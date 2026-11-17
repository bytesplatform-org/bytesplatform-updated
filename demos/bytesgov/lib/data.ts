/* ------------------------------------------------------------------
   BytesGov demo workspace: sample data only.
   Every firm, notice number, person and dollar figure below is
   fictional. Notice IDs carry a DEMO- prefix so nothing here can be
   mistaken for a live SAM.gov record.
   ------------------------------------------------------------------ */

export const DEMO_TODAY = new Date(Date.UTC(2026, 10, 17)); // Tue 17 Nov 2026

export const FIRM = {
  name: "Meridian Federal Solutions",
  short: "Meridian",
  uei: "MFSDEMO00001",
  cage: "9DEM0",
  hq: "Arlington, VA",
  employees: 84,
  primaryNaics: "541512",
  naics: ["541511", "541512", "541519", "518210", "541611"],
  certifications: ["SDVOSB (SBA VetCert)", "Small business", "ISO 27001", "CMMC Level 2 (C3PAO)"],
};

export const NAICS: Record<string, string> = {
  "541511": "Custom Computer Programming Services",
  "541512": "Computer Systems Design Services",
  "541519": "Other Computer Related Services",
  "518210": "Computing Infrastructure, Data Processing & Hosting",
  "541611": "Administrative & General Management Consulting",
};

export type SetAside =
  | "SDVOSB"
  | "8(a)"
  | "HUBZone"
  | "WOSB"
  | "Small business"
  | "Full & open"
  | "State / local";

export type Stage = "Identified" | "Qualifying" | "Capture" | "Proposal" | "Submitted";
export const STAGES: Stage[] = ["Identified", "Qualifying", "Capture", "Proposal", "Submitted"];

export type FactorKey =
  | "pastPerformance"
  | "naicsFit"
  | "setAside"
  | "incumbent"
  | "price"
  | "relationship"
  | "technical"
  | "timeline";

export const FACTORS: { key: FactorKey; label: string; weight: number; hint: string }[] = [
  { key: "pastPerformance", label: "Past performance", weight: 20, hint: "Relevance and CPARS ratings of similar work in the last five years" },
  { key: "setAside", label: "Set-aside eligibility", weight: 15, hint: "Whether your certifications narrow the field" },
  { key: "incumbent", label: "Incumbent strength", weight: 15, hint: "Higher means a weaker or absent incumbent" },
  { key: "price", label: "Price competitiveness", weight: 12, hint: "Your labour rates against awarded rates on similar vehicles" },
  { key: "technical", label: "Technical fit", weight: 12, hint: "Coverage of the SOW by your capability library" },
  { key: "naicsFit", label: "NAICS fit", weight: 10, hint: "Primary vs. secondary code, and size standard headroom" },
  { key: "relationship", label: "Agency relationship", weight: 10, hint: "Prior awards, industry days attended, known contacts" },
  { key: "timeline", label: "Timeline", weight: 6, hint: "Days to respond against your typical proposal cycle" },
];

