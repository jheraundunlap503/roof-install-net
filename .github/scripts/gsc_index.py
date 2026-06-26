#!/usr/bin/env python3
"""
Derives URLs from content files changed in the latest push and submits
them to the Google Search Console Indexing API.

Priority order  : service pages > blog > city pages
Hard daily cap  : 10 requests
"""

import json
import os
import subprocess
import time

import requests
import google.auth.transport.requests
from google.oauth2 import service_account

BASE_URL     = 'https://roofinstall.net'
INDEXING_API = 'https://indexing.googleapis.com/v3/urlNotifications:publish'
SCOPES       = ['https://www.googleapis.com/auth/indexing']
MAX_DAILY    = 10

PRIORITY = {
    'content/services': 1,
    'content/blog':     2,
    'content/cities':   3,
}


def credentials():
    info = json.loads(os.environ['GSC_SERVICE_ACCOUNT_KEY'])
    return service_account.Credentials.from_service_account_info(
        info, scopes=SCOPES)


def changed_files():
    manual = os.environ.get('MANUAL_URLS', '').strip()
    if manual:
        return None, [u.strip() for u in manual.split(',') if u.strip()]
    result = subprocess.run(
        ['git', 'diff', '--name-only', 'HEAD~1', 'HEAD', '--', 'content/'],
        capture_output=True, text=True)
    files = [f for f in result.stdout.strip().split('\n') if f.endswith('.md')]
    return files, None


def priority(path):
    for prefix, p in PRIORITY.items():
        if path.startswith(prefix):
            return p
    return 99


def to_url(path):
    inner = path.replace('content/', '', 1).replace('.md', '')
    return f'{BASE_URL}/{inner}/'


def submit(creds, url):
    auth_req = google.auth.transport.requests.Request()
    creds.refresh(auth_req)
    resp = requests.post(
        INDEXING_API,
        headers={'Authorization': f'Bearer {creds.token}',
                 'Content-Type': 'application/json'},
        json={'url': url, 'type': 'URL_UPDATED'},
        timeout=10)
    return resp.status_code


def main():
    files, manual_urls = changed_files()

    if manual_urls:
        urls = manual_urls[:MAX_DAILY]
    elif files:
        files.sort(key=priority)
        urls = [to_url(f) for f in files[:MAX_DAILY]]
    else:
        print('No content files changed.')
        return

    creds = credentials()
    for url in urls:
        code = submit(creds, url)
        print(f'  {code}  {url}')
        time.sleep(1)

    print(f'\nSubmitted {len(urls)} URL(s).')


if __name__ == '__main__':
    main()
