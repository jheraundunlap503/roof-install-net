#!/usr/bin/env python3
"""
Weekly content generator for roofinstall.net.
Reads keywords.csv, determines content phase by site age,
calls Claude API to write drafts, schedules them 14 days out.
Fetches a Pexels image for each article.
"""

import argparse
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

MODEL      = 'claude-sonnet-4-6'
MAX_TOKENS = 8000
USER_AGENT = 'Mozilla/5.0 (compatible; roofinstall-bot/1.0)'

# Tier 1-2 sources only (CLAUDE.md source-backed-claims standard).
# The model may ONLY cite pages it actually retrieved from these domains.
ALLOWED_SOURCE_DOMAINS = [
    # Trade / standards bodies
    'nrca.net', 'iibhs.org', 'asphaltroofing.org', 'tileroofing.org',
    'iccsafe.org', 'nachi.org', 'coolroofs.org',
    # Federal
    'energy.gov', 'epa.gov', 'noaa.gov', 'weather.gov', 'nist.gov',
    'fema.gov', 'hud.gov', 'census.gov', 'bls.gov', 'osha.gov',
    'energystar.gov', 'nrel.gov',
    # Arizona state / municipal
    'az.gov', 'roc.az.gov', 'maricopa.gov', 'phoenix.gov', 'mesaaz.gov',
    'chandleraz.gov', 'gilbertaz.gov', 'tempe.gov', 'scottsdaleaz.gov',
    # NOTE: azcentral.com blocks Anthropic's crawler and is rejected by the API.
    # Trade press / consumer protection
    'remodeling.hw.net', 'bbb.org',
    # Manufacturers
    'gaf.com', 'owenscorning.com', 'certainteed.com', 'iko.com', 'tamko.com',
]

# Basic variant on purpose. The _20260209 "dynamic filtering" variant runs code
# execution under the hood, which forces container_id plumbing on every pause_turn
# resume and fires dozens of extra server-tool calls per article. We only need real
# retrieved sources, which this does without the overhead.
WEB_SEARCH_TOOL = {
    'type': 'web_search_20250305',
    'name': 'web_search',
    'max_uses': 12,
    'allowed_domains': ALLOWED_SOURCE_DOMAINS,
}

MARKDOWN_LINK = re.compile(r'\[([^\]]+)\]\((https?://[^)\s]+)\)')

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


def pick_keywords(rows, allowed, count=ARTICLES_PER_RUN):
    queued = [r for r in rows
              if r['status'] == 'queued' and r['type'] in allowed]
    order = {'high': 0, 'medium': 1, 'low': 2}
    queued.sort(key=lambda r: order.get(r.get('priority', 'low'), 99))
    return queued[:count]


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


