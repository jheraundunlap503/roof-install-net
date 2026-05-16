# roofinstall.net — Agent Roster

## DOE Framework — Directive / Orchestration / Execution

This project runs three specialized agents. Each agent has a defined scope. They do not overlap.

---

## Agent 1: Site Builder

**Directive:** Build and maintain the roofinstall.net Next.js frontend — all pages, components, API routes, static files, and Vercel deployment.

**Scope:**
- Homepage, blog index, service page index, about, contact
- Cost estimator React component and API route
- Email capture form connected to Brevo and Supabase
- llms.txt, robots.txt, sitemap.xml generation
- Vercel deployment pipeline
- Google Search Console verification

**Does NOT:** Write article content, run content schedules, manage Supabase schema beyond the leads table.

**Handoff to:** Content Engine Agent when site is live and approved on preview URL.

---

## Agent 2: Content Engine

**Directive:** Generate, format, and publish all blog articles and service pages following the roofinstall SEO rules. Maintain the content calendar and keyword tracker.

**Scope:**
- Read keyword from keywords.csv or Supabase keywords table
- Research top 3 ranking pages for keyword
- Find credible sources for claims
- Write article in content capsule format with TLDR + FAQ
- Apply full on-page SEO checklist
- Pull image from Pexels API
- Save to /content/blog/ or /content/services/
- Update Supabase article status
- Submit to Google Search Console

**Does NOT:** Build frontend components, handle lead capture, manage Vercel deploys.

**Approval gate:** Show generated article for review before saving to /content/ folder. Never publish without explicit approval on first 10 articles.

**Schedule:** Run daily at 9am (blog) and 11am (service pages) once approved.

---

## Agent 3: Data Layer

**Directive:** Build and maintain the Supabase database, lead pipeline, and all data flows between the estimator tool, Beehiiv, and Brevo.

**Scope:**
- Supabase schema creation and migrations
- Lead capture from estimator → Supabase leads table
- Brevo transactional email triggers (lead confirmation, admin notification)
- Beehiiv API integration for newsletter opt-ins
- Keyword and article status tracking in Supabase
- Weekly lead report generation

**Does NOT:** Write articles, build frontend pages, manage Vercel.

**Approval gate:** Show all Supabase table schemas and Brevo email templates before activating any send.

---

## Activation

To activate DOE in Antigravity:
1. Save this file
2. Type: `@agents.md instantiate`
3. Agent will confirm all three agents are loaded and ask which to activate first

Activate in order: Site Builder → Data Layer → Content Engine
