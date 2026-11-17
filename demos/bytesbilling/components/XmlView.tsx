"use client";

import { useEffect, useState } from "react";
import { sha256 } from "@/lib/ubl";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Minimal, safe highlighter: tokenises raw XML and escapes every piece it emits. */
function highlight(xml: string) {
  return xml.replace(/<[^>]+>|[^<]+/g, (tok) => {
    if (!tok.startsWith("<")) return tok.trim() ? `<span class="v">${esc(tok)}</span>` : esc(tok);
    const m = /^(<\/?)([\w:.-]+)([\s\S]*?)(\/?>)$/.exec(tok);
    if (!m) return `<span class="p">${esc(tok)}</span>`;
    const [, open, name, attrs, close] = m;
    const a = attrs.replace(/([^\s=]+)="([^"]*)"|([\s\S])/g, (_x, k, v, other) =>
      k !== undefined ? `<span class="a">${esc(k)}</span>=<span class="v">"${esc(v)}"</span>` : esc(other),
    );
    return `<span class="p">${esc(open)}</span><span class="t">${esc(name)}</span>${a}<span class="p">${esc(close)}</span>`;
  });
}

export function XmlCode({ xml, maxHeight = "32rem" }: { xml: string; maxHeight?: string }) {
  return (
    <pre className="xml overflow-auto rounded-2xl bg-[#11131c] p-5" style={{ maxHeight }} tabIndex={0} aria-label="PINT AE XML">
      <code dangerouslySetInnerHTML={{ __html: highlight(xml) }} />
    </pre>
  );
}

export function useSha256(text: string) {
  const [hash, setHash] = useState("");
  useEffect(() => {
    let alive = true;
    sha256(text).then((h) => alive && setHash(h));
    return () => {
      alive = false;
    };
  }, [text]);
  return hash;
}

export function downloadText(filename: string, text: string, type = "application/xml") {
  try {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    /* ignore */
  }
}
