import type { ServiceContent } from "./serviceContent";
import type { ProductSlug } from "./products";

/**
 * Product page copy, adapted from https://bytesplatform.com/products/*.
 * One spelling per product name, repeated sections merged, and claims the old
 * pages made without backing (uptime guarantees, customer counts, compliance
 * certifications, free-trial terms) left out.
 */
export const productContent: Record<ProductSlug, ServiceContent> = {
  "byte-bots": {
    slug: "byte-bots",
    meta: {
      title: "AI Chatbot for Customer Support & Leads | Byte Bots",
      description:
        "Byte Bots is an AI chatbot for customer support and lead generation, trained on your data and plugged into your CRM and website. Book a free demo today.",
    },
    hero: {
      title: ["Byte Bots"],
      intro:
        "The future of conversation, powered by AI. Custom chatbots trained on your own business data. They answer accurately in your brand's voice, qualify leads and support customers around the clock.",
    },
    statement: "Every conversation is a chance to sell, support and learn. Byte Bots make sure none of them are wasted.",
    action: "Book a consultation",
    labels: { statement: "Why Byte Bots", offer: "Features", highlights: "The difference", faq: "FAQ" },
    offer: {
      heading: "What Byte Bots do",
      items: [
        {
          title: "Plug & play integrations",
          body: "Fits into the tools you already use, on your website, in your CRM and in the chat apps your customers and team live in.",
          tags: ["Website widget", "CRM & ERP connectors", "Slack, Teams, WhatsApp", "Webhooks & REST"],
        },
        {
          title: "Conversion engine",
          body: "Every interaction moves toward an outcome, with conversation paths shaped by real sales training.",
          tags: ["Lead qualification flows", "Dynamic CTAs & form fills", "Automated follow-ups", "A/B-tested paths"],
        },
        {
          title: "Data-driven intelligence",
          body: "Chat logs become actionable insight, real-time dashboards, alerts, trend forecasts and executive summaries on demand.",
        },
        {
          title: "Continuous learning",
          body: "Smarter over time: contextual memory, an evolving vocabulary and a tone that adapts to each audience segment.",
        },
      ],
    },
    highlights: {
      heading: "Built around your business",
      items: [
        { title: "Trained on your data", body: "Your products, policies and voice, not generic answers from the open web." },
        { title: "In your control", body: "An admin portal for prompts, overrides and ongoing training, so the bot stays on message." },
        { title: "Always on", body: "Customers get answers and leads get followed up, day and night, without adding headcount." },
      ],
    },
    faqs: [
      { q: "How do Byte Bots work?", a: "Each bot is trained on your business's own content and connected to your tools. It answers customer questions, qualifies leads and hands off to your team when a person is needed." },
      { q: "Can a Byte Bot be customized to my business?", a: "Yes. Every bot is built for your requirements, whether customer support, sales or internal processes, and speaks in your brand's voice." },
      { q: "Will it integrate with my existing systems?", a: "Byte Bots connect to websites, CRMs, ERPs and chat channels through ready integrations, webhooks and REST endpoints." },
      { q: "How do I get started?", a: "Book a free consultation. We'll scope your use case, then guide you through setup, training and customization." },
    ],
    cta: {
      heading: "Ready to transform your conversations",
      body: "Book a free Byte Bots consultation and see how AI can power your business.",
    },
  },

  "byte-suites": {
    slug: "byte-suites",
    meta: {
      title: "CRM Software for Small Business | Byte Suites",
      description:
        "Byte Suites is custom CRM software for small business: lead management, AI assistant, invoicing and scheduling in one platform. Book your onboarding call.",
    },
    hero: {
      title: ["Byte Suites"],
      intro:
        "The future of CRM. One connected platform for leads, communication, billing and analytics, with an AI assistant built in, and room to grow into a full ERP.",
    },
    statement: "Stop stitching tools together. Run customers, sales and operations from one place, built for the way you work.",
    action: "Book a consultation",
    labels: { statement: "Why Byte Suites", offer: "Features", highlights: "Who it's for", process: "Implementation & support", faq: "FAQ" },
    offer: {
      heading: "Everything in one suite",
      items: [
        {
          title: "Smart lead management",
          body: "Intelligent capture, AI-powered qualification and nurture, with sales pipelines shaped to your process.",
          tags: ["Lead capture", "AI qualification", "Custom pipelines"],
        },
        {
          title: "Byte Bot assistant",
          body: "An AI assistant that handles customer queries, automates follow-ups and surfaces real-time sales insights and next actions.",
        },
        {
          title: "Communication hub",
          body: "A unified inbox with calendar sync, reminders, team collaboration and mobile notifications.",
          tags: ["Unified inbox", "Calendar & reminders", "Team collaboration"],
        },
        {
          title: "Sales automation & analytics",
          body: "Deal-flow automation, AI sales forecasting and custom dashboards that move prospects through your pipeline faster.",
        },
        {
          title: "Built-in business tools",
          body: "Branded invoicing, appointment scheduling, inventory tracking and accounting. Native, no third-party add-ons needed.",
          tags: ["Invoicing", "Scheduling", "Inventory", "Accounting"],
        },
      ],
    },
    highlights: {
      heading: "Made for teams like yours",
      body: "How Byte Suites changes the day-to-day for different kinds of business.",
      items: [
        {
          title: "Consultants & service providers",
          body: "Run your practice from one place.",
          points: ["One platform instead of disconnected tools", "Automated client communication", "Invoicing with recurring billing"],
        },
        {
          title: "Sales teams & agencies",
          body: "Intelligent automation for every rep.",
          points: ["AI assistant for continuous follow-ups", "Team performance analytics", "Lead scoring and qualification"],
        },
        {
          title: "Small & medium businesses",
          body: "Enterprise features, without the complexity.",
          points: ["Scales as you grow", "Intuitive interface for fast adoption", "Role-based access control"],
        },
        {
          title: "E-commerce & retail",
          body: "The whole customer lifecycle, connected.",
          points: ["End-to-end customer management", "Inventory and sales in sync", "Automated customer support"],
        },
      ],
    },
    process: {
      heading: "Getting started, and growing",
      body: "We set Byte Suites up with you, move your data across and stay on hand as you scale.",
      steps: [
        { title: "Onboarding call", body: "A personal walkthrough to map your workflows and customize the suite." },
        { title: "Data migration", body: "Our team handles moving your existing customer data across from your current CRM." },
        { title: "Training", body: "Video tutorials and documentation so your team is productive from day one." },
        { title: "Ongoing support", body: "A help center, live support from real people and regular feature updates." },
        { title: "Grow into ERP", body: "When you need HR, finance, supply chain and operations, Byte Suites becomes the customer-facing hub of a custom ERP built for your industry." },
      ],
    },
    faqs: [
      { q: "What is Byte Suites?", a: "A business management platform that brings CRM, communication, billing and analytics together to streamline operations and improve collaboration." },
      { q: "Is it suitable for small businesses?", a: "Yes. Byte Suites scales with you, from small teams to multi-department organizations." },
      { q: "Does it integrate with other tools?", a: "Byte Suites is API-first, with custom integrations for tools like Google Workspace and Microsoft Office and workflow automation across your stack." },
      { q: "What if I need more than a CRM?", a: "We build custom ERP solutions covering HR, finance, supply chain and operations, with Byte Suites as the customer-facing hub." },
    ],
    cta: {
      heading: "Ready to transform your customer relationships",
      body: "Book a free Byte Suites consultation, or talk to us about a custom ERP.",
    },
  },
  "bytesgov": {
    slug: "bytesgov",
    meta: {
      title: "Construction Management Software for Contractors | BytesGov",
      description:
        "BytesGov is construction management software for contractors: job costing, estimating, subcontractor scheduling and billing. Request a walkthrough today.",
    },
    hero: {
      title: ["BytesGov"],
      intro:
        "From notice to award, in one place. SAM.gov and FPDS opportunities land every morning, scored for win probability, mapped to FAR and DFARS requirements and ready for a proposal, with every client's pipeline kept separate in a single workspace.",
    },
    statement: "Every outcome, won or lost, recalibrates the model. BytesGov learns where your firm actually wins, and makes the next bid start from evidence.",
    action: "Book a consultation",
    labels: { statement: "Why BytesGov", offer: "Features", highlights: "Who it's for", process: "How it works", faq: "FAQ" },
    offer: {
      heading: "Find, score, bid and perform",
      items: [
        {
          title: "Opportunity discovery",
          body: "Automated SAM.gov and FPDS ingestion across your NAICS codes, with new notices matched to each client and waiting in the dashboard every morning.",
          tags: ["SAM.gov & FPDS sync", "NAICS filters", "State & municipal bids", "Grants & civilian programs"],
        },
        {
          title: "Calibrated win probability",
          body: "An eight-factor score on every opportunity, recalibrated against each client's own history, with the breakdown shown and a bid or no-bid decision engine behind it.",
          tags: ["P(win) scoring", "Bid / no-bid engine", "Score breakdowns", "Backtesting"],
        },
        {
          title: "Contract analysis & compliance",
          body: "Upload a solicitation for AI clause extraction and a compliance matrix that stays current through every amendment, with gaps turned into bid guidance and penalty risk flagged.",
          tags: ["Sections L & M mapping", "FAR / DFARS clauses", "Gap analysis", "Document requirements"],
        },
        {
          title: "Proposal Studio",
          body: "Requirements become outlines, win themes and full draft PDFs in minutes, benchmarked against public award history before you submit, and always handed to a person for approval.",
          tags: ["AI outlines & drafts", "Pricing workspace", "Template library", "Human-approved"],
        },
        {
          title: "Set-aside, teaming & market intelligence",
          body: "Eligibility matching for SDVOSB, 8(a), HUBZone and WOSB, agency award rates, incumbent and competitor lookups from USAspending, and partner recommendations with evidence.",
          tags: ["Set-aside scanner", "Teaming board", "Prime contacts", "Agency buying profiles"],
        },
        {
          title: "Post-award performance",
          body: "Deliverables, modifications, options, timekeeping, indirect rates and receivables tracked after award, so performance data feeds the next bid.",
          tags: ["Contract administration", "Receivables & cash flow", "Timekeeping", "Audit readiness"],
        },
      ],
    },
    highlights: {
      heading: "Built for firms that win on behalf of others",
      body: "Nine opt-in agents, one audit trail, and every client's data kept apart.",
      items: [
        {
          title: "GovCon consulting firms",
          body: "Many clients, one workspace.",
          points: ["Per-client pipelines with no crossed data", "Branded client portals and PDF reports", "Role-based seats for your whole team"],
        },
        {
          title: "Small business contractors",
          body: "Enterprise-grade intelligence without the enterprise tier.",
          points: ["Opportunities matched to your NAICS and certifications", "Win probability you can defend", "Add only the modules you need"],
        },
        {
          title: "Proposal & capture teams",
          body: "From solicitation to submission, faster.",
          points: ["Compliance matrices in minutes", "AI-drafted outlines and full proposals", "Pricing checked against public award data"],
        },
        {
          title: "AI-first operators",
          body: "BytesGov where your team already works.",
          points: ["MCP servers for Claude, Cursor and other agents", "REST API for custom dashboards and CRMs", "Every tool call audited and tenant-scoped"],
        },
      ],
    },
    process: {
      heading: "From notice to award",
      body: "A loop that runs every morning, and gets sharper with every outcome.",
      steps: [
        { title: "Discover", body: "SAM.gov and FPDS notices land each morning, matched to each client's NAICS codes and set-aside eligibility." },
        { title: "Qualify", body: "An eight-factor win probability, calibrated to the client, and a bid or no-bid decision with the reasoning shown." },
        { title: "Comply", body: "Clause extraction and a FAR / DFARS compliance matrix that stays current through every amendment." },
        { title: "Propose", body: "Outlines, win themes and full drafts, priced against public award history and approved by a human before submission." },
        { title: "Perform", body: "Deliverables, modifications and receivables tracked after award, so the next bid starts from evidence." },
      ],
    },
    faqs: [
      { q: "What is BytesGov?", a: "A federal contracting intelligence platform for consulting firms and small businesses. It finds opportunities, scores win probability, builds compliance matrices, drafts proposals and tracks performance after award, all in one multi-tenant workspace." },
      { q: "Where does the data come from?", a: "SAM.gov, FPDS and USAspending are synced automatically, with FAR and DFARS clause libraries built in. State and municipal portals, grants and civilian programs can be added as modules." },
      { q: "Does it work with multiple clients?", a: "Yes. BytesGov is multi-tenant by design. Each client gets its own pipeline, portal and branded reports, with no data shared across clients." },
      { q: "Can I use it from Claude or other AI tools?", a: "Yes. The API & MCP Access module provides MCP servers for opportunity search, knowledge, proposals and core platform data, plus a REST API for custom integrations." },
      { q: "How is it priced?", a: "A base plan covers search, scoring and the decision engine. Feature modules are added individually from $29/mo, or unlocked together with All Access. Every plan starts with a fourteen-day free trial and every module enabled." },
    ],
    cta: {
      heading: "Ready to win more federal contracts",
      body: "Book a free BytesGov consultation and see your pipeline scored, mapped and ready to bid.",
    },
  },
  "bytesbilling": {
    slug: "bytesbilling",
    meta: {
      title: "E-Invoicing Software UAE: ERP-Ready, PINT AE Validated",
      description:
        "E-invoicing software UAE businesses can run inside their ERP: PINT AE validation before your ASP submits. See the e-invoicing solution for ERP in a demo.",
    },
    hero: {
      title: ["BytesBilling"],
      intro:
        "Compliant with the UAE e-invoicing mandate, without changing how you work. Create invoices in Bytes ERP or your existing accounting software, and BytesBilling validates every document, routes it through an accredited provider to Peppol and the FTA, tracks both states and archives the proof.",
    },
    statement: "A rejection after go-live costs money. A rejection before you send costs nothing. BytesBilling validates locally, blocks what would fail and keeps every compliance artefact the FTA could ask for.",
    action: "Book a consultation",
    labels: { statement: "Why BytesBilling", offer: "Features", highlights: "Who it's for", process: "How it works", faq: "FAQ" },
    offer: {
      heading: "Everything between your invoice and the FTA",
      items: [
        {
          title: "PINT AE compliance engine",
          body: "Every invoice and credit note is built as a PINT AE (UBL 2.1) document, schema-validated and checked against VAT business rules before it leaves. Failures are blocked locally with plain-English hints, never discovered at the ASP.",
          tags: ["UBL 2.1 / PINT AE", "XSD validation", "VAT rule checks", "TRN validation"],
        },
        {
          title: "Peppol & FTA delivery",
          body: "Documents are handed to an accredited service provider for Peppol exchange and the FTA Tax Data Document. Peppol state and FTA state are tracked independently, so a buyer-delivered invoice the FTA rejected is never shown as a success.",
          tags: ["Accredited ASP routing", "Two-state tracking", "Webhooks & polling", "Resubmit & credit notes"],
        },
        {
          title: "Rejection worklist",
          body: "Rejections grouped by error code with a hint for each, the master data to fix and one-click resubmission. Retries never duplicate at the provider thanks to idempotent submissions.",
        },
        {
          title: "Inbound supplier e-invoices",
          body: "Supplier bills arrive through the same hub, are 3-way matched against purchase orders and receipts, and post to accounts payable, with partial matches and exceptions flagged for review.",
          tags: ["Inbound receipt", "3-way match", "AP posting"],
        },
        {
          title: "Legal archive & retention",
          body: "Write-once archive of every XML and PDF with SHA-256 hashes, per-tenant retention clocks (5 years general, 7 for real estate), legal hold and a compliance audit log on every tenant.",
          tags: ["Write-once storage", "Legal hold", "Retention clock", "Audit log"],
        },
        {
          title: "Bytes ERP",
          body: "A multi-tenant ERP to run the business itself: double-entry ledger, VAT with mandatory categories, gapless numbering, customers and suppliers with TRN and Peppol endpoints, payments and cheques, with role-based access and MFA.",
          tags: ["Double-entry ledger", "Gapless numbering", "5% / 0% / exempt / reverse charge", "MFA & RBAC"],
        },
      ],
    },
    highlights: {
      heading: "Built for UAE SMEs",
      body: "One compliance hub shared by every client, with each tenant's data fully isolated.",
      items: [
        {
          title: "Real estate & property management",
          body: "Our first vertical, built in.",
          points: ["Properties, units, landlords and tenancy contracts", "Rent schedules, service charges and OA levies", "7-year retention handled by default"],
        },
        {
          title: "Businesses on Odoo, QuickBooks or Xero",
          body: "Keep your accounting software, add compliance.",
          points: ["BytesBilling works standalone over a simple HTTPS API", "Idempotent invoice submission with full timelines", "No XML to build on your side"],
        },
        {
          title: "Finance & accounts teams",
          body: "See compliance at a glance.",
          points: ["Dashboard KPIs as events arrive", "Rejections grouped and explained", "Signed links to archived XML and PDF"],
        },
        {
          title: "Growing SMEs",
          body: "Start with invoicing, grow into a full ERP.",
          points: ["Contracting, automotive and professional services verticals on the roadmap", "Supabase-hosted, UAE data residency documented", "Every tenant isolated with enforced row-level security"],
        },
      ],
    },
    process: {
      heading: "From invoice to FTA",
      body: "The same pipeline for every invoice, whichever system it starts in.",
      steps: [
        { title: "Create", body: "Raise the invoice in Bytes ERP or send it from your own ERP over HTTPS with an idempotency key." },
        { title: "Validate", body: "BytesBilling builds the PINT AE document and checks schema, VAT maths, TRN format and category rules. Anything that would be rejected is stopped here." },
        { title: "Transmit", body: "The document goes to an accredited service provider, which exchanges it on Peppol and reports the Tax Data Document to the FTA." },
        { title: "Track", body: "Peppol and FTA states update in real time through signed webhooks and polling. Rejections land in the worklist with hints." },
        { title: "Archive", body: "XML and PDF are stored write-once with hashes, retention clock and legal hold, available through short-lived signed links." },
      ],
    },
    faqs: [
      { q: "Is BytesBilling an Accredited Service Provider?", a: "No. BytesBilling is our compliance hub. It builds, validates, tracks and archives e-invoices, then hands them to an accredited service provider that handles Peppol exchange and FTA reporting." },
      { q: "Do I have to use Bytes ERP?", a: "No. BytesBilling works on its own with any ERP or accounting software that is not accredited, such as Odoo, QuickBooks or Xero, through a simple HTTPS API." },
      { q: "What formats and rules does it support?", a: "PINT AE (UBL 2.1) invoices and credit notes, including zero-rated, exempt, reverse-charge and foreign-currency cases, validated against the official UBL schema and UAE VAT rules before transmission." },
      { q: "How long are invoices kept?", a: "Retention follows Cabinet Decision 74/2023: five years by default, seven for real estate, with a legal hold that suspends expiry during a dispute or audit. Retention is set per tenant." },
      { q: "How do I get started?", a: "Book a free consultation. We'll review your invoicing flow, connect BytesBilling to your ERP or set you up on Bytes ERP, and run certification samples before go-live." },
    ],
    cta: {
      heading: "Ready for the UAE e-invoicing mandate",
      body: "Book a free BytesBilling consultation and see your first invoice validated, delivered and archived.",
    },
  },
  "bytesagentic": {
    slug: "bytesagentic",
    meta: {
      title: "AI Receptionist for Dental Offices | BytesAgentic",
      description:
        "BytesAgentic is an AI receptionist for dental offices: answers calls, books appointments and recovers missed patients. AI for dental practices. See a demo.",
    },
    hero: {
      title: ["BytesAgentic"],
      intro:
        "Keep every chair full, without adding to the front desk. An AI receptionist for dental practices that answers every call, finds the patient, books into open chair time at the right office, confirms by text and hands anything clinical to your team. Built for HIPAA from the first line of code.",
    },
    statement: "Calls ring while your desk is busy, at lunch and after hours. BytesAgentic answers in under a second, books into the same schedule and never says a word it isn't allowed to.",
    action: "Book a demo",
    labels: { statement: "Why BytesAgentic", offer: "Features", highlights: "What it never does", process: "How it works", faq: "FAQ" },
    offer: {
      heading: "A receptionist that books, and knows its limits",
      items: [
        {
          title: "Answers every call",
          body: "Picks up in under a second, 24/7, with your practice name and the recording notice your state requires. No hold music, no voicemail box nobody checks.",
          tags: ["24/7 answering", "< 1 s pickup", "State recording disclosure", "Overflow & after-hours rules"],
        },
        {
          title: "Books into open chair time",
          body: "Matches the patient by name and date of birth, offers up to three open slots with the right provider at the right office, and writes the appointment to your schedule. The slot is re-checked the instant it's booked, so two callers can never take the same chair.",
          tags: ["Patient matching", "Multi-office", "Provider-aware slots", "Double-booking guard"],
        },
        {
          title: "Confirms by text",
          body: "A confirmation carrying only date, time, provider and office, with SMS consent logged in the words the patient heard. Nothing about the reason for the visit ever goes by text.",
          tags: ["SMS confirmations", "Reminders", "Consent logging", "STOP handling"],
        },
        {
          title: "Hands over cleanly",
          body: "Warm transfer with a one-line summary during office hours, first emergency slot for a patient in pain, a booking queue your desk works within the hour, and voicemail turned into a task when a transfer isn't answered.",
          tags: ["Warm transfer", "Emergency visits", "Booking queue", "Voicemail to task"],
        },
        {
          title: "Audit log on every record",
          body: "Who accessed which record, when, why and the outcome, written as codes and a pseudonym rather than free text, so the log itself holds no PHI. Your dashboard shows it live.",
          tags: ["HIPAA audit log", "Signed BAA", "Signature-verified webhooks", "No PHI in logs"],
        },
        {
          title: "Works with your practice software",
          body: "Dentrix, Open Dental and Eaglesoft through NexHealth, or the built-in chair schedule to start before connecting anything. Daily summaries, weekly reports and missed-call alerts by email.",
          tags: ["Dentrix via NexHealth", "Open Dental & Eaglesoft", "Built-in schedule", "Email reports"],
        },
      ],
    },
    highlights: {
      heading: "It knows what it is not allowed to do",
      body: "The assistant handles scheduling only. Everything else goes to a person.",
      items: [
        {
          title: "No clinical advice",
          body: "Scheduling only, never medicine.",
          points: ["Pain, swelling, bleeding and medication questions go to your team", "Call summarised before the handover", "Emergency slot offered, never an answer"],
        },
        {
          title: "No money talk",
          body: "Plans accepted, and nothing more.",
          points: ["Never discusses balances or claims", "Never says what insurance will pay", "Billing questions transferred to the desk"],
        },
        {
          title: "No record reading",
          body: "Only the appointment being booked.",
          points: ["Never sees clinical notes or balances", "No match means no record is opened", "New patients set up instead of guessed"],
        },
        {
          title: "No arguing",
          body: "A person is always one ask away.",
          points: ["Transfers when a caller insists on a human", "Takes a message with a callback promise", "Never books a procedure it hasn't been told about"],
        },
      ],
    },
    process: {
      heading: "Live in under an hour",
      body: "A guided setup inside the product, then a test call before your number is forwarded.",
      steps: [
        { title: "Tell it about your practice", body: "Your offices and hours, your providers and what each one does, appointment types and lengths, the insurance you accept, and the words it uses when it answers." },
        { title: "Connect your schedule", body: "Link Dentrix, Open Dental or Eaglesoft through NexHealth, or start on the built-in chair schedule and connect later." },
        { title: "Make a test call", body: "Phone the assistant yourself, hear it answer as your practice and watch the booking land on the dashboard." },
        { title: "Forward your number", body: "You keep your number. Forward it always, after four rings, or outside office hours. Most practices start with overflow and after hours and widen it once they trust it." },
        { title: "Watch it work", body: "A dashboard with the day's chair schedule per office, every call and what happened on it, the confirmations it sent and the audit log an auditor would ask for." },
      ],
    },
    faqs: [
      { q: "Is it HIPAA compliant?", a: "It is built to be a business associate: a signed BAA is part of every plan, every access to a patient record is written to an audit log, the assistant handles scheduling only and refers anything clinical, and recordings live under the same controls as the rest of your data." },
      { q: "Does it replace my front desk?", a: "No. It answers the calls that ring while your desk is busy, at lunch or after hours, and books into the same schedule. Your team sees every booking with a note on what the caller said, and takes over any call that needs a person." },
      { q: "Will it answer insurance questions?", a: "It states which plans you accept and nothing more. Balances, claims and what a plan will pay are always handed to your team." },
      { q: "What does it cost?", a: "Plans start at $149/month for one office and 300 minutes, $349/month for three offices with practice software integration and 1,000 minutes, and from $799/month for groups with unlimited offices and 3,000 minutes. Overage is $0.25 per minute, with no setup fee and no contract longer than a month." },
      { q: "How do I get started?", a: "Book a demo. It takes twenty minutes, we configure the assistant with your offices, providers and hours, and you call it yourself. Cancel any time and we forward your number back the same day." },
    ],
    cta: {
      heading: "See it on your own schedule",
      body: "Book a twenty-minute BytesAgentic demo. We set it up with your offices, providers and hours, then you call it.",
    },
  },
};
