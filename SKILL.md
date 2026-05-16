---
name: roofinstall-seo
description: >
  roofinstall.net content engine — generates SEO-optimized roofing articles, service pages, and FAQ content for the roofinstall.net platform. Use this skill whenever generating any content for roofinstall.net including blog articles, East Valley service pages, national city pages, and FAQ content. This skill MUST be used for all roofinstall.net content production — it contains the complete content capsule format, source-backing rules, keyword cluster logic, on-page SEO checklist, and Arizona roofing knowledge base required to produce content that ranks and converts. Triggers on: roofinstall article, roofinstall content, write blog for roofinstall, generate service page, roofinstall keyword, write roofing article, create city page roofinstall, roofinstall FAQ.
---

# roofinstall-seo — Content Engine Skill

Generates publish-ready content for roofinstall.net that ranks in Google and gets cited in AI search engines. Every piece follows the three-reader rule: written for the human homeowner, scannable by an AI inbox summarizer, and structured for AI search citation.

---

## Step 1 — Pre-Write Research (Always Do This First)

Before writing a single word:

1. **Check Supabase** — confirm the keyword is not already marked 'published' or 'in_progress'
2. **Google the keyword** — find the top 3 ranking pages (not Reddit, not Quora — actual articles)
3. **Note from top 3:** average word count, H2 heading structure, questions covered, what they miss
4. **Find 3-5 credible sources** for the main claims:
   - GAF (gaf.com) — for material specs, warranties, certification data
   - NRCA (nrca.net) — for industry standards
   - Remodeling Magazine Cost vs Value Report — for ROI data
   - Arizona ROC (roc.az.gov) — for licensing, contractor data
   - BBB Arizona (bbb.org/us/az) — for complaint data, scam patterns
   - Roofing Contractor Magazine — for industry trends
   - Local news sources — for storm events, hail reports
   - NAR (realtor.org) — for home value impact data

---

## Step 2 — Article Architecture

Every article follows this exact structure:

```
[H1 — Primary Keyword in Title]

[TLDR — 3-4 sentences. What this article covers and the key takeaway. 
Written so someone who reads ONLY this section knows what to do.]

[Introduction — 2-3 paragraphs max. Hook with a specific Arizona 
pain point or real scenario. Primary keyword in first 100 words.]

[H2 — Written as a question the homeowner is actually asking]
[30-60 word answer that stands completely alone. No fluff.]

[H2 — Next question]
[30-60 word answer]

[Continue for 50-60% of body copy in this format]

[H2 — Deeper editorial section — longer, more opinionated, 
Arizona-specific context, real numbers, real scenarios]

[H2 — Another editorial section if needed]

[H2 — Frequently Asked Questions]
[4-6 FAQs in schema markup format — see FAQ format below]

[Closing CTA — soft, useful, no hard sell. 
"Use our free cost estimator to get a ballpark for your home."]
```

---

## Step 3 — Content Rules

### Voice
- Straight-talking homeowner resource, not a contractor pitch
- Specific numbers over vague claims ("Arizona shingles last 15-20 years" not "shorter than average")
- Arizona climate context always: UV load, 300+ days sun, 40-50 monsoon storms annually
- Honest — tell readers when they DON'T need a new roof
- No em-dashes anywhere
- No: "delve", "comprehensive", "in today's world", "it's worth noting", "game-changer"
- No generic opener: never start with "When it comes to..." or "In today's..."

### Content Capsule Format
- 50-60% of body copy = H2/H3 question + 30-60 word immediate answer
- Test: does the answer make sense if you read NOTHING else on the page?
- If no — rewrite until it does

### Source-Backed Claims
- Every 150-200 words, cite a credible source
- Link contextually in the sentence (not at the bottom as references)
- Example: "According to [Remodeling Magazine's Cost vs Value Report](URL), Arizona homeowners recoup approximately 68% of roof replacement costs at resale."
- Never make up statistics — if you can't source it, don't include it or reframe as opinion

### Arizona Roofing Knowledge Base
- Asphalt shingles last 15-20 years in Arizona (vs 25-30 nationally) due to UV and heat
- Clay/concrete tile regularly lasts 50+ years in Arizona
- Monsoon season: July-September, 40-50 storms annually
- Average monsoon roofing damage: $10M+ annually statewide
- October 2025 hail event: up to 2.5-inch hail in Chandler, Tempe, Scottsdale, Mesa
- East Valley HOA communities: Gilbert, Chandler, Queen Creek have strict ARC approval requirements
- GAF Master Elite: top 2% of roofers in North America
- Arizona ROC (Registrar of Contractors): verify license at roc.az.gov
- Roofing was AZ's #1 consumer complaint industry 2021 and 2022 (BBB data)
- Insurance adjusters' first offers are frequently below actual replacement cost

