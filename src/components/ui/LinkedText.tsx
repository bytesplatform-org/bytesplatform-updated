import { splitLinks, type InlineLink } from "@/lib/linkText";

/** Copy with its internal links (from src/data/internalLinks.ts) wrapped in place. */
export default function LinkedText({ text, links, className }: { text: string; links?: InlineLink[]; className?: string }) {
  if (!links?.length) return text;
  return splitLinks(text, [...links]).map((part, index) =>
    typeof part === "string" ? part : <a key={index} className={className} href={part.href}>{part.text}</a>,
  );
}
