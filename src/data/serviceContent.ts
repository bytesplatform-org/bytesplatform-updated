import type { ServiceSlug } from "./services";
import { digitalServices } from "./serviceCatalog/digital";
import { dataAiServices } from "./serviceCatalog/dataAi";
import { cloudSecurityServices } from "./serviceCatalog/cloudSecurity";
import { businessProcessServices } from "./serviceCatalog/businessProcess";

/**
 * Service page copy, adapted from https://bytesplatform.com/services/*.
 * Typos are fixed, repeated sections merged, and unsourced or contradictory
 * stats from the old pages left out.
 */
export type ServiceContent = {
  slug: string;
  meta: { title: string; description: string };
  hero: { title: string[]; intro: string };
  statement: string;
  offer: { heading: string; body?: string; items: { title: string; body: string; tags?: string[] }[] };
  highlights?: { heading: string; body?: string; items: { title: string; body: string; points?: string[] }[] };
  process?: { heading: string; body?: string; steps: { title: string; body: string }[] };
  stack?: { label: string; items: string[] };
  faqs: { q: string; a: string }[];
  /** The heading is completed with a blue question mark. */
  cta: { heading: string; body: string };
  /** Label for the hero and closing buttons; defaults to "Start your project". */
  action?: string;
  /** Section labels for the indexed layout (dot, label, number above a hairline). */
  labels?: { statement: string; offer: string; highlights?: string; process?: string; faq: string };
};