export type Opportunity = {
  id: string;
  notice: string;
  title: string;
  agency: string;
  office: string;
  naics: string;
  setAside: SetAside;
  type: "RFP" | "RFQ" | "Sources sought" | "RFI";
  contract: string;
  source: "SAM.gov" | "FPDS recompete" | "State portal" | "Municipal portal";
  dueInDays: number;
  postedDaysAgo: number;
  value: number;
  stage: Stage;
  isNew: boolean;
  incumbent: string | null;
  place: string;
  pop: string;
  summary: string;
  scores: Record<FactorKey, number>;
  notes: { good: string[]; risk: string[] };
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "va-ehr-data",
    notice: "DEMO-36C10B-27-R-0042",
    title: "EHR Data Integration & Interoperability Services",
    agency: "Department of Veterans Affairs",
    office: "Technology Acquisition Center, Eatontown NJ",
    naics: "541512",
    setAside: "SDVOSB",
    type: "RFP",
    contract: "Firm-fixed-price, single award",
    source: "SAM.gov",
    dueInDays: 5,
    postedDaysAgo: 21,
    value: 18_400_000,
    stage: "Proposal",
    isNew: false,
    incumbent: "Halberd Systems Group",
    place: "Remote / Washington DC",
    pop: "1 base year + 4 option years",
    summary:
      "Design, build and operate HL7 FHIR interfaces between VA clinical systems and community care partners. Includes a data quality programme, interface monitoring, and Section 508 conformant dashboards.",
    scores: { pastPerformance: 82, naicsFit: 95, setAside: 92, incumbent: 58, price: 71, relationship: 74, technical: 86, timeline: 48 },
    notes: {
      good: ["Two FHIR interface contracts at VA VISN 4 with Exceptional CPARS", "SDVOSB set-aside cuts the field to an estimated 9 bidders"],
      risk: ["Five days left; your median proposal cycle is 18 days", "Incumbent has held the work since 2021"],
    },
  },
  {
    id: "army-cloud-mod",
    notice: "DEMO-W91QUZ-27-R-0117",
    title: "Enterprise Cloud Modernization Support (ECMS)",
    agency: "Department of the Army",
    office: "ACC Rock Island, Enterprise IT Division",
    naics: "518210",
    setAside: "Small business",
    type: "RFP",
    contract: "IDIQ, multiple award, task orders FFP / T&M",
    source: "SAM.gov",
    dueInDays: 19,
    postedDaysAgo: 2,
    value: 46_000_000,
    stage: "Capture",
    isNew: true,
    incumbent: null,
    place: "Fort Belvoir, VA and remote",
    pop: "5-year ordering period",
    summary:
      "Migration of 140 legacy applications to Army Enterprise Cloud (cArmy) under a zero-trust reference architecture. Requires CMMC Level 2 and handling of CUI under DFARS 252.204-7012.",
    scores: { pastPerformance: 70, naicsFit: 78, setAside: 64, incumbent: 90, price: 66, relationship: 52, technical: 81, timeline: 76 },
    notes: {
      good: ["New requirement, no incumbent to displace", "CMMC Level 2 certificate already in hand"],
      risk: ["Army relationship is thin: one subcontract in 2023", "Multiple award means price pressure on task orders"],
    },
  },
  {
    id: "cisa-soc",
    notice: "DEMO-70QS0127R00000019",
    title: "Security Operations Center Analytics Platform Support",
    agency: "DHS · CISA",
    office: "Office of Procurement Operations",
    naics: "541519",
    setAside: "8(a)",
    type: "RFP",
    contract: "Time-and-materials, single award",
    source: "SAM.gov",
    dueInDays: 26,
    postedDaysAgo: 1,
    value: 12_750_000,
    stage: "Identified",
    isNew: true,
    incumbent: "Northvale Cyber LLC",
    place: "Arlington, VA",
    pop: "1 base year + 2 option years",
    summary:
      "Tier 2/3 analytics engineering for CISA's SOC platform: detection content, SOAR playbooks and data pipeline operations. TS/SCI clearances required for key personnel.",
    scores: { pastPerformance: 64, naicsFit: 80, setAside: 0, incumbent: 44, price: 62, relationship: 40, technical: 72, timeline: 80 },
    notes: {
      good: ["Strong detection-engineering past performance at DOE"],
      risk: ["8(a) set-aside: Meridian is not 8(a) certified, prime is not possible", "Teaming as a subcontractor is the only path"],
    },
  },
  {
    id: "cms-analytics",
    notice: "DEMO-75FCMC27R0008",
    title: "Medicaid Program Integrity Analytics Modernization",
    agency: "HHS · Centers for Medicare & Medicaid Services",
    office: "Office of Acquisition and Grants Management",
    naics: "541511",
    setAside: "Small business",
    type: "RFP",
    contract: "Hybrid FFP / labour-hour",
    source: "SAM.gov",
    dueInDays: 33,
    postedDaysAgo: 0,
    value: 22_300_000,
    stage: "Qualifying",
    isNew: true,
    incumbent: "Calder Analytics Inc.",
    place: "Woodlawn, MD and remote",
    pop: "1 base year + 4 option years",
    summary:
      "Rebuild fraud, waste and abuse models on a modern data platform; deliver case-management integrations and model governance documentation aligned to the HHS AI strategy.",
    scores: { pastPerformance: 68, naicsFit: 88, setAside: 64, incumbent: 50, price: 70, relationship: 58, technical: 77, timeline: 88 },
    notes: {
      good: ["Plenty of time to respond: 33 days", "Analytics past performance at USDA FNS is directly relevant"],
      risk: ["Calder has strong CPARS on the current task order"],
    },
  },
  {
    id: "gsa-forms",
    notice: "DEMO-47QTCA27Q0031",
    title: "Digital Forms Platform Development (TTS)",
    agency: "General Services Administration",
    office: "Technology Transformation Services",
    naics: "541511",
    setAside: "SDVOSB",
    type: "RFQ",
    contract: "BPA call, firm-fixed-price",
    source: "SAM.gov",
    dueInDays: 3,
    postedDaysAgo: 14,
    value: 3_900_000,
    stage: "Submitted",
    isNew: false,
    incumbent: null,
    place: "Remote",
    pop: "12 months + 1 option",
    summary: "Agile delivery team to extend an open-source digital forms platform: accessibility, form builder UX and agency onboarding.",
    scores: { pastPerformance: 78, naicsFit: 92, setAside: 92, incumbent: 92, price: 80, relationship: 70, technical: 88, timeline: 60 },
    notes: { good: ["No incumbent", "SDVOSB set-aside", "Strong open-source delivery record"], risk: ["Small dollar value relative to effort"] },
  },
  {
    id: "navwar-devsecops",
    notice: "DEMO-N66001-27-R-0204",
    title: "DevSecOps Pipeline & Software Factory Support",
    agency: "Department of the Navy · NAVWAR",
    office: "NIWC Pacific, San Diego",
    naics: "541512",
    setAside: "SDVOSB",
    type: "RFP",
    contract: "Cost-plus-fixed-fee",
    source: "FPDS recompete",
    dueInDays: 41,
    postedDaysAgo: 3,
    value: 31_500_000,
    stage: "Capture",
    isNew: true,
    incumbent: "Tidewater Digital Corp.",
    place: "San Diego, CA",
    pop: "1 base year + 4 option years",
    summary:
      "Recompete of the software factory support contract. Platform engineering for Kubernetes-based pipelines, continuous ATO artefacts and developer enablement.",
    scores: { pastPerformance: 74, naicsFit: 95, setAside: 92, incumbent: 62, price: 60, relationship: 46, technical: 84, timeline: 90 },
    notes: {
      good: ["Recompete flagged from FPDS 11 months before expiry", "Incumbent is graduating from small business status"],
      risk: ["Cost-plus requires a DCAA-compliant accounting system, which is in progress"],
    },
  },
  {
    id: "usda-hosting",
    notice: "DEMO-12314427Q0015",
    title: "Managed Hosting for Farm Programs Applications",
    agency: "Department of Agriculture",
    office: "Farm Production and Conservation Business Center",
    naics: "518210",
    setAside: "HUBZone",
    type: "RFQ",
    contract: "Firm-fixed-price",
    source: "SAM.gov",
    dueInDays: 12,
    postedDaysAgo: 6,
    value: 6_200_000,
    stage: "Qualifying",
    isNew: false,
    incumbent: "Prairie Cloud Services",
    place: "Kansas City, MO",
    pop: "1 base year + 4 option years",
    summary: "FedRAMP Moderate managed hosting and O&M for twelve farm-programme applications, including disaster recovery testing.",
    scores: { pastPerformance: 60, naicsFit: 76, setAside: 0, incumbent: 40, price: 64, relationship: 62, technical: 70, timeline: 70 },
    notes: { good: ["Existing USDA relationship from FNS work"], risk: ["HUBZone set-aside: not eligible as prime", "Incumbent is well regarded"] },
  },
  {
    id: "dol-pmo",
    notice: "DEMO-1605DC-27-Q-00009",
    title: "IT Program Management Office Support",
    agency: "Department of Labor",
    office: "Office of the Chief Information Officer",
    naics: "541611",
    setAside: "WOSB",
    type: "RFQ",
    contract: "Labour-hour",
    source: "SAM.gov",
    dueInDays: 9,
    postedDaysAgo: 0,
    value: 4_800_000,
    stage: "Identified",
    isNew: true,
    incumbent: "Ashgrove Consulting",
    place: "Washington, DC",
    pop: "1 base year + 2 option years",
    summary: "Portfolio governance, CPIC reporting, and IT investment analysis for the DOL OCIO.",
    scores: { pastPerformance: 56, naicsFit: 60, setAside: 0, incumbent: 50, price: 72, relationship: 30, technical: 58, timeline: 64 },
    notes: { good: ["Rates are competitive for PMO labour categories"], risk: ["WOSB set-aside: not eligible", "No DOL relationship"] },
  },
  {
    id: "va-ident",
    notice: "DEMO-36C10X-27-Q-0088",
    title: "Identity & Access Management Engineering",
    agency: "Department of Veterans Affairs",
    office: "Strategic Acquisition Center, Frederick MD",
    naics: "541512",
    setAside: "SDVOSB",
    type: "RFQ",
    contract: "T4NG2 task order, FFP",
    source: "SAM.gov",
    dueInDays: 16,
    postedDaysAgo: 1,
    value: 9_600_000,
    stage: "Qualifying",
    isNew: true,
    incumbent: "Halberd Systems Group",
    place: "Remote",
    pop: "1 base year + 3 option years",
    summary: "Okta and PIV-based identity engineering, privileged access management rollout and zero-trust identity pillar reporting.",
    scores: { pastPerformance: 76, naicsFit: 95, setAside: 92, incumbent: 56, price: 68, relationship: 74, technical: 80, timeline: 82 },
    notes: { good: ["VA relationship is strong", "Identity work at VISN 4 is a direct match"], risk: ["Same incumbent as the EHR bid: two head-to-heads this quarter"] },
  },
  {
    id: "va-state-ehr",
    notice: "DEMO-VA-eVA-2027-0412",
    title: "Statewide Case Management System Modernization",
    agency: "Commonwealth of Virginia · DSS",
    office: "Department of Social Services (eVA)",
    naics: "541511",
    setAside: "State / local",
    type: "RFP",
    contract: "Fixed price with deliverable milestones",
    source: "State portal",
    dueInDays: 24,
    postedDaysAgo: 4,
    value: 14_200_000,
    stage: "Identified",
    isNew: false,
    incumbent: "Commonwell IT",
    place: "Richmond, VA",
    pop: "3 years + 2 renewals",
    summary: "Replace a 20-year-old case management system with a configurable low-code platform. SWaM certification earns evaluation points.",
    scores: { pastPerformance: 58, naicsFit: 86, setAside: 70, incumbent: 52, price: 66, relationship: 44, technical: 74, timeline: 78 },
    notes: { good: ["Virginia SWaM certified", "Local presence in Arlington"], risk: ["State procurement rules differ: no CPARS, references required"] },
  },
  {
    id: "austin-311",
    notice: "DEMO-ATX-RFP-2027-118",
    title: "311 Service Request Platform Integration",
    agency: "City of Austin, TX",
    office: "Communications & Technology Management",
    naics: "541519",
    setAside: "State / local",
    type: "RFP",
    contract: "Fixed price",
    source: "Municipal portal",
    dueInDays: 30,
    postedDaysAgo: 5,
    value: 2_100_000,
    stage: "Identified",
    isNew: false,
    incumbent: null,
    place: "Austin, TX",
    pop: "2 years + 3 one-year renewals",
    summary: "Integrate the city's 311 platform with work-order and GIS systems; open data publishing of service request metrics.",
    scores: { pastPerformance: 52, naicsFit: 80, setAside: 50, incumbent: 92, price: 58, relationship: 20, technical: 70, timeline: 84 },
    notes: { good: ["No incumbent"], risk: ["No Texas presence; MBE/WBE subcontracting goals apply"] },
  },
  {
    id: "doe-data-lake",
    notice: "DEMO-89303027RNA000061",
    title: "Enterprise Data Lake Operations & Governance",
    agency: "Department of Energy",
    office: "Office of the CIO, Germantown MD",
    naics: "518210",
    setAside: "Full & open",
    type: "Sources sought",
    contract: "Anticipated IDIQ",
    source: "SAM.gov",
    dueInDays: 7,
    postedDaysAgo: 8,
    value: 38_000_000,
    stage: "Qualifying",
    isNew: false,
    incumbent: "Brightline Federal",
    place: "Germantown, MD",
    pop: "Anticipated 5 years",
    summary: "Market research for a follow-on data lake operations contract. Responses help DOE decide whether to set the work aside for small business.",
    scores: { pastPerformance: 80, naicsFit: 78, setAside: 30, incumbent: 46, price: 60, relationship: 70, technical: 82, timeline: 86 },
    notes: {
      good: ["A strong sources-sought response could move this to a small-business set-aside", "Detection engineering work at DOE is current and rated Very Good"],
      risk: ["As full and open, large integrators will compete"],
    },
  },
];

