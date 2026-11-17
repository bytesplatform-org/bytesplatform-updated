import { invoiceTotals, lineNet, round2 } from "./format";
import type { Doc, Invoice, Party } from "./types";

/** Specification identifier required by PINT AE (Peppol rule aligned-ibrp-001-ae). */
export const PINT_AE_CUSTOMIZATION = "urn:peppol:pint:billing-1@ae-1";
/** Business process identifier. Illustrative: confirm against the UAE Peppol Authority spec. */
export const PINT_AE_PROFILE = "urn:peppol:bis:billing";

const NS_INVOICE = "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2";
const NS_CAC = "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2";
const NS_CBC = "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const n2 = (n: number) => round2(n).toFixed(2);
const fmtQty = (n: number) => (Number.isInteger(n) ? String(n) : String(round2(n)));

function splitEndpoint(endpoint: string) {
  const i = endpoint.indexOf(":");
  if (i < 0) return { scheme: "", value: endpoint };
  return { scheme: endpoint.slice(0, i), value: endpoint.slice(i + 1) };
}

const EXEMPTION: Record<string, string> = {
  E: "Exempt supply (residential lease)",
  O: "Outside the scope of UAE VAT",
  Z: "Zero-rated supply",
};

function party(tag: "AccountingSupplierParty" | "AccountingCustomerParty", p: Party, trnOverride?: string, indent = "  ") {
  const ep = splitEndpoint(p.endpoint);
  const i = indent;
  const endpoint = p.endpoint
    ? `${i}    <cbc:EndpointID schemeID="${esc(ep.scheme)}">${esc(ep.value)}</cbc:EndpointID>\n`
    : "";
  return `${i}<cac:${tag}>
${i}  <cac:Party>
${endpoint}${i}    <cac:PostalAddress>
${i}      <cbc:StreetName>${esc(p.street)}</cbc:StreetName>
${i}      <cbc:CityName>${esc(p.city)}</cbc:CityName>
${i}      <cbc:CountrySubentity>${esc(p.emirate)}</cbc:CountrySubentity>
${i}      <cac:Country>
${i}        <cbc:IdentificationCode>AE</cbc:IdentificationCode>
${i}      </cac:Country>
${i}    </cac:PostalAddress>
${i}    <cac:PartyTaxScheme>
${i}      <cbc:CompanyID>${esc(trnOverride ?? p.trn)}</cbc:CompanyID>
${i}      <cac:TaxScheme>
${i}        <cbc:ID>VAT</cbc:ID>
${i}      </cac:TaxScheme>
${i}    </cac:PartyTaxScheme>
${i}    <cac:PartyLegalEntity>
${i}      <cbc:RegistrationName>${esc(p.name)}</cbc:RegistrationName>
${i}    </cac:PartyLegalEntity>
${i}  </cac:Party>
${i}</cac:${tag}>`;
}

export type XmlOverrides = { buyerTrn?: string; taxInclusive?: number; payable?: number };

