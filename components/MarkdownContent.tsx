import Link from "next/link";
import { markdownToBlocks } from "@/lib/content";

type MarkdownContentProps = {
  markdown: string;
};

function parseInline(text: string): React.ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let k = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[1];
    if (token.startsWith("**")) {
      parts.push(<strong key={k++}>{token.slice(2, -2)}</strong>);
    } else {
      const bracket = token.indexOf("](");
      const linkText = token.slice(1, bracket);
      const url = token.slice(bracket + 2, -1);
      if (url.startsWith("http") || url.startsWith("//")) {
        parts.push(
          <a key={k++} href={url} target="_blank" rel="noopener noreferrer">
            {linkText}
          </a>
        );
      } else {
        parts.push(
          <Link key={k++} href={url}>
            {linkText}
          </Link>
        );
      }
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function toHeadingId(raw: string): string {
  return raw
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[[^\]]+\]\([^)]+\)/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function MarkdownContent({ markdown }: MarkdownContentProps) {
  return (
    <>
      {markdownToBlocks(markdown).map((block, index) => {
        // Horizontal rule
        if (block === "---") {
          return <hr key={index} />;
        }

        // H1 — skip (rendered in page header)
        if (block.startsWith("# ")) {
          return null;
        }

        // H2
        if (block.startsWith("## ")) {
          const raw = block.slice(3);
          const id = toHeadingId(raw);
          return (
            <h2 id={id} key={index}>
              {parseInline(raw)}
            </h2>
          );
        }

        // H3
        if (block.startsWith("### ")) {
          const raw = block.slice(4);
          const id = toHeadingId(raw);
          return (
            <h3 id={id} key={index}>
              {parseInline(raw)}
            </h3>
          );
        }

        // Unordered list
        if (block.startsWith("- ")) {
          return (
            <ul className="list" key={index}>
              {block.split("\n").map((line, li) => (
                <li key={li}>{parseInline(line.replace(/^- /, ""))}</li>
              ))}
            </ul>
          );
        }

        // Numbered list
        if (/^\d+\.\s/.test(block)) {
          return (
            <ol className="list" key={index}>
              {block.split("\n").map((line, li) => (
                <li key={li}>{parseInline(line.replace(/^\d+\.\s+/, ""))}</li>
              ))}
            </ol>
          );
        }

        // TLDR callout
        if (block.startsWith("**TLDR:**") || block.startsWith("**TLDR: ")) {
          return (
            <div className="art-tldr" key={index}>
              <p>{parseInline(block)}</p>
            </div>
          );
        }

        // Default paragraph
        return <p key={index}>{parseInline(block)}</p>;
      })}
    </>
  );
}