export const serviceContent: Record<ServiceSlug, ServiceContent> = {
  "ai-automation": {
    slug: "ai-automation",
    meta: {
      title: "AI Automation Services & AI Agent Development Company",
      description:
        "AI automation services: custom AI agent development, workflow automation and document processing wired into your stack with guardrails. Book a call.",
    },
    hero: {
      title: ["AI automation", "& AI agents"],
      intro:
        "We design AI agents and automated workflows that handle the repetitive work across sales, support and operations, connected to the systems your team already uses.",
    },
    statement: "Most of a team's week goes to work a well-built agent could do. We build the agents, and the guardrails around them.",
    labels: { statement: "Why automate", offer: "Services", highlights: "How we build", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we automate",
      body: "From a single workflow to a team of agents, scoped around the outcomes you care about.",
      items: [
        {
          title: "Custom AI agents",
          body: "Agents that research, draft, triage and act, reading from your data and working through your tools, with a person in the loop where it matters.",
          tags: ["LLM agents", "Tool use", "Human-in-the-loop"],
        },
        {
          title: "Workflow automation",
          body: "Hand-offs between apps, inboxes and spreadsheets replaced with automated flows that run on triggers and schedules.",
          tags: ["n8n", "Make", "Zapier", "Custom APIs"],
        },
        {
          title: "Knowledge assistants",
          body: "Assistants grounded in your documents, policies and product data, so answers come from your sources rather than the open web.",
          tags: ["RAG", "Vector search", "Document AI"],
        },
        {
          title: "Document processing",
          body: "Invoices, forms, contracts and emails read, classified and turned into structured data your systems can use.",
          tags: ["OCR", "Extraction", "Classification"],
        },
      ],
    },
    highlights: {
      heading: "Built to be trusted in production",
      body: "An agent is only useful if your team can rely on it, see what it did and step in when needed.",
      items: [
        {
          title: "Connected to your stack",
          body: "Agents work inside the tools you already run rather than beside them.",
          points: ["CRM, ERP & helpdesk integrations", "Email, chat & calendar actions", "Databases & internal APIs", "Webhooks & scheduled jobs"],
        },
        {
          title: "Guardrails & oversight",
          body: "Clear limits on what an agent can do on its own, and a record of everything it did.",
          points: ["Approval steps for sensitive actions", "Role-based access to data", "Full activity logs", "Fallback to a person"],
        },
        {
          title: "Measured and improved",
          body: "Every automation ships with the numbers that show whether it is working.",
          points: ["Evaluation sets for accuracy", "Time & cost tracking", "Prompt and model tuning", "Ongoing monitoring"],
        },
      ],
    },
    process: {
      heading: "From idea to running agent",
      steps: [
        { title: "Process mapping", body: "We sit with your team, map the work as it really happens and pick the tasks where automation pays off first." },
        { title: "Prototype", body: "A working agent on real examples, so you can judge the output before anything is wired into production." },
        { title: "Integration", body: "Connections to your systems, permissions, approval steps and logging, built and tested end to end." },
        { title: "Launch & tuning", body: "A controlled rollout, then ongoing evaluation and improvements as the agent meets real cases." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["Claude", "OpenAI", "LangChain", "LlamaIndex", "Python", "Node.js", "n8n", "Pinecone", "PostgreSQL", "AWS"],
    },
    faqs: [
      { q: "What is the difference between automation and an AI agent?", a: "Automation follows fixed rules. When this happens, do that. An AI agent can read unstructured input, decide which steps to take and use tools to complete them. Most projects combine both." },
      { q: "Will AI agents replace my team?", a: "Agents take over repetitive, rules-heavy work so your team can spend time on the decisions and relationships that need people. Sensitive actions can always require human approval." },
      { q: "Is my data safe?", a: "We design around your data policies. Access is limited to what each agent needs, activity is logged, and we can deploy with providers and regions that meet your compliance requirements." },
      { q: "How long does an AI automation project take?", a: "A focused workflow can be prototyped in a few weeks. Larger multi-agent systems are delivered in phases, with each phase in use before the next begins." },
    ],
    cta: {
      heading: "Ready to put AI to work",
      body: "Tell us where your team loses the most time, and we'll show you what an agent could take off its plate.",
    },
  },

  "saas-product-development": {
    slug: "saas-product-development",
    meta: {
      title: "SaaS Development Services | MVP to Scale | BytesPlatform",
      description:
        "SaaS development services from a US SaaS development company: MVP builds, multi-tenant platforms, billing and product modernization. Start your build.",
    },
    hero: {
      title: ["Custom SaaS", "& products"],
      intro:
        "We take software products from idea to paying customers, covering strategy, design, engineering and launch, with one team that stays with the product as it grows.",
    },
    statement: "A good product is more than working code. It's the right features, shipped in the right order, on a foundation that scales.",
    labels: { statement: "Our approach", offer: "Services", highlights: "Foundations", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we build",
      body: "New products, and the next version of products that have outgrown their first build.",
      items: [
        {
          title: "Product discovery",
          body: "Market, user and competitor research turned into a focused scope, a roadmap and a clear first release.",
          tags: ["Workshops", "User research", "Roadmapping"],
        },
        {
          title: "MVP development",
          body: "A launchable first version built around the features that prove the idea, without shortcuts you'll pay for later.",
          tags: ["Rapid prototyping", "Agile sprints"],
        },
        {
          title: "SaaS platforms",
          body: "Multi-tenant web applications with accounts, roles, subscriptions, admin tools and the integrations customers expect.",
          tags: ["Multi-tenancy", "Billing", "Admin panels"],
        },
        {
          title: "Product modernization",
          body: "Legacy software rebuilt or refactored onto a modern stack, migrated without disrupting the customers who depend on it.",
          tags: ["Refactoring", "Cloud migration", "API-first"],
        },
      ],
    },
    highlights: {
      heading: "The parts every product needs",
      body: "We build the unglamorous foundations properly, so your team can focus on what makes the product different.",
      items: [
        {
          title: "Accounts & access",
          body: "Sign-up, sign-in and permissions done right from day one.",
          points: ["SSO & social login", "Teams, roles & permissions", "Audit trails", "Secure session handling"],
        },
        {
          title: "Subscriptions & billing",
          body: "Plans, trials and payments that just work.",
          points: ["Stripe & payment gateways", "Usage-based pricing", "Invoices & receipts", "Upgrade & cancellation flows"],
        },
        {
          title: "Scale & reliability",
          body: "Architecture that grows with your customer base.",
          points: ["Cloud infrastructure", "CI/CD pipelines", "Monitoring & alerts", "Automated backups"],
        },
      ],
    },
    process: {
      heading: "How a product comes together",
      steps: [
        { title: "Discovery", body: "We define the problem, the users and the smallest release that delivers real value." },
        { title: "Design", body: "User flows, interface design and clickable prototypes, tested with real users before development." },
        { title: "Build", body: "Two-week sprints with working software at the end of each, reviewed with you as it takes shape." },
        { title: "Launch", body: "Production infrastructure, analytics and a release plan for your first customers." },
        { title: "Grow", body: "Feature iterations, performance work and support, guided by how customers actually use the product." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["Next.js", "React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Stripe", "AWS", "Docker", "Vercel"],
    },
    faqs: [
      { q: "Do I need a full specification before we start?", a: "No. Many products start with an idea and a rough scope. Our discovery phase turns that into a prioritized plan and a clear first release." },
      { q: "How long does it take to build an MVP?", a: "It depends on scope, but a focused MVP is typically delivered in a few months. We agree on the timeline after discovery." },
      { q: "Who owns the code?", a: "You do. Source code, designs and infrastructure belong to you, and we document everything so your own team can take over if you choose." },
      { q: "Can you continue developing a product someone else built?", a: "Yes. We start with a code and architecture review, then stabilize what's there before adding new features." },
    ],
    cta: {
      heading: "Ready to build your product",
      body: "Bring us the idea. We'll help shape it, build it and get it into the hands of customers.",
    },
  },

  "web-mobile-app-development": {
    slug: "web-mobile-app-development",
    meta: {
      title: "Custom Web Application Development | Web & Mobile Apps",
      description:
        "Custom web application development plus cross-platform app development, PWAs and APIs from one US team with a shared backend. Scope your app today.",
    },
    hero: {
      title: ["Web & mobile", "apps"],
      intro:
        "Web applications and mobile apps that share one design language and one backend, built to feel fast and natural on every screen.",
    },
    statement: "Your customers move between laptop and phone all day. Your product should move with them.",
    labels: { statement: "Our approach", offer: "Services", highlights: "Why one team", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we build",
      body: "Customer-facing apps, internal tools and everything that connects them.",
      items: [
        {
          title: "Web applications",
          body: "Fast, responsive web apps and portals built with modern frameworks, accessible and SEO-ready.",
          tags: ["React", "Next.js", "TypeScript"],
        },
        {
          title: "Native mobile apps",
          body: "iOS and Android apps built natively when performance and deep device features matter most.",
          tags: ["Swift", "Kotlin"],
        },
        {
          title: "Cross-platform apps",
          body: "One codebase for iOS and Android with React Native or Flutter, without giving up a native feel.",
          tags: ["React Native", "Flutter"],
        },
        {
          title: "Progressive web apps",
          body: "Installable, offline-capable web apps for products that need app-like reach without the app stores.",
          tags: ["PWA", "Offline-first"],
        },
        {
          title: "APIs & backends",
          body: "Secure, scalable backends and APIs that power your web and mobile apps from one source of truth.",
          tags: ["Node.js", "REST", "GraphQL"],
        },
        {
          title: "UI/UX design",
          body: "Research, wireframes, prototypes and design systems that keep every platform consistent.",
          tags: ["Figma", "Design systems"],
        },
      ],
    },
    highlights: {
      heading: "One team across every platform",
      body: "Web and mobile built together, so features land everywhere at once and behave the same way.",
      items: [
        { title: "Shared design system", body: "One set of components and patterns, adapted to each platform's conventions." },
        { title: "Shared backend", body: "One API serving web and mobile, so data, accounts and permissions stay in sync." },
        { title: "Launch & support", body: "App store submission, web deployment, monitoring and ongoing updates after release." },
      ],
    },
    process: {
      heading: "How a project runs",
      steps: [
        { title: "Discovery", body: "Goals, users and platforms defined, with a scope and timeline you can plan around." },
        { title: "Design", body: "User flows and high-fidelity prototypes for web and mobile, validated before development." },
        { title: "Development", body: "Agile sprints with regular demos on real devices and browsers." },
        { title: "Testing", body: "Functional, performance and security testing across devices, browsers and screen sizes." },
        { title: "Launch & care", body: "Store releases, production deployment and continuing maintenance and improvements." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["React", "Next.js", "React Native", "Flutter", "Swift", "Kotlin", "Node.js", "Firebase", "PostgreSQL", "AWS"],
    },
    faqs: [
      { q: "Should I build a web app, a mobile app or both?", a: "It depends on your users and how they'll use the product. Many projects start with one platform and add the other. We'll recommend the order that gets you to value fastest." },
      { q: "Native or cross-platform?", a: "Cross-platform suits most business apps and saves time and cost. Native is worth it for heavy graphics, complex device features or the very best performance." },
      { q: "Do you publish apps to the App Store and Google Play?", a: "Yes. We handle store listings, submission and review, and ship updates after launch." },
      { q: "Will you maintain the app after launch?", a: "Yes. We offer ongoing maintenance covering OS updates, security patches, bug fixes and new features." },
    ],
    cta: {
      heading: "Ready to build your app",
      body: "Tell us what you want to launch, and we'll plan the right platforms and the fastest path there.",
    },
  },

  "crm-erp-systems": {
    slug: "crm-erp-systems",
    meta: {
      title: "Custom CRM Development & ERP Implementation Services",
      description:
        "Custom CRM development and ERP implementation services: bespoke builds, Salesforce, Odoo and Dynamics customization, and migration. Plan your rollout.",
    },
    hero: {
      title: ["CRM & ERP", "systems"],
      intro:
        "We build and integrate CRM and ERP systems that fit the way your business runs, so customers, sales, finance and operations share one source of truth.",
    },
    statement: "When every department keeps its own spreadsheet, nobody sees the whole business. We connect the pieces.",
    labels: { statement: "Why it matters", offer: "Services", highlights: "Modules", process: "Implementation", faq: "FAQ" },
    offer: {
      heading: "What we deliver",
      body: "Custom builds, customizations of established platforms, or a mix of both.",
      items: [
        {
          title: "Custom CRM",
          body: "Lead, deal and customer management shaped around your sales process, with pipelines, automation and reporting.",
          tags: ["Pipelines", "Automation", "Dashboards"],
        },
        {
          title: "Custom ERP",
          body: "Finance, inventory, procurement and operations modules built around how your business actually works.",
          tags: ["Finance", "Inventory", "Procurement"],
        },
        {
          title: "Platform customization",
          body: "Configuration, custom modules and extensions for established platforms when an off-the-shelf base is the better fit.",
          tags: ["Odoo", "Salesforce", "HubSpot", "Zoho"],
        },
        {
          title: "Migration & integration",
          body: "Data moved out of legacy tools and spreadsheets, and your CRM and ERP connected to the rest of your stack.",
          tags: ["Data migration", "APIs", "Sync"],
        },
      ],
    },
    highlights: {
      heading: "Everything in one place",
      body: "Modules chosen for your business, not a catalogue of features you'll never use.",
      items: [
        {
          title: "Sales & customers",
          body: "The full customer journey, from first contact to repeat order.",
          points: ["Lead capture & scoring", "Deal pipelines", "Quotes & proposals", "Customer history"],
        },
        {
          title: "Finance & operations",
          body: "The numbers and processes that keep the business running.",
          points: ["Invoicing & accounting", "Inventory & warehouses", "Purchasing & suppliers", "HR & payroll"],
        },
        {
          title: "Insight & control",
          body: "A clear view of the business, with access set by role.",
          points: ["Real-time dashboards", "Custom reports", "Roles & approvals", "Audit trails"],
        },
      ],
    },
    process: {
      heading: "How we implement",
      steps: [
        { title: "Process review", body: "We map how sales, finance and operations work today and where information gets lost between them." },
        { title: "Solution design", body: "The right mix of custom modules and existing platforms, with a phased rollout plan." },
        { title: "Build & configure", body: "Modules, workflows, permissions and integrations, built in phases with your team reviewing each one." },
        { title: "Data migration", body: "Customers, products, balances and history cleaned and moved across, then verified." },
        { title: "Training & support", body: "Hands-on training for every team, followed by ongoing support and improvements." },
      ],
    },
    faqs: [
      { q: "Should we build a custom system or customize an existing one?", a: "It depends on how standard your processes are. Established platforms are faster when they fit; custom builds win when your workflow is what sets you apart. We'll recommend the right mix after reviewing your processes." },
      { q: "Can you migrate data from our current tools?", a: "Yes. We migrate from spreadsheets, legacy systems and other platforms, cleaning and validating the data along the way." },
      { q: "Will it integrate with our other software?", a: "Yes. We connect CRM and ERP systems to accounting, e-commerce, email, payment and e-invoicing tools through their APIs." },
      { q: "Do you provide training?", a: "Yes. Every rollout includes training for each team and documentation they can come back to." },
    ],
    cta: {
      heading: "Ready to run your business from one place",
      body: "Let's look at how your teams work today and design the system that connects them.",
    },
  },

  "government-proposal-technology": {
    slug: "government-proposal-technology",
    meta: {
      title: "Government Proposal Software | AI Capture & Bid Tools",
      description:
        "Government proposal software and capture management software for contractors: SAM.gov monitoring, bid/no-bid scoring and AI drafting. Request a demo.",
    },
    hero: {
      title: ["Government", "proposal tech"],
      intro:
        "Technology that helps contractors find the right government opportunities sooner and respond with stronger, compliant proposals in less time.",
    },
    statement: "Winning public contracts starts long before the proposal. It starts with seeing the right opportunity in time to bid on it.",
    labels: { statement: "Why it matters", offer: "Services", highlights: "Capabilities", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we build",
      body: "Tools for every stage of the bid, from first notice to final submission.",
      items: [
        {
          title: "Opportunity discovery",
          body: "Monitoring of procurement portals and tender sources, filtered to the opportunities that match your capabilities.",
          tags: ["Portal monitoring", "Smart filters", "Alerts"],
        },
        {
          title: "Bid / no-bid analysis",
          body: "Scoring that weighs fit, requirements and past performance, so your team spends effort on the bids it can win.",
          tags: ["Scoring", "Qualification"],
        },
        {
          title: "AI proposal assistance",
          body: "Solicitations broken down into requirements and compliance matrices, with first drafts built from your past proposals.",
          tags: ["Requirement extraction", "Drafting", "Content library"],
        },
        {
          title: "Pipeline management",
          body: "Every opportunity, deadline, owner and document tracked in one place, from capture to award.",
          tags: ["Deadlines", "Collaboration", "Reporting"],
        },
      ],
    },
    highlights: {
      heading: "Respond faster, with fewer misses",
      items: [
        {
          title: "Compliance first",
          body: "Requirements are pulled out of the solicitation and tracked through the response.",
          points: ["Compliance matrices", "Section & format checks", "Required forms checklist", "Amendment tracking"],
        },
        {
          title: "Reusable knowledge",
          body: "Your best past content, ready to adapt rather than rewrite.",
          points: ["Searchable content library", "Past performance records", "Team résumés & capabilities", "Pricing templates"],
        },
        {
          title: "Team workflow",
          body: "Writers, reviewers and approvers working from the same plan.",
          points: ["Assignments & due dates", "Review stages", "Version history", "Submission readiness"],
        },
      ],
    },
    process: {
      heading: "How we work with you",
      steps: [
        { title: "Discovery", body: "We learn your markets, contract types, sources and how your bid team works today." },
        { title: "Configuration", body: "Sources, filters, scoring and templates set up around your capabilities and history." },
        { title: "Integration", body: "Connections to your CRM, document storage and collaboration tools." },
        { title: "Rollout & support", body: "Training for your capture and proposal teams, with refinements as bids go out." },
      ],
    },
    faqs: [
      { q: "Who is this for?", a: "Businesses that bid on government and public-sector contracts, from small firms making their first bids to established contractors managing a full pipeline." },
      { q: "Does AI write the proposal for us?", a: "AI produces structured first drafts and compliance checks from the solicitation and your past content. Your team stays in control of strategy, pricing and the final submission." },
      { q: "Which opportunity sources can you monitor?", a: "We configure monitoring around the procurement portals and sources relevant to your markets. Tell us where you bid today and we'll cover those first." },
      { q: "Is our proposal content kept private?", a: "Yes. Your content library and drafts stay in your environment, with access limited to your team." },
    ],
    cta: {
      heading: "Ready to win more public contracts",
      body: "Let's look at where your bid process loses time and build the tools to get it back.",
    },
  },

  "e-invoicing-integration": {
    slug: "e-invoicing-integration",
    meta: {
      title: "E-Invoicing ERP Integration Services | Connect Any ERP",
      description:
        "E-invoicing ERP integration for SAP, Dynamics, NetSuite, Odoo and QuickBooks: Peppol integration, data clean-up and validated invoices. Book an assessment.",
    },
    hero: {
      title: ["E-invoicing &", "integration"],
      intro:
        "We connect your ERP, accounting and sales systems to e-invoicing networks and to each other, so invoices go out compliant and data flows without re-keying.",
    },
    statement: "An e-invoicing mandate is only as smooth as the data your systems send. We fix the data and the connections behind it.",
    labels: { statement: "Why it matters", offer: "Services", highlights: "What changes", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we deliver",
      body: "Compliance-ready invoicing, and the integrations that keep every system in step.",
      items: [
        {
          title: "E-invoicing readiness",
          body: "Gap assessments against your country's e-invoicing requirements, with a clear plan to close them before your deadline.",
          tags: ["Assessment", "Compliance roadmap"],
        },
        {
          title: "ERP to e-invoicing",
          body: "Your ERP or accounting system connected to your accredited service provider, with invoice data mapped and validated.",
          tags: ["Peppol", "Service providers", "Validation"],
        },
        {
          title: "Master data clean-up",
          body: "Customer, item and tax-code data fixed at the source, so invoices aren't rejected after go-live.",
          tags: ["Tax IDs", "Tax codes", "Data quality"],
        },
        {
          title: "System integration",
          body: "ERP, CRM, e-commerce, payment and banking systems connected so orders, invoices and payments sync automatically.",
          tags: ["APIs", "Middleware", "Automation"],
        },
      ],
    },
    highlights: {
      heading: "Fewer rejections, less manual work",
      items: [
        { title: "Keep your ERP", body: "We work with the systems you already run instead of asking you to replace them." },
        { title: "Validated before sending", body: "Invoices are checked against the required format before they reach your service provider." },
        { title: "One flow of data", body: "Orders, invoices and payments move between systems without re-keying or spreadsheets." },
      ],
    },
    process: {
      heading: "How we get you live",
      steps: [
        { title: "Assessment", body: "We review your systems, invoice volumes and data against the requirements that apply to you." },
        { title: "Data clean-up", body: "Master data corrected at the source, ahead of any deadline." },
        { title: "Integration", body: "Mappings and connections built between your ERP, your service provider and your other systems." },
        { title: "Testing", body: "Test invoices validated end to end before go-live." },
        { title: "Go-live & support", body: "Monitoring, rejection handling and support as volumes ramp up." },
      ],
    },
    faqs: [
      { q: "Do we need to replace our ERP for e-invoicing?", a: "Usually not. We integrate your existing ERP or accounting system with an accredited service provider and fix the data it sends." },
      { q: "Are you a service provider (ASP)?", a: "No. We work alongside whichever accredited provider you choose, handling the ERP side, including data, mapping and integration." },
      { q: "We're in the UAE. Can you help with the mandate?", a: "Yes. See our UAE e-invoicing page for the phases, deadlines and how we prepare your systems in time." },
      { q: "Which systems can you integrate?", a: "Most ERP, accounting, CRM, e-commerce and payment platforms with an API or data export. We'll confirm the approach after reviewing your setup." },
    ],
    cta: {
      heading: "Ready to get your invoicing compliant",
      body: "Let's review your systems and data, and plan the shortest path to go-live.",
    },
  },

  web: {
    slug: "web",
    meta: {
      title: "Web Development Company | Custom Web Development Services",
      description:
        "Web development services from a US web development company: fast, SEO-ready websites, custom web apps and Shopify stores. Get a free quote today.",
    },
    hero: {
      title: ["Web", "development"],
      intro:
        "Professional web development tailored to the unique needs of each client, combining creativity with modern technology to build custom solutions that drive business growth.",
    },
    statement: "Fast, responsive websites and web applications, engineered from the first wireframe to the last deploy.",
    labels: { statement: "Our approach", offer: "Services", highlights: "Platforms", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we build",
      body: "A full spectrum of web development, from interfaces your customers touch to the systems behind them.",
      items: [
        {
          title: "Frontend development",
          body: "Modern frameworks like React, Vue.js and Angular for responsive, user-friendly interfaces.",
          tags: ["React", "Vue.js", "Angular", "TypeScript"],
        },
        {
          title: "Backend development",
          body: "Scalable server-side solutions with robust APIs, databases and cloud integration.",
          tags: ["Node.js", "Python", "PHP", "MongoDB"],
        },
        {
          title: "Mobile-first design",
          body: "Responsive web applications that work flawlessly across every device and screen size.",
          tags: ["PWA", "Responsive", "Mobile UI"],
        },
        {
          title: "Full-stack solutions",
          body: "End-to-end development from concept to deployment, with modern DevOps practices.",
          tags: ["MERN", "MEAN", "JAMstack", "Serverless"],
        },
      ],
    },
    highlights: {
      heading: "CMS and e-commerce, done properly",
      body: "From content-driven websites to thriving online stores, built to grow with your business.",
      items: [
        {
          title: "Shopify stores",
          body: "High-conversion storefronts with custom apps, payment gateways and ERP integrations.",
          points: ["Custom Liquid templates & sections", "App & payment-gateway integrations", "Optimized checkout flows", "Analytics & sales automation"],
        },
        {
          title: "WordPress sites",
          body: "Custom themes, plugins and scalable WordPress builds optimized for performance and SEO.",
          points: ["Pixel-perfect custom themes", "WooCommerce storefronts", "Headless WordPress", "On-page SEO & performance tuning"],
        },
        {
          title: "MERN applications",
          body: "Full-stack JavaScript applications built with MongoDB, Express, React and Node.js.",
          points: ["REST & GraphQL APIs", "Scalable microservices", "Real-time features with WebSockets", "Cloud deployment & CI/CD"],
        },
        {
          title: "Website add-ons",
          body: "Integrations and features tailored to your workflow, added to new or existing sites.",
          points: ["CRM integration", "Chatbots & admin panels", "Sales analytics & tracking", "Payment gateways & newsletters"],
        },
      ],
    },
    process: {
      heading: "How a project runs",
      body: "A proven methodology that keeps quality, transparency and delivery dates in view the whole way through.",
      steps: [
        { title: "Discovery & planning", body: "Stakeholder workshops, competitive analysis and a technical feasibility study become a detailed project roadmap." },
        { title: "Design & prototyping", body: "User flows, high-fidelity mock-ups and interactive prototypes, validated before a line of production code." },
        { title: "Development", body: "Clean, maintainable code shipped in agile sprints, with code reviews and continuous integration." },
        { title: "Testing & QA", body: "Unit and integration tests, performance benchmarking and security audits." },
        { title: "Deployment & launch", body: "Automated CI/CD pipelines, cloud environment setup and zero-downtime rollouts." },
        { title: "Maintenance & support", body: "Monitoring, regular updates and feature iterations based on real user feedback." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["React", "Next.js", "JavaScript", "Node.js", "Laravel", "WordPress", "Shopify", "Webflow", "Tailwind CSS"],
    },
    faqs: [
      { q: "Why is web development important for my business?", a: "A professional, responsive and user-friendly website is how most customers first meet your business. It drives engagement and online visibility." },
      { q: "How long does it take to build a website?", a: "It depends on the complexity and features involved. A standard website can be ready quickly, while larger custom projects take longer. We give you a clear timeline after discovery." },
      { q: "What types of websites can you create?", a: "Business sites, e-commerce stores, blogs, portfolios and more, on WordPress, Shopify, or fully custom full-stack builds, depending on your requirements." },
      { q: "Will my website be mobile-friendly?", a: "Absolutely. Every website we build is responsive and works smoothly across smartphones, tablets and desktops." },
    ],
    cta: {
      heading: "Ready to transform your digital presence",
      body: "We don't just build websites; we build professional websites that help your business thrive.",
    },
  },

  seo: {
    slug: "seo",
    meta: {
      title: "SEO Services | Technical, Content & AI SEO Agency",
      description:
        "SEO services that grow organic traffic: technical SEO, content, link building and AI search optimization with weekly reporting. Request a free SEO audit.",
    },
    hero: {
      title: ["Search engine", "optimization"],
      intro:
        "If you're not ranking, you're bleeding revenue. We don't just improve your rankings, we drive targeted organic traffic that converts into real business growth.",
    },
    statement: "Every day, customers search for what you offer. If you're not on page one, those clicks go to your competitors.",
    labels: { statement: "Why SEO", offer: "Services", highlights: "Reporting & management", faq: "FAQ" },
    offer: {
      heading: "Rank for what matters",
      body: "Search strategies built to lift your rankings and keep them growing.",
      items: [
        { title: "Keyword strategy", body: "Industry-specific research that finds the terms with real buying intent, competitor and SERP analysis, long-tail opportunities and intent mapping." },
        { title: "Technical SEO", body: "Full site audits that clear crawl errors, improve Core Web Vitals, fix mobile issues and add structured data for faster, healthier pages." },
        { title: "On-page & off-page", body: "Content aligned with search intent, conversion-focused meta titles and descriptions, and authority-building backlinks." },
        { title: "Local SEO", body: "Google Business Profile optimization, local keywords, citations and reviews, so you own searches in your city or region." },
      ],
    },
    highlights: {
      heading: "Ongoing, measured, reported",
      items: [
        {
          title: "Weekly reporting",
          body: "Real growth metrics, not vanity numbers.",
          points: ["Keyword ranking tracking", "Organic traffic growth", "Conversion rate & ROI", "Competitive monitoring"],
        },
        {
          title: "SEO-optimized content",
          body: "Content that ranks and converts.",
          points: ["Strategy aligned with search intent", "Blog & product page optimization", "Answer-focused content", "Conversion-focused copywriting"],
        },
        {
          title: "Ongoing management",
          body: "Content support and backlink building, month after month.",
          points: ["Continuous strategy optimization", "Regular content updates", "Algorithm change adaptation", "Long-term ranking focus"],
        },
      ],
    },
    faqs: [
      { q: "How long will it take to see results from SEO?", a: "SEO is a long-term strategy. Significant improvements typically take 3–6 months, though early results can appear within a few weeks, and weekly reports show you the progress as it happens." },
      { q: "Do I need to do anything to my website for SEO?", a: "We audit your site and optimize content, keywords and structure. You may need to approve some updates, but we handle the technical work." },
      { q: "Do you offer local SEO services?", a: "Yes. Local SEO helps your business rank in nearby searches and attract customers in your area." },
      { q: "Will SEO work for any type of business?", a: "SEO benefits businesses of every size and industry, from local stores to e-commerce platforms and service providers." },
    ],
    cta: {
      heading: "Ready to let search bring you business",
      body: "With SEO done right, your ideal clients find you every hour of every day. Start with a free SEO audit.",
    },
  },

  app: {
    slug: "app",
    meta: {
      title: "Mobile App Development Company | iOS & Android App Services",
      description:
        "Mobile app development services for iOS and Android from a US mobile app development company: UX, build, launch and support. Start your app project today.",
    },
    hero: {
      title: ["Mobile", "apps"],
      intro:
        "We turn your ideas into powerful mobile experiences, intuitive, user-friendly applications tailored to your business needs.",
    },
    statement: "Your app isn't just a tool. It's a direct line to your customers and an extension of your brand.",
    labels: { statement: "Why mobile", offer: "Services", highlights: "Why us", process: "Features", faq: "FAQ" },
    offer: {
      heading: "Development services",
      items: [
        { title: "Native iOS", body: "Swift and SwiftUI apps optimized for Apple's ecosystem, with Face ID, Apple Pay, CloudKit sync and ARKit where it matters.", tags: ["Swift", "SwiftUI", "CloudKit", "TestFlight"] },
        { title: "Native Android", body: "Kotlin and Java apps that use the full Android platform, with Material Design and Google Play Services.", tags: ["Kotlin", "Java", "Material Design", "Firebase"] },
        { title: "Cross-platform", body: "React Native and Flutter apps that share one codebase across iOS and Android without giving up native feel.", tags: ["React Native", "Flutter"] },
        { title: "UI/UX design", body: "User research, wireframes, Figma prototypes and design systems for intuitive, accessible interfaces." },
        { title: "Backend integration", body: "REST and GraphQL APIs, real-time sync, secure authentication and third-party services on a scalable architecture." },
        { title: "App store deployment", body: "Store optimization, listings, submission to the App Store and Google Play, analytics and post-launch updates." },
      ],
    },
    highlights: {
      heading: "End-to-end ownership",
      body: "One team from the first prototype to version two.",
      items: [
        { title: "Pixel-perfect prototypes", body: "High-fidelity Figma prototypes that show the real experience before development starts." },
        { title: "Frontend to cloud", body: "We handle every layer of your app, interface, backend and cloud services." },
        { title: "Post-launch support", body: "Ongoing maintenance, security patches and version management to keep your app current." },
      ],
    },
    process: {
      heading: "Features users come back for",
      steps: [
        { title: "Seamless onboarding", body: "Guided setup, progressive disclosure and interactive tutorials that get users started fast." },
        { title: "Powerful dashboards", body: "Real-time analytics and customizable widgets with mobile-optimized charts." },
        { title: "Smart messaging", body: "Real-time chat, push notifications and media sharing that keep users engaged." },
        { title: "User profiles", body: "Profile customization, privacy controls and social integration." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["React Native", "Flutter", "Swift", "SwiftUI", "Kotlin", "Node.js", "Firebase", "MongoDB", "AWS", "Azure"],
    },
    faqs: [
      { q: "What types of apps do you develop?", a: "Custom mobile applications for Android and iOS, including business apps, e-commerce apps and social apps." },
      { q: "How long does it take to develop an app?", a: "Anywhere from a few weeks to several months, depending on features, design and the platforms involved." },
      { q: "How do you ensure my app is secure?", a: "We follow security best practices, including data encryption, secure login and regular vulnerability testing." },
      { q: "Do you offer app maintenance and updates?", a: "Yes. We provide ongoing maintenance with new features, security patches and performance improvements." },
    ],
    cta: {
      heading: "Ready to elevate your mobile presence",
      body: "We craft custom mobile apps tailored to your business. Book a free app consultation and bring your vision to life.",
    },
  },

  marketing: {
    slug: "marketing",
    meta: {
      title: "Digital Marketing Services | Social, PPC & Content Agency",
      description:
        "Digital marketing services: social media marketing, PPC management and full-funnel tracking from a Texas-based agency serving the US. Grow your reach now.",
    },
    hero: {
      title: ["Digital", "marketing"],
      intro:
        "Social media and paid campaigns designed to help businesses grow, creative that connects, backed by strategy that drives results.",
    },
    statement: "Great marketing is more than attractive posts. It's a connection with your audience and a brand they remember.",
    labels: { statement: "Our approach", offer: "Social media", highlights: "Paid advertising", faq: "FAQ" },
    offer: {
      heading: "Social media marketing",
      body: "Highly engaging content that resonates with your audience, planned by people who know your industry.",
      items: [
        { title: "Custom posts & reels", body: "Tailored posts, stories and high-conversion short-form video, made in platform-native formats for every algorithm.", tags: ["Platform-native formats", "Motion graphics", "Caption frameworks"] },
        { title: "Strategic planning", body: "Senior strategists map every campaign to audience insights and market trends, with roadmaps that evolve alongside your business.", tags: ["Social audits", "Content calendars", "Real-time reporting"] },
        { title: "Multi-platform growth", body: "Campaigns that reach the right audience across Facebook, Instagram, Google and LinkedIn, and scale as you do." },
      ],
    },
    highlights: {
      heading: "Pay-per-click advertising",
      body: "Smart, scalable campaigns on Google, Bing, LinkedIn and YouTube, built for measurable ROI.",
      items: [
        { title: "Smart targeting", body: "Your ads reach the right audience, with engaging creative designed to convert." },
        { title: "Professional management", body: "A certified Google & Microsoft Ads team fine-tunes bids, keywords and ad copy in real time." },
        { title: "Full-funnel tracking", body: "GA4, Google Tag Manager and pixel tracking, so every marketing dollar is accounted for." },
      ],
    },
    faqs: [
      { q: "What types of marketing services do you offer?", a: "Social media marketing, pay-per-click advertising, content and email campaigns, all aimed at growing your brand's online presence." },
      { q: "How do you track the success of marketing campaigns?", a: "We track website traffic, conversions, social engagement and other metrics with analytics tools to measure what's working." },
      { q: "How do you create a marketing strategy for my business?", a: "We start with your business goals, target audience and competitors, then build a marketing plan that fits your needs." },
      { q: "How long will it take to see results?", a: "Paid campaigns can show results within a few weeks; organic growth efforts usually take a few months." },
    ],
    cta: {
      heading: "Ready to grow your audience",
      body: "Let's build campaigns that turn attention into customers.",
    },
  },

  "advanced-services": {
    slug: "advanced-services",
    meta: {
      title: "Data and AI Consulting Services | BytesPlatform",
      description:
        "Data and AI consulting services: data modernization, advanced analytics services, generative AI, cybersecurity and emerging tech in one place. Explore.",
    },
    hero: {
      title: ["Advanced", "services"],
      intro: "Transforming businesses through cutting-edge technology and data-driven innovation.",
    },
    statement: "Your data already holds the answers. We build the systems that find them, protect them and put them to work.",
    labels: { statement: "Why it matters", offer: "Data & analytics", highlights: "Security & innovation", faq: "FAQ" },
    offer: {
      heading: "Data and analytics",
      body: "Advanced statistics, machine learning and visualization that turn raw data into strategic insight.",
      items: [
        { title: "Data modernization", body: "Legacy systems rebuilt as modern, scalable data architectures that support growth and efficiency." },
        { title: "Advanced analytics", body: "Machine learning and AI that extract actionable insights from complex datasets and predict future trends." },
        { title: "Connected intelligence", body: "IoT devices and sensors integrated into intelligent ecosystems that respond to real-time data." },
        { title: "Generative AI", body: "Generative models that automate content creation and sharpen decision-making." },
      ],
    },
    highlights: {
      heading: "Secure today, ready for tomorrow",
      items: [
        {
          title: "Cybersecurity",
          body: "A multi-layered approach that keeps your business resilient against evolving threats, from detection and incident response to compliance and security awareness training.",
        },
        {
          title: "Emerging technologies",
          body: "Strategic adoption of AI, IoT, blockchain and other transformative technology, focused on measurable business value.",
        },
      ],
    },
    faqs: [
      { q: "What are advanced services, and who are they for?", a: "Technologies like AI, machine learning, data analytics and blockchain, for businesses that want to innovate and stay ahead of the competition." },
      { q: "How do you integrate AI into my business processes?", a: "We implement AI to automate tasks, improve decision-making and enhance customer experiences, tailored to your industry." },
      { q: "Can I get custom solutions?", a: "Yes. Every solution is built around your business needs, from software development to process automation." },
      { q: "What industries benefit from advanced services?", a: "Healthcare, finance, retail and logistics benefit most, though automation, AI and analytics pay off almost anywhere." },
    ],
    cta: {
      heading: "Ready to transform your business",
      body: "Let's discuss how advanced services can accelerate your digital transformation.",
    },
  },

  // Service lines added in Oct 2026, one file per menu category.
  ...digitalServices,
  ...dataAiServices,
  ...cloudSecurityServices,
  ...businessProcessServices,
};
