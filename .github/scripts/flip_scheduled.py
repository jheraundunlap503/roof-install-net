#!/usr/bin/env python3
"""
Scans content/blog/, content/services/, content/cities/ for files where
  published: false  AND  scheduled_date <= today (Arizona MST, UTC-7).
Flips matching files to published: true and writes GITHUB_OUTPUT.

The comparison is <=, not ==, so a day the workflow does not run (GitHub
outage, dropped runner, missed cron) does not strand an article at
published: false forever. The backlog drains on the next successful run,
oldest first, capped at MAX_PER_RUN to honor the 2-per-day publish limit.
"""

import os
import re
from datetime import datetime, timezone, timedelta

ARIZONA_TZ    = timezone(timedelta(hours=-7))   # UTC-7 year-round (no DST)
CONTENT_DIRS  = ['content/blog', 'content/services', 'content/cities']
GITHUB_OUTPUT = os.environ.get('GITHUB_OUTPUT', '')
MAX_PER_RUN   = 2                               # never publish >2 per day


def today_az():
    return datetime.now(ARIZONA_TZ).strftime('%Y-%m-%d')


def get_field(content, field):
    m = re.search(rf'^{field}:\s*["\']?([^"\'\\n]+?)["\']?\s*$',
                  content, re.MULTILINE)
    return m.group(1).strip() if m else None


def has_review_flags(content):
    """True while the article is unreviewed. Deleting the line approves it."""
    return re.search(r'^review_flags:', content, re.MULTILINE) is not None


def flip_published(content):
    return re.sub(
        r'^(published:\s*)false(\s*$)',
        r'\g<1>true\2',
        content, count=1, flags=re.MULTILINE
    )


def main():
    today = today_az()
    print(f"Today (Arizona): {today}")

    due, pending, unreviewed = [], [], []

    for d in CONTENT_DIRS:
        if not os.path.isdir(d):
            continue
        for fn in sorted(os.listdir(d)):
            if not fn.endswith('.md'):
                continue
            path = os.path.join(d, fn)
            text = open(path, encoding='utf-8').read()

            if get_field(text, 'published') != 'false':
                continue

            sched = get_field(text, 'scheduled_date')
            if not sched:
                continue

            # An unreviewed draft must never publish, whatever its date says.
            # Deleting the review_flags line is the human approval signal.
            if has_review_flags(text):
                if sched <= today:
                    unreviewed.append((sched, path))
                continue

            # ISO dates sort and compare correctly as plain strings.
            (due if sched <= today else pending).append((sched, path))

    due.sort()          # oldest backlog first
    changed = []

    for sched, path in due[:MAX_PER_RUN]:
        text = open(path, encoding='utf-8').read()
        open(path, 'w', encoding='utf-8').write(flip_published(text))
        late = '' if sched == today else f'  (LATE, was due {sched})'
        print(f"  Flipped: {path}{late}")
        changed.append(path)

    for sched, path in due[MAX_PER_RUN:]:
        print(f"  HELD (over {MAX_PER_RUN}/run cap, due {sched}): {path}")
    for sched, path in unreviewed:
        print(f"  SKIPPED (still unreviewed, due {sched}): {path}")
    for sched, path in sorted(pending)[:3]:
        print(f"  Not yet due ({sched}): {path}")

    if GITHUB_OUTPUT:
        with open(GITHUB_OUTPUT, 'a') as f:
            f.write(f'files_changed={"true" if changed else "false"}\n')
            if changed:
                f.write(f'changed_paths={",".join(changed)}\n')

    print(f"\n{len(changed)} file(s) flipped. "
          f"{len(due) - len(changed)} still due, {len(pending)} scheduled ahead.")


if __name__ == '__main__':
    main()
