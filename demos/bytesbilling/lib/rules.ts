import { round2, trnPattern } from "./format";
import { PINT_AE_CUSTOMIZATION } from "./ubl";
import type { Doc, RuleResult } from "./types";

const CATS = ["S", "Z", "E", "O"];
const eq = (a: number, b: number) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 0.005;
const f2 = (n: number) => (Number.isFinite(n) ? round2(n).toFixed(2) : "missing");

type Rule = {
  id: string;
  title: string;
  field?: string;
  /** Returns null when the rule passes, or a plain-English hint when it fails. */
  check: (d: Doc) => string | null;
  /** Rules about the XML envelope; skipped for documents built in the app. */
  xmlOnly?: boolean;
};

const RULES: Rule[] = [
  {
    id: "UBL-SCHEMA",
    title: "Root element is a UBL 2.1 Invoice",
    xmlOnly: true,
    check: (d) =>
      d.rootName === "Invoice" && d.rootNamespace.endsWith("Invoice-2")
        ? null
        : `Found <${d.rootName}> in "${d.rootNamespace || "no namespace"}". Expected <Invoice> in the UBL 2.1 Invoice-2 namespace.`,
  },
  {
    id: "IBR-001-AE",
    title: `Specification identifier is ${PINT_AE_CUSTOMIZATION}`,
    xmlOnly: true,
    check: (d) =>
      d.customizationId.startsWith(PINT_AE_CUSTOMIZATION)
        ? null
        : `CustomizationID is "${d.customizationId || "empty"}". PINT AE invoices must declare ${PINT_AE_CUSTOMIZATION}.`,
  },
  {
    id: "BR-02",
    title: "Invoice has a number",
    field: "number",
    check: (d) => (d.number ? null : "Give the invoice a number. Bytes ERP assigns gapless numbers automatically."),
  },
  {
    id: "BR-03",
    title: "Invoice has an issue date",
    field: "issueDate",
    check: (d) => (/^\d{4}-\d{2}-\d{2}$/.test(d.issueDate) ? null : "Set the issue date in YYYY-MM-DD format."),
  },
  {
    id: "AE-CUR-01",
    title: "Amounts are in AED (or VAT accounted in AED)",
    check: (d) =>
      d.currency === "AED" || d.taxCurrency === "AED"
        ? null
        : `Currency is ${d.currency || "missing"}. Foreign-currency invoices must also state the VAT in AED (TaxCurrencyCode).`,
  },
  {
    id: "AE-TRN-01",
    title: "Seller TRN is 15 digits starting with 100",
    field: "sellerTrn",
    check: (d) =>
      trnPattern.test(d.seller.trn) ? null : `Seller TRN "${d.seller.trn || "empty"}" is not a valid UAE TRN. Fix it in company settings.`,
  },
  {
    id: "BR-07",
    title: "Buyer name is present",
    field: "buyerName",
    check: (d) => (d.buyer.name.trim() ? null : "Add the buyer's registered legal name, as on their trade licence."),
  },
  {
    id: "AE-TRN-02",
    title: "Buyer TRN is 15 digits starting with 100",
    field: "buyerTrn",
    check: (d) => {
      const t = d.buyer.trn.replace(/\s/g, "");
      if (!t) return "Add the buyer's TRN. B2B invoices to VAT-registered buyers must carry it.";
      if (!/^\d+$/.test(t)) return `"${d.buyer.trn}" contains non-digits. A TRN is numbers only.`;
      if (t.length !== 15) return `"${t}" has ${t.length} digits. A UAE TRN has exactly 15.`;
      if (!t.startsWith("100")) return `"${t}" starts with ${t.slice(0, 3)}. UAE TRNs start with 100.`;
      return null;
    },
  },
  {
    id: "AE-EP-01",
    title: "Buyer Peppol endpoint is present",
    field: "buyerEndpoint",
    check: (d) =>
      d.buyer.endpoint.trim()
        ? null
        : "Without an electronic address the ASP can't route the invoice. Add the buyer's Peppol ID, e.g. 0235:<TRN>.",
  },
  {
    id: "AE-EP-02",
    title: "Buyer endpoint uses scheme:identifier format",
    field: "buyerEndpoint",
    check: (d) => {
      const e = d.buyer.endpoint.trim();
      if (!e) return "Endpoint is empty (see AE-EP-01).";
      return /^\d{4}:\S+$/.test(e) ? null : `"${e}" needs a 4-digit scheme, a colon and the identifier, e.g. 0235:100487213900003.`;
    },
  },
  {
    id: "BR-16",
    title: "Invoice has at least one line",
    field: "lines",
    check: (d) => (d.lines.length > 0 ? null : "Add at least one invoice line."),
  },
  {
    id: "BR-25",
    title: "Every line has an item name",
    field: "lines",
    check: (d) => {
      const bad = d.lines.filter((l) => !l.description.trim());
      return bad.length ? `Line ${bad.map((l) => l.id).join(", ")} has no description.` : null;
    },
  },
  {
    id: "BR-27",
    title: "Quantities and prices are not negative",
    field: "lines",
    check: (d) => {
      const bad = d.lines.filter((l) => !(l.qty > 0) || !(l.price >= 0));
      return bad.length
        ? `Line ${bad.map((l) => l.id).join(", ")} has a zero/negative quantity or a negative price. Refunds go on a credit note, not a negative line.`
        : null;
    },
  },
  {
    id: "BR-CO-04",
    title: "Every line has a VAT category (S, Z, E or O)",
    field: "lines",
    check: (d) => {
      const bad = d.lines.filter((l) => !CATS.includes(l.category));
      return bad.length ? `Line ${bad.map((l) => l.id).join(", ")} has category "${bad[0].category || "none"}". Use S, Z, E or O.` : null;
    },
  },
  {
    id: "AE-VAT-02",
    title: "Standard-rated lines use 5%",
    field: "lines",
    check: (d) => {
      const bad = d.lines.filter((l) => l.category === "S" && l.rate !== 5);
      return bad.length ? `Line ${bad.map((l) => l.id).join(", ")} is category S at ${bad[0].rate}%. The UAE standard rate is 5%.` : null;
    },
  },
  {
    id: "AE-VAT-03",
    title: "Zero-rated, exempt and out-of-scope lines use 0%",
    field: "lines",
    check: (d) => {
      const bad = d.lines.filter((l) => ["Z", "E", "O"].includes(l.category) && l.rate !== 0);
      return bad.length ? `Line ${bad.map((l) => l.id).join(", ")} is category ${bad[0].category} but charges ${bad[0].rate}%. Set the rate to 0.` : null;
    },
  },
  {
    id: "BR-CO-10",
    title: "Sum of line amounts = total without VAT",
    check: (d) => {
      const sum = round2(d.lines.reduce((s, l) => s + (Number.isFinite(l.net) ? l.net : 0), 0));
      return eq(sum, d.totals.lineExtension)
        ? null
        : `Lines add up to ${f2(sum)} but LineExtensionAmount says ${f2(d.totals.lineExtension)}.`;
    },
  },
  {
    id: "BR-CO-14",
    title: "VAT total = sum of VAT per category",
    check: (d) => {
      const sum = round2(d.taxSubtotals.reduce((s, g) => s + (Number.isFinite(g.tax) ? g.tax : 0), 0));
      return eq(sum, d.totals.tax) ? null : `Category VAT adds up to ${f2(sum)} but TaxTotal says ${f2(d.totals.tax)}.`;
    },
  },
  {
    id: "BR-CO-15",
    title: "Total with VAT = total without VAT + VAT",
    check: (d) => {
      const expected = round2(d.totals.taxExclusive + d.totals.tax);
      return eq(expected, d.totals.taxInclusive)
        ? null
        : `${f2(d.totals.taxExclusive)} + ${f2(d.totals.tax)} VAT = ${f2(expected)}, but the invoice says ${f2(d.totals.taxInclusive)}. Recalculate the totals in the ERP.`;
    },
  },
  {
    id: "BR-CO-16",
    title: "Amount due = total with VAT",
    check: (d) =>
      eq(d.totals.payable, d.totals.taxInclusive)
        ? null
        : `PayableAmount ${f2(d.totals.payable)} differs from TaxInclusiveAmount ${f2(d.totals.taxInclusive)} with no prepayment recorded.`,
  },
];

export function validateDoc(doc: Doc, mode: "form" | "xml" = "xml"): RuleResult[] {
  return RULES.filter((r) => mode === "xml" || !r.xmlOnly).map((r) => {
    let hint: string | null;
    try {
      hint = r.check(doc);
    } catch {
      hint = "The rule could not read this part of the document.";
    }
    return { id: r.id, title: r.title, field: r.field, status: hint ? "fail" : "pass", hint: hint ?? "" };
  });
}

export const RULE_COUNT = RULES.length;
