# roofinstall.net — Project Brain

## What This Is

roofinstall.net is a standalone AI-powered lead generation and content platform targeting the $51.9B U.S. roofing industry. It is NOT affiliated with K9 Newsletters Media Group or any roofing contractor client. It is an independent media and technology asset owned and operated as a separate venture.

---

## The Platform

A three-layer asset:

**Layer 1 — Cost Estimator Tool**
Free interactive tool where homeowners input zip code, home size, roof type, and material preference to get an estimated replacement cost range. Email capture gates the detailed breakdown. Every submission is a qualified lead with intent data.

**Layer 2 — Homeowner Newsletter + Content Hub**
Biweekly newsletter for homeowners researching roof replacement or managing storm damage. Content hub publishes every issue as an evergreen article. List monetized through contractor referral fees and newsletter sponsorships.

**Layer 3 — Programmatic City + Service Pages**
Zipper method: roofing services × East Valley / Phoenix metro cities = dedicated landing pages targeting buyer-intent keywords. Also: 500+ national city pages targeting "roof installation [city]" and "roof replacement cost [city]".

---

## Audience

**Primary:** Homeowners in Mesa, Gilbert, Chandler, Queen Creek, Tempe, Scottsdale, Phoenix metro — researching roof replacement or managing insurance claims. Own their home. Roof 12-20 years old. High buying power. Decision-stage or pre-decision.

**Secondary:** Homeowners nationally searching roofing cost questions.

**NOT:** Renters, contractors, roofing supply companies.

---

## Voice and Tone

Straight-talking homeowner resource. Not a contractor site. Not a media company trying to sound editorial. The voice is: knowledgeable neighbor who happens to know a lot about roofs and wants to protect you from getting ripped off.

- Specific over vague (real numbers, real city names, real permit data)
- Honest over promotional (we tell you when you don't need a new roof)
- Local over generic (Arizona climate context in every relevant piece)
- No em-dashes anywhere
- No AI-sounding phrases ("delve", "comprehensive", "in today's fast-paced world")

---

## SEO Rules — Non-Negotiable

Every article must follow ALL of these:

1. **Content Capsule Format:** 50-60% of body copy written as H2/H3 question + 30-60 word immediate answer. The answer must stand alone if the rest of the article is removed.

2. **Source-Backed Claims:** Every factual claim linked to a credible source inline (not at bottom). Cadence: one source per 150-200 words. Acceptable sources: GAF, Owens Corning, NRCA, Remodeling Magazine Cost vs Value, Arizona ROC, BBB, Roofing Contractor Magazine, NAR, local news for storm events.

3. **TLDR Section:** Every article opens with a 3-4 sentence summary after the H1. No exceptions.

4. **FAQ Section:** Every article closes with 4-6 FAQs in schema-ready format.

5. **Internal Links:** 3-5 internal links per article to relevant pages on site.

6. **Keyword in First 100 Words:** Primary keyword appears naturally in the first paragraph.

7. **One H1 only.** Multiple H2s and H3s allowed.

8. **Meta title and description generated** with every article. Meta title under 60 characters. Meta description under 155 characters.

---

## Revenue Model

1. Lead referrals: $25-$75 per qualified lead sold to verified contractors
2. Contractor listings: $49-$149/month per slot
3. Exclusive market packages: $500-$1,500/month per metro market
4. Newsletter sponsorships: $250-$1,000 per issue (Month 6+)
5. Domain/asset exit: evaluate at Month 12 if traffic milestones hit

---

## Business Separation

roofinstall.net has its own:
- Domain (roofinstall.net)
- Vercel project
- Supabase project (fresh, isolated)
- Beehiiv account
- Stripe account (when monetization activates)
- Social presence

It does NOT share infrastructure, branding, email domains, or clients with K9 Newsletters Media Group. Never mention K9 Newsletters in any roofinstall.net content, emails, or outreach.

---

## Tech Stack

- **Frontend:** Next.js 14, static site generation (SSG required — not SSR, not CSR)
- **Hosting:** Vercel
- **Database:** Supabase (fresh isolated project)
- **Newsletter:** Beehiiv
- **Email (transactional):** Brevo
- **Content generation:** Claude API (claude-sonnet-4-20250514)
- **Scraping/research:** Apify, Firecrawl
- **Payments (later):** Stripe
- **Analytics:** Google Analytics 4 + Google Search Console

---

## Key Constraints

- Static site generation ONLY — Google must be able to crawl every page instantly
- Supabase pin: v2.25.1 (higher versions break on Windows)
- No browser storage APIs (localStorage, sessionStorage) in any artifact
- Every page needs: sitemap entry, robots.txt allow, meta tags, OG tags
- llms.txt file in root directory — Day 1, no exceptions
- Content release cadence: 1-2 articles per day MAX — never dump bulk content
