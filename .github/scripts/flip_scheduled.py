#!/usr/bin/env python3
"""
Scans content/blog/, content/services/, content/cities/ for files where
  published: false  AND  scheduled_date == today (Arizona MST, UTC-7).
Flips matching files to published: true and writes GITHUB_OUTPUT.
"""

import os
import re
from datetime import datetime, timezone, timedelta

ARIZONA_TZ    = timezone(timedelta(hours=-7))   # UTC-7 year-round (no DST)
CONTENT_DIRS  = ['content/blog', 'content/services', 'content/cities']
GITHUB_OUTPUT = os.environ.get('GITHUB_OUTPUT', '')


def today_az():
    return datetime.now(ARIZONA_TZ).strftime('%Y-%m-%d')


def get_field(content, field):
    m = re.search(rf'^{field}:\s*["\']?([^"\'\\n]+?)["\']?\s*$',
                  content, re.MULTILINE)
    return m.group(1).strip() if m else None


def flip_published(content):
    return re.sub(
        r'^(published:\s*)false(\s*$)',
        r'\g<1>true\2',
        content, count=1, flags=re.MULTILINE
    )


def main():
    today = today_az()
    print(f"Today (Arizona): {today}")
    changed = []

    for d in CONTENT_DIRS:
        if not os.path.isdir(d):
            continue
        for fn in sorted(os.listdir(d)):
            if not fn.endswith('.md'):
                continue
            path = os.path.join(d, fn)
            text = open(path, encoding='utf-8').read()

            if get_field(text, 'published') == 'false' \
                    and get_field(text, 'scheduled_date') == today:
                open(path, 'w', encoding='utf-8').write(flip_published(text))
                print(f"  Flipped: {path}")
                changed.append(path)

    if GITHUB_OUTPUT:
        with open(GITHUB_OUTPUT, 'a') as f:
            f.write(f'files_changed={"true" if changed else "false"}\n')
            if changed:
                f.write(f'changed_paths={",".join(changed)}\n')

    print(f"\n{len(changed)} file(s) flipped.")


if __name__ == '__main__':
    main()