/** Weighted factor sum, then calibrated: raw scores overstate odds, so the
 *  model maps them onto the historical win rate curve for the firm. */
export function rawScore(o: Opportunity) {
  return FACTORS.reduce((sum, f) => sum + (f.weight * o.scores[f.key]) / 100, 0);
}

export function pwin(o: Opportunity) {
  if (o.scores.setAside === 0) return Math.round(rawScore(o) * 0.22); // cannot prime
  const r = rawScore(o) / 100;
  // logistic calibration centred at 0.72 raw, tuned to a 31% historical win rate
  const p = 1 / (1 + Math.exp(-9 * (r - 0.72)));
  return Math.round(p * 100);
}

export type Verdict = "Bid" | "Bid with conditions" | "No-bid" | "Team";

export function verdict(o: Opportunity): Verdict {
  if (o.scores.setAside === 0) return "Team";
  const p = pwin(o);
  if (p >= 45) return "Bid";
  if (p >= 28) return "Bid with conditions";
  return "No-bid";
}

export function getOpportunity(id: string) {
  return OPPORTUNITIES.find((o) => o.id === id);
}

/* ---------- compliance sample ---------- */

export type MatrixStatus = "Covered" | "Partial" | "Gap";
export type MatrixRow = {
  id: string;
  requirement: string;
  section: string;
  clause: string;
  status: MatrixStatus;
  owner: string;
  response: string;
};

