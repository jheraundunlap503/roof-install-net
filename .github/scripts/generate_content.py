#!/usr/bin/env python3
"""
Weekly content generator for roofinstall.net.
Reads keywords.csv, determines content phase by site age,
calls Claude API to write drafts, schedules them 14 days out.
Fetches a Pexels image for each article.
"""

import csv
import os
import re
from datetime import datetime, timezone, timedelta

import requests
from anthropic import Anthropic

ARIZONA_TZ       = timezone(timedelta(hours=-7))
KEYWORDS_CSV     = 'keywords.csv'
ARTICLES_PER_RUN = 2
SCHEDULE_DAYS    = 0
DRY_RUN          = os.environ.get('DRY_RUN', 'false').lower() == 'true'
GITHUB_OUTPUT    = os.environ.get('GITHUB_OUTPUT', '')

CONTENT_DIR = {
    'blog':    'content/blog',
    'service': 'content/services',
    'city':    'content/cities',
    'faq':     'content/blog',
}


def now():
    return datetime.now(ARIZONA_TZ)


def site_age_days():
    s = os.environ.get('SITE_LAUNCH_DATE', '')
    if not s:
        return 999
    try:
        launch = datetime.strptime(s, '%Y-%m-%d').replace(tzinfo=ARIZONA_TZ)
        return (now() - launch).days
    except ValueError:
        return 999


def allowed_types():
    age = site_age_days()
    if age < 30:
        return {'blog', 'faq'}
    if age < 60:
        return {'blog', 'faq', 'service'}
    return {'blog', 'faq', 'service', 'city'}


def read_csv():
    with open(KEYWORDS_CSV, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))


def write_csv(rows):
    with open(KEYWORDS_CSV, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)


def pick_keywords(rows, allowed):
    queued = [r for r in rows
              if r['status'] == 'queued' and r['type'] in allowed]
    order = {'high': 0, 'medium': 1, 'low': 2}
    queued.sort(key=lambda r: order.get(r.get('priority', 'low'), 99))
    return queued[:ARTICLES_PER_RUN]


def to_slug(keyword):
    return re.sub(r'[^a-z0-9]+', '-', keyword.lower()).strip('-')


def sched_date(offset=SCHEDULE_DAYS):
    return (now() + timedelta(days=offset)).strftime('%Y-%m-%d')


def fetch_pexels_image(keyword):
    key = os.environ.get('PEXELS_API_KEY', '')
    if not key:
        return '', ''
    search = re.sub(r'\b(arizona|az)\b', '', keyword, flags=re.IGNORECASE).strip()
    try:
        resp = requests.get(
            'https://api.pexels.com/v1/search',
            headers={'Authorization': key},
            params={'query': search, 'per_page': 5, 'orientation': 'landscape'},
            timeout=10
        )
        if resp.status_code != 200:
            return '', ''
        photos = resp.json().get('photos', [])
        if not photos:
            return '', ''
        photo = photos[0]
        url = photo['src']['large2x']
        alt = photo.get('alt', keyword)
        print(f'  Pexels image: {photo["id"]} — {alt[:60]}')
        return url, alt
    except Exception as e:
        print(f'  Pexels fetch failed: {e}')
        return '', ''


def build_prompt(keyword, ktype, slug, image_url, image_alt):
    today_str = now().strftime('%Y-%m-%d')
    scheduled = sched_date()

    return f"""You are writing content for roofinstall.net — an independent homeowner resource for the U.S. roofing industry. Primary focus: Arizona / Phoenix metro East Valley.

Write a complete, publish-ready markdown article for this keyword: "{keyword}"

CONTENT RULES (non-negotiable):
- No em-dashes anywhere
- No phrases: "delve", "comprehensive guide", "in today's world", "it's worth noting"
- One H1 only
- TLDR (3-4 sentences) immediately after H1, before any H2
- Content capsule format: every H2/H3 opens with the question, then a 30-60 word direct answer, then expanded detail
- 7-10 inline source citations embedded in contextual anchor text (Tier 1-2 only: .gov sites, nrca.net, manufacturer docs, NOAA, Remodeling Magazine, AZ Central)
- Primary keyword "{keyword}" within the first 100 words
- 4-6 FAQ questions at the close
- 3-5 internal links using relative paths (e.g. /blog/slug/ or /services/slug/)
- Arizona context where relevant: UV index 11+, monsoon June 15–Sep 30, shingle lifespan 15-20 yrs, tile 30-50 yrs
- Honest tone — tell homeowners when they do NOT need a new roof

FRONTMATTER: Output the block below exactly as shown, then the article.
---
title: "[Article title]"
slug: {slug}
date: {today_str}
published: false
scheduled_date: {scheduled}
meta_title: "[Under 60 chars]"
meta_description: "[Under 155 chars]"
primary_keyword: {keyword}
type: {ktype}
image_url: "{image_url}"
image_alt: "{image_alt}"
---

[H1 title]

[TLDR paragraph — bold, 3-4 sentences]

---

[Body in content capsule format]

[FAQ section]

Return ONLY the markdown. No preamble, no explanation after."""


def generate_article(keyword, ktype, slug, image_url, image_alt):
    client = Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])
    prompt = build_prompt(keyword, ktype, slug, image_url, image_alt)
    msg = client.messages.create(
        model='claude-sonnet-4-6',
        max_tokens=4096,
        messages=[{'role': 'user', 'content': prompt}],
    )
    return msg.content[0].text


def save_article(ktype, slug, content):
    directory = CONTENT_DIR.get(ktype, 'content/blog')
    os.makedirs(directory, exist_ok=True)
    path = os.path.join(directory, f'{slug}.md')
    if not DRY_RUN:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
    return path


def main():
    allowed = allowed_types()
    print(f"Site age: {site_age_days()} days | Allowed types: {allowed}")

    rows  = read_csv()
    picks = pick_keywords(rows, allowed)

    if not picks:
        print('No queued keywords for current phase.')
        if GITHUB_OUTPUT:
            with open(GITHUB_OUTPUT, 'a') as f:
                f.write('article_count=0\nfiles_generated=\nsummary=No queued keywords.\n')
        return

    generated = []
    lines = [
        f'roofinstall.net — content drafts {now().strftime("%Y-%m-%d")}',
        f'Scheduled to publish: {sched_date()}',
        '',
    ]

    for row in picks:
        kw   = row['keyword']
        kt   = row['type']
        slug = to_slug(kw)

        print(f'\nGenerating [{kt}]: {kw}')
        image_url, image_alt = fetch_pexels_image(kw)
        content = generate_article(kw, kt, slug, image_url, image_alt)
        path    = save_article(kt, slug, content)
        generated.append(path)

        for r in rows:
            if r['keyword'] == kw:
                r['status'] = 'drafted'

        lines += [
            f'  [{kt.upper()}] {kw}',
            f'    slug:      {slug}',
            f'    file:      {path}',
            f'    image:     {image_url[:60] if image_url else "(none)"}',
            '',
        ]
        print(f'  Saved: {path}')

    if not DRY_RUN:
        write_csv(rows)

    summary = '\\n'.join(lines)

    if GITHUB_OUTPUT:
        with open(GITHUB_OUTPUT, 'a') as f:
            f.write(f'article_count={len(generated)}\n')
            f.write(f'files_generated={",".join(generated)}\n')
            f.write(f'summary={summary}\n')

    print(f'\nDone — {len(generated)} draft(s) generated.')


if __name__ == '__main__':
    main()