---

## Step 4 — On-Page SEO Checklist

Run this on every article before saving:

- [ ] Primary keyword in H1 title
- [ ] Primary keyword in first 100 words naturally
- [ ] One H1 only — never more than one
- [ ] Meta title generated (under 60 characters, includes primary keyword)
- [ ] Meta description generated (under 155 characters, includes benefit + CTA)
- [ ] 3-5 internal links to existing site pages (use relative URLs)
- [ ] 2-3 external links to credible sources (contextual, not at bottom)
- [ ] Keyword cluster: 3-5 related secondary keywords embedded naturally in H2s and body
- [ ] TLDR section present (3-4 sentences, after H1, before introduction)
- [ ] FAQ section present (4-6 questions, schema format)
- [ ] Pexels image pulled and included (alt text = primary keyword)
- [ ] Word count within 20% of top 3 ranking pages average
- [ ] Reading level: 8th grade or below (short sentences, plain English)

---

## Step 5 — FAQ Schema Format

Use this exact format for every FAQ section:

```markdown
## Frequently Asked Questions

**[Question 1?]**
[Direct answer in 2-4 sentences. Start with the direct answer, not a preamble.]

**[Question 2?]**
[Direct answer.]

**[Question 3?]**
[Direct answer.]

**[Question 4?]**
[Direct answer.]
```

FAQs should answer the questions homeowners are actually Googling — pull from People Also Ask for the primary keyword. Never make up questions.

---

## Step 6 — Service Page Format

Service pages follow the zipper method: [Service] + [City, AZ]

```
[H1: {Service} in {City}, AZ — {Year} Cost Guide]

[TLDR]

[H2: How Much Does {Service} Cost in {City}?]
[Local cost range with material breakdown]

[H2: Why {City} Homeowners Choose {Service}]
[Arizona climate-specific reasons]

[H2: What to Look For in a {City} Roofing Contractor]
[Licensing, GAF Elite, reviews, insurance]

[H2: The {Service} Process in {City}]
[Step by step, realistic timeline]

[H2: Common Questions About {Service} in {City}]
[4-5 FAQs]

[CTA: Free cost estimate for your {City} home]
```

Service pages target buyer-intent keywords. They are shorter than blog articles (600-900 words). Every service page links to the cost estimator tool.

---

## Step 7 — City Page Format (National Programmatic)

```
[H1: Roof Installation Cost in {City}, {State}: {Year} Guide]

[TLDR]

[H2: Average Roof Replacement Cost in {City}]
[National baseline + local adjustment factors]

[H2: Roofing Materials Best Suited for {City}'s Climate]
[Climate-specific material recommendations]

[H2: What Affects Roofing Costs in {City}]
[Labor market, material availability, permit costs]

[H2: How to Find a Reputable Roofer in {City}]
[Contractor vetting checklist, licensing lookup]

[H2: {City} Roofing FAQs]
[4-5 FAQs]

[CTA: Use our free estimator for a {City} cost estimate]
```

City pages are 700-1,000 words. They pull from the national cost data and adjust for regional labor and material costs.

---

## Step 8 — Output Format

Save every article as:

```
---
title: [Full article title]
slug: [url-friendly-slug]
date: [YYYY-MM-DD]
meta_title: [Under 60 chars]
meta_description: [Under 155 chars]
primary_keyword: [keyword]
keyword_cluster: [keyword1, keyword2, keyword3]
type: [blog|service|city|faq]
image_url: [Pexels URL]
image_alt: [primary keyword]
---

[Article content in markdown]
```

Save to:
- Blog: /content/blog/[slug].md
- Service pages: /content/services/[slug].md
- City pages: /content/cities/[slug].md

Update Supabase articles table: set status = 'published', published_at = now()
Update Supabase keywords table: set status = 'published', assigned_url = '/blog/[slug]'

---

## Content Update Schedule

Every article older than 6 months should be reviewed for:
- Cost data accuracy (check against current Remodeling Magazine report)
- Storm event references (add new hail/monsoon events)
- GAF certification status of any mentioned contractors
- BBB complaint statistics (update annually)
- Any new HOA rule changes in East Valley communities
