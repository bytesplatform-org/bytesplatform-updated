/**
 * Government contractors page copy (content brief of Nov 2026, with gaps filled
 * from the "Government Page Redesign" mock-up). Bracketed placeholders in the
 * brief are left out until confirmed: UEI, CAGE, state and cooperative
 * contracts held, teaming agreements, certifications and SPRS / CMMC status.
 * Recheck dated items before they go stale, especially CMMC Phase 2 (paused by
 * DoD in July 2026 pending review).
 */

/** Hero versions per audience, picked by the tabs or ?for=. Only these change. */
export const audiences = [
  {
    key: "agency",
    label: "State & local agency",
    eyebrow: "For cities, counties, states and school districts",
    headline: ["Built to pass", "the audit"],
    paragraph:
      "We modernize government websites, portals and back-office systems that residents can use, staff can update, and accessibility coordinators can sign off, with the evidence to prove it.",
    cta: { label: "Get a free accessibility scan", target: "#scan" },
  },
  {
    key: "prime",
    label: "Federal prime",
    eyebrow: "For primes building a winning team",
    headline: ["Your compliant", "delivery team"],
    paragraph:
      "Add a US-based design, build and accessibility team to your bid. We ship the Section 508 and security evidence your contracting officer reviews.",
    cta: { label: "Talk teaming", target: "#buy" },
  },
  {
    key: "smb",
    label: "Small business contractor",
    eyebrow: "For 8(a), WOSB, SDVOSB and HUBZone firms",
    headline: ["Look like a prime.", "Bid like one"],
    paragraph:
      "A GovCon-ready website and capability statement, plus BytesGov, the AI bid platform we use ourselves to find, qualify and write proposals.",
    cta: { label: "See BytesGov", target: "#bytesgov" },
  },
] as const;

export type AudienceKey = (typeof audiences)[number]["key"];

export const capabilities = [
  "Section 508",
  "WCAG 2.1 AA",
  "NIST 800-171 aligned",
  "US-hosted",
  "Denton, Texas",
];

/** What agencies and primes put out to bid that maps to what we build.
 * Images are Unsplash photos (Unsplash License), cropped to 900×600. */
export const contractTypes = [
  {
    title: "Website & digital service modernization",
    image: "/govcon/websites.jpg",
    body: "Accessible, fast sites on a CMS your staff can update, delivered with an Accessibility Conformance Report.",
    naics: "541511 · 541512",
    buys: ["WCAG 2.1 AA build", "ACR / VPAT", "Content migration", "CMS training"],
  },
  {
    title: "Constituent portals, permitting & licensing",
    image: "/govcon/portals.jpg",
    body: "Online applications, payments and status tracking that replace paper forms and email queues.",
    naics: "541511 · 541519",
    buys: ["Online applications", "Payments", "Login.gov / SSO", "Status tracking"],
  },
  {
    title: "CRM & case management",
    image: "/govcon/crm.jpg",
    body: "One view of every case, grant or constituent on Salesforce, Dynamics 365 or a custom build, with audit trails.",
    naics: "541511 · 541512",
    buys: ["Case workflows", "Role-based access", "Audit trails", "Reporting"],
  },
  {
    title: "ERP & financial modernization",
    image: "/govcon/erp.jpg",
    body: "Finance, procurement and HR moved off legacy systems, or a DCAA-ready ERP for contractors.",
    naics: "541512 · 541519",
    buys: ["ERP migration", "Integrations & APIs", "Data conversion", "DCAA-ready timekeeping"],
  },
  {
    title: "Data, AI & intelligent automation",
    image: "/govcon/ai.jpg",
    body: "Document extraction and policy search with a person approving every output, plus clear governance records.",
    naics: "541511 · 518210",
    buys: ["Document AI", "Search assistants", "Human review", "Use-case inventory"],
  },
  {
    title: "Cloud hosting & DevSecOps",
    image: "/govcon/cloud.jpg",
    body: "Migration to US-region, FedRAMP-authorized clouds with security scanning on every deploy.",
    naics: "518210 · 541513",
    buys: ["Cloud migration", "CI/CD scanning", "Monitoring", "Hardening"],
  },
];

/** NAICS codes we pursue, with the current SBA small-business size standards. */
export const naics = [
  { code: "541511", name: "Custom Computer Programming Services", size: "$34M" },
  { code: "541512", name: "Computer Systems Design Services", size: "$34M" },
  { code: "541519", name: "Other Computer Related Services", size: "$34M" },
  { code: "518210", name: "Computing Infrastructure, Data Processing & Web Hosting", size: "$40M" },
  { code: "541513", name: "Computer Facilities Management Services", size: "$37M" },
  { code: "541611", name: "Administrative Management Consulting", size: "$24.5M" },
];

