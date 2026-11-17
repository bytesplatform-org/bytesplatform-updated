export type VatCategory = "S" | "Z" | "E" | "O";

export type PeppolState = "Queued" | "Sent" | "Delivered" | "Failed";
export type FtaState = "Pending" | "Reported" | "Accepted" | "Rejected";

export type Party = {
  name: string;
  trn: string;
  /** Peppol endpoint as "scheme:value", e.g. "0235:100352984700003". */
  endpoint: string;
  street: string;
  city: string;
  emirate: string;
};

export type Line = {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
  category: VatCategory;
  /** VAT rate in percent. Derived from the category but kept editable so the rules can catch a mismatch. */
  rate: number;
};

export type Invoice = {
  id: string;
  number: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;
  createdAt: string; // ISO timestamp
  source: string;
  buyer: Party;
  lines: Line[];
  peppol: PeppolState;
  fta: FtaState;
  rejectionCode?: string;
  /** True when the invoice passed local validation on the first attempt. */
  firstPass: boolean;
  realEstate?: boolean;
  resubmittedAt?: string;
  /** The rejection code this invoice was resubmitted from. */
  resolvedCode?: string;
  idempotencyKey?: string;
  poRef?: string;
};

export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
};

/** A parsed or built e-invoice, as the rules see it. */
export type DocLine = {
  id: string;
  description: string;
  qty: number;
  price: number;
  net: number;
  category: string;
  rate: number;
};

export type Doc = {
  rootName: string;
  rootNamespace: string;
  customizationId: string;
  profileId: string;
  number: string;
  issueDate: string;
  typeCode: string;
  currency: string;
  taxCurrency: string;
  seller: { name: string; trn: string; endpoint: string };
  buyer: { name: string; trn: string; endpoint: string };
  lines: DocLine[];
  taxSubtotals: { category: string; rate: number; taxable: number; tax: number }[];
  totals: { lineExtension: number; taxExclusive: number; tax: number; taxInclusive: number; payable: number };
};

export type RuleResult = {
  id: string;
  title: string;
  status: "pass" | "fail";
  hint: string;
  /** Form field the rule points at, for inline errors. */
  field?: string;
};
