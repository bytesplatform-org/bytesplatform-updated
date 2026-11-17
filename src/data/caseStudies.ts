import { demoUrls } from "./demos";

/**
 * Product case studies with their live demos. Facts come from the product pages
 * (productContent.ts) and BytesGov's public Trust & Security page; no outcome
 * metrics are stated until there are client-approved numbers to quote.
 */
export const caseStudies = [
  {
    slug: "bytesgov",
    name: "BytesGov",
    sector: "Federal contracting",
    tagline: "Know your odds before you bid.",
    summary:
      "A multi-tenant platform for government contractors and the consultants who bid for them: SAM.gov and FPDS opportunities scored for win probability, solicitations turned into compliance matrices, and proposal drafts that cannot be exported until a named person attests to them.",
    challenge: [
      "Small contractors read hundreds of notices to find the few worth pursuing, and bid or no-bid calls were made on instinct.",
      "Sections L and M were tracked in spreadsheets, so compliance gaps surfaced the week a proposal was due.",
      "AI drafting was tempting but risky: nobody could prove who had reviewed what was submitted.",
    ],
    built: [
      { title: "Opportunity discovery", body: "Daily SAM.gov and FPDS ingestion across each client's NAICS codes, plus state and municipal bids." },
      { title: "Calibrated P(win)", body: "An eight-factor score recalibrated against each firm's own wins and losses, with a bid / no-bid engine." },
      { title: "Compliance matrix", body: "AI clause extraction mapping Sections L & M and FAR / DFARS clauses, with gaps flagged." },
      { title: "Proposal Studio", body: "Outlines, win themes and drafts, held behind a human attestation pinned to a hash of the text." },
      { title: "Market intelligence", body: "Set-aside eligibility, incumbents, competitors and agency buying profiles from USAspending." },
      { title: "Post-award", body: "Deliverables, modifications, options, timekeeping and receivables feeding the next bid." },
    ],
    engineering: [
      "Tenant isolation enforced in middleware, with cross-tenant regression tests on every change",
      "AES-256-GCM encryption at rest and an exportable per-firm audit log that records every AI call",
      "A multi-provider AI router, so no firm depends on a single model vendor; customer data is never used for training",
      "Mapping controls to NIST SP 800-171 and CMMC Level 2",
    ],
    stack: ["Next.js", "PostgreSQL", "Background workers", "Multi-LLM router", "BigQuery", "SAM.gov & USAspending APIs"],
    demo: {
      href: demoUrls.bytesgov,
      tries: [
        "Sign in to a sample contractor workspace",
        "Open an opportunity and read its P(win) breakdown",
        "Turn a sample RFP into a compliance matrix and export it",
        "Attest a proposal draft, then watch the attestation go stale when you edit it",
      ],
    },
    links: { product: "/products/bytesgov", related: { label: "Government contractors", href: "/government-contractors" } },
  },
  {
    slug: "bytesbilling",
    name: "BytesBilling",
    sector: "UAE e-invoicing",
    tagline: "Every invoice, valid before it leaves.",
    summary:
      "An e-invoicing hub for the UAE mandate. Invoices raised in Bytes ERP or an existing ERP are built as PINT AE documents, validated against UAE VAT rules before they reach the accredited service provider, and tracked through Peppol delivery and FTA reporting separately.",
    challenge: [
      "The mandate makes structured e-invoices compulsory, starting with businesses above AED 50M revenue on 1 January 2027.",
      "Appointing an ASP is the easy part. Most ERPs hold TRNs, VAT categories and buyer endpoints that would fail PINT AE validation.",
      "An invoice can reach the buyer over Peppol and still be rejected by the FTA, and a single status column hides that.",
    ],
    built: [
      { title: "PINT AE engine", body: "UBL 2.1 documents, schema-validated and checked against VAT business rules, with plain-English fixes." },
      { title: "Two-state tracking", body: "Peppol state and FTA state tracked independently, so a delivered-but-rejected invoice is never green." },
      { title: "Rejection worklist", body: "Errors grouped by code with the master data to fix and idempotent one-click resubmission." },
      { title: "Inbound invoices", body: "Supplier e-invoices 3-way matched against purchase orders and receipts, then posted to payables." },
      { title: "Legal archive", body: "Write-once XML and PDF with SHA-256 hashes, 5- and 7-year retention clocks and legal hold." },
      { title: "Bytes ERP", body: "A multi-tenant ERP with double-entry ledger, VAT categories and gapless numbering, for firms without one." },
    ],
    engineering: [
      "Validation runs locally, before submission, so failures cost nothing",
      "Idempotent submissions: retries never create duplicates at the provider",
      "Works over a simple HTTPS API beside SAP, Oracle, Dynamics, Odoo, Zoho, Tally and QuickBooks",
      "Role-based access and MFA, with a compliance audit log on every tenant",
    ],
    stack: ["PINT AE / UBL 2.1", "Peppol 5-corner model", "ASP integration", "ERP connectors", "Write-once storage"],
    demo: {
      href: demoUrls.bytesbilling,
      tries: [
        "Build an invoice and watch the PINT AE rules check it live",
        "Fix a bad TRN, submit to the ASP and follow both states",
        "Validate a sample UBL XML file rule by rule",
        "Clear the rejection worklist with idempotent resubmits",
      ],
    },
    links: { product: "/products/bytesbilling", related: { label: "UAE e-invoicing", href: "/e-invoicing" } },
  },
];
