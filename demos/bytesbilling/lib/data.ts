import { addDays, isoDay, VAT_RATES } from "./format";
import type { AuditEntry, FtaState, Invoice, Line, Party, PeppolState, VatCategory } from "./types";

/* All companies, TRNs and amounts below are fictional sample data. */

export const SELLER: Party = {
  name: "Al Noor Trading LLC (demo)",
  trn: "100352984700003",
  endpoint: "0235:100352984700003",
  street: "Office 1204, Bay Square 7, Business Bay",
  city: "Dubai",
  emirate: "DU",
};

export const ERP_NAME = "SAP Business One";
export const ASP_NAME = "Accredited ASP · sandbox";

/** UAE mandate milestones (UTC+4), from MoF Electronic Invoicing Guidelines v1.1. */
export const MILESTONES = [
  { id: "p1-asp", date: "2026-10-30T23:59:59+04:00", label: "Phase 1: appoint your ASP", who: "Revenue AED 50M+" },
  { id: "p1-live", date: "2027-01-01T00:00:00+04:00", label: "Phase 1: mandatory go-live", who: "Revenue AED 50M+" },
  { id: "p2-asp", date: "2027-03-31T23:59:59+04:00", label: "Phase 2: appoint your ASP", who: "Revenue below AED 50M" },
  { id: "p2-live", date: "2027-07-01T00:00:00+04:00", label: "Phase 2: mandatory go-live", who: "Revenue below AED 50M" },
] as const;

export function nextMilestone(now: Date) {
  return MILESTONES.find((m) => new Date(m.date).getTime() > now.getTime()) ?? MILESTONES[MILESTONES.length - 1];
}

export const PENALTIES = [
  { amount: "AED 5,000", per: "per month", what: "for not implementing e-invoicing or not appointing an ASP on time" },
  { amount: "AED 100", per: "per invoice", what: "issued or sent late, capped at AED 5,000 a month" },
] as const;

export const REJECTION_CODES: Record<
  string,
  { title: string; hint: string; fix: string; side: "Peppol" | "FTA"; fixDone: string }
> = {
  "FTA-TRN-404": {
    side: "FTA",
    title: "Buyer TRN not active in the FTA register",
    hint: "The TRN is well-formed, so it passed local checks, but the FTA has no active registration for it. Usually the customer re-registered or sent an old certificate.",
    fix: "Update the customer's TRN in SAP Business One from their current VAT certificate.",
    fixDone: "Customer master updated with the TRN from the current VAT certificate.",
  },
  "PEPPOL-SMP-404": {
    side: "Peppol",
    title: "Buyer endpoint not found on the Peppol network",
    hint: "The buyer's Peppol ID isn't registered with any access point yet, so the invoice can't be delivered. Their ASP may have registered a different scheme.",
    fix: "Confirm the buyer's Peppol ID (scheme 0235) with their AP team and update the customer record.",
    fixDone: "Endpoint confirmed with the buyer and updated on the customer record.",
  },
  "FTA-TAX-210": {
    side: "FTA",
    title: "Exempt line without an exemption reason",
    hint: "Category E was sent without a reason code for the Tax Data Document. The tax-code mapping for this item is incomplete.",
    fix: "Map item tax code E-RES to exemption reason “Residential lease” in the tax-code table.",
    fixDone: "Tax-code E-RES mapped to the residential lease exemption reason.",
  },
};

