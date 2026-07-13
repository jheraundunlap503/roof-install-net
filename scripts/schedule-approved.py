#!/usr/bin/env python3
"""
Schedule approved drafts for publication, one per day starting tomorrow.

An article is APPROVED when a human deletes its `review_flags:` line. Until then
it is skipped, no matter what else the frontmatter says.

This script does NOT publish. It stamps a staggered `scheduled_date` and leaves
`published: false`. The Daily Auto-Publisher cron (.github/workflows/publish-
scheduled.yml -> flip_scheduled.py) flips exactly one article to published:true
on the day its scheduled_date comes up. Setting published:true here instead
would dump the whole batch live at once, which is the thing review-first exists
to prevent.

Usage:
    python scripts/schedule-approved.py            # schedule and commit
    python scripts/schedule-approved.py --dry-run  # show the plan, change nothing
    python scripts/schedule-approved.py --no-commit
"""

import argparse
import os
import re
import subprocess
import sys
from datetime import datetime, timezone, timedelta

ARIZONA_TZ   = timezone(timedelta(hours=-7))   # UTC-7 year round, no DST
CONTENT_DIRS = ['content/blog', 'content/services', 'content/cities']


def today_az():
    return datetime.now(ARIZONA_TZ).date()


def get_field(text, field):
    m = re.search(rf'^{field}:\s*["\']?([^"\'\n]*?)["\']?\s*$', text, re.MULTILINE)
    return m.group(1).strip() if m else None


def has_review_flags(text):
    return re.search(r'^review_flags:', text, re.MULTILINE) is not None


def set_scheduled_date(text, date_str):
    """Set scheduled_date, whether the line is empty, filled, or missing."""
    if re.search(r'^scheduled_date:', text, re.MULTILINE):
        return re.sub(r'^scheduled_date:.*$', f'scheduled_date: {date_str}',
                      text, count=1, flags=re.MULTILINE)
    # No line at all: insert it after `published:` so it stays inside frontmatter.
    return re.sub(r'^(published:.*)$', rf'\1\nscheduled_date: {date_str}',
                  text, count=1, flags=re.MULTILINE)


def find_approved():
    """Approved = no review_flags line, and not yet published."""
    approved, unreviewed = [], []
    for d in CONTENT_DIRS:
        if not os.path.isdir(d):
            continue
        for fn in sorted(os.listdir(d)):
            if not fn.endswith('.md'):
                continue
            path = os.path.join(d, fn)
            text = open(path, encoding='utf-8').read()

            if get_field(text, 'published') != 'false':
                continue                      # already live, leave it alone
            if has_review_flags(text):
                unreviewed.append(path)
                continue
            approved.append((path, text))
    return approved, unreviewed


def latest_scheduled_date():
    """Don't collide with drafts already waiting in the queue."""
    latest = None
    for d in CONTENT_DIRS:
        if not os.path.isdir(d):
            continue
        for fn in os.listdir(d):
            if not fn.endswith('.md'):
                continue
            text = open(os.path.join(d, fn), encoding='utf-8').read()
            if get_field(text, 'published') != 'false':
                continue
            raw = get_field(text, 'scheduled_date')
            if not raw:
                continue
            try:
                dt = datetime.strptime(raw, '%Y-%m-%d').date()
            except ValueError:
                continue
            if latest is None or dt > latest:
                latest = dt
    return latest


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true', help='show the plan, write nothing')
    ap.add_argument('--no-commit', action='store_true', help='write files but do not commit')
    args = ap.parse_args()

    approved, unreviewed = find_approved()

    if unreviewed:
        print(f'{len(unreviewed)} draft(s) still unreviewed, skipping:')
        for p in unreviewed:
            print(f'  [ ] {p}')
        print()

    if not approved:
        print('Nothing approved. Delete the review_flags line from a draft to approve it.')
        return 0

    # Start the day after the last thing already queued, so batches never collide.
    start = today_az() + timedelta(days=1)
    pending = latest_scheduled_date()
    if pending and pending >= start:
        start = pending + timedelta(days=1)
        print(f'Existing drafts are queued through {pending}. Continuing from {start}.\n')

    print(f'{len(approved)} approved article(s), one per day from {start}:\n')
    print(f'  {"DATE":<12} {"TYPE":<8} FILE')
    print(f'  {"-"*12} {"-"*8} {"-"*44}')

    written = []
    for i, (path, text) in enumerate(approved):
        date_str = (start + timedelta(days=i)).strftime('%Y-%m-%d')
        ktype = get_field(text, 'type') or '?'
        print(f'  {date_str:<12} {ktype:<8} {path}')

        if not args.dry_run:
            open(path, 'w', encoding='utf-8').write(set_scheduled_date(text, date_str))
            written.append(path)

    last = (start + timedelta(days=len(approved) - 1)).strftime('%Y-%m-%d')
    print(f'\n  {len(approved)} scheduled. Queue runs {start} through {last}.')
    print('  published stays false; the daily cron flips one per day.')

    if args.dry_run:
        print('\nDRY RUN - nothing written.')
        return 0

    if args.no_commit:
        print('\nFiles written, not committed (--no-commit).')
        return 0

    subprocess.run(['git', 'add', *written], check=True)
    msg = (f'content: schedule {len(approved)} approved article(s), '
           f'{start} to {last}')
    subprocess.run(['git', 'commit', '-m', msg], check=True)
    print(f'\nCommitted: {msg}')
    print('Push when ready:  git push origin main')
    return 0


if __name__ == '__main__':
    sys.exit(main())