export const SAMPLE_RFP = {
  file: "DEMO-W91QUZ-27-R-0117_ECMS_RFP.pdf",
  pages: 142,
  title: "Enterprise Cloud Modernization Support (ECMS)",
  agency: "Department of the Army · ACC Rock Island",
  oppId: "army-cloud-mod",
};

export const EXTRACTION_STEPS = [
  { label: "Reading the solicitation", detail: "142 pages, 6 attachments, 2 amendments" },
  { label: "Locating Sections C, L and M", detail: "SOW at C.3, instructions at L.4 to L.11, evaluation at M.2" },
  { label: "Extracting shall-statements", detail: "38 requirements, 11 deliverables, 4 key personnel" },
  { label: "Matching FAR and DFARS clauses", detail: "27 clauses incorporated, 6 need action" },
  { label: "Mapping to your capability library", detail: "Past performance, résumés and boilerplate" },
  { label: "Flagging gaps", detail: "Compliance matrix ready for review" },
];

export const MATRIX: MatrixRow[] = [
  { id: "C.3.1", requirement: "Assess 140 legacy applications and deliver a migration wave plan within 60 days of award", section: "C · SOW", clause: "", status: "Covered", owner: "D. Okafor", response: "Vol I §2.1, wave planning method from USDA FNS" },
  { id: "C.3.4", requirement: "Implement zero-trust reference architecture aligned to DoD ZT Strategy pillars", section: "C · SOW", clause: "", status: "Partial", owner: "R. Lindqvist", response: "Device pillar evidence thin; add IAM work from VA" },
  { id: "C.3.7", requirement: "Maintain an authority to operate with continuous monitoring artefacts (eMASS)", section: "C · SOW", clause: "", status: "Covered", owner: "R. Lindqvist", response: "Vol I §2.4, cATO pipeline" },
  { id: "C.5.2", requirement: "Provide a Cloud Architect key person holding an active Secret clearance", section: "C · Key personnel", clause: "", status: "Gap", owner: "Unassigned", response: "No bench candidate; recruiting or teaming needed" },
  { id: "L.4.2", requirement: "Technical volume limited to 30 pages, 12-pt font, 1-inch margins", section: "L · Instructions", clause: "", status: "Covered", owner: "A. Reyes", response: "Template enforced in Proposal Studio" },
  { id: "L.6.1", requirement: "Three past performance references within five years, each over $5M", section: "L · Instructions", clause: "", status: "Partial", owner: "A. Reyes", response: "Two qualify; third is $4.1M" },
  { id: "L.8.3", requirement: "Submit a small business participation plan with Limitations on Subcontracting calculation", section: "L · Instructions", clause: "FAR 52.219-14", status: "Covered", owner: "M. Haddad", response: "Prime performs 62% of labour cost" },
  { id: "L.9.1", requirement: "Provide a current SPRS score from a NIST SP 800-171 assessment", section: "L · Instructions", clause: "DFARS 252.204-7019", status: "Covered", owner: "M. Haddad", response: "SPRS 110, assessed Mar 2026" },
  { id: "M.2.1", requirement: "Factor 1 Technical approach is significantly more important than price", section: "M · Evaluation", clause: "", status: "Covered", owner: "D. Okafor", response: "Win themes front-loaded in §1" },
  { id: "M.2.3", requirement: "Risk assessment of transition-in plan, rated on a confidence scale", section: "M · Evaluation", clause: "", status: "Partial", owner: "D. Okafor", response: "Transition plan drafted; needs risk register" },
  { id: "I.12", requirement: "Basic safeguarding of covered contractor information systems", section: "I · Clauses", clause: "FAR 52.204-21", status: "Covered", owner: "M. Haddad", response: "15 controls in SSP" },
  { id: "I.18", requirement: "Safeguard CUI and report cyber incidents to DoD within 72 hours", section: "I · Clauses", clause: "DFARS 252.204-7012", status: "Covered", owner: "M. Haddad", response: "Incident response plan v4, DIBNet access active" },
  { id: "I.19", requirement: "CMMC Level 2 (C3PAO) certification at time of award", section: "I · Clauses", clause: "DFARS 252.204-7021", status: "Covered", owner: "M. Haddad", response: "Certificate valid through Feb 2029" },
  { id: "I.22", requirement: "Prohibition on covered telecommunications equipment (Section 889) representation", section: "K · Reps & certs", clause: "FAR 52.204-24", status: "Gap", owner: "Unassigned", response: "Representation not yet signed in SAM" },
  { id: "I.25", requirement: "Contractor personnel must complete annual cybersecurity training", section: "I · Clauses", clause: "DFARS 252.239-7001", status: "Partial", owner: "A. Reyes", response: "71 of 84 staff complete" },
];

