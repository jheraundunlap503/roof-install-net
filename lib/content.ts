import fs from "node:fs";
import path from "node:path";

export type ContentType = "blog" | "services";

export type ContentItem = {
  slug: string;
  title: string;
  description: string;
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
  image_alt?: string;
  date?: string;
  published?: boolean;
  type: ContentType;
  primaryKeyword?: string;
  city?: string;
  service?: string;
  body: string;
};

const contentRoot = path.join(process.cwd(), "content");

function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---")) {
    return { data: {}, body: raw.trim() };
  }

  const closing = raw.indexOf("\n---", 3);
  if (closing === -1) {
    return { data: {}, body: raw.trim() };
  }

  const frontmatter = raw.slice(3, closing).trim();
  const body = raw.slice(closing + 4).trim();
  const data = frontmatter.split("\n").reduce<Record<string, string>>((acc, line) => {
    const separator = line.indexOf(":");
    if (separator === -1) {
      return acc;
    }

    const key = line.slice(0, separator).trim();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    acc[key] = value;
    return acc;
  }, {});

  return { data, body };
}

export function getContentItems(type: ContentType): ContentItem[] {
  const dir = path.join(contentRoot, type);
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, body } = parseFrontmatter(raw);

      const description = data.meta_description || data.description || data.metaDescription || "";
      const published = data.published === undefined ? true : data.published !== "false";
      return {
        slug,
        title: data.title || slug.replace(/-/g, " "),
        description,
        meta_title: data.meta_title || data.title || "",
        meta_description: description,
        image_url: data.image_url || "",
        image_alt: data.image_alt || "",
        date: data.date,
        published,
        type,
        primaryKeyword: data.primary_keyword || data.primaryKeyword,
        city: data.city,
        service: data.service,
        body
      };
    })
    .filter((item) => item.published !== false)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function getContentItem(type: ContentType, slug: string) {
  return getContentItems(type).find((item) => item.slug === slug);
}

export function getAllStaticPaths() {
  const blog = getContentItems("blog").map((item) => `/blog/${item.slug}/`);
  const services = getContentItems("services").map(
    (item) => `/services/${item.slug}/`
  );

  return [...blog, ...services];
}

export function markdownToBlocks(markdown: string) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}