/** Builds a PINT AE (UBL 2.1) invoice. Structure follows UBL 2.1; values are sample data. */
export function invoiceToXml(inv: Invoice, seller: Party, o: XmlOverrides = {}): string {
  const t = invoiceTotals(inv.lines);
  const taxIncl = o.taxInclusive ?? t.gross;
  const payable = o.payable ?? taxIncl;
  const subtotals = t.subtotals
    .map(
      (g) => `    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="AED">${n2(g.taxable)}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="AED">${n2(g.tax)}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>${g.category}</cbc:ID>
        <cbc:Percent>${fmtQty(g.rate)}</cbc:Percent>
${g.category !== "S" ? `        <cbc:TaxExemptionReason>${esc(EXEMPTION[g.category] ?? "")}</cbc:TaxExemptionReason>\n` : ""}        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>`,
    )
    .join("\n");
  const lines = inv.lines
    .map(
      (l, idx) => `  <cac:InvoiceLine>
    <cbc:ID>${idx + 1}</cbc:ID>
    <cbc:InvoicedQuantity unitCode="C62">${fmtQty(l.qty)}</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="AED">${n2(lineNet(l))}</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Name>${esc(l.description)}</cbc:Name>
      <cac:ClassifiedTaxCategory>
        <cbc:ID>${l.category}</cbc:ID>
        <cbc:Percent>${fmtQty(l.rate)}</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="AED">${n2(l.unitPrice)}</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="${NS_INVOICE}"
         xmlns:cac="${NS_CAC}"
         xmlns:cbc="${NS_CBC}">
  <cbc:CustomizationID>${PINT_AE_CUSTOMIZATION}</cbc:CustomizationID>
  <cbc:ProfileID>${PINT_AE_PROFILE}</cbc:ProfileID>
  <cbc:ID>${esc(inv.number)}</cbc:ID>
  <cbc:IssueDate>${inv.issueDate}</cbc:IssueDate>
  <cbc:DueDate>${inv.dueDate}</cbc:DueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>AED</cbc:DocumentCurrencyCode>
  <cbc:TaxCurrencyCode>AED</cbc:TaxCurrencyCode>
${inv.poRef ? `  <cac:OrderReference>\n    <cbc:ID>${esc(inv.poRef)}</cbc:ID>\n  </cac:OrderReference>\n` : ""}${party("AccountingSupplierParty", seller)}
${party("AccountingCustomerParty", inv.buyer, o.buyerTrn)}
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="AED">${n2(t.vat)}</cbc:TaxAmount>
${subtotals}
  </cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="AED">${n2(t.net)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="AED">${n2(t.net)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="AED">${n2(taxIncl)}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="AED">${n2(payable)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
${lines}
</Invoice>
`;
}

/** The rules' view of an invoice built in the app (form or ERP). */
export function invoiceToDoc(inv: Pick<Invoice, "number" | "issueDate" | "buyer" | "lines">, seller: Party): Doc {
  const t = invoiceTotals(inv.lines);
  return {
    rootName: "Invoice",
    rootNamespace: NS_INVOICE,
    customizationId: PINT_AE_CUSTOMIZATION,
    profileId: PINT_AE_PROFILE,
    number: inv.number,
    issueDate: inv.issueDate,
    typeCode: "380",
    currency: "AED",
    taxCurrency: "AED",
    seller: { name: seller.name, trn: seller.trn, endpoint: seller.endpoint },
    buyer: { name: inv.buyer.name, trn: inv.buyer.trn, endpoint: inv.buyer.endpoint },
    lines: inv.lines.map((l) => ({
      id: l.id,
      description: l.description,
      qty: l.qty,
      price: l.unitPrice,
      net: lineNet(l),
      category: l.category,
      rate: l.rate,
    })),
    taxSubtotals: t.subtotals,
    totals: { lineExtension: t.net, taxExclusive: t.net, tax: t.vat, taxInclusive: t.gross, payable: t.gross },
  };
}

/* ---------- Parsing ---------- */

const kids = (el: Element | null | undefined, name: string) =>
  el ? Array.from(el.children).filter((c) => c.localName === name) : [];
const kid = (el: Element | null | undefined, name: string) => kids(el, name)[0] ?? null;
const path = (el: Element | null | undefined, ...names: string[]) => {
  let cur: Element | null = el ?? null;
  for (const n of names) cur = kid(cur, n);
  return cur;
};
const text = (el: Element | null) => el?.textContent?.trim() ?? "";
const num = (el: Element | null) => {
  const t = text(el);
  return t === "" ? NaN : Number(t);
};

function readParty(root: Element, tag: string) {
  const p = path(root, tag, "Party");
  const ep = kid(p, "EndpointID");
  const scheme = ep?.getAttribute("schemeID") ?? "";
  return {
    name: text(path(p, "PartyLegalEntity", "RegistrationName")),
    trn: text(path(p, "PartyTaxScheme", "CompanyID")),
    endpoint: ep ? `${scheme}${scheme ? ":" : ""}${text(ep)}` : "",
  };
}

export function parseXml(xml: string): { doc?: Doc; error?: string } {
  if (!xml.trim()) return { error: "Paste a UBL 2.1 invoice, or load one of the samples." };
  let dom: Document;
  try {
    dom = new DOMParser().parseFromString(xml, "application/xml");
  } catch {
    return { error: "The XML could not be parsed." };
  }
  const perr = dom.getElementsByTagName("parsererror")[0];
  if (perr) {
    const msg = (perr.textContent ?? "").split("\n").find((l) => l.trim()) ?? "";
    return { error: `Not well-formed XML. ${msg.trim().slice(0, 160)}` };
  }
  const root = dom.documentElement;
  const lines = kids(root, "InvoiceLine").map((l, i) => {
    const cat = path(l, "Item", "ClassifiedTaxCategory");
    return {
      id: text(kid(l, "ID")) || String(i + 1),
      description: text(path(l, "Item", "Name")),
      qty: num(kid(l, "InvoicedQuantity")),
      price: num(path(l, "Price", "PriceAmount")),
      net: num(kid(l, "LineExtensionAmount")),
      category: text(kid(cat, "ID")),
      rate: num(kid(cat, "Percent")),
    };
  });
  const taxTotal = kid(root, "TaxTotal");
  const lmt = kid(root, "LegalMonetaryTotal");
  return {
    doc: {
      rootName: root.localName,
      rootNamespace: root.namespaceURI ?? "",
      customizationId: text(kid(root, "CustomizationID")),
      profileId: text(kid(root, "ProfileID")),
      number: text(kid(root, "ID")),
      issueDate: text(kid(root, "IssueDate")),
      typeCode: text(kid(root, "InvoiceTypeCode")),
      currency: text(kid(root, "DocumentCurrencyCode")),
      taxCurrency: text(kid(root, "TaxCurrencyCode")),
      seller: readParty(root, "AccountingSupplierParty"),
      buyer: readParty(root, "AccountingCustomerParty"),
      lines,
      taxSubtotals: kids(taxTotal, "TaxSubtotal").map((s) => ({
        category: text(path(s, "TaxCategory", "ID")),
        rate: num(path(s, "TaxCategory", "Percent")),
        taxable: num(kid(s, "TaxableAmount")),
        tax: num(kid(s, "TaxAmount")),
      })),
      totals: {
        lineExtension: num(kid(lmt, "LineExtensionAmount")),
        taxExclusive: num(kid(lmt, "TaxExclusiveAmount")),
        tax: num(kid(taxTotal, "TaxAmount")),
        taxInclusive: num(kid(lmt, "TaxInclusiveAmount")),
        payable: num(kid(lmt, "PayableAmount")),
      },
    },
  };
}

export async function sha256(textIn: string): Promise<string> {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(textIn));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "";
  }
}
