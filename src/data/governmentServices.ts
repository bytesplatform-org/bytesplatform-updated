/**
 * Government services: one entry per card in the "What government buys" grid
 * on /government-contractors, and the content of each card's detail page at
 * /government-contractors/services/[slug]. The grid and the pages both read
 * from here, so they can't drift apart.
 *
 * Card images are Unsplash photos (Unsplash License), cropped to 900×600.
 * 04 (ERP) page content is a DRAFT written to match the live card: review it.
 */

export type GovernmentService = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  naics: string[];
  /** The 4 pills on the grid card. */
  tags: string[];
  image: string;
  whoItsFor: { state: string; prime: string; small: string };
  problems: string[];
  whatWeDo: { lead: string; line?: string }[];
  deliverables: string[];
  faqs: { q: string; a: string }[];
  /** Slugs of two other services. */
  related: [string, string];
};

export const governmentServices: GovernmentService[] = [
  {
    slug: "website-modernization",
    number: "01",
    title: "Website & digital service modernization",
    summary: "Accessible, fast sites on a CMS your staff can update, delivered with an Accessibility Conformance Report.",
    naics: ["541511", "541512"],
    tags: ["WCAG 2.1 AA build", "ACR / VPAT", "Content migration", "CMS training"],
    image: "/govcon/websites.jpg",
    whoItsFor: {
      state: "City, county and school district sites that need to meet WCAG 2.1 AA",
      prime: "Section 508-tested web work for your task order",
      small: "A credible, government-ready website",
    },
    problems: [
      "Your site fails accessibility checks and the deadline is coming.",
      "Staff can't update a page without calling IT or a vendor.",
      "Residents can't find what they need, especially on a phone.",
      "Hundreds of PDFs that screen readers can't read.",
    ],
    whatWeDo: [
      { lead: "Accessibility audit:", line: "automated scans plus manual screen reader testing" },
      { lead: "Redesign around top tasks:", line: "pay, apply, report and find, so residents finish faster" },
      { lead: "Easy CMS:", line: "your staff edit pages without code" },
      { lead: "Content migration:", line: "including turning key PDFs into accessible pages" },
      { lead: "Hosting, security and speed setup" },
      { lead: "Staff training:", line: "live, plus recorded" },
    ],
    deliverables: ["Audit report", "ACR / VPAT", "Accessible website", "Migrated content", "Admin guide", "Training recording"],
    faqs: [
      { q: "Do we have to rebuild the whole site?", a: "Not always. If your current site is solid, we fix it. The assessment shows which option is cheaper." },
      { q: "Who owns the site?", a: "You do: the code, the content and all accounts." },
      { q: "Can our staff update it after launch?", a: "Yes. Training and an admin guide are included." },
    ],
    related: ["portals-permitting-licensing", "crm-case-management"],
  },
  {
    slug: "portals-permitting-licensing",
    number: "02",
    title: "Constituent portals, permitting & licensing",
    summary: "Online applications, payments and status tracking that replace paper forms and email queues.",
    naics: ["541511", "541519"],
    tags: ["Online applications", "Payments", "Login.gov / SSO", "Status tracking"],
    image: "/govcon/portals.jpg",
    whoItsFor: {
      state: "Permits, licenses, registrations and service requests",
      prime: "Public-facing application portals for your program",
      small: "Online intake and payments for your government customers",
    },
    problems: [
      "Residents print, sign, scan and email forms.",
      "Staff re-type the same data into another system.",
      "“What's my status?” phone calls fill the day.",
      "Payments still come in by check.",
    ],
    whatWeDo: [
      { lead: "Process mapping:", line: "we chart your current process and remove unneeded steps" },
      { lead: "Online forms:", line: "with save-and-resume and file uploads" },
      { lead: "Secure online payments:", line: "through the processor you already use" },
      { lead: "Sign-in:", line: "with Login.gov or your existing single sign-on" },
      { lead: "Status tracking:", line: "with email or text updates" },
      { lead: "Staff dashboard:", line: "to approve, return or assign applications" },
      { lead: "Connections:", line: "to your existing systems where they allow it" },
    ],
    deliverables: ["Process map", "Live portal", "Staff dashboard", "Accessibility & security test results", "Admin guide"],
    faqs: [
      { q: "Can it connect to our current system?", a: "Usually, yes, through an API or data export. We confirm it during the assessment." },
      { q: "Do we need a new payment processor?", a: "No. We connect to the one you already use where possible." },
      { q: "Is it accessible?", a: "Yes. It's tested against WCAG 2.1 AA before launch." },
    ],
    related: ["website-modernization", "crm-case-management"],
  },
  {
    slug: "crm-case-management",
    number: "03",
    title: "CRM & case management",
    summary: "One view of every case, grant or constituent on Salesforce, Dynamics 365 or a custom build, with audit trails.",
    naics: ["541511", "541512"],
    tags: ["Case workflows", "Role-based access", "Audit trails", "Reporting"],
    image: "/govcon/crm.jpg",
    whoItsFor: {
      state: "Case, grant and constituent tracking across departments",
      prime: "CRM setup and data migration on your program",
      small: "One place to track bids, contracts and customers",
    },
    problems: [
      "Information lives in spreadsheets and inboxes.",
      "Cases fall through the cracks when someone is out.",
      "No record of who changed what, and when.",
      "Reports take days to build by hand.",
    ],
    whatWeDo: [
      { lead: "Workflow mapping:", line: "for each of your case types" },
      { lead: "Platform setup:", line: "Salesforce, Dynamics 365 or a custom build, based on what fits and what you already license" },
      { lead: "Data migration:", line: "from spreadsheets and old systems, checked and validated" },
      { lead: "Role-based access:", line: "people only see what they should" },
      { lead: "Automatic assignments and reminders" },
      { lead: "Dashboards and reports", line: "that update themselves" },
    ],
    deliverables: ["Configured system", "Migrated data + validation report", "Workflow documents", "Dashboards", "Training"],
    faqs: [
      { q: "Which platform should we use?", a: "It depends on your needs and the licenses you already have. We recommend one in the assessment." },
      { q: "Do we need new licenses?", a: "Not if you already own them." },
      { q: "Is there an audit trail?", a: "Yes. Every change is logged with who made it and when." },
    ],
    related: ["portals-permitting-licensing", "data-ai-automation"],
  },
  {
    // DRAFT page content, written to match the live card 04. Review before publishing.
    slug: "erp-financial-modernization",
    number: "04",
    title: "ERP & financial modernization",
    summary: "Finance, procurement and HR moved off legacy systems, or a DCAA-ready ERP for contractors.",
    naics: ["541512", "541519"],
    tags: ["ERP migration", "Integrations & APIs", "Data conversion", "DCAA-ready timekeeping"],
    image: "/govcon/erp.jpg",
    whoItsFor: {
      state: "Finance, procurement and HR teams running on aging systems",
      prime: "ERP migration and integration work on your contract",
      small: "Timekeeping, job costing and billing that hold up in an audit",
    },
    problems: [
      "Finance runs on an old system only one person fully understands.",
      "Month-end close means weeks of spreadsheets.",
      "Systems don't talk to each other, so staff re-key the same data.",
      "Timekeeping and job costing aren't ready for an audit.",
    ],
    whatWeDo: [
      { lead: "Process and data review:", line: "how money, purchases and people move through your systems today" },
      { lead: "Modernize or replace:", line: "a recommendation based on your needs and the licenses you already have" },
      { lead: "Data conversion:", line: "from old systems and spreadsheets, checked and validated" },
      { lead: "Integrations & APIs:", line: "so finance, procurement and HR share one set of data" },
      { lead: "DCAA-ready timekeeping:", line: "with job costing and billing for contractors" },
      { lead: "Staff training:", line: "live, plus written guides" },
    ],
    deliverables: ["Assessment & roadmap", "Configured system", "Converted data + validation report", "Integration documents", "Training"],
    faqs: [
      { q: "Do we have to replace our ERP?", a: "Not always. If your current system can be modernized, we tell you. The assessment shows which option is cheaper." },
      { q: "Will our historical data move over?", a: "Yes. We convert it, then check it against your old system before go-live." },
      { q: "Is it ready for a DCAA audit?", a: "We set up timekeeping and job costing to DCAA expectations. Your auditor makes the final call." },
    ],
    related: ["crm-case-management", "cloud-hosting-devsecops"],
  },
  {
    slug: "data-ai-automation",
    number: "05",
    title: "Data, AI & intelligent automation",
    summary: "Document extraction and policy search with a person approving every output, plus clear governance records.",
    naics: ["541511", "518210"],
    tags: ["Document AI", "Search assistants", "Human review", "Use-case inventory"],
    image: "/govcon/ai.jpg",
    whoItsFor: {
      state: "Front desks and call centers answering the same questions every day",
      prime: "AI and automation work on your program",
      small: "Less admin, more time for delivery",
    },
    problems: [
      "Staff answer the same emails and calls all day.",
      "After-hours questions go unanswered.",
      "Requests pile up waiting to be sorted.",
    ],
    whatWeDo: [
      { lead: "Automation shortlist:", line: "we find the best tasks to automate and estimate the time saved" },
      { lead: "AI assistant on your website:", line: "it answers from your own public content" },
      { lead: "Request routing:", line: "incoming requests are sorted and sent to the right person automatically" },
      { lead: "Summaries and draft replies:", line: "for staff to review" },
      { lead: "Human review and full logs:", line: "of everything the AI does" },
    ],
    deliverables: ["Automation shortlist", "Working AI assistant", "Routing workflow", "Usage logs", "Staff guide"],
    faqs: [
      { q: "Will AI make decisions for us?", a: "No. It answers common questions, sorts and drafts. Your staff decide." },
      { q: "Is our data used to train AI models?", a: "We choose providers and settings that keep your data out of model training, and we document it." },
      { q: "Can we turn it off?", a: "Yes, any time." },
    ],
    related: ["crm-case-management", "cloud-hosting-devsecops"],
  },
  {
    slug: "cloud-hosting-devsecops",
    number: "06",
    title: "Cloud hosting & DevSecOps",
    summary: "Migration to US-region, FedRAMP-authorized clouds with security scanning on every deploy.",
    naics: ["518210", "541513"],
    tags: ["Cloud migration", "CI/CD scanning", "Monitoring", "Hardening"],
    image: "/govcon/cloud.jpg",
    whoItsFor: {
      state: "Agencies with aging servers or no dedicated IT staff",
      prime: "Hosting and operations support on your contract",
      small: "Reliable hosting without hiring an IT team",
    },
    problems: [
      "Old servers nobody wants to touch.",
      "No one clearly owns security updates.",
      "Backups exist, but nobody has tested a restore.",
      "Residents notice outages before you do.",
    ],
    whatWeDo: [
      { lead: "Cloud move:", line: "to AWS, Azure or Google Cloud, including government regions when required" },
      { lead: "Security hardening:", line: "with access controls and encryption" },
      { lead: "24/7 monitoring and alerts" },
      { lead: "Backups with tested restores:", line: "plus a disaster recovery plan" },
      { lead: "Regular patching and updates" },
      { lead: "Help desk:", line: "with agreed response times" },
    ],
    deliverables: ["Migration plan", "Secured environment", "Monitoring dashboard", "Tested backup & recovery plan", "Monthly report"],
    faqs: [
      { q: "Can you host on FedRAMP-authorized cloud services?", a: "Yes, when your contract requires it." },
      { q: "What if something breaks at night?", a: "Monitoring alerts us, and we respond within the agreed response times." },
      { q: "Can we leave?", a: "Yes. All accounts and documents are yours." },
    ],
    related: ["website-modernization", "data-ai-automation"],
  },
];

