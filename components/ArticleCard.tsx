import Link from "next/link";
import type { ContentItem } from "@/lib/content";

type ArticleCardProps = {
  item: ContentItem;
  href: string;
  label?: string;
};

export function ArticleCard({ item, href, label }: ArticleCardProps) {
  return (
    <Link className="editorial-card" href={href}>
      <span className="label">{label || item.primaryKeyword || item.type}</span>
      <h3>{item.title}</h3>
      <p>{item.description || "Approved editorial content will appear here."}</p>
      <div className="metadata">
        {item.date ? <span>{item.date}</span> : null}
        {item.city ? <span>{item.city}</span> : null}
      </div>
    </Link>
  );
}