// UEI and CAGE go here once confirmed: "Find us on SAM.gov under these codes. UEI … · CAGE …."
export const naicsNote =
  "Find us on SAM.gov under these codes. Size standards are average annual receipts under 13 CFR 121.201.";

/** How agencies and primes can buy from us. Only list contracts actually held. */
export const vehicles = [
  { name: "Micro-purchase", status: "Up to $15,000 by government purchase card. The fastest start: an accessibility audit or a prototype." },
  { name: "Simplified acquisition", status: "Up to $350,000 with simplified procedures, often set aside for small businesses." },
  // Add "Registered on the Texas CMBL." once confirmed.
  { name: "Texas state agencies", status: "We watch the Texas ESBD for state agency opportunities and respond directly." },
  { name: "Texas cities & counties", status: "Cities bid formally above $50,000 and counties above $100,000. Below that, a quote is enough." },
  // Name the DIR / BuyBoard contract here if one is held.
  { name: "Cooperative contracts", status: "Through partners who hold DIR and co-op contracts." },
  // List specific vehicles only where a teaming agreement is signed.
  { name: "Subcontract to primes", status: "Bring us onto your team on GSA MAS, NASA SEWP VI, OASIS+ or an agency IDIQ." },
  // Name 8(a) / WOSB / HUBZone / SDVOSB only if certified.
  { name: "Small-business set-asides", status: "Small business under NAICS 541511." },
  { name: "Before the RFP", status: "We answer Sources Sought notices and RFIs and brief program offices, at no cost." },
];

/** Shown on the dark panel. `count` makes the figure count up (digits only). */
export const market: { value: string; label: string; source: string; count?: { to: number; prefix?: string; suffix?: string } }[] = [
  { value: "WCAG 2.1 AA", label: "Required standard for state and local government websites under ADA Title II", source: "ADA Title II" },
  { value: "Section 508", label: "Accessibility standard for federal agency technology", source: "29 U.S.C. 794d" },
  { value: "110", label: "NIST SP 800-171 controls behind CMMC Level 2", source: "32 CFR Part 170", count: { to: 110 } },
  { value: "$15K", label: "Federal micro-purchase limit, enough to buy an audit without a formal bid", source: "FAR 2.101", count: { to: 15, prefix: "$", suffix: "K" } },
];

export const deadlines = [
  { when: "Apr 26, 2027", what: "ADA Title II. Governments serving 50,000+ people must meet WCAG 2.1 AA." },
  { when: "Apr 26, 2028", what: "Smaller governments and special districts reach the same requirement." },
  // The brief states Phase 2 as in force; DoD paused it in July 2026. Update when the review concludes.
  { when: "Nov 10, 2026", what: "CMMC Phase 2: third-party Level 2 assessments in applicable DoD contracts, paused by DoD in July 2026 for review." },
  { when: "Oct 1, 2025", what: "Federal micro-purchase limit rose to $15,000; simplified acquisition to $350,000." },
];