export const BUYERS: Party[] = [
  { name: "Gulf Horizon Contracting LLC", trn: "100487213900003", endpoint: "0235:100487213900003", street: "Musaffah M-26", city: "Abu Dhabi", emirate: "AZ" },
  { name: "Marina Crest Hospitality LLC", trn: "100623405100003", endpoint: "0235:100623405100003", street: "Marina Walk, Tower B", city: "Dubai", emirate: "DU" },
  { name: "Desert Bloom Facilities FZ-LLC", trn: "100219876500003", endpoint: "0235:100219876500003", street: "Dubai Silicon Oasis, A3", city: "Dubai", emirate: "DU" },
  { name: "Al Seef Medical Supplies LLC", trn: "100734190200003", endpoint: "0235:100734190200003", street: "Al Qusais Industrial 4", city: "Dubai", emirate: "DU" },
  { name: "Palm Grove Property Management LLC", trn: "100558012300003", endpoint: "0235:100558012300003", street: "Al Majaz 2", city: "Sharjah", emirate: "SH" },
  { name: "Coastal Freight & Logistics LLC", trn: "100901236400003", endpoint: "0235:100901236400003", street: "Jebel Ali Free Zone, S-B21", city: "Dubai", emirate: "DU" },
  { name: "Oasis Retail Group LLC", trn: "100345678900003", endpoint: "0235:100345678900003", street: "Al Wahda Street", city: "Sharjah", emirate: "SH" },
  { name: "Sharjah Steelworks LLC", trn: "100812345600003", endpoint: "0235:100812345600003", street: "Industrial Area 13", city: "Sharjah", emirate: "SH" },
  { name: "Blue Dune Interiors LLC", trn: "100276543200003", endpoint: "0235:100276543200003", street: "Al Quoz 3, Warehouse 18", city: "Dubai", emirate: "DU" },
  { name: "Emirates Line Catering LLC", trn: "100667788900003", endpoint: "0235:100667788900003", street: "Ras Al Khor Industrial 2", city: "Dubai", emirate: "DU" },
];

const CATALOG: { d: string; p: number; c: VatCategory }[] = [
  { d: "Industrial LED floodlight 200W", p: 485, c: "S" },
  { d: "Copper cable 4mm², 100 m drum", p: 1260, c: "S" },
  { d: "Delivery and on-site installation", p: 950, c: "S" },
  { d: "Stainless fixings kit (box of 500)", p: 214.5, c: "S" },
  { d: "Export consignment to Muscat, Oman", p: 18400, c: "Z" },
  { d: "Residential staff accommodation, monthly lease", p: 14500, c: "E" },
  { d: "Customs duty disbursement (paid on behalf)", p: 2310, c: "O" },
  { d: "Annual maintenance contract, Q4", p: 7800, c: "S" },
  { d: "Cold-room compressor unit", p: 9650, c: "S" },
  { d: "Safety signage set, bilingual", p: 128, c: "S" },
];

const L = (i: number, qty: number, ci: number, override?: Partial<Line>): Line => {
  const c = CATALOG[ci];
  return { id: `l${i}`, description: c.d, qty, unitPrice: c.p, category: c.c, rate: VAT_RATES[c.c], ...override };
};

type SeedRow = {
  n: number;
  daysAgo: number;
  buyer: number;
  lines: Line[];
  peppol: PeppolState;
  fta: FtaState;
  code?: string;
  firstPass?: boolean;
  realEstate?: boolean;
  po?: string;
};

