/**
 * Pure helpers for weaving internal links into text. Safe in client
 * components: the link data itself lives in src/data/internalLinks.ts and
 * reaches a page as props.
 */

export type InlineLink = { anchor: string; href: string };

/** What a service, product or government page shows of the site's internal links. */
export type PageExplore = {
  /** Anchors in the page copy, by field ("offer.items.2", "faqs.0"). */
  links: Record<string, InlineLink[]>;
  related: { href: string; label: string }[];
  reading: { href: string; title: string }[];
};

/** A run of text, or a run that should be wrapped in a link. */
export type LinkedPart = string | { text: string; href: string };

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/'/g, "['’]");

/** Whole-word, case-insensitive: "SEO strategy" matches "SEO Strategy" but not "SEO strategy-led". */
const pattern = (anchor: string) => new RegExp(`(?<![\\w-])${escape(anchor)}(?![\\w-])`, "i");

/**
 * Splits `text` around the first appearance of any pending anchor, repeating
 * on what follows. Anchors that get used are removed from `pending`, so passing
 * the same array through a whole post links each anchor once, where it first
 * appears.
 */
export function splitLinks(text: string, pending: InlineLink[]): LinkedPart[] {
  if (!pending.length || !text) return [text];
  let first: { index: number; length: number; link: InlineLink } | null = null;
  for (const link of pending) {
    const match = pattern(link.anchor).exec(text);
    if (match && (!first || match.index < first.index)) first = { index: match.index, length: match[0].length, link };
  }
  if (!first) return [text];
  pending.splice(pending.indexOf(first.link), 1);
  const end = first.index + first.length;
  return [
    ...(first.index > 0 ? [text.slice(0, first.index)] : []),
    { text: text.slice(first.index, end), href: first.link.href },
    ...splitLinks(text.slice(end), pending),
  ];
}