export const CLAUSES = [
  { id: "FAR 52.204-21", name: "Basic Safeguarding of Covered Contractor Information Systems", action: false },
  { id: "DFARS 252.204-7012", name: "Safeguarding Covered Defense Information and Cyber Incident Reporting", action: false },
  { id: "DFARS 252.204-7019", name: "Notice of NIST SP 800-171 DoD Assessment Requirements", action: false },
  { id: "DFARS 252.204-7020", name: "NIST SP 800-171 DoD Assessment Requirements", action: true },
  { id: "DFARS 252.204-7021", name: "Contractor Compliance with the CMMC Level Requirements", action: false },
  { id: "FAR 52.204-24", name: "Representation Regarding Certain Telecommunications Equipment", action: true },
  { id: "FAR 52.219-14", name: "Limitations on Subcontracting", action: false },
  { id: "FAR 52.222-50", name: "Combating Trafficking in Persons", action: true },
];

/* ---------- proposal studio ---------- */

export type Section = { id: string; title: string; volume: string; pages: string; text: string };

export const WIN_THEMES = [
  "Wave plan in 60 days, proven at USDA",
  "Zero-trust by default, not bolted on",
  "CMMC Level 2 certified today",
  "Veteran-led delivery",
];

export const SECTIONS: Section[] = [
  {
    id: "exec",
    volume: "Volume I · Technical",
    title: "1.0 Executive summary",
    pages: "2 of 30",
    text:
      "Meridian Federal Solutions will move the Army's 140 legacy applications to cArmy in four planned waves, starting with a complete portfolio assessment and wave plan delivered within 60 days of award. We have run this playbook before: at USDA FNS we assessed 96 applications and migrated the first wave in 11 weeks with no unplanned downtime.\n\nOur approach treats zero trust as the starting condition of every migration rather than a later hardening step. Each application lands with identity-aware access, continuous monitoring artefacts in eMASS, and a pipeline that keeps its authority to operate current.\n\nMeridian holds a CMMC Level 2 certificate today and an SPRS score of 110, so the Army carries no certification risk at award.",
  },
  {
    id: "tech",
    volume: "Volume I · Technical",
    title: "2.0 Technical approach",
    pages: "14 of 30",
    text:
      "2.1 Assessment and wave planning. In the first 30 days our team inventories every application, its data classification, dependencies and hosting constraints. Each one is scored for migration pattern (rehost, replatform, refactor or retire) and grouped into waves by mission risk.\n\n2.2 Landing zone. We extend the cArmy landing zone with policy-as-code guardrails so every account inherits logging, encryption and network segmentation at creation.\n\n2.3 Migration factory. A repeatable pipeline moves applications through build, security scanning, test and cutover, with rollback rehearsed before every production move.",
  },
  {
    id: "mgmt",
    volume: "Volume I · Technical",
    title: "3.0 Management approach",
    pages: "6 of 30",
    text:
      "A single program manager, a 21-year Army signal officer, is accountable for cost, schedule and performance. Integrated master schedule updates are delivered every two weeks, with earned value reported against the wave plan.",
  },
  {
    id: "staff",
    volume: "Volume I · Technical",
    title: "4.0 Staffing & key personnel",
    pages: "4 of 30",
    text:
      "Key personnel: Program Manager (identified), Cloud Architect (recruiting, Secret clearance required), Security Lead (identified). Our retention rate on federal programmes is 91% over three years.",
  },
  {
    id: "pp",
    volume: "Volume II · Past performance",
    title: "Past performance references",
    pages: "3 references",
    text:
      "Reference 1: USDA FNS Cloud Migration, $8.2M, 2022–2025, Exceptional.\nReference 2: VA VISN 4 Interface Engineering, $6.7M, 2021–present, Exceptional.\nReference 3: DOE Detection Engineering, $4.1M, 2023–present, Very Good.",
  },
  {
    id: "price",
    volume: "Volume III · Price",
    title: "Price narrative",
    pages: "Narrative only",
    text:
      "Labour rates are drawn from our GSA MAS schedule with a 6% volume discount on task orders over $2M. Escalation is held at 2.5% per option year.",
  },
];