const ROWS: SeedRow[] = [
  { n: 1301, daysAgo: 0, buyer: 0, lines: [L(1, 12, 0), L(2, 3, 1), L(3, 1, 2)], peppol: "Sent", fta: "Pending", po: "GHC-PO-88412" },
  { n: 1300, daysAgo: 0, buyer: 1, lines: [L(1, 1, 7), L(2, 20, 9)], peppol: "Delivered", fta: "Reported" },
  { n: 1299, daysAgo: 1, buyer: 3, lines: [L(1, 2, 8), L(2, 1, 2)], peppol: "Delivered", fta: "Accepted", po: "ASM-4471" },
  { n: 1298, daysAgo: 1, buyer: 2, lines: [L(1, 40, 3), L(2, 6, 0)], peppol: "Delivered", fta: "Rejected", code: "FTA-TRN-404" },
  { n: 1297, daysAgo: 2, buyer: 5, lines: [L(1, 1, 4), L(2, 1, 6)], peppol: "Delivered", fta: "Accepted", po: "CFL-20931" },
  { n: 1296, daysAgo: 3, buyer: 4, lines: [L(1, 1, 5), L(2, 1, 7)], peppol: "Delivered", fta: "Rejected", code: "FTA-TAX-210", realEstate: true },
  { n: 1295, daysAgo: 3, buyer: 6, lines: [L(1, 30, 0), L(2, 10, 9)], peppol: "Delivered", fta: "Accepted", firstPass: false },
  { n: 1294, daysAgo: 4, buyer: 8, lines: [L(1, 2, 1), L(2, 1, 2)], peppol: "Failed", fta: "Pending", code: "PEPPOL-SMP-404" },
  { n: 1293, daysAgo: 5, buyer: 7, lines: [L(1, 4, 1), L(2, 200, 3, { qty: 2 })], peppol: "Delivered", fta: "Accepted" },
  { n: 1292, daysAgo: 6, buyer: 9, lines: [L(1, 1, 8), L(2, 1, 7)], peppol: "Delivered", fta: "Accepted", po: "ELC-PO-1180" },
  { n: 1291, daysAgo: 7, buyer: 0, lines: [L(1, 25, 0), L(2, 1, 2)], peppol: "Delivered", fta: "Accepted" },
  { n: 1290, daysAgo: 8, buyer: 2, lines: [L(1, 60, 3)], peppol: "Delivered", fta: "Rejected", code: "FTA-TRN-404" },
  { n: 1289, daysAgo: 9, buyer: 4, lines: [L(1, 1, 5)], peppol: "Delivered", fta: "Accepted", realEstate: true },
  { n: 1288, daysAgo: 10, buyer: 1, lines: [L(1, 1, 7), L(2, 12, 9)], peppol: "Delivered", fta: "Accepted", firstPass: false },
  { n: 1287, daysAgo: 12, buyer: 3, lines: [L(1, 1, 8)], peppol: "Delivered", fta: "Accepted" },
  { n: 1286, daysAgo: 13, buyer: 5, lines: [L(1, 1, 4), L(2, 1, 6), L(3, 1, 2)], peppol: "Delivered", fta: "Accepted" },
  { n: 1285, daysAgo: 15, buyer: 6, lines: [L(1, 18, 0), L(2, 2, 1)], peppol: "Delivered", fta: "Accepted" },
  { n: 1284, daysAgo: 17, buyer: 7, lines: [L(1, 3, 1), L(2, 1, 2)], peppol: "Delivered", fta: "Accepted" },
];

export const invoiceNumber = (n: number, year: number) => `INV-${year}-${String(n).padStart(6, "0")}`;

export function buildSeedInvoices(now: Date): Invoice[] {
  return ROWS.map((r) => {
    const day = addDays(now, -r.daysAgo);
    const created = new Date(day);
    created.setHours(9 + (r.n % 8), (r.n * 7) % 60, 0, 0);
    if (created.getTime() > now.getTime()) created.setTime(now.getTime() - (r.n % 5 + 1) * 37 * 60_000);
    return {
      id: String(r.n),
      number: invoiceNumber(r.n, day.getFullYear()),
      issueDate: isoDay(day),
      dueDate: isoDay(addDays(day, 30)),
      createdAt: created.toISOString(),
      source: ERP_NAME,
      buyer: BUYERS[r.buyer],
      lines: r.lines,
      peppol: r.peppol,
      fta: r.fta,
      rejectionCode: r.code,
      firstPass: r.firstPass ?? true,
      realEstate: r.realEstate,
      poRef: r.po,
    };
  });
}

