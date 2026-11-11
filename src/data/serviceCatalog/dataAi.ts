import type { ServiceContent } from "../serviceContent";

/** Data & AI service pages: generative AI, data platforms, analytics, governance and connected devices. */
export const dataAiServices = {
  "generative-ai": {
    slug: "generative-ai",
    meta: {
      title: "Generative AI Development Services & LLM Integration",
      description:
        "Generative AI development services: LLM integration, RAG, fine-tuning and in-product copilots evaluated before launch. Start with a proof of value.",
    },
    hero: {
      title: ["Generative AI", "built into your product"],
      intro:
        "We help you find where generative AI earns its place, then build it into your own software, copilots, generation features and the models behind them, tested and governed.",
    },
    statement: "Generative AI is easy to demo and hard to ship. We focus on the part after the demo: quality, cost and trust.",
    labels: { statement: "Why GenAI", offer: "Services", highlights: "How we build", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we deliver",
      body: "From choosing the first use case to running models in production, scoped to the value you expect.",
      items: [
        {
          title: "Strategy & use-case discovery",
          body: "Workshops with your teams to list where generative AI could help, then rank each idea by value, risk and effort.",
          tags: ["Opportunity mapping", "ROI scoping", "Roadmaps"],
        },
        {
          title: "Copilots & chat in your product",
          body: "Assistants and chat features built into your app or platform, so your customers and staff get help where they already work.",
          tags: ["In-app copilots", "Chat UX", "Streaming APIs"],
        },
        {
          title: "Content & code generation",
          body: "Features that draft copy, summaries, reports, images or code from your templates and data, with review steps before anything goes out.",
          tags: ["Text generation", "Image generation", "Code assist", "Templates"],
        },
        {
          title: "Model selection & fine-tuning",
          body: "We compare hosted and open models on your own tasks, then tune prompts, fine-tune or distill where it improves quality or lowers cost.",
          tags: ["Benchmarking", "Fine-tuning", "Open-weight models"],
        },
      ],
    },
    highlights: {
      heading: "Generative AI you can stand behind",
      body: "A feature that works on stage has to keep working on real users, real data and a real budget.",
      items: [
        {
          title: "Evaluated before launch",
          body: "Every feature ships with tests that show how well it performs on your cases.",
          points: ["Task-specific evaluation sets", "Human review rounds", "Regression checks on model changes", "Quality dashboards"],
        },
        {
          title: "Responsible AI & governance",
          body: "Clear rules for what the model may see, say and do, written down and enforced.",
          points: ["Usage policies & risk review", "Content filtering", "Privacy & PII handling", "Audit trails"],
        },
        {
          title: "Cost and speed under control",
          body: "Model choice, caching and routing tuned so the feature stays fast and affordable as usage grows.",
          points: ["Model routing by task", "Prompt & response caching", "Token and spend tracking", "Latency budgets"],
        },
      ],
    },
    process: {
      heading: "From idea to production feature",
      steps: [
        { title: "Discovery", body: "We map your goals, data and users, and agree on the one or two use cases worth building first." },
        { title: "Proof of value", body: "A working prototype tested on your real inputs, with clear measures of quality and cost." },
        { title: "Build & integrate", body: "The feature built into your product, with guardrails, evaluation and monitoring in place." },
        { title: "Launch & improve", body: "A staged rollout, then regular tuning as models change and user feedback comes in." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["Claude", "OpenAI", "Gemini", "Llama", "Mistral", "Hugging Face", "LangChain", "Amazon Bedrock", "Azure OpenAI", "Python"],
    },
    faqs: [
      { q: "How is this different from your AI automation service?", a: "AI automation is about agents and workflows that run your internal processes. Generative AI is about building AI features into your own products, choosing and tuning the models, and setting the rules for how AI is used." },
      { q: "Which model should we use?", a: "It depends on the task, your data rules and your budget. We test a shortlist of models on your own examples and recommend the one that gives the best balance of quality, speed and cost." },
      { q: "Will our data be used to train public models?", a: "No. We use providers and settings that keep your data out of their training, and we can deploy in a private cloud or with open models you host yourself." },
      { q: "Do we need to fine-tune a model?", a: "Often not. Good prompts and retrieval cover most needs. We fine-tune only when testing shows it clearly improves quality or cuts cost." },
    ],
    cta: {
      heading: "Ready to build with generative AI",
      body: "Tell us what you want your product or team to do better, and we'll show you where generative AI fits.",
    },
  },

  "data-modernization": {
    slug: "data-modernization",
    meta: {
      title: "Data Modernization Services: Legacy to Cloud | BytesPlatform",
      description:
        "Data modernization services: legacy data migration to Snowflake, Databricks or BigQuery with phased, reconciled cutovers. Request an assessment.",
    },
    hero: {
      title: ["Data", "modernization"],
      intro:
        "We move your data off ageing databases and warehouses onto a modern cloud platform, with pipelines that keep it fresh and ready for reporting and AI.",
    },
    statement: "AI and analytics are only as good as the data under them. We rebuild that foundation without stopping the business.",
    labels: { statement: "Why modernize", offer: "Services", highlights: "How we work", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we modernize",
      body: "From a single legacy database to a full data estate, planned in phases you can live with.",
      items: [
        {
          title: "Cloud data platforms",
          body: "Warehouses and lakehouses designed around how your business uses data, sized for today and ready to grow.",
          tags: ["Snowflake", "Databricks", "BigQuery", "Lakehouse"],
        },
        {
          title: "Legacy migration",
          body: "Data, schemas and logic moved from on-premise systems to the cloud, checked record by record before cut-over.",
          tags: ["SQL Server", "Oracle", "Teradata", "Validation"],
        },
        {
          title: "Data pipelines",
          body: "Batch and streaming pipelines that pull from your apps and sources and land clean, consistent data on schedule.",
          tags: ["ELT", "Streaming", "dbt", "Orchestration"],
        },
        {
          title: "AI-ready data",
          body: "Data organised, documented and exposed so analysts, models and AI features can use it safely.",
          tags: ["Feature stores", "Vector data", "Semantic layers"],
        },
      ],
    },
    highlights: {
      heading: "A move you can trust",
      body: "Modernization should cut cost and complexity, not add risk to the systems you run on today.",
      items: [
        {
          title: "No big-bang cut-overs",
          body: "We move in stages and run old and new side by side until the numbers match.",
          points: ["Phased migration plans", "Parallel runs", "Reconciliation checks", "Rollback paths"],
        },
        {
          title: "Built for scale and cost",
          body: "Storage and compute set up to grow with demand while keeping spend visible.",
          points: ["Separation of storage & compute", "Auto-scaling", "Cost monitoring", "Workload tuning"],
        },
        {
          title: "Engineered properly",
          body: "Pipelines treated as software, with versioning, tests and alerts.",
          points: ["Infrastructure as code", "Data tests in CI", "Pipeline monitoring", "Clear documentation"],
        },
      ],
    },
    process: {
      heading: "From legacy to modern platform",
      steps: [
        { title: "Assessment", body: "We inventory your data sources, workloads and reports, and find where the cost and pain sit today." },
        { title: "Target design", body: "A platform architecture and migration plan, agreed with your team before anything moves." },
        { title: "Migration", body: "Data and pipelines moved in phases, validated against the old system at every step." },
        { title: "Handover & support", body: "Documentation, training and ongoing support so your team can run and extend the platform." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["Snowflake", "Databricks", "BigQuery", "Amazon Redshift", "Azure Synapse", "dbt", "Apache Airflow", "Apache Kafka", "Fivetran", "Terraform"],
    },
    faqs: [
      { q: "Do we have to move everything at once?", a: "No. We usually start with the data that matters most to reporting or a new product, prove the platform, then move the rest in phases." },
      { q: "Which cloud platform should we choose?", a: "It depends on your existing cloud, skills, workloads and budget. We compare the options against your needs and recommend one, rather than pushing a single vendor." },
      { q: "Will our reports break during the migration?", a: "We run old and new systems in parallel and reconcile the results, so reports switch over only once the numbers match." },
      { q: "How long does a data modernization project take?", a: "A focused migration can take a few months. Larger estates are delivered in phases, each one in use before the next begins." },
    ],
    cta: {
      heading: "Ready to modernize your data",
      body: "Tell us what your data runs on today, and we'll map out a practical path to a modern platform.",
    },
  },

  "advanced-analytics": {
    slug: "advanced-analytics",
    meta: {
      title: "Advanced Analytics Services & BI Consulting | BytesPlatform",
      description:
        "Advanced analytics services and business intelligence consulting: Power BI and Tableau dashboards, predictive models, embedded analytics. Book a call.",
    },
    hero: {
      title: ["Advanced", "analytics"],
      intro:
        "We turn your data into dashboards, forecasts and models that answer real business questions, and put them in front of the people who make the calls.",
    },
    statement: "Most companies have more data than answers. We close that gap with analytics people actually use.",
    labels: { statement: "Why analytics", offer: "Services", highlights: "How we work", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we build",
      body: "From a first set of trusted KPIs to predictive models in production.",
      items: [
        {
          title: "BI & dashboards",
          body: "Clear dashboards built on agreed metrics, so every team reads the same numbers the same way.",
          tags: ["Power BI", "Tableau", "Looker", "KPI design"],
        },
        {
          title: "Predictive analytics",
          body: "Models that forecast demand, flag churn risk or score leads, built on your history and checked against real outcomes.",
          tags: ["Forecasting", "Machine learning", "Scoring"],
        },
        {
          title: "Self-service analytics",
          body: "Semantic layers and curated datasets that let business users explore data without waiting on an analyst.",
          tags: ["Semantic layer", "Data models", "Training"],
        },
        {
          title: "Embedded analytics",
          body: "Charts, reports and insights built into your own product, so your customers see their data inside your app.",
          tags: ["Embedded BI", "Custom charts", "Multi-tenant"],
        },
      ],
    },
    highlights: {
      heading: "Analytics people trust",
      body: "A dashboard nobody believes is worse than none. We build for accuracy and adoption.",
      items: [
        {
          title: "One version of the truth",
          body: "Metrics defined once and reused everywhere.",
          points: ["Shared metric definitions", "Documented calculations", "Certified datasets", "Data quality checks"],
        },
        {
          title: "Models that hold up",
          body: "Predictive work tested against real results, not just training data.",
          points: ["Back-testing", "Explainable outputs", "Drift monitoring", "Scheduled retraining"],
        },
        {
          title: "Designed for decisions",
          body: "Every view starts from a question someone needs to answer.",
          points: ["Role-based views", "Alerts on key changes", "Mobile-friendly reports", "Natural-language queries"],
        },
      ],
    },
    process: {
      heading: "From question to insight",
      steps: [
        { title: "Discovery", body: "We meet the people who make decisions and list the questions they need answered." },
        { title: "Data & metrics", body: "We check what data exists, fix gaps, and agree on how each metric is calculated." },
        { title: "Build", body: "Dashboards and models built in short cycles, reviewed with your team as they take shape." },
        { title: "Adoption", body: "Training, documentation and follow-up so the tools become part of how decisions get made." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["Power BI", "Tableau", "Looker", "Python", "SQL", "scikit-learn", "Databricks", "Snowflake", "dbt", "Azure ML"],
    },
    faqs: [
      { q: "Our data is messy. Can we still start?", a: "Yes. Most projects begin with cleaning and modelling the data behind the first few metrics. We fix what is needed to answer the first questions, then expand." },
      { q: "Which BI tool should we use?", a: "Often the one you already license. If you're choosing fresh, we weigh cost, your existing stack and who will use it, then recommend a fit." },
      { q: "What is the difference between BI and advanced analytics?", a: "BI shows what happened and what is happening now. Advanced analytics adds forecasts, predictions and models that suggest what is likely to happen next." },
      { q: "Can you add analytics to our own product?", a: "Yes. We build embedded dashboards and reports that live inside your app, with each customer seeing only their own data." },
    ],
    cta: {
      heading: "Ready to get answers from your data",
      body: "Tell us the decisions you want to make with more confidence, and we'll show you the analytics that support them.",
    },
  },

  "data-management": {
    slug: "data-management",
    meta: {
      title: "Data Governance Services & Data Management | BytesPlatform",
      description:
        "Data governance services and data management consulting: frameworks, data quality, MDM and catalog/lineage built for compliance. Get an assessment.",
    },
    hero: {
      title: ["Data management", "& governance"],
      intro:
        "We put the rules, tools and ownership in place so your data stays accurate, secure and easy to find, across every system that uses it.",
    },
    statement: "When nobody owns the data, everybody argues about it. We set up the ownership and controls that end the argument.",
    labels: { statement: "Why it matters", offer: "Services", highlights: "How we work", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we manage",
      body: "Practical governance that fits how your teams work, not a binder on a shelf.",
      items: [
        {
          title: "Data governance",
          body: "Clear owners, policies and standards for your key data, with a lightweight process to keep them current.",
          tags: ["Data ownership", "Policies", "Stewardship"],
        },
        {
          title: "Data quality",
          body: "Rules and checks that catch missing, duplicate or wrong data early, with alerts before it reaches a report.",
          tags: ["Validation rules", "Profiling", "Monitoring"],
        },
        {
          title: "Master data management",
          body: "One trusted record for customers, products and suppliers, matched and merged across your systems.",
          tags: ["MDM", "Matching", "Golden records"],
        },
        {
          title: "Catalog & lineage",
          body: "A searchable catalog that shows what data you have, what it means and where it came from.",
          tags: ["Data catalog", "Lineage", "Metadata", "Glossary"],
        },
      ],
    },
    highlights: {
      heading: "Governance that people follow",
      body: "Controls only work if they are simple enough to use every day.",
      items: [
        {
          title: "Secure by design",
          body: "Access matched to roles, with sensitive data protected wherever it lives.",
          points: ["Role-based access", "Data masking", "Encryption", "Access reviews"],
        },
        {
          title: "Ready for compliance",
          body: "Controls and records that help you meet the regulations that apply to you.",
          points: ["Data classification", "Retention rules", "Consent tracking", "Audit logs"],
        },
        {
          title: "Automated where possible",
          body: "Checks and documentation that run on their own instead of relying on memory.",
          points: ["Automated quality tests", "Lineage capture", "Policy enforcement", "Issue workflows"],
        },
      ],
    },
    process: {
      heading: "From scattered to managed",
      steps: [
        { title: "Assessment", body: "We review your data landscape, current controls and the problems they cause day to day." },
        { title: "Framework", body: "Roles, policies and priorities agreed with your team, starting with the data that matters most." },
        { title: "Implementation", body: "Tools, quality checks, catalogs and access controls set up and connected to your systems." },
        { title: "Operate & improve", body: "Regular reviews, reporting and coaching so governance becomes a habit, not a project." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["Microsoft Purview", "Collibra", "Alation", "Unity Catalog", "Informatica", "Great Expectations", "dbt", "Snowflake", "AWS Lake Formation", "Monte Carlo"],
    },
    faqs: [
      { q: "Is data governance only for large companies?", a: "No. Smaller teams benefit too, especially as they add systems and start using AI. We scale the approach to your size, starting with a few critical datasets." },
      { q: "Do we need to buy new tools?", a: "Not always. Many platforms you already use have governance features built in. We recommend new tools only where they fill a real gap." },
      { q: "How does this help with AI?", a: "AI models and assistants repeat whatever is in your data. Good quality, clear ownership and access controls make AI outputs more accurate and keep sensitive data out of the wrong places." },
      { q: "Can you help with regulations like HIPAA or GDPR?", a: "We design controls such as classification, access, retention and audit trails that support compliance. Your legal and compliance teams confirm what each regulation requires of you." },
    ],
    cta: {
      heading: "Ready to take control of your data",
      body: "Tell us where bad or scattered data is slowing you down, and we'll show you where to start.",
    },
  },

  "connected-intelligence": {
    slug: "connected-intelligence",
    meta: {
      title: "IoT Development Services & Solutions | BytesPlatform",
      description:
        "IoT development services from an IoT solutions provider: platforms, edge computing, digital twins and monitoring secured device to cloud. Scope a pilot.",
    },
    hero: {
      title: ["Connected", "intelligence"],
      intro:
        "We connect your devices, machines and sites to software that collects their data, watches it in real time and acts when something changes.",
    },
    statement: "Your equipment already produces the data. We connect it, make sense of it and put it to work.",
    labels: { statement: "Why connect", offer: "Services", highlights: "How we build", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we connect",
      body: "From a pilot on one line or site to a fleet of connected devices.",
      items: [
        {
          title: "IoT platforms",
          body: "Cloud platforms that onboard devices, collect their data securely and manage them at scale.",
          tags: ["AWS IoT", "Azure IoT", "MQTT", "Device management"],
        },
        {
          title: "Edge computing",
          body: "Processing close to the device, so data is filtered and decisions are made even when the connection drops.",
          tags: ["Edge gateways", "Local inference", "Offline sync"],
        },
        {
          title: "Digital twins",
          body: "Live digital models of equipment, buildings or processes that mirror their state and let you test changes safely.",
          tags: ["Asset models", "Simulation", "3D views"],
        },
        {
          title: "Real-time monitoring",
          body: "Dashboards, alerts and mobile apps that show what is happening now and flag problems before they spread.",
          tags: ["Streaming data", "Alerts", "Predictive maintenance", "Mobile apps"],
        },
      ],
    },
    highlights: {
      heading: "Built for the real world",
      body: "Connected systems run in factories, fields and buildings, not just in the cloud.",
      items: [
        {
          title: "Secure from device to cloud",
          body: "Every device identified, every message encrypted, every update controlled.",
          points: ["Device identity & certificates", "Encrypted transport", "Secure firmware updates", "Network segmentation"],
        },
        {
          title: "Works with what you have",
          body: "We connect existing equipment and protocols instead of asking you to replace them.",
          points: ["Industrial protocols", "Legacy equipment retrofits", "ERP & maintenance system links", "Open APIs"],
        },
        {
          title: "Intelligence on the data",
          body: "Raw sensor readings turned into signals your team can act on.",
          points: ["Anomaly detection", "Failure prediction", "Usage & energy insights", "Automated actions"],
        },
      ],
    },
    process: {
      heading: "From pilot to connected fleet",
      steps: [
        { title: "Discovery", body: "We walk your sites, review your equipment and agree on the outcomes the data should drive." },
        { title: "Pilot", body: "A small set of connected devices with live data and dashboards, so you can see the value early." },
        { title: "Scale-up", body: "Device onboarding, security and data pipelines hardened for the full rollout." },
        { title: "Operate & evolve", body: "Monitoring, updates and new analytics added as your connected estate grows." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["AWS IoT Core", "Azure IoT Hub", "MQTT", "OPC UA", "Node-RED", "Apache Kafka", "InfluxDB", "Grafana", "Python", "React Native"],
    },
    faqs: [
      { q: "Do we need new hardware?", a: "Not always. Many machines already have sensors or controllers we can read from. Where they don't, we recommend add-on sensors or gateways that fit your setup." },
      { q: "What happens if the connection drops?", a: "Edge devices keep collecting and processing data locally, then sync with the cloud when the connection returns." },
      { q: "How do you keep connected devices secure?", a: "Each device gets its own identity, all traffic is encrypted, and updates are signed and controlled. We also separate device networks from the rest of your systems." },
      { q: "How quickly can we see results?", a: "A focused pilot on a few devices can show live data within weeks. We then scale in phases based on what the pilot proves." },
    ],
    cta: {
      heading: "Ready to connect your operations",
      body: "Tell us about your equipment and sites, and we'll show you what connected data could do for you.",
    },
  },
} satisfies Record<string, ServiceContent>;