/* ---------- market intelligence ---------- */

export const AGENCY_AWARDS: Record<string, { agency: string; amount: number }[]> = {
  "541512": [
    { agency: "Department of Defense", amount: 14.8 },
    { agency: "Veterans Affairs", amount: 6.1 },
    { agency: "Homeland Security", amount: 4.4 },
    { agency: "Health & Human Services", amount: 3.9 },
    { agency: "Treasury", amount: 2.2 },
    { agency: "Justice", amount: 1.6 },
  ],
  "541511": [
    { agency: "Health & Human Services", amount: 5.3 },
    { agency: "Department of Defense", amount: 4.9 },
    { agency: "General Services Admin.", amount: 2.4 },
    { agency: "Veterans Affairs", amount: 2.1 },
    { agency: "Commerce", amount: 1.2 },
    { agency: "Education", amount: 0.8 },
  ],
  "541519": [
    { agency: "Department of Defense", amount: 6.7 },
    { agency: "Homeland Security", amount: 2.6 },
    { agency: "State", amount: 1.4 },
    { agency: "Veterans Affairs", amount: 1.3 },
    { agency: "Energy", amount: 0.9 },
    { agency: "Interior", amount: 0.5 },
  ],
  "518210": [
    { agency: "Department of Defense", amount: 7.9 },
    { agency: "Health & Human Services", amount: 2.1 },
    { agency: "Agriculture", amount: 1.3 },
    { agency: "Energy", amount: 1.1 },
    { agency: "Homeland Security", amount: 1.0 },
    { agency: "Social Security Admin.", amount: 0.6 },
  ],
  "541611": [
    { agency: "Department of Defense", amount: 9.2 },
    { agency: "Health & Human Services", amount: 2.8 },
    { agency: "Homeland Security", amount: 1.9 },
    { agency: "Veterans Affairs", amount: 1.2 },
    { agency: "Labor", amount: 0.7 },
    { agency: "Treasury", amount: 0.6 },
  ],
};