export function buildSeedAudit(now: Date, invoices: Invoice[]): AuditEntry[] {
  const at = (minsAgo: number) => new Date(now.getTime() - minsAgo * 60_000).toISOString();
  const byN = (n: number) => invoices.find((i) => i.id === String(n))?.number ?? "";
  return [
    { id: "a1", at: at(14), actor: "ERP connector", action: "Invoice received and validated (20/20 rules)", target: byN(1301) },
    { id: "a2", at: at(16), actor: "ASP webhook", action: "Peppol delivery confirmed", target: byN(1300) },
    { id: "a3", at: at(52), actor: "ASP webhook", action: "FTA Tax Data Document reported", target: byN(1300) },
    { id: "a4", at: at(190), actor: "Sara Al Mansoori", action: "Downloaded archived XML (signed link, 5 min)", target: byN(1297) },
    { id: "a5", at: at(25 * 60), actor: "ASP webhook", action: "FTA rejected: FTA-TRN-404", target: byN(1298) },
    { id: "a6", at: at(27 * 60), actor: "ASP webhook", action: "FTA accepted", target: byN(1299) },
    { id: "a7", at: at(3 * 24 * 60), actor: "ASP webhook", action: "FTA rejected: FTA-TAX-210", target: byN(1296) },
    { id: "a8", at: at(4 * 24 * 60), actor: "ASP webhook", action: "Peppol delivery failed: PEPPOL-SMP-404", target: byN(1294) },
    { id: "a9", at: at(5 * 24 * 60), actor: "Omar Haddad", action: "Retention policy confirmed: 5 years general, 7 real estate", target: "Tenant settings" },
  ];
}

/* ---------- Inbound supplier e-invoices ---------- */

export type MatchCheck = "match" | "variance" | "missing";
export type InboundInvoice = {
  id: string;
  supplier: string;
  supplierTrn: string;
  number: string;
  received: string;
  amount: number;
  po: { ref: string; status: MatchCheck; note?: string };
  grn: { ref: string; status: MatchCheck; note?: string };
  price: { status: MatchCheck; note?: string };
  posted: boolean;
};

export function buildSeedInbound(now: Date): InboundInvoice[] {
  const d = (n: number) => isoDay(addDays(now, -n));
  return [
    { id: "s1", supplier: "Zenith Electricals Trading LLC", supplierTrn: "100445566700003", number: "ZET/26/09114", received: d(0), amount: 48_310.5, po: { ref: "PO-7731", status: "match" }, grn: { ref: "GRN-5520", status: "match" }, price: { status: "match" }, posted: false },
    { id: "s2", supplier: "Arabian Cable Industries LLC", supplierTrn: "100998877600003", number: "ACI-INV-33021", received: d(0), amount: 126_420, po: { ref: "PO-7725", status: "match" }, grn: { ref: "GRN-5517", status: "variance", note: "Received 180 of 200 drums" }, price: { status: "match" }, posted: false },
    { id: "s3", supplier: "Falcon Packaging FZE", supplierTrn: "100123498700003", number: "FP-2026-1188", received: d(1), amount: 9_187.5, po: { ref: "PO-7719", status: "match" }, grn: { ref: "GRN-5509", status: "match" }, price: { status: "variance", note: "Unit price 2.4% above PO" }, posted: false },
    { id: "s4", supplier: "Gulf Transport Services LLC", supplierTrn: "100556677800003", number: "GTS/0098271", received: d(1), amount: 3_465, po: { ref: "PO-7712", status: "match" }, grn: { ref: "—", status: "missing", note: "No goods receipt booked yet" }, price: { status: "match" }, posted: false },
    { id: "s5", supplier: "Zenith Electricals Trading LLC", supplierTrn: "100445566700003", number: "ZET/26/09087", received: d(3), amount: 21_840, po: { ref: "PO-7698", status: "match" }, grn: { ref: "GRN-5488", status: "match" }, price: { status: "match" }, posted: true },
    { id: "s6", supplier: "Al Wasl Office Supplies LLC", supplierTrn: "100667700100003", number: "AWOS-55412", received: d(4), amount: 1_942.5, po: { ref: "—", status: "missing", note: "Invoice quotes no PO number" }, grn: { ref: "—", status: "missing" }, price: { status: "missing" }, posted: false },
    { id: "s7", supplier: "Emirates Steel Distribution LLC", supplierTrn: "100778899000003", number: "ESD-INV-77310", received: d(6), amount: 84_000, po: { ref: "PO-7660", status: "match" }, grn: { ref: "GRN-5431", status: "match" }, price: { status: "match" }, posted: true },
  ];
}