/** The three blocks every service page shares. Change them here once. */
export const governmentServiceShared = {
  howItWorks: [
    { lead: "Free discovery call (30 min).", line: "Tell us about the solicitation or the problem. We'll tell you honestly if we're a fit." },
    { lead: "Assessment (1–2 weeks).", line: "We review your current site or system, users, data and compliance gaps. You get a findings report, a clear scope and a fixed quote." },
    { lead: "Plan & design.", line: "We agree on scope, timeline and designs. Nothing is built until you sign off." },
    { lead: "Build in 2-week sprints.", line: "You see a working demo every two weeks and can change priorities." },
    { lead: "Test.", line: "Accessibility (WCAG 2.1 AA), security, and testing with your own staff." },
    { lead: "Launch & train.", line: "Go-live plan, staff training and written guides." },
    { lead: "Support.", line: "A warranty period after launch, then optional ongoing support." },
  ],
  management: [
    { lead: "One project lead:", line: "your single point of contact from day one to launch" },
    { lead: "Weekly 30-minute call:", line: "plus a short written update on what's done, what's next and any risks" },
    { lead: "Shared tracker:", line: "your team can check progress anytime" },
    { lead: "Your sign-off at every phase:", line: "nothing moves without your approval" },
    { lead: "Pay for finished work:", line: "invoices are tied to completed milestones" },
    { lead: "Full handover:", line: "code, accounts, documents and guides are yours" },
  ],
  waysToWork: [
    { lead: "Direct contract:", line: "fixed price, or time-and-materials for ongoing work" },
    { lead: "Through your procurement:", line: "we respond to RFPs, RFQs and quote requests" },
    { lead: "Under a prime:", line: "we work as a subcontractor on federal and state contracts" },
    { lead: "After launch:", line: "an optional monthly support plan" },
  ],
};

export const govServicePath = (slug: string) => `/government-contractors/services/${slug}`;

export const findGovernmentService = (slug: string) => governmentServices.find((service) => service.slug === slug);