export const INCUMBENTS = [
  { name: "Halberd Systems Group", status: "SDVOSB", awards: 14, obligated: 212_000_000, recompete: "Mar 2027", agencies: "VA, IHS", overlap: "High" },
  { name: "Tidewater Digital Corp.", status: "Graduating small", awards: 9, obligated: 148_000_000, recompete: "Oct 2027", agencies: "Navy, USMC", overlap: "High" },
  { name: "Calder Analytics Inc.", status: "Small business", awards: 7, obligated: 96_000_000, recompete: "Jan 2028", agencies: "CMS, CDC", overlap: "Medium" },
  { name: "Brightline Federal", status: "Large", awards: 22, obligated: 640_000_000, recompete: "Aug 2027", agencies: "DOE, NNSA", overlap: "Medium" },
  { name: "Northvale Cyber LLC", status: "8(a)", awards: 6, obligated: 58_000_000, recompete: "Jun 2027", agencies: "CISA, TSA", overlap: "Low" },
  { name: "Prairie Cloud Services", status: "HUBZone", awards: 5, obligated: 31_000_000, recompete: "Sep 2028", agencies: "USDA", overlap: "Low" },
];

export const AGENCY_PROFILES = [
  { agency: "Veterans Affairs", vehicle: "T4NG2", smallShare: 41, sdvosbShare: 24, avgAward: "$7.8M", buysIn: "Q3 and Q4 FY", note: "Vets First rule: SDVOSB and VOSB firms get first look on VA buys." },
  { agency: "Department of the Army", vehicle: "ITES-4S", smallShare: 28, sdvosbShare: 5, avgAward: "$11.2M", buysIn: "Q4 FY surge", note: "Heavy use of IDIQs; task-order competitions move fast once a vehicle is held." },
  { agency: "HHS · CMS", vehicle: "SPARC", smallShare: 34, sdvosbShare: 4, avgAward: "$9.4M", buysIn: "Q2 and Q4 FY", note: "Prefers agile delivery evidence and oral presentations." },
];

/* ---------- post-award ---------- */

export type Contract = {
  id: string;
  name: string;
  agency: string;
  number: string;
  value: number;
  funded: number;
  billed: number;
  periods: { label: string; start: string; end: string; state: "done" | "active" | "option" }[];
  todayPct: number;
  deliverables: { name: string; due: string; status: "Accepted" | "Submitted" | "Due" | "Late" }[];
  mods: { id: string; date: string; desc: string; amount: number }[];
  invoices: { id: string; period: string; amount: number; status: "Paid" | "In review" | "Overdue" }[];
  hours: { budget: number; used: number };
};

