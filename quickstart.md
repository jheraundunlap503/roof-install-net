# roofinstall.net — Quickstart

## Prerequisites Before Opening Antigravity

### Accounts Needed
- [ ] Vercel account (vercel.com) — free tier is fine to start
- [ ] Supabase account (supabase.com) — create a FRESH project called "roofinstall-net"
- [ ] Beehiiv account (beehiiv.com) — new account, separate from any existing
- [ ] Brevo account (brevo.com) — for transactional email
- [ ] Google Analytics — create new GA4 property for roofinstall.net
- [ ] Google Search Console — add roofinstall.net property
- [ ] Pexels API key (pexels.com/api) — free, for article images

### API Keys Needed (add to .env)
```
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BEEHIIV_API_KEY=
BEEHIIV_PUBLICATION_ID=
BREVO_API_KEY=
PEXELS_API_KEY=
GA_MEASUREMENT_ID=
NEXT_PUBLIC_SITE_URL=https://roofinstall.net
```

### Domain
- roofinstall.net is already owned
- Connect to Vercel AFTER the build is live on a preview URL
- Add custom domain in Vercel dashboard → Settings → Domains

---

## Build Order — Do NOT Skip Steps

### Phase 1: Foundation (Day 1 Session)
1. Next.js 14 project scaffold with SSG configuration
2. Homepage (hero, estimator CTA, newsletter opt-in, trust signals)
3. Blog index page (dynamic, pulls from /content/blog/)
4. Service page index (dynamic, pulls from /content/services/)
5. About/trust page
6. Contact page
7. llms.txt (root)
8. robots.txt (allow all except /admin)
9. sitemap.xml (auto-generated, includes all pages)
10. Deploy to Vercel (preview URL)

**Approval gate:** Review live preview before moving to Phase 2.

### Phase 2: Estimator Tool (Day 2 Session)
1. Cost estimator React component
2. ZIP code input → region lookup
3. Home size selector (sq ft or bedroom count)
4. Roof type selector (shingle, tile, foam, metal)
5. Material tier selector (standard, mid, premium)
6. Output: cost range + explanation (Claude API call)
7. Email capture gate before showing full breakdown
8. Lead stored in Supabase (leads table)
9. Brevo confirmation email sent to lead
10. Admin notification sent via Brevo

**Approval gate:** Test full estimator flow before moving to Phase 3.

### Phase 3: Content System (Day 3 Session)
1. Supabase tables: keywords, articles, leads
2. /content/blog/ markdown folder structure
3. /content/services/ markdown folder structure
4. First 10 articles written and dropped in (from content-calendar.md)
5. First 5 service pages written and dropped in
6. Google Search Console verification meta tag added
7. Sitemap submitted to Google Search Console
8. Beehiiv newsletter connected to site opt-in form

**Approval gate:** Review first 10 articles live on site before activating content schedule.

### Phase 4: Content Engine Automation (Day 4 Session)
1. Keyword tracker script (reads keywords.csv → Supabase)
2. Article generator script (reads keyword → writes article → saves to /content/blog/)
3. Service page generator script (reads service+city combos → writes pages)
4. Daily schedule: 1 blog article at 9am, 1 service page at 11am
5. Google Search Console indexing request on each publish
6. Supabase article status updated on publish

**Approval gate:** Run one article end-to-end manually. Review output before scheduling.

---

## Supabase Schema

### leads
```sql
id uuid primary key default gen_random_uuid()
created_at timestamptz default now()
email text not null
zip_code text
home_size text
roof_type text
material_tier text
estimated_cost_low integer
estimated_cost_high integer
source text default 'estimator'
status text default 'new'
```

### keywords
```sql
id uuid primary key default gen_random_uuid()
keyword text not null
type text -- 'blog', 'service', 'faq'
monthly_volume integer
difficulty integer
status text default 'queued' -- queued, in_progress, published
assigned_url text
published_at timestamptz
```

### articles
```sql
id uuid primary key default gen_random_uuid()
created_at timestamptz default now()
keyword_id uuid references keywords(id)
title text
slug text unique
meta_description text
word_count integer
status text default 'draft' -- draft, scheduled, published, indexed
published_at timestamptz
indexed_at timestamptz
```

---

## Deployment

### Vercel Setup
1. Push project to GitHub (private repo)
2. Import repo in Vercel dashboard
3. Framework preset: Next.js
4. Add all env vars in Vercel → Settings → Environment Variables
5. Deploy
6. Connect custom domain: roofinstall.net

### After Domain Connection
1. Verify in Google Search Console
2. Submit sitemap.xml
3. Request indexing on homepage manually

---

## Content Release Rules

- Maximum 1-2 articles published per day
- Never publish more than 2 articles on the same day
- Blog articles: publish at 9am
- Service pages: publish at 11am (staggered from blog)
- First 30 days: prioritize blog content over service pages
- Days 31-60: 50/50 split
- Days 61-90: begin national city pages (programmatic batch)

---

## Self-Healing Rules for Agent

```
On API failure: log error, skip item, continue pipeline, flag in status report
On content generation error: retry once with simpler prompt, log if still fails
On Supabase write error: retry 3x with backoff, log if persistent
Never publish duplicate slugs — check Supabase before every write
Never re-use a keyword already marked 'published' in Supabase
Stop and alert if Pexels API fails — do not publish articles without images
```
