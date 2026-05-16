import Link from "next/link";

type EditorialCardProps = {
  href: string;
  label: string;
  title: string;
  excerpt: string;
  meta?: string;
};

export function EditorialCard({
  href,
  label,
  title,
  excerpt,
  meta
}: EditorialCardProps) {
  return (
    <Link className="editorial-card" href={href}>
      <span className="label">{label}</span>
      <h3>{title}</h3>
      <p>{excerpt}</p>
      {meta ? <div className="metadata">{meta}</div> : null}
    </Link>
  );
}