export const CONTRACTS: Contract[] = [
  {
    id: "visn4",
    name: "VISN 4 Interface Engineering",
    agency: "Veterans Affairs",
    number: "DEMO-36C24421C0117",
    value: 6_700_000,
    funded: 4_100_000,
    billed: 3_640_000,
    periods: [
      { label: "Base", start: "Oct 2021", end: "Sep 2022", state: "done" },
      { label: "OY1", start: "Oct 2022", end: "Sep 2023", state: "done" },
      { label: "OY2", start: "Oct 2023", end: "Sep 2024", state: "done" },
      { label: "OY3", start: "Oct 2024", end: "Sep 2025", state: "done" },
      { label: "OY4", start: "Oct 2025", end: "Sep 2026", state: "done" },
      { label: "Ext.", start: "Oct 2026", end: "Mar 2027", state: "active" },
    ],
    todayPct: 90,
    deliverables: [
      { name: "Monthly status report (Oct)", due: "10 Nov", status: "Accepted" },
      { name: "Interface monitoring runbook v3", due: "14 Nov", status: "Submitted" },
      { name: "Section 508 conformance report", due: "20 Nov", status: "Due" },
      { name: "Transition-out plan", due: "1 Dec", status: "Due" },
    ],
    mods: [
      { id: "P00011", date: "28 Sep 2026", desc: "Six-month extension under FAR 52.217-8", amount: 610_000 },
      { id: "P00010", date: "12 Aug 2026", desc: "Incremental funding, OY4", amount: 420_000 },
    ],
    invoices: [
      { id: "INV-2611", period: "Oct 2026", amount: 98_400, status: "In review" },
      { id: "INV-2610", period: "Sep 2026", amount: 112_900, status: "Paid" },
      { id: "INV-2609", period: "Aug 2026", amount: 109_300, status: "Paid" },
    ],
    hours: { budget: 4160, used: 3398 },
  },
  {
    id: "fns",
    name: "FNS Analytics & Cloud Operations",
    agency: "Agriculture · FNS",
    number: "DEMO-12319823F0042",
    value: 8_200_000,
    funded: 5_900_000,
    billed: 5_120_000,
    periods: [
      { label: "Base", start: "Jan 2025", end: "Dec 2025", state: "done" },
      { label: "OY1", start: "Jan 2026", end: "Dec 2026", state: "active" },
      { label: "OY2", start: "Jan 2027", end: "Dec 2027", state: "option" },
      { label: "OY3", start: "Jan 2028", end: "Dec 2028", state: "option" },
    ],
    todayPct: 47,
    deliverables: [
      { name: "Quarterly model governance review", due: "6 Nov", status: "Late" },
      { name: "Monthly status report (Oct)", due: "10 Nov", status: "Accepted" },
      { name: "DR test results", due: "24 Nov", status: "Due" },
    ],
    mods: [
      { id: "P00004", date: "2 Oct 2026", desc: "Add data engineer labour category", amount: 186_000 },
      { id: "P00003", date: "15 Jan 2026", desc: "Exercise option year 1", amount: 2_050_000 },
    ],
    invoices: [
      { id: "INV-2614", period: "Oct 2026", amount: 171_200, status: "In review" },
      { id: "INV-2602", period: "Sep 2026", amount: 168_750, status: "Overdue" },
      { id: "INV-2598", period: "Aug 2026", amount: 166_100, status: "Paid" },
    ],
    hours: { budget: 6240, used: 5310 },
  },
  {
    id: "doe",
    name: "DOE Detection Engineering",
    agency: "Energy · OCIO",
    number: "DEMO-89303023FMA000214",
    value: 4_100_000,
    funded: 2_300_000,
    billed: 1_980_000,
    periods: [
      { label: "Base", start: "Jun 2023", end: "May 2024", state: "done" },
      { label: "OY1", start: "Jun 2024", end: "May 2025", state: "done" },
      { label: "OY2", start: "Jun 2025", end: "May 2026", state: "done" },
      { label: "OY3", start: "Jun 2026", end: "May 2027", state: "active" },
      { label: "OY4", start: "Jun 2027", end: "May 2028", state: "option" },
    ],
    todayPct: 70,
    deliverables: [
      { name: "Detection content release 26.11", due: "18 Nov", status: "Submitted" },
      { name: "Monthly status report (Oct)", due: "10 Nov", status: "Accepted" },
      { name: "Purple-team exercise report", due: "5 Dec", status: "Due" },
    ],
    mods: [{ id: "P00007", date: "30 May 2026", desc: "Exercise option year 3", amount: 820_000 }],
    invoices: [
      { id: "INV-2613", period: "Oct 2026", amount: 68_300, status: "In review" },
      { id: "INV-2607", period: "Sep 2026", amount: 70_100, status: "Paid" },
    ],
    hours: { budget: 2080, used: 1210 },
  },
];
