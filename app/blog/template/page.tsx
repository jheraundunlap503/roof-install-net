import type { Metadata } from "next";
import { ArticleScaffold } from "@/components/ArticleScaffold";

export const metadata: Metadata = {
  title: "Article Template Preview",
  description: "Noindex article template preview for roofinstall.net.",
  robots: {
    index: false,
    follow: false
  }
};

const body = `## What should homeowners know first?
This article template uses the required content capsule format: a question-style heading followed by a short, direct answer. Published articles will include source links inline, local context where relevant, and practical guidance homeowners can use before they call a contractor.

## How will cost guidance be presented?
Cost sections will explain the range, the assumptions behind that range, and the factors that move the number up or down. Arizona articles should account for UV exposure, monsoon weather, roof material, underlayment, and local permitting when relevant.

## What makes this different from contractor content?
The article should be honest about when a repair may be enough, when a replacement is likely, and which claims need a credible source. The tone should protect the homeowner from pressure, not push them into a lead form.

### What should readers do next?
Readers should compare the article guidance with their own roof age, material, visible symptoms, and local bids. The estimator CTA should feel like a useful next step, not a sales interruption.`;

export default function ArticleTemplatePreviewPage() {
  return (
    <ArticleScaffold
      body={body}
      date="Template preview"
      description="This noindex page shows the approved editorial article structure before real content is published."
      faq={[
        {
          question: "Will every article include a TLDR?",
          answer:
            "Yes. Every article opens with a 3-4 sentence TLDR immediately after the H1."
        },
        {
          question: "Will articles include sources?",
          answer:
            "Yes. Published articles need inline source-backed claims from credible roofing, insurance, or local sources."
        },
        {
          question: "Will this page be indexed?",
          answer:
            "No. This is a noindex template preview and is not included in the sitemap."
        }
      ]}
      label="Template preview"
      tldr={[
        "This is the article template, not a published roofing guide.",
        "It demonstrates the TLDR box, table of contents, capsule headings, estimator CTA, and FAQ structure."
      ]}
      title="Roofing Article Template"
      toc={[
        { id: "what-should-homeowners-know-first", title: "What homeowners should know first" },
        { id: "how-will-cost-guidance-be-presented", title: "How cost guidance will work" },
        { id: "what-makes-this-different-from-contractor-content", title: "How this differs from contractor content" }
      ]}
    />
  );
}
