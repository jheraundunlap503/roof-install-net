# roofinstall.net — Claude Code Project DNA

## Project Identity
You are building roofinstall.net — a standalone AI-powered homeowner resource for the U.S. roofing industry. This is NOT a contractor website. This is NOT affiliated with K9 Newsletters. This is an independent media and lead generation asset.

## Your Role
You are building, maintaining, and expanding this platform. You write code, generate content, manage the content pipeline, and handle deployments. You do not make decisions about monetization, client relationships, or business strategy without explicit approval.

## Non-Negotiables

### SSG Only
Every page MUST use static site generation. Never use server-side rendering or client-side rendering for content pages. Google must be able to crawl and index every page instantly. If you're about to use getServerSideProps or a client-side fetch for content — stop and use getStaticProps instead.

### Content Quality Rules
Every article you write must include:
- TLDR section (3-4 sentences) immediately after the H1
- Content capsule format for 50-60% of body (H2/H3 question + 30-60 word immediate answer)
- Articles 1-10: at least 3-5 source-backed claims with inline contextual links
- Articles 11+: 7-10 inline source citations per article (source-backed-claims.skill standard — cite every 150-200 words, Tier 1-2 sources only, links embedded in contextual keyword phrases)
- FAQ section at close (4-6 questions)
- 3-5 internal links
- Meta title (under 60 chars) and meta description (under 155 chars)
- Primary keyword in first 100 words
- One H1 only

### Voice Rules
- No em-dashes anywhere
- No AI-sounding phrases: no "delve", "comprehensive guide", "in today's world", "it's worth noting"
- Specific numbers over vague claims
- Arizona climate context where relevant (UV load, monsoon season, 15-20 year shingle lifespan)
- Honest tone — tell homeowners when they do NOT need a new roof

### File Paths
- Blog articles: /content/blog/[slug].md
- Service pages: /content/services/[slug].md
- Components: /components/
- Pages: /app/ (Next.js 14 App Router)
- API routes: /app/api/

### Database
- Supabase v2.25.1 ONLY — do not upgrade
- Always check for duplicate slugs before writing
- Always update article status in Supabase after publish
- Never hardcode Supabase keys — always use .env

### Deployment
- Vercel only
- Every deploy auto-triggers from GitHub push to main
- Never push directly to main without testing on preview first

## Approval Gates — Always Stop and Show Me

1. After Blueprint presentation — before any code is written
2. After Phase 1 site is live on preview URL — before estimator build
3. After estimator tool is complete — before content system build
4. After first 10 articles are generated — before scheduling automation
5. Before any article is published live to the site
6. Before any email is sent from Brevo

## Content Generation Instructions

When writing articles:
1. Search for the keyword in Google to find top 3 ranking pages
2. Note their average word count, H2 structure, and question coverage
3. Find credible sources before writing a single word — articles 1-10: 3-5 sources; articles 11+: 7-10 sources (Tier 1-2 per source-backed-claims.skill: .gov, manufacturer docs, NRCA, NRCA, BBB, Remodeling Magazine, NOAA, AZ Central)
4. Write TLDR first
5. Write body in content capsule format
6. Add internal links to existing site pages
7. Write FAQ section
8. Generate meta title and description
9. Pull relevant image from Pexels API
10. Save to /content/blog/[slug].md
11. Update Supabase article status to 'published'
12. Submit to Google Search Console via API

## What You Should NEVER Do

- Never use localStorage or sessionStorage
- Never hardcode API keys
- Never publish more than 2 articles per day
- Never re-use a keyword already marked published in Supabase
- Never use SSR for content pages
- Never send emails or publish content without explicit approval
- Never build on stale code — start fresh if architecture changes
- Never mention K9 Newsletters or roofing contractor clients in any roofinstall.net content
