"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { IconDownload, IconLock } from "../icons";
import { Badge, Card, CardHead, PageHeader } from "../ui";
import { downloadText } from "../XmlView";
import { SELLER } from "@/lib/data";
import { fmtDate, fmtDateTime } from "@/lib/format";
import { useStore } from "@/lib/store";
import { invoiceToXml, sha256 } from "@/lib/ubl";

const short = (h?: string) => (h ? `${h.slice(0, 10)}…${h.slice(-6)}` : "computing…");

export default function Archive() {
  const { invoices, holds, toggleHold, audit, log } = useStore();
  const archived = useMemo(() => invoices.filter((i) => i.peppol !== "Queued"), [invoices]);
  const xmls = useMemo(() => Object.fromEntries(archived.map((i) => [i.id, invoiceToXml(i, SELLER)])), [archived]);
  const [hashes, setHashes] = useState<Record<string, { xml: string; pdf: string }>>({});

  useEffect(() => {
    let alive = true;
    Promise.all(
      Object.entries(xmls).map(async ([id, x]) => [id, { xml: await sha256(x), pdf: await sha256(`%PDF-1.7 rendition\n${x}`) }] as const),
    ).then((rows) => alive && setHashes(Object.fromEntries(rows)));
    return () => {
      alive = false;
    };
  }, [xmls]);

  const held = archived.filter((i) => holds[i.id]).length;

  return (
    <>
      <PageHeader
        eyebrow="Legal archive"
        title="Archive"
        intro="Every XML and its PDF rendition is stored write-once with a SHA-256 hash. Retention follows Cabinet Decision 74/2023: five years by default, seven for real estate. A legal hold suspends expiry during an audit or dispute."
      />

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { l: "Documents archived", v: String(archived.length * 2), s: `${archived.length} XML + ${archived.length} PDF` },
          { l: "On legal hold", v: String(held), s: "Expiry suspended" },
          { l: "Retention policy", v: "5 / 7 yrs", s: "General / real estate" },
        ].map((k) => (
          <div key={k.l} className="card card-pad">
            <p className="text-[0.78rem] text-ink-mute">{k.l}</p>
            <p className="mt-2 text-[2.2rem] font-medium leading-none tracking-[-0.05em] tabular-nums">{k.v}</p>
            <p className="mt-2 text-[0.76rem] text-ink-mute">{k.s}</p>
          </div>
        ))}
      </div>

      <Card pad={false}>
        <div className="card-pad pb-3">
          <CardHead
            eyebrow="Write-once storage"
            title="Stored documents"
            aside={
              <span className="hidden items-center gap-1.5 text-[0.76rem] text-ink-mute sm:inline-flex">
                <IconLock size={14} /> Objects cannot be edited or deleted before expiry
              </span>
            }
          />
        </div>
        <div className="table-wrap">
          <table className="dtable min-w-[1000px]">
            <thead>
              <tr>
                <th scope="col">Document</th>
                <th scope="col">Stored</th>
                <th scope="col">XML SHA-256</th>
                <th scope="col">PDF SHA-256</th>
                <th scope="col">Retain until</th>
                <th scope="col">Legal hold</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {archived.map((i) => {
                const years = i.realEstate ? 7 : 5;
                const until = new Date(`${i.issueDate}T12:00:00`);
                until.setFullYear(until.getFullYear() + years);
                const h = hashes[i.id];
                const on = !!holds[i.id];
                return (
                  <tr key={i.id}>
                    <td>
                      <Link href={`/invoices/${i.id}`} className="font-medium hover:text-blue">
                        {i.number}
                      </Link>
                      <p className="max-w-[14rem] truncate text-[0.74rem] text-ink-mute">{i.buyer.name}</p>
                    </td>
                    <td className="whitespace-nowrap text-ink-mute">{fmtDateTime(i.createdAt)}</td>
                    <td>
                      <span className="mono" title={h?.xml}>
                        {short(h?.xml)}
                      </span>
                    </td>
                    <td>
                      <span className="mono text-ink-mute" title={h?.pdf}>
                        {short(h?.pdf)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap">
                      {on ? <Badge tone="warn">Suspended</Badge> : fmtDate(until)}
                      <p className="text-[0.72rem] text-ink-mute">{years} yrs{i.realEstate ? " · real estate" : ""}</p>
                    </td>
                    <td>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        aria-label={`Legal hold for ${i.number}`}
                        className="switch"
                        onClick={() => toggleHold(i.id)}
                      />
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="pill pill-sm pill-quiet"
                        onClick={() => {
                          downloadText(`${i.number}.xml`, xmls[i.id]);
                          log("Downloaded archived XML (signed link, 5 min)", i.number);
                        }}
                      >
                        <IconDownload size={14} /> XML
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-3">
        <CardHead eyebrow="Compliance audit log" title="Audit trail" aside={<span className="text-[0.76rem] text-ink-mute">Append-only</span>} />
        <div className="table-wrap -mx-2">
          <table className="dtable min-w-[680px]">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Actor</th>
                <th scope="col">Event</th>
                <th scope="col">Object</th>
              </tr>
            </thead>
            <tbody>
              {audit.slice(0, 14).map((a) => (
                <tr key={a.id}>
                  <td className="whitespace-nowrap text-ink-mute">{fmtDateTime(a.at)}</td>
                  <td className="whitespace-nowrap">{a.actor}</td>
                  <td>{a.action}</td>
                  <td className="mono whitespace-nowrap text-ink-mute">{a.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
