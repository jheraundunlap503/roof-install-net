import type { Metadata } from "next";
import { ArticleScaffold } from "@/components/ArticleScaffold";

export const metadata: Metadata = {
  title: "Service Page Template Preview",
  description: "Noindex service page template preview for roofinstall.net.",
  robots: {
    index: false,
    follow: false
  }
};

const body = `## What does this service cost locally?
Service pages will open with a clear local cost discussion and explain the assumptions behind the range. The content should identify material, roof size, underlayment, slope, access, and climate as separate cost drivers.

## What local factors change the job?
Phoenix metro service pages should cover UV exposure, monsoon timing, tile underlayment, foam roof coating cycles, HOA approval, and city or county permit expectations when relevant.

## What should you ask before hiring?
Homeowners should ask about license status, insurance, scope of work, material brand, underlayment, warranty terms, cleanup, payment timing, and what is excluded from the estimate.

### When is the estimator useful?
The estimator is useful before a homeowner collects bids, after an insurance inspection, or when two contractor estimates are far apart.`;

export default function ServiceTemplatePreviewPage() {
  return (
    <ArticleScaffold
      body={body}
      ctaStrength="strong"
      date="Template preview"
      description="This noindex page shows the stronger service-page structure for local roofing pages."
      faq={[
        {
          question: "Are service pages published automatically?",
          answer:
            "No. Service pages require approval and follow the content release limit."
        },
        {
          question: "Will service pages include local data?",
          answer:
            "Yes. The template includes sections for local cost factors, permit notes, material fit, and homeowner questions."
        },
        {
          question: "Will these pages use a stronger CTA?",
          answer:
            "Yes, but the CTA remains editorial and points to the estimator instead of using aggressive sales language."
        }
      ]}
      label="Service template"
      tldr={[
        "This is the service page template, not a live local service page.",
        "It uses the article structure plus stronger local cost, data, and estimator sections."
      ]}
      title="Local Roofing Service Page Template"
      toc={[
        { id: "what-does-this-service-cost-locally", title: "Local cost range" },
        { id: "what-local-factors-change-the-job", title: "Local job factors" },
        { id: "what-should-you-ask-before-hiring", title: "Hiring questions" }
      ]}
    />
  );
}
