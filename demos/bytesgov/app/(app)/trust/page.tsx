import type { Metadata } from "next";
import { Card, Eyebrow, PageHeader } from "@/components/ui";
import { IconCheck, IconFile, IconGrid, IconLock, IconPen, IconRadar, IconShieldCheck } from "@/components/Icons";

export const metadata: Metadata = { title: "Trust & Security" };

const PILLARS = [
  {
    icon: IconShieldCheck,
    title: "Your data is never training data",
    body: "Solicitations, proposals and pricing you bring in are used to serve your workspace only. They are not used to train or fine-tune any model, ours or a provider's.",
  },
  {
    icon: IconGrid,
    title: "Strict tenant isolation",
    body: "Every query is scoped to a single workspace at the data layer. One firm's pipeline, matrices and drafts are never visible to another, including in search and AI context.",
  },
  {
    icon: IconLock,
    title: "Encrypted at rest and in transit",
    body: "Stored data is encrypted with AES-256-GCM, with per-tenant keys. Traffic uses TLS 1.2 or newer. Uploaded files are scanned before processing.",
  },
  {
    icon: IconFile,
    title: "An audit log you can export",
    body: "Sign-ins, exports, role changes and every attestation are written to an append-only log. Export it as CSV for your own compliance reviews.",
  },
  {
    icon: IconPen,
    title: "A human signs for every draft",
    body: "AI-drafted content carries a DRAFT — NOT FOR SUBMISSION banner until a named person attests. The attestation is pinned to a SHA-256 hash of the draft, so any later edit voids it.",
  },
  {
    icon: IconRadar,
    title: "Public sources, clearly labelled",
    body: "Opportunity and award data comes from public SAM.gov, FPDS and USAspending records. Every figure links back to its source so you can verify it.",
  },
];

const ACCESS = [
  "Two-factor authentication with TOTP authenticator apps",
  "Role-based access: owner, capture lead, writer, reviewer, read-only",
  "Session timeouts and device sign-out",
  "Least-privilege access for BytesGov staff, logged and time-boxed",
];

export default function TrustPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trust & Security"
        title="Built for work that matters"
        sub="Capture and proposal data is some of the most sensitive information a contractor holds. This is how BytesGov protects it."
      />

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {PILLARS.map(({ icon: Icon, title, body }) => (
          <li key={title}>
            <Card as="article" className="h-full p-6">
              <span className="grid size-10 place-items-center rounded-full bg-blue/10 text-blue">
                <Icon />
              </span>
              <h2 className="mt-5 text-[1.2rem] font-medium leading-tight tracking-[-0.035em]">
                {title}
                <span className="text-blue">.</span>
              </h2>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-mute">{body}</p>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card as="div" className="p-6">
          <Eyebrow>Access control</Eyebrow>
          <ul className="mt-5 space-y-3">
            {ACCESS.map((a) => (
              <li key={a} className="flex gap-3 text-[0.92rem]">
                <IconCheck width={18} height={18} className="mt-0.5 shrink-0 text-blue" />
                {a}
              </li>
            ))}
          </ul>
        </Card>
        <Card as="div" className="bg-ink p-6 text-paper">
          <p className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-paper/60">
            <span aria-hidden className="size-1.5 rounded-full bg-blue" />
            About this demo
          </p>
          <p className="mt-5 text-[1.35rem] font-medium leading-snug tracking-[-0.04em]">
            Everything here is sample data that lives in your browser tab<span className="text-blue">.</span>
          </p>
          <p className="mt-3 text-[0.88rem] leading-relaxed text-paper/65">
            No account is created, nothing you type is sent to a server, and files you drop on the compliance page are never uploaded.
            Firms, people and notice numbers are fictional.
          </p>
        </Card>
      </div>
    </>
  );
}
