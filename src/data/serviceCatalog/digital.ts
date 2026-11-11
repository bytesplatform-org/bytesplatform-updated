import type { ServiceContent } from "../serviceContent";

/** Digital service lines: consulting & strategy, and commerce. */
export const digitalServices = {
  "digital-consulting-strategy": {
    slug: "digital-consulting-strategy",
    meta: {
      title: "Digital Strategy Consulting | Roadmaps & Advisory",
      description:
        "Digital strategy consulting and digital transformation consulting services: discovery, AI advisory and roadmaps tied to delivery. Book a strategy call.",
    },
    hero: {
      title: ["Digital consulting", "& strategy"],
      intro:
        "We help you decide what to build, in what order and why, then stay on to design it and see it delivered, so the plan never gets lost between the slide deck and the codebase.",
    },
    statement: "A strategy is only as good as what ships from it. We write plans our own engineers would be happy to build.",
    labels: { statement: "Why strategy", offer: "Services", highlights: "How we work", process: "Process", faq: "FAQ" },
    offer: {
      heading: "Where we help",
      body: "From a single product decision to a company-wide modernization plan, scoped to the questions you need answered.",
      items: [
        {
          title: "Digital roadmaps",
          body: "A clear view of where your systems, processes and customer touchpoints stand today, and a phased plan for where they should go next.",
          tags: ["Current-state review", "Prioritization", "Phased plans"],
        },
        {
          title: "Product discovery",
          body: "Research, workshops and quick prototypes that test an idea with real users before you commit a budget to building it.",
          tags: ["User research", "Workshops", "Prototyping", "Validation"],
        },
        {
          title: "Experience design",
          body: "Journeys, interfaces and design systems built around how your customers and staff actually work, ready for engineers to pick up.",
          tags: ["UX research", "UI design", "Design systems"],
        },
        {
          title: "AI & technology advisory",
          body: "Honest advice on where AI, automation and new platforms fit your business, and where they would add cost without adding value.",
          tags: ["AI readiness", "Architecture", "Build vs. buy"],
        },
      ],
    },
    highlights: {
      heading: "Strategy that connects to delivery",
      body: "Every recommendation comes with the detail a team needs to act on it.",
      items: [
        {
          title: "Grounded in your business",
          body: "We start from your goals, constraints and customers, not from a template.",
          points: ["Stakeholder interviews", "Process & systems mapping", "Customer journey analysis", "Clear success measures"],
        },
        {
          title: "Designed at scale",
          body: "Design work that holds up across products, platforms and teams.",
          points: ["Shared design systems", "Accessible interfaces", "Web & mobile patterns", "Clickable prototypes"],
        },
        {
          title: "Engineering in the room",
          body: "Our engineers review every plan, so what we propose is something we know how to build.",
          points: ["Technical feasibility checks", "Architecture options", "Effort & cost estimates", "Hand-off to delivery"],
        },
      ],
    },
    process: {
      heading: "From question to plan",
      steps: [
        { title: "Discover", body: "We talk to your people, review your systems and data, and agree on the problem worth solving first." },
        { title: "Define", body: "Options laid out side by side, with trade-offs, rough costs and a recommended path." },
        { title: "Design & prototype", body: "The chosen direction turned into journeys, screens and a prototype you can put in front of users." },
        { title: "Roadmap & hand-off", body: "A phased plan with priorities and milestones, delivered by our team or yours." },
      ],
    },
    faqs: [
      { q: "Do we need a strategy engagement before building anything?", a: "Not always. If the problem and the solution are already clear, we can go straight to delivery. Strategy work pays off when the options are open, the stakes are high or several teams need to agree." },
      { q: "What do we get at the end?", a: "Usually a prioritized roadmap, designs or a working prototype, and the technical notes needed to estimate and start the build. The exact outputs are agreed at the start." },
      { q: "Can you work with our in-house team?", a: "Yes. We often run workshops and design sprints alongside internal product and engineering teams, and hand over everything so your team can carry it forward." },
      { q: "How long does it take?", a: "A focused discovery can take a few weeks. Broader modernization plans run longer and are split into stages, each with its own outputs." },
    ],
    cta: {
      heading: "Ready to plan your next move",
      body: "Tell us what you are trying to change, and we'll help you work out the clearest way to get there.",
    },
  },
  "digital-commerce": {
    slug: "digital-commerce",
    meta: {
      title: "Ecommerce Development Services | B2B, Stores & Marketplaces",
      description:
        "Ecommerce development services for online stores, B2B ecommerce development and marketplaces: headless, payments, ERP integration. Get a store quote.",
    },
    hero: {
      title: ["Digital", "commerce"],
      intro:
        "We build online stores, B2B ordering portals and marketplaces that are fast to browse, simple to buy from and connected to the systems that fulfil every order.",
    },
    statement: "Selling online is more than a storefront. We build the whole path, from first search to delivered order.",
    labels: { statement: "Why it matters", offer: "Services", highlights: "How we build", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we build",
      body: "Commerce platforms sized to your catalogue, your customers and the way you sell.",
      items: [
        {
          title: "Online stores",
          body: "Storefronts with clean product pages, quick search and a checkout that gets out of the customer's way.",
          tags: ["Shopify", "WooCommerce", "Headless"],
        },
        {
          title: "B2B commerce",
          body: "Ordering portals with account pricing, quotes, bulk orders and approval flows for business buyers.",
          tags: ["Customer pricing", "Quotes", "Reorders"],
        },
        {
          title: "Marketplaces",
          body: "Multi-vendor platforms with seller onboarding, listings, commissions and payouts handled in one place.",
          tags: ["Vendor portals", "Split payments", "Stripe Connect"],
        },
        {
          title: "Personalization & AI",
          body: "Product recommendations, smarter search and tailored offers based on what each shopper browses and buys.",
          tags: ["Recommendations", "AI search", "Segmentation"],
        },
      ],
    },
    highlights: {
      heading: "Built to sell, built to scale",
      body: "A store has to hold up on its busiest day and still be easy for your team to run.",
      items: [
        {
          title: "Unified commerce",
          body: "One view of products, stock, orders and customers across web, mobile and in-person sales.",
          points: ["ERP & inventory sync", "POS integration", "Order management", "Shipping & fulfilment"],
        },
        {
          title: "Secure payments",
          body: "Checkout and payment flows that protect your customers and keep fraud in check.",
          points: ["Card, wallet & local methods", "Subscriptions & invoicing", "Fraud screening", "PCI-aware design"],
        },
        {
          title: "Fast and findable",
          body: "Performance and SEO treated as features, because slow pages and hidden products lose sales.",
          points: ["Core Web Vitals tuning", "Structured product data", "Analytics & conversion tracking", "A/B testing"],
        },
      ],
    },
    process: {
      heading: "From catalogue to checkout",
      steps: [
        { title: "Discovery", body: "We review your products, customers, channels and existing systems, and agree on the platform that fits." },
        { title: "Design", body: "Shopping journeys and screens designed for browsing, comparing and buying on any device." },
        { title: "Build & integrate", body: "The store, payments and back-office connections built and tested with real orders end to end." },
        { title: "Launch & grow", body: "A careful go-live with data migration, then ongoing tuning based on how customers actually shop." },
      ],
    },
    stack: {
      label: "Platforms & technology",
      items: ["Shopify", "WooCommerce", "Medusa", "Next.js", "Stripe", "PayPal", "Algolia", "Node.js", "PostgreSQL", "AWS"],
    },
    faqs: [
      { q: "Should we use Shopify or a custom build?", a: "Hosted platforms like Shopify suit most catalogues and get you live quickly. A headless or custom build makes sense when you need unusual pricing, complex B2B rules or full control over the experience. We will recommend the simplest option that fits." },
      { q: "Can you move our existing store to a new platform?", a: "Yes. We migrate products, customers and order history, keep your URLs and SEO in place with redirects, and run the old and new stores side by side until the switch is safe." },
      { q: "Will the store connect to our ERP or inventory system?", a: "That is a core part of most projects. We connect stock, pricing, orders and customer data so your team is not copying information between systems by hand." },
      { q: "How long does a commerce project take?", a: "A store on an established platform can launch in a matter of weeks. Marketplaces and B2B portals with deep integrations are delivered in phases, starting with the features you need to sell." },
    ],
    cta: {
      heading: "Ready to sell more online",
      body: "Tell us what you sell and how you sell it, and we'll show you what a better store could look like.",
    },
  },
} satisfies Record<string, ServiceContent>;
