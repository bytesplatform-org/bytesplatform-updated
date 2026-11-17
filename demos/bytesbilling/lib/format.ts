import type { FtaState, Invoice, Line, PeppolState, VatCategory } from "./types";

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const money = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const amount = (n: number) => money.format(n);
export const aed = (n: number) => `AED ${money.format(n)}`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value.length === 10 ? `${value}T12:00:00` : value) : value;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function fmtDateTime(value: string) {
  const d = new Date(value);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${fmtDate(d)}, ${hh}:${mm}`;
}

export function fmtTime(value: string) {
  const d = new Date(value);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const addDays = (d: Date, days: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + days);
  return c;
};

export const VAT_RATES: Record<VatCategory, number> = { S: 5, Z: 0, E: 0, O: 0 };
export const VAT_LABELS: Record<VatCategory, string> = {
  S: "Standard rate 5%",
  Z: "Zero-rated 0%",
  E: "Exempt",
  O: "Out of scope",
};
export const VAT_SHORT: Record<VatCategory, string> = { S: "S · 5%", Z: "Z · 0%", E: "E · exempt", O: "O · out of scope" };

export function lineNet(l: Pick<Line, "qty" | "unitPrice">) {
  return round2(l.qty * l.unitPrice);
}

export function invoiceTotals(lines: Line[]) {
  const net = round2(lines.reduce((s, l) => s + lineNet(l), 0));
  const groups = new Map<string, { category: VatCategory; rate: number; taxable: number; tax: number }>();
  for (const l of lines) {
    const key = `${l.category}-${l.rate}`;
    const g = groups.get(key) ?? { category: l.category, rate: l.rate, taxable: 0, tax: 0 };
    g.taxable = round2(g.taxable + lineNet(l));
    groups.set(key, g);
  }
  const subtotals = [...groups.values()].map((g) => ({ ...g, tax: round2((g.taxable * g.rate) / 100) }));
  const vat = round2(subtotals.reduce((s, g) => s + g.tax, 0));
  return { net, vat, gross: round2(net + vat), subtotals };
}

export type Outcome = { label: string; tone: Tone };
export type Tone = "ok" | "warn" | "bad" | "info" | "neutral";

/** Success only when the buyer has it AND the FTA accepted it. */
export function outcome(inv: Pick<Invoice, "peppol" | "fta">): Outcome {
  if (inv.peppol === "Failed" || inv.fta === "Rejected") return { label: "Needs action", tone: "bad" };
  if (inv.peppol === "Delivered" && inv.fta === "Accepted") return { label: "Complete", tone: "ok" };
  return { label: "In progress", tone: "info" };
}

export const peppolTone: Record<PeppolState, Tone> = { Queued: "neutral", Sent: "info", Delivered: "ok", Failed: "bad" };
export const ftaTone: Record<FtaState, Tone> = { Pending: "neutral", Reported: "info", Accepted: "ok", Rejected: "bad" };

export const trnPattern = /^100\d{12}$/;
export const formatTrn = (trn: string) => trn;