export const sources = [
  { label: "DOJ interim final rule (Apr 20, 2026)", href: "https://statescoop.com/doj-delays-state-local-digital-accessibility-deadline-by-one-year/" },
  { label: "32 CFR Part 170", href: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-G/part-170" },
  { label: "CMMC Phase 2 pause", href: "https://www.morganlewis.com/pubs/2026/07/department-of-war-suspends-cmmc-phase-ii-requirements-but-cybersecurity-obligations-remain" },
  { label: "FAR inflation adjustment effective Oct 1, 2025", href: "https://www.acquisition.gov/far/2.101" },
];

/** The evidence pack handed over with every release. */
export const evidence = [
  { name: "Accessibility Conformance Report", detail: "VPAT 2.5 Rev 508 edition, per release", format: "PDF" },
  { name: "Section 508 test results", detail: "Automated scans plus manual screen-reader testing", format: "XLSX" },
  { name: "Security controls matrix", detail: "Mapped to NIST SP 800-53 / 800-171", format: "XLSX" },
  { name: "Software bill of materials", detail: "Every library and version that shipped", format: "JSON" },
  { name: "Vulnerability scan summary", detail: "Findings, severity and fixes before go-live", format: "PDF" },
  { name: "Release notes & change log", detail: "What changed, who approved it, when", format: "PDF" },
  { name: "Admin & training guides", detail: "So your staff own the system after launch", format: "PDF" },
];

/** Before-and-after results. PLACEHOLDERS: replace with real, client-approved numbers.
 * Any field still holding a [bracket] is not rendered; the section hides
 * until at least two cards are real. */
export const proof = [
  { who: "[Agency type · State]", project: "[Project name: e.g., County website rebuild]", value: "[62 → 100]", label: "[Lighthouse accessibility score, before → after]" },
  { who: "[Agency type · State]", project: "[Project name: e.g., Online permitting portal]", value: "[3 wks → 2 days]", label: "[Permit approval time]" },
  { who: "[Prime or small business]", project: "[Project name: e.g., Subcontract delivery]", value: "[0]", label: "[Critical 508 issues at acceptance]" },
];

/** Company data for buyers. Rows whose value still holds a [bracket] are hidden. */
export const company = [
  { label: "Legal name", value: "Bytes Platform LLC" },
  { label: "UEI", value: "[YOUR UEI]" },
  { label: "CAGE code", value: "[YOUR CAGE]" },
  { label: "Primary NAICS", value: "541511 Custom Computer Programming" },
  { label: "Also", value: "541512 · 541519 · 518210 · 541513 · 541611" },
  { label: "Business size", value: "[Small business: confirm in SAM.gov]" },
  { label: "Certifications", value: "[8(a) / WOSB / HUBZone / none]" },
  { label: "Headquarters", value: "Denton, Texas, USA" },
  { label: "Point of contact", value: "[Name, title] · info@bytesplatform.com" },
];

/** Ways to start. Prices are PLACEHOLDERS. */
export const packages = [
  {
    title: "Accessibility sprint",
    body: "For an existing site that has to meet WCAG 2.1 AA before the deadline.",
    includes: ["Full audit & prioritized fix list", "Remediation of critical issues", "Updated ACR / VPAT"],
    price: "From [YOUR PRICE]",
  },
  {
    title: "Modernization project",
    body: "A new website, portal, CRM or ERP module, delivered in fixed-scope phases.",
    includes: ["Discovery & prototype", "Build with evidence per release", "Training & handover"],
    price: "Fixed price per phase",
  },
  {
    title: "Sustain & support",
    body: "Monthly enhancements, monitoring and help desk, aligned to your option years.",
    includes: ["Monitoring & patching", "Enhancement hours", "Monthly service report"],
    price: "From [YOUR PRICE] / month",
  },
];

/** The ADA Title II date the dark panel counts down to (large governments). */
export const titleIIDeadline = "2027-04-26T00:00:00-05:00";

export const steps = [
  {
    title: "Capture & solution",
    body: "We read the solicitation with you, map Sections L and M, and give you a technical approach and a realistic estimate. You get a solution brief.",
  },
  {
    title: "Build to the requirement",
    body: "Accessibility, security controls and data handling are designed in from the first sprint, not patched in before acceptance. You get a clickable prototype.",
  },
  {
    title: "Deliver with evidence",
    body: "Every release ships with an Accessibility Conformance Report, 508 test results, a security controls matrix and a change log. You get an evidence pack per release.",
  },
  {
    title: "Sustain & support",
    body: "Enhancements, monitoring and help desk under a support plan, so option years run as smoothly as the base year. You get a monthly service report.",
  },
];

export const roles = ["State or local agency", "Federal agency", "Prime contractor", "Small business contractor", "Other"];
export const needs = ["Website modernization", "Portal or permitting", "CRM or case management", "ERP or finance", "AI and automation", "Teaming partner"];

export const faqs = [
  {
    q: "Do you hold your own contract vehicles?",
    // Add any vehicle or cooperative contract held.
    a: "We're registered in SAM.gov and sell directly under micro-purchase and simplified acquisition procedures. For larger buys we team with primes that hold GSA MAS and other vehicles.",
  },
  {
    q: "Which NAICS codes do you work under?",
    a: "Primary 541511, plus 541512, 541519, 518210, 541513 and 541611. Our UEI and CAGE are in the capability statement.",
  },
  {
    q: "Can you build to Section 508 and WCAG 2.1 AA?",
    a: "Yes. We test with automated tools and manually with screen readers and keyboard-only navigation, and deliver an Accessibility Conformance Report with each release.",
  },
  {
    q: "How do you handle CMMC and CUI?",
    // Add current SPRS score / CMMC status once confirmed.
    a: "Our delivery environment is aligned to NIST SP 800-171. We handle CUI only in environments approved for it.",
  },
  {
    q: "Where is our data hosted?",
    a: "In US regions only, on FedRAMP-authorized cloud services when your contract requires it. We document every subprocessor.",
  },
  {
    q: "Can you help before the RFP drops?",
    a: "Yes. We answer Sources Sought notices and RFIs and brief program offices, so requirements are realistic and estimates defensible.",
  },
];
