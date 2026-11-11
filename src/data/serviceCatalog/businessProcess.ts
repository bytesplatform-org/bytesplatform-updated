import type { ServiceContent } from "../serviceContent";

/** Business Process Services: people-led operations, supported by automation where it helps. */
export const businessProcessServices = {
  "contact-center": {
    slug: "contact-center",
    meta: {
      title: "Contact Center Outsourcing | Voice, Chat & AI Support",
      description:
        "Contact center outsourcing for voice, chat, email and social with AI-assisted agents and QA. Call center outsourcing services that scale. Get a quote.",
    },
    hero: {
      title: ["Contact center", "services"],
      intro:
        "We run customer and technical support across phone, chat, email and social, with trained agents on the conversations that need a person and AI on the ones that don't.",
    },
    statement: "Customers remember how fast and how well they were helped. We staff the queue, build the automation around it and keep both improving.",
    labels: { statement: "Why it matters", offer: "Services", highlights: "How we work", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we handle",
      body: "From overflow support to a full program, shaped around your customers, channels and hours.",
      items: [
        {
          title: "Voice support",
          body: "Inbound calls for orders, billing, bookings and account questions, plus outbound follow-ups and surveys, handled to your scripts and tone.",
          tags: ["Inbound", "Outbound", "IVR"],
        },
        {
          title: "Chat, email & social",
          body: "Written support across live chat, email, messaging apps and social channels, with consistent answers wherever a customer reaches out.",
          tags: ["Live chat", "Email", "Social", "Messaging"],
        },
        {
          title: "Technical support",
          body: "Tiered help desk support for software, devices and accounts, troubleshooting, ticket triage and clean escalations to your engineering team.",
          tags: ["Tier 1–2", "Help desk", "Escalations"],
        },
        {
          title: "AI-assisted service",
          body: "Chatbots and voice assistants for routine questions, with agent assist, call summaries and smart routing so people spend time where it counts.",
          tags: ["Chatbots", "Agent assist", "Routing", "Summaries"],
        },
      ],
    },
    highlights: {
      heading: "Support that runs like part of your company",
      body: "Agents learn your product and policies, work in your tools and report on the numbers you track.",
      items: [
        {
          title: "Trained on your business",
          body: "Onboarding built from your product, policies and brand voice before an agent takes a live contact.",
          points: ["Product & policy training", "Scripts & knowledge base", "Brand voice guidelines", "Regular refreshers"],
        },
        {
          title: "People plus automation",
          body: "AI takes the repetitive contacts and the admin, so agents can focus on the harder conversations.",
          points: ["Self-service for common requests", "Automatic ticket tagging", "Post-call summaries", "Clear hand-off to a person"],
        },
        {
          title: "Quality you can see",
          body: "Every program ships with reporting and a quality process your team can review.",
          points: ["Call & ticket QA reviews", "CSAT and resolution tracking", "Shared dashboards", "Monthly improvement reviews"],
        },
      ],
    },
    process: {
      heading: "From first call to steady state",
      steps: [
        { title: "Discovery", body: "We review your contact volumes, channels, common requests and service goals, and agree on the metrics that matter." },
        { title: "Setup & training", body: "Tools connected, knowledge base built, agents trained and AI flows configured for the routine requests." },
        { title: "Pilot", body: "A controlled start on a slice of your traffic, so you can check quality before volume ramps up." },
        { title: "Scale & improve", body: "Full rollout, then ongoing QA, coaching and automation tuning as patterns in the data show up." },
      ],
    },
    stack: {
      label: "Platforms we work with",
      items: ["Zendesk", "Salesforce Service Cloud", "Freshdesk", "HubSpot", "Intercom", "Genesys", "Five9", "Twilio", "Amazon Connect", "Talkdesk"],
    },
    faqs: [
      { q: "Can your agents work in our existing tools?", a: "Yes. We usually work inside your helpdesk, CRM and phone system, so tickets, history and reporting stay in one place. If you don't have a setup yet, we can help choose and configure one." },
      { q: "Which contacts should go to AI and which to people?", a: "Routine, well-defined requests like order status or password resets suit automation. Complaints, complex issues and anything sensitive go to a person. We map this together and adjust it as we learn." },
      { q: "Can you handle only part of our support?", a: "Yes. Many teams start with overflow, after-hours or a single channel, then expand once they're happy with the quality." },
      { q: "How do you protect customer data?", a: "Agents get access only to what they need, activity is logged, and we design processes around your data and compliance requirements." },
    ],
    cta: {
      heading: "Ready to raise your support game",
      body: "Tell us about your customers and channels, and we'll suggest how people and automation could share the load.",
    },
  },

  "finance-accounting": {
    slug: "finance-accounting",
    meta: {
      title: "Finance and Accounting Outsourcing Services | BytesPlatform",
      description:
        "Finance and accounting outsourcing services for procure-to-pay, order-to-cash and record-to-report, plus accounts payable outsourcing. Lighten your close.",
    },
    hero: {
      title: ["Finance &", "accounting"],
      intro:
        "We take on the day-to-day work of your finance team, from payables and receivables to reconciliations and close, and automate the steps that slow it down.",
    },
    statement: "Finance teams lose too many hours to keying in invoices and chasing reconciliations. We take that work on, and make it faster each month.",
    labels: { statement: "Why it matters", offer: "Services", highlights: "How we work", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we take on",
      body: "Support for a single process or the full cycle, working in your accounting system and to your controls.",
      items: [
        {
          title: "Procure to pay",
          body: "Vendor setup, invoice capture, matching, approvals and payment runs, handled on time so early-payment discounts aren't missed.",
          tags: ["Accounts payable", "3-way match", "Vendor management"],
        },
        {
          title: "Order to cash",
          body: "Invoicing, cash application, collections follow-up and customer account queries, so money comes in sooner and disputes get resolved.",
          tags: ["Billing", "Accounts receivable", "Collections", "Cash application"],
        },
        {
          title: "Record to report",
          body: "Journal entries, account reconciliations, month-end close and management reporting, with a clear trail behind every number.",
          tags: ["Bookkeeping", "Reconciliations", "Month-end close", "Reporting"],
        },
        {
          title: "Finance automation",
          body: "AI-assisted invoice extraction, automated matching and reconciliation rules, and dashboards that update themselves.",
          tags: ["Document AI", "RPA", "Dashboards"],
        },
      ],
    },
    highlights: {
      heading: "Accurate books, less manual work",
      body: "Good finance operations depend on clean processes and controls you can trust, not just extra hands.",
      items: [
        {
          title: "Works inside your systems",
          body: "We work in the accounting and ERP software you already run, with your chart of accounts and approval rules.",
          points: ["ERP & accounting access by role", "Your approval workflows", "Shared close checklists", "Documented procedures"],
        },
        {
          title: "Controls built in",
          body: "Processes designed around segregation of duties and your audit and compliance needs.",
          points: ["Maker-checker reviews", "Audit-ready documentation", "Exception tracking", "Restricted payment rights"],
        },
        {
          title: "Automation where it pays",
          body: "Repetitive steps handed to software, with a person reviewing anything unusual.",
          points: ["Invoice data extraction", "Auto-matching rules", "Duplicate payment checks", "Live finance dashboards"],
        },
      ],
    },
    process: {
      heading: "From handover to a smoother close",
      steps: [
        { title: "Assessment", body: "We review your current processes, systems, volumes and controls, and pick where to start." },
        { title: "Transition", body: "Procedures documented, access set up and work shadowed alongside your team before we take it over." },
        { title: "Run", body: "Day-to-day processing against agreed timelines, with regular reporting on accuracy and turnaround." },
        { title: "Automate & improve", body: "Once the process is stable, we automate the repetitive steps and shorten the cycle." },
      ],
    },
    stack: {
      label: "Software we work with",
      items: ["QuickBooks", "Xero", "NetSuite", "Sage Intacct", "Microsoft Dynamics 365", "SAP", "Bill.com", "Expensify", "Power BI", "Excel"],
    },
    faqs: [
      { q: "Do you replace our accountant or CFO?", a: "No. We handle the transactional and operational work so your finance leads and outside accountants can focus on review, planning and decisions. Tax and audit opinions stay with your advisers." },
      { q: "Can you work in our existing accounting software?", a: "Yes. We work in your system with role-based access and follow your approval rules. If you're moving to a new platform, we can help with that too." },
      { q: "How do you keep our financial data secure?", a: "Access is limited to the people and functions that need it, activity is logged, and payment rights stay with your team unless you decide otherwise." },
      { q: "Can we start with just one process?", a: "Yes. Many clients start with accounts payable or bookkeeping and add other processes once the first is running well." },
    ],
    cta: {
      heading: "Ready to lighten your finance workload",
      body: "Tell us which processes eat the most time, and we'll show you what we can take on and what we can automate.",
    },
  },

  "staff-augmentation": {
    slug: "staff-augmentation",
    meta: {
      title: "IT Staff Augmentation Services | Engineers & Specialists",
      description:
        "IT staff augmentation services that add vetted engineers, designers and data/AI specialists in days. Staff augmentation services on your stack. Grow now.",
    },
    hero: {
      title: ["Staff", "augmentation"],
      intro:
        "Add engineers, designers and data and AI specialists to your team when you need them. They work in your tools, join your rituals and report to your leads.",
    },
    statement: "Hiring takes months. Your roadmap doesn't wait. We add the skills you're missing, so the work keeps moving.",
    labels: { statement: "Why augment", offer: "Roles", highlights: "How we work", process: "Process", faq: "FAQ" },
    offer: {
      heading: "Who we can add",
      body: "One specialist or a full pod, matched to your stack and the way your team works.",
      items: [
        {
          title: "Software engineers",
          body: "Front-end, back-end, full-stack and mobile engineers who pick up tickets, review code and ship alongside your team.",
          tags: ["React", "Node.js", "Python", "Mobile"],
        },
        {
          title: "Designers",
          body: "Product, UX and UI designers who run research, build flows and hand off clean, buildable designs.",
          tags: ["Product design", "UX research", "Figma"],
        },
        {
          title: "Data & AI specialists",
          body: "Data engineers, analysts and ML engineers who build pipelines, dashboards, models and LLM features.",
          tags: ["Data engineering", "ML", "LLM apps", "Analytics"],
        },
        {
          title: "Cloud, QA & delivery",
          body: "DevOps engineers, QA testers and project managers to round out a team or keep a release on track.",
          tags: ["DevOps", "QA automation", "Project management"],
        },
      ],
    },
    highlights: {
      heading: "Specialists who work like your own team",
      body: "Augmented staff only help if they fit in quickly and stay productive.",
      items: [
        {
          title: "Matched to your stack",
          body: "We shortlist people based on your tools, codebase and seniority needs, and you interview them.",
          points: ["Skills-based screening", "Technical assessments", "Your final interview", "Fast replacements if needed"],
        },
        {
          title: "Embedded in your workflow",
          body: "They join your standups, work in your repos and follow your processes.",
          points: ["Your tools & channels", "Your sprint cadence", "Overlapping working hours", "Direct reporting to your leads"],
        },
        {
          title: "Flexible as you grow",
          body: "Scale the team up or down as projects start, change and finish.",
          points: ["Monthly engagements", "Add or swap roles", "Knowledge handover", "Option to move to a managed team"],
        },
      ],
    },
    process: {
      heading: "From request to first commit",
      steps: [
        { title: "Requirements", body: "We learn the roles, skills, seniority, time zone and team setup you need." },
        { title: "Shortlist", body: "Pre-screened candidates sent for your review, with their experience and assessment results." },
        { title: "Interviews & selection", body: "You interview and choose. We handle contracts, equipment and access setup." },
        { title: "Onboarding & support", body: "A guided start in your environment, then regular check-ins to keep the fit and the output right." },
      ],
    },
    faqs: [
      { q: "How is staff augmentation different from outsourcing a project?", a: "With augmentation, specialists join your team and you direct the work. With a managed project, we own delivery against an agreed scope. Many clients use both at different times." },
      { q: "Do we get to interview candidates?", a: "Yes. We shortlist, and you make the final call after your own interviews." },
      { q: "What if someone isn't the right fit?", a: "Tell us early. We'll work through the issue, and if it can't be fixed we'll find a replacement and support the handover." },
      { q: "Who owns the work they produce?", a: "You do. Ownership of code, designs and other work product is set out in the contract before anyone starts." },
    ],
    cta: {
      heading: "Ready to grow your team",
      body: "Tell us the roles and skills you need, and we'll come back with people who fit.",
    },
    action: "Request talent",
  },

  "legal-process-outsourcing": {
    slug: "legal-process-outsourcing",
    meta: {
      title: "Legal Process Outsourcing Services | Review & Paralegal",
      description:
        "Legal process outsourcing services for document review, contracts and outsourced paralegal support, attorney-led and confidential. Free up your legal team.",
    },
    hero: {
      title: ["Legal process", "outsourcing"],
      intro:
        "We support law firms and in-house legal teams with document review, contract management, research and paralegal work, under the direction of your attorneys.",
    },
    statement: "Lawyers should spend their time on legal judgment, not on sorting documents. We take on the volume work, and your attorneys stay in charge.",
    labels: { statement: "Why outsource", offer: "Services", highlights: "How we work", process: "Process", faq: "FAQ" },
    offer: {
      heading: "How we support legal teams",
      body: "Support work for litigation, transactions and day-to-day legal operations. We don't provide legal advice. Your attorneys review and own every decision.",
      items: [
        {
          title: "Document review",
          body: "First-pass review, coding and privilege tagging for litigation and investigations, plus due diligence reviews for transactions.",
          tags: ["eDiscovery", "Due diligence", "Privilege tagging"],
        },
        {
          title: "Contract management",
          body: "Contract intake, abstraction, clause tracking, renewal dates and obligation logs, kept organised in your repository.",
          tags: ["Abstraction", "CLM", "Obligation tracking"],
        },
        {
          title: "Legal research support",
          body: "Research memos, case law and statute summaries, and citation checks prepared for attorney review.",
          tags: ["Case summaries", "Citation checks", "Research memos"],
        },
        {
          title: "Paralegal support",
          body: "Deposition summaries, chronologies, exhibit preparation, document drafting from templates and matter administration.",
          tags: ["Deposition summaries", "Chronologies", "Drafting", "Matter admin"],
        },
      ],
    },
    highlights: {
      heading: "Careful work, under your direction",
      body: "Legal support is only useful if it's accurate, confidential and easy for your attorneys to check.",
      items: [
        {
          title: "Attorney-led workflow",
          body: "Your lawyers set the instructions and protocols, and sign off on the output.",
          points: ["Review protocols from your team", "Escalation of judgment calls", "No legal advice given", "Clear audit trail"],
        },
        {
          title: "Confidentiality first",
          body: "Processes designed around client confidentiality and your firm's security requirements.",
          points: ["Confidentiality agreements", "Role-based access", "Secure document handling", "Conflict checks on request"],
        },
        {
          title: "AI-assisted, human-checked",
          body: "AI speeds up sorting, extraction and summarising, and trained reviewers check the results.",
          points: ["Clause extraction", "Document clustering", "Draft summaries", "Quality sampling"],
        },
      ],
    },
    process: {
      heading: "From brief to delivered work",
      steps: [
        { title: "Scoping", body: "We agree on the matter or workstream, volumes, deadlines, protocols and who signs off." },
        { title: "Setup", body: "Secure access to your platforms, confidentiality terms in place and the team briefed on your instructions." },
        { title: "Delivery", body: "Work completed against the protocol, with questions and judgment calls escalated to your attorneys." },
        { title: "Quality review", body: "Sampling and checks before handover, plus feedback loops to tighten accuracy over time." },
      ],
    },
    stack: {
      label: "Platforms we work with",
      items: ["Relativity", "Everlaw", "DISCO", "iManage", "NetDocuments", "Ironclad", "DocuSign CLM", "Clio", "Westlaw", "LexisNexis"],
    },
    faqs: [
      { q: "Do you provide legal advice?", a: "No. We provide support services to legal teams. Your attorneys direct the work, review what we produce and remain responsible for all legal advice and decisions." },
      { q: "Who do you work with?", a: "Law firms, in-house legal departments and other teams with legal workloads, such as compliance or procurement." },
      { q: "How do you handle confidential documents?", a: "Everyone on the team signs confidentiality terms, access is limited to the matters they work on, and we work within your platforms and security requirements wherever possible." },
      { q: "Can you help with a short-term spike, like a big review?", a: "Yes. We can support a single matter or deadline, or provide ongoing help with routine work like contract management." },
    ],
    cta: {
      heading: "Ready to free up your legal team",
      body: "Tell us about the workload that's slowing your attorneys down, and we'll show you how we can support it.",
    },
  },

  "recruitment-process-outsourcing": {
    slug: "recruitment-process-outsourcing",
    meta: {
      title: "Recruitment Process Outsourcing Services | RPO Partner",
      description:
        "Recruitment process outsourcing services covering end-to-end, project and partial RPO services with AI-assisted screening. Start hiring faster today.",
    },
    hero: {
      title: ["Recruitment process", "outsourcing"],
      intro:
        "We run all or part of your hiring, from sourcing and screening to scheduling and offers, so your managers meet better candidates with less effort.",
    },
    statement: "Good candidates don't wait around. We keep your hiring pipeline moving, and give your managers back the time they spend on admin.",
    labels: { statement: "Why RPO", offer: "Services", highlights: "How we work", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we take on",
      body: "Full-cycle hiring or the stages where you need the most help, for permanent and contract roles.",
      items: [
        {
          title: "End-to-end recruitment",
          body: "The whole cycle, from job brief and sourcing to offers and onboarding hand-off, run under your employer brand.",
          tags: ["Full-cycle", "Employer brand", "Direct hire"],
        },
        {
          title: "Project & partial RPO",
          body: "Help with a hiring push, a new location or a single stage like sourcing or screening, while your team handles the rest.",
          tags: ["Hiring sprints", "Sourcing", "Screening"],
        },
        {
          title: "Contract & contract-to-hire",
          body: "Contract staffing for short-term needs, with the option to convert people to permanent roles when it works for both sides.",
          tags: ["Contract staffing", "Contract-to-hire", "Temp roles"],
        },
        {
          title: "AI-assisted hiring",
          body: "Resume screening, candidate matching, interview scheduling and pipeline reporting, automated where it helps and reviewed by recruiters.",
          tags: ["Screening", "Scheduling", "ATS automation", "Analytics"],
        },
      ],
    },
    highlights: {
      heading: "Hiring that feels like your own team",
      body: "Our recruiters represent your company to every candidate, so the experience has to reflect you.",
      items: [
        {
          title: "Built around your roles",
          body: "We learn your teams, culture and what good looks like before sourcing anyone.",
          points: ["Role intake with managers", "Clear scorecards", "Your employer brand", "Market and salary insight"],
        },
        {
          title: "Fair, consistent screening",
          body: "Structured processes so every candidate is judged on the same criteria.",
          points: ["Structured interviews", "Skills assessments", "Human review of AI scoring", "Prompt candidate updates"],
        },
        {
          title: "Clear pipeline reporting",
          body: "You always know where each role stands and where things are getting stuck.",
          points: ["Time-to-fill tracking", "Source effectiveness", "Funnel conversion", "Weekly hiring updates"],
        },
      ],
    },
    process: {
      heading: "From open role to accepted offer",
      steps: [
        { title: "Intake", body: "We meet hiring managers, agree on the role, the scorecard, the timeline and the interview steps." },
        { title: "Sourcing & screening", body: "Candidates found through job boards, outreach and referrals, then screened against the scorecard." },
        { title: "Interviews & offers", body: "Interview scheduling, feedback collection and offer support, with candidates kept informed throughout." },
        { title: "Onboarding & review", body: "A smooth hand-off to onboarding, then a review of what worked to improve the next round." },
      ],
    },
    stack: {
      label: "Tools we work with",
      items: ["LinkedIn Recruiter", "Greenhouse", "Lever", "Workday", "BambooHR", "Ashby", "Indeed", "Calendly"],
    },
    faqs: [
      { q: "How is RPO different from a staffing agency?", a: "An agency usually fills individual roles. RPO takes over part or all of your recruiting process, working as an extension of your team under your brand and in your systems." },
      { q: "Will candidates know they're working with an outside partner?", a: "That's up to you. Most clients have us recruit under their brand, using their email and careers pages." },
      { q: "Do you use AI to make hiring decisions?", a: "No. AI helps with screening, matching and scheduling, but recruiters review the results and your managers make every hiring decision." },
      { q: "Can you hire for technical roles?", a: "Yes. As a technology company, we're well placed to source and screen engineers, designers and data specialists, as well as non-technical roles." },
    ],
    cta: {
      heading: "Ready to hire faster",
      body: "Tell us about the roles you need to fill, and we'll suggest the right mix of recruiting support.",
    },
  },
} satisfies Record<string, ServiceContent>;
