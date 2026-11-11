import { Fragment, type ReactNode } from "react";
import { createSlugger, markdownHeadingText, type PortableBlock, type PortableSpan, type Post } from "@/lib/blogFormat";
import styles from "./Blog.module.css";

/**
 * Renders both post formats with the same typography: Sanity Portable Text
 * (paragraphs, h2–h4, bullet/number lists, strong/em/link marks — everything
 * the dataset uses) and the older posts' plain text with **bold** runs.
 * Headings get ids from createSlugger, matching postHeadings, so the
 * contents list can link to them.
 */
export default function PostBody({ body }: { body: Post["body"] }) {
  return (
    <div className={styles.prose}>
      {body.kind === "portable" ? renderPortable(body.blocks) : renderMarkdown(body.text)}
    </div>
  );
}

/* ------------------------------------------------------------ portable text */

function renderSpans(block: PortableBlock): ReactNode {
  const links = new Map(block.markDefs?.filter((def) => def._type === "link").map((def) => [def._key, def.href]) ?? []);
  return (block.children ?? []).map((span: PortableSpan, index) => {
    let node: ReactNode = span.text;
    for (const mark of span.marks ?? []) {
      if (mark === "strong") node = <strong>{node}</strong>;
      else if (mark === "em") node = <em>{node}</em>;
      else if (links.has(mark)) {
        const href = links.get(mark) ?? "#";
        const external = /^https?:\/\//.test(href) && !href.includes("bytesplatform.com");
        node = <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{node}</a>;
      }
    }
    return <Fragment key={span._key ?? index}>{node}</Fragment>;
  });
}

function renderPortable(blocks: PortableBlock[]) {
  const out: ReactNode[] = [];
  const slug = createSlugger();
  let list: { type: "bullet" | "number"; items: ReactNode[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.type === "number" ? "ol" : "ul";
    out.push(<Tag key={`list-${out.length}`}>{list.items}</Tag>);
    list = null;
  };

  blocks.forEach((block, index) => {
    const key = block._key ?? index;
    // Anything that isn't a text block (the dataset has one empty code block) is skipped.
    if (!block.children) return;
    if (block.listItem) {
      if (list && list.type !== block.listItem) flush();
      list ??= { type: block.listItem, items: [] };
      list.items.push(<li key={key}>{renderSpans(block)}</li>);
      return;
    }
    flush();
    const text = block.children.map((child) => child.text).join("").trim();
    if (!text) return;
    const content = renderSpans(block);
    if (block.style === "h2") out.push(<h2 key={key} id={slug(text)}>{content}</h2>);
    else if (block.style === "h3") out.push(<h3 key={key} id={slug(text)}>{content}</h3>);
    else if (block.style === "h4") out.push(<h4 key={key} id={slug(text)}>{content}</h4>);
    else out.push(<p key={key}>{content}</p>);
  });
  flush();
  return out;
}

/* ----------------------------------------------------------------- markdown */

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part,
  );
}

/**
 * Line-based: "##"–"####" lines are headings (text follows on the next line,
 * not after a blank one), "- " / "• " lines group into a list, and other runs
 * of lines become paragraphs.
 */
function renderMarkdown(text: string) {
  const out: ReactNode[] = [];
  const slug = createSlugger();
  let paragraph: string[] = [];
  let items: string[] = [];
  const flushParagraph = () => {
    if (paragraph.length) out.push(<p key={out.length}>{renderInline(paragraph.join(" "))}</p>);
    paragraph = [];
  };
  const flushList = () => {
    if (items.length) out.push(<ul key={out.length}>{items.map((item, index) => <li key={index}>{renderInline(item)}</li>)}</ul>);
    items = [];
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const heading = /^(#{2,4})\s+(.*)$/.exec(line);
    const item = /^[-•]\s+(.*)$/.exec(line);
    if (!line) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      const content = renderInline(heading[2].replace(/^\*\*|\*\*$/g, ""));
      const level = heading[1].length;
      const id = slug(markdownHeadingText(heading[2]));
      out.push(level === 2 ? <h2 key={out.length} id={id}>{content}</h2> : level === 3 ? <h3 key={out.length} id={id}>{content}</h3> : <h4 key={out.length} id={id}>{content}</h4>);
    } else if (item) {
      flushParagraph();
      items.push(item[1]);
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return out;
}