def build_prompt(keyword, ktype, slug, image_url, image_alt, sources):
    today_str = now().strftime('%Y-%m-%d')
    scheduled = sched_date()
    source_block = '\n'.join(f'- {title}: {url}' for url, title in sources)

    return f"""You are writing content for roofinstall.net — an independent homeowner resource for the U.S. roofing industry. Primary focus: Arizona / Phoenix metro East Valley.

Write a complete, publish-ready markdown article for this keyword: "{keyword}"

VERIFIED SOURCES — these were retrieved by a live web search and are the ONLY URLs you may cite:
{source_block}

CITATION RULES (non-negotiable):
- Cite 7-10 of the verified URLs above as inline markdown links, embedded in contextual anchor text. Example: the [Arizona ROC workmanship standards](https://roc.az.gov/...) require flashing at every penetration.
- Copy each URL EXACTLY as written above. Do not edit, shorten, or "clean up" a URL.
- NEVER cite a URL that is not in the list above. Do not write a URL from memory, do not guess a path, do not invent a homepage. A fabricated citation is the single worst thing you can produce.
- Every citation must be load-bearing: it supports a specific number, code requirement, or factual claim in that sentence. Do not decorate.
- If a claim has no matching source above, state it plainly with no citation rather than inventing one.

CONTENT RULES (non-negotiable):
- No em-dashes anywhere
- No phrases: "delve", "comprehensive guide", "in today's world", "it's worth noting"
- One H1 only
- TLDR (3-4 sentences) immediately after H1, before any H2
- Content capsule format: every H2/H3 opens with the question, then a 30-60 word direct answer, then expanded detail
- 7-10 inline source citations, drawn only from the VERIFIED SOURCES list above
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
scheduled_date:
review_flags: unreviewed - verify every citation, all numbers, and voice before approving
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


def strip_code_fence(text):
    text = text.strip()
    if text.startswith('```'):
        first_newline = text.index('\n')
        text = text[first_newline + 1:]
    if text.endswith('```'):
        text = text[:text.rfind('```')].rstrip()
    return text


def extract_article(msg):
    """Join the text blocks and drop any preamble before the frontmatter."""
    text = '\n'.join(
        b.text for b in msg.content if getattr(b, 'type', '') == 'text'
    ).strip()
    text = strip_code_fence(text)
    start = text.find('---')
    if start > 0:
        text = text[start:]
    return text.strip()


def research(client, keyword):
    """Pass 1: live web search. Returns the (url, title) pairs actually retrieved.

    The API attaches citations to text blocks as structured metadata rather than
    having the model write markdown links, and those blocks split mid-sentence.
    So we harvest the retrieved URLs here and hand them to the writer in pass 2,
    which is what lets the article carry real inline links.
    """
    prompt = (
        f'Research the topic "{keyword}" for an Arizona homeowner roofing article.\n'
        'Search thoroughly and from several angles: installed costs, material specs, '
        'building code and permit requirements, contractor licensing and workmanship '
        'standards, and Arizona climate (UV load, monsoon). Run at least 6 searches.\n'
        'Then list the key facts you found. Do not write an article.'
    )
    with client.messages.stream(
        model=MODEL,
        max_tokens=3000,
        tools=[WEB_SEARCH_TOOL],
        messages=[{'role': 'user', 'content': prompt}],
    ) as stream:
        msg = stream.get_final_message()

    sources, seen = [], set()
    for block in msg.content:
        if getattr(block, 'type', '') != 'web_search_tool_result':
            continue
        results = block.content
        if not isinstance(results, list):
            print(f'  search error: {results}')   # error blocks come back as objects
            continue
        for r in results:
            url = getattr(r, 'url', None)
            if not url or url in seen:
                continue
            # An allowed domain can still serve user-generated content. A forum
            # thread is not a Tier 1-2 source, so never let one become a citation.
            if re.search(r'//forum\.|/forum/|/forums/|/community/', url, re.I):
                print(f'  skipped user-generated source: {url}')
                continue
            seen.add(url)
            title = re.sub(r'\s+', ' ', (getattr(r, 'title', '') or 'Source')).strip()
            sources.append((url, title[:80]))

    searches = sum(
        1 for b in msg.content if getattr(b, 'type', '') == 'server_tool_use'
    )
    print(f'  researched: {searches} searches, {len(sources)} unique sources')
    return sources[:30]


def generate_article(keyword, ktype, slug, image_url, image_alt):
    # Streaming is required: live search plus a long article blows past the
    # default non-streaming HTTP read timeout and raises APITimeoutError.
    client = Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'], timeout=900.0)

    sources = research(client, keyword)
    if len(sources) < 3:
        raise RuntimeError(f'only {len(sources)} sources found for "{keyword}"')

    # Pass 2: write with no tools, citing only the verified URLs from pass 1.
    prompt = build_prompt(keyword, ktype, slug, image_url, image_alt, sources)
    with client.messages.stream(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        messages=[{'role': 'user', 'content': prompt}],
    ) as stream:
        msg = stream.get_final_message()

    return extract_article(msg), {u for u, _ in sources}


def check_url(url):
    """Return an HTTP status, or 0 if the request failed entirely."""
    headers = {'User-Agent': USER_AGENT}
    try:
        r = requests.head(url, allow_redirects=True, timeout=12, headers=headers)
        if r.status_code >= 400:
            # Some hosts reject HEAD; confirm with a GET before condemning it.
            r = requests.get(url, allow_redirects=True, timeout=15,
                             headers=headers, stream=True)
        return r.status_code
    except requests.RequestException:
        return 0


def validate_links(markdown, verified=None):
    """Unwrap any outbound link that is unverified or does not resolve.

    Two gates, both of which keep the prose and drop only the link:
      1. Whitelist. If the URL was not returned by the live search, it was
         invented. Strip it, even if it happens to resolve.
      2. Liveness. Fetch what remains. 403/405/429 mean the host is blocking a
         bot, not that the page is missing, so those are left alone.

    A fabricated or dead citation therefore cannot reach the site.
    """
    seen, dead = {}, []

    def resolve(match):
        anchor, url = match.group(1), match.group(2)
        if verified is not None and url not in verified:
            dead.append((url, 'not in verified sources'))
            return anchor
        if url not in seen:
            seen[url] = check_url(url)
        code = seen[url]
        if code == 0 or (code >= 400 and code not in (403, 405, 429)):
            dead.append((url, code or 'no response'))
            return anchor
        return match.group(0)

    return MARKDOWN_LINK.sub(resolve, markdown), dead


def save_article(ktype, slug, content):
    directory = CONTENT_DIR.get(ktype, 'content/blog')
    os.makedirs(directory, exist_ok=True)
    path = os.path.join(directory, f'{slug}.md')
    if not DRY_RUN:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
    return path


def main():
    parser = argparse.ArgumentParser(
        description='Generate review-first article drafts. Nothing auto-publishes.'
    )
    parser.add_argument('--count', type=int, default=ARTICLES_PER_RUN,
                        help='how many drafts to generate this session')
    args = parser.parse_args()

    allowed = allowed_types()
    print(f"Site age: {site_age_days()} days | Allowed types: {allowed}")

    rows  = read_csv()
    picks = pick_keywords(rows, allowed, args.count)

    if not picks:
        print('No queued keywords for current phase.')
        if GITHUB_OUTPUT:
            with open(GITHUB_OUTPUT, 'a') as f:
                f.write('article_count=0\nfiles_generated=\nsummary=No queued keywords.\n')
        return

    print(f'Generating {len(picks)} draft(s). All land as unreviewed drafts.\n')

    generated, failed = [], []
    lines = [
        f'roofinstall.net — content drafts {now().strftime("%Y-%m-%d")}',
        'All drafts are unreviewed. Nothing publishes until you delete the',
        'review_flags line and run scripts/schedule-approved.py.',
        '',
    ]

    for i, row in enumerate(picks, 1):
        kw   = row['keyword']
        kt   = row['type']
        slug = to_slug(kw)

        print(f'[{i}/{len(picks)}] Generating [{kt}]: {kw}')
        try:
            image_url, image_alt = fetch_pexels_image(kw)
            content, verified = generate_article(kw, kt, slug, image_url, image_alt)

            content, dead = validate_links(content, verified)
            live = len(set(m.group(2) for m in MARKDOWN_LINK.finditer(content)))
            for url, reason in dead:
                print(f'  LINK STRIPPED ({reason}): {url}')
            print(f'  Citations: {live} live, {len(dead)} stripped')

            path = save_article(kt, slug, content)
        except Exception as e:
            # One bad article must not kill a 15-article batch.
            print(f'  FAILED: {e}\n')
            failed.append((kw, str(e)))
            continue

        generated.append(path)
        for r in rows:
            if r['keyword'] == kw:
                r['status'] = 'drafted'

        lines += [
            f'  [{kt.upper()}] {kw}',
            f'    file:      {path}',
            f'    citations: {live} live, {len(dead)} stripped',
            '',
        ]
        print(f'  Saved: {path}\n')

    if not DRY_RUN:
        write_csv(rows)

    print('=' * 60)
    print(f'{len(generated)} draft(s) written, {len(failed)} failed.')
    for kw, err in failed:
        print(f'  FAILED  {kw}: {err}')
    if generated:
        print('\nNext: review each draft, delete its review_flags line to approve,')
        print('then run  python scripts/schedule-approved.py')
    print('=' * 60)

    summary = '\\n'.join(lines)

    if GITHUB_OUTPUT:
        with open(GITHUB_OUTPUT, 'a') as f:
            f.write(f'article_count={len(generated)}\n')
            f.write(f'files_generated={",".join(generated)}\n')
            f.write(f'summary={summary}\n')

    print(f'\nDone — {len(generated)} draft(s) generated.')


if __name__ == '__main__':
    main()
