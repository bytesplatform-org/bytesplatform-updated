import type { ServiceContent } from "../serviceContent";

/** Cloud, infrastructure, managed services, security and emerging technology service pages. */
export const cloudSecurityServices = {
  "cloud-operations-migration": {
    slug: "cloud-operations-migration",
    meta: {
      title: "Cloud Migration Services & Managed Cloud Ops | BytesPlatform",
      description:
        "Cloud migration services and cloud managed services: readiness assessment, landing zones, phased AWS, Azure or GCP moves and FinOps. Plan your migration.",
    },
    hero: {
      title: ["Cloud operations", "& migration"],
      intro:
        "We move your applications and data to the cloud in planned stages, then run the environment with the monitoring, automation and cost control it needs to stay healthy.",
    },
    statement: "A migration is not finished when the servers move. It is finished when the new environment is faster, safer and cheaper to run.",
    labels: { statement: "Why the cloud", offer: "Services", highlights: "How we run it", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we take on",
      body: "From a first workload to a full data center exit, scoped around what your business needs to keep running.",
      items: [
        {
          title: "Cloud readiness assessment",
          body: "An inventory of your applications, data and dependencies, with a clear view of what to move, what to rebuild and what to retire.",
          tags: ["Discovery", "Dependency mapping", "TCO"],
        },
        {
          title: "Migration delivery",
          body: "Workloads rehosted, replatformed or refactored and moved in waves, with tested cutovers and a rollback plan for each.",
          tags: ["Rehost", "Replatform", "Refactor", "Data migration"],
        },
        {
          title: "Cloud operations",
          body: "Day-to-day running of your cloud: monitoring, patching, backups, scaling and incident response, handled by one team.",
          tags: ["Monitoring", "Backups", "Incident response"],
        },
        {
          title: "Cost optimization",
          body: "Right-sized resources, reserved capacity and tagging that shows where every dollar goes, reviewed on a regular schedule.",
          tags: ["FinOps", "Right-sizing", "Cost reporting"],
        },
      ],
    },
    highlights: {
      heading: "A cloud that is built to be run",
      body: "We set up the environment so it can be operated, audited and changed without guesswork.",
      items: [
        {
          title: "Landing zones done right",
          body: "Accounts, networks and permissions laid out before the first workload arrives.",
          points: ["Account & subscription structure", "Network segmentation", "Identity & access policies", "Guardrails and tagging"],
        },
        {
          title: "Everything as code",
          body: "Infrastructure defined in version control, so changes are reviewed and repeatable.",
          points: ["Terraform & IaC modules", "CI/CD for infrastructure", "Drift detection", "Documented environments"],
        },
        {
          title: "Visible and accountable",
          body: "Dashboards and alerts that show health, cost and risk in one place.",
          points: ["Centralized logging", "Alerting & on-call runbooks", "Cost dashboards", "Regular operations reviews"],
        },
      ],
    },
    process: {
      heading: "From on-premises to running in the cloud",
      steps: [
        { title: "Assess", body: "We map your applications, data and dependencies, and agree on a target architecture and migration order." },
        { title: "Prepare", body: "The landing zone, networking, security controls and pipelines are built before any workload moves." },
        { title: "Migrate", body: "Workloads move in waves, each tested and cut over with a rollback plan ready." },
        { title: "Operate & optimize", body: "We run the environment, tune performance and cost, and keep improving it as your needs change." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["AWS", "Microsoft Azure", "Google Cloud", "Terraform", "Kubernetes", "Docker", "GitHub Actions", "Datadog", "Prometheus", "Grafana"],
    },
    faqs: [
      { q: "Which cloud provider should we choose?", a: "It depends on your existing tools, skills, compliance needs and workloads. We compare the options against your situation and recommend one, or a mix, with the reasons written down." },
      { q: "Will our systems go down during the migration?", a: "We plan cutovers to keep downtime as short as possible, usually in agreed maintenance windows, and test each move in advance with a rollback plan ready." },
      { q: "Do we have to move everything at once?", a: "No. Most migrations run in waves, starting with lower-risk workloads. Some systems may stay on-premises in a hybrid setup if that makes more sense." },
      { q: "Can you run the cloud environment after migration?", a: "Yes. We can operate it for you on an ongoing basis, or hand it over to your team with documentation, runbooks and training." },
    ],
    cta: {
      heading: "Ready to move to the cloud",
      body: "Tell us what you run today, and we'll map out a migration path that fits your timeline and budget.",
    },
  },

  "cloud-application-development": {
    slug: "cloud-application-development",
    meta: {
      title: "Cloud Application Development Services | BytesPlatform",
      description:
        "Cloud application development services: cloud-native application development, API integration, legacy modernization and CI/CD on AWS or Azure. Talk to us.",
    },
    hero: {
      title: ["Cloud app development", "& integration"],
      intro:
        "We build cloud-native applications, connect the systems your business depends on and modernize legacy software so it can scale, ship faster and cost less to run.",
    },
    statement: "Software built for the cloud scales with demand, recovers on its own and ships updates without drama. We build it that way from the start.",
    labels: { statement: "Why cloud-native", offer: "Services", highlights: "How we build", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we build",
      body: "New products, connected systems and older applications given a second life.",
      items: [
        {
          title: "Cloud-native applications",
          body: "Web platforms and backend services designed around containers, managed services and automated deployment.",
          tags: ["Microservices", "Containers", "Serverless"],
        },
        {
          title: "APIs & integration",
          body: "Clean APIs and integrations that let your CRM, ERP, payments and internal tools share data reliably.",
          tags: ["REST", "GraphQL", "Webhooks", "Event streaming"],
        },
        {
          title: "Legacy modernization",
          body: "Older applications broken into manageable pieces and moved to modern frameworks and infrastructure, without stopping the business.",
          tags: ["Re-architecture", "Strangler pattern", "Data migration"],
        },
        {
          title: "DevOps & delivery pipelines",
          body: "Automated build, test and release pipelines so every change reaches production the same safe way.",
          tags: ["CI/CD", "IaC", "Automated testing"],
        },
      ],
    },
    highlights: {
      heading: "Built to scale and to change",
      body: "Good cloud software is easy to deploy, easy to observe and easy to extend.",
      items: [
        {
          title: "Designed for scale",
          body: "Architecture that grows with your users without a rewrite.",
          points: ["Horizontal scaling", "Managed databases & queues", "Caching & CDN", "Multi-environment setup"],
        },
        {
          title: "Integration you can trust",
          body: "Data moves between systems accurately, and failures are caught early.",
          points: ["Versioned, documented APIs", "Retries & idempotency", "Message queues & events", "Integration monitoring"],
        },
        {
          title: "Secure by default",
          body: "Security built into the code and the pipeline, not added at the end.",
          points: ["Secrets management", "Least-privilege access", "Dependency scanning", "Encryption in transit & at rest"],
        },
      ],
    },
    process: {
      heading: "From brief to production",
      steps: [
        { title: "Discovery", body: "We learn your goals, users and current systems, and agree on the architecture and scope." },
        { title: "Architecture & design", body: "Services, data flows, integrations and infrastructure are designed and reviewed before the build begins." },
        { title: "Build & integrate", body: "We develop in short iterations, connect your systems and test every release in a staging environment." },
        { title: "Launch & support", body: "A planned release, then monitoring, fixes and new features as the product grows." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["AWS", "Microsoft Azure", "Google Cloud", "Kubernetes", "Docker", "Node.js", ".NET", "Python", "PostgreSQL", "Kafka"],
    },
    faqs: [
      { q: "What does cloud-native actually mean?", a: "It means the application is designed to run on cloud infrastructure from the start, packaged in containers or as managed services, deployed automatically, and able to scale and recover without manual work." },
      { q: "Do we need to rewrite our legacy application?", a: "Not always. Some applications can be moved and improved step by step. We assess the codebase and recommend the least disruptive path that still meets your goals." },
      { q: "Can you integrate with the software we already use?", a: "Yes. We connect most business platforms that offer APIs, and build custom connectors or middleware where they don't." },
      { q: "Will we own the code?", a: "Yes. The code, infrastructure definitions and documentation belong to you, so your team or any partner can work on them later." },
    ],
    cta: {
      heading: "Ready to build for the cloud",
      body: "Share what you want to build or modernize, and we'll propose an architecture and a plan to get there.",
    },
  },

  "managed-services": {
    slug: "managed-services",
    meta: {
      title: "Managed IT Services | 24/7 Support & SLAs | BytesPlatform",
      description:
        "Managed IT services with 24/7 monitoring, help desk and infrastructure support under clear SLAs. Built for small businesses and growing teams. Get a quote.",
    },
    hero: {
      title: ["Managed", "services"],
      intro:
        "We take ongoing responsibility for your applications and IT, covering monitoring, support, maintenance and steady improvement under service levels agreed up front.",
    },
    statement: "Systems don't stand still after launch. Someone has to watch them, fix them and keep them current. We do that work, every day.",
    labels: { statement: "Why managed", offer: "Services", highlights: "How we work", process: "Onboarding", faq: "FAQ" },
    offer: {
      heading: "What we manage",
      body: "Pick the scope that fits, a single application, your cloud environment or your wider IT estate.",
      items: [
        {
          title: "Application support",
          body: "Bug fixes, small enhancements and performance tuning for the software your business runs on, whether we built it or not.",
          tags: ["L2/L3 support", "Bug fixes", "Enhancements"],
        },
        {
          title: "Monitoring & incident response",
          body: "Uptime, performance and error monitoring with alerts routed to engineers who know your systems.",
          tags: ["Alerting", "On-call", "Root cause analysis"],
        },
        {
          title: "Infrastructure management",
          body: "Servers, cloud resources, backups and patching kept in order and documented.",
          tags: ["Patching", "Backups", "Capacity planning"],
        },
        {
          title: "IT help desk",
          body: "A single point of contact for your staff's day-to-day IT issues, from access requests to device problems.",
          tags: ["Service desk", "Ticketing", "User support"],
        },
      ],
    },
    highlights: {
      heading: "Support you can measure",
      body: "Clear commitments, visible work and a team that gets to know your systems.",
      items: [
        {
          title: "Agreed service levels",
          body: "Response and resolution targets set together and reported on.",
          points: ["Priority-based response times", "Defined escalation paths", "Monthly service reports", "Regular review meetings"],
        },
        {
          title: "Proactive, not reactive",
          body: "Problems found and fixed before your users notice them.",
          points: ["Health checks & audits", "Patch & update schedules", "Capacity forecasting", "Trend analysis on incidents"],
        },
        {
          title: "Knowledge that stays",
          body: "What we learn about your systems is written down and shared.",
          points: ["Runbooks & documentation", "Change records", "Known-issue tracking", "Clean handover on request"],
        },
      ],
    },
    process: {
      heading: "How we take over",
      steps: [
        { title: "Assessment", body: "We review your systems, current support setup and pain points, and agree on scope and service levels." },
        { title: "Knowledge transfer", body: "We document your environment, set up access and monitoring, and learn from whoever runs it today." },
        { title: "Transition", body: "Support moves to our team in a planned handover, with a period of shared responsibility." },
        { title: "Steady state", body: "Day-to-day support and maintenance, with regular reports and a running list of improvements." },
      ],
    },
    stack: {
      label: "Tools we work with",
      items: ["Jira Service Management", "ServiceNow", "Datadog", "Grafana", "PagerDuty", "Sentry", "AWS", "Microsoft Azure", "Microsoft 365", "Intune"],
    },
    faqs: [
      { q: "Can you support software you didn't build?", a: "Yes. We start with a knowledge-transfer phase to learn the codebase and infrastructure, then document what we find before we take on support." },
      { q: "How are service levels decided?", a: "We agree on them together, based on how critical each system is to your business. Targets, priorities and escalation paths are written into the agreement." },
      { q: "Is pricing fixed or based on hours?", a: "We offer both. Many clients choose a fixed monthly scope with a block of hours for enhancements; others prefer pay-as-you-go. We'll recommend what fits your usage." },
      { q: "Can we bring support back in-house later?", a: "Yes. Because everything is documented as we go, we can hand over to your team or another provider whenever you choose." },
    ],
    cta: {
      heading: "Ready to hand off the day-to-day",
      body: "Tell us what you need supported, and we'll propose a scope and service levels that fit.",
    },
  },

  "digital-infrastructure": {
    slug: "digital-infrastructure",
    meta: {
      title: "IT Infrastructure Services | Network, Servers & Cloud",
      description:
        "IT infrastructure services covering network design, servers, data center and hybrid cloud, with IT infrastructure management by one team. Book an audit.",
    },
    hero: {
      title: ["Digital", "infrastructure"],
      intro:
        "We design, build and maintain the networks, servers, hybrid environments and workplace technology your business runs on, from the office floor to the cloud.",
    },
    statement: "Every application depends on the layers beneath it. When the network, servers and devices are solid, everything above them works better.",
    labels: { statement: "Why it matters", offer: "Services", highlights: "How we build", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we cover",
      body: "The physical and virtual foundation of your IT, planned as one connected system.",
      items: [
        {
          title: "Network design & management",
          body: "Wired, wireless and site-to-site networks designed for speed, reliability and segmentation.",
          tags: ["LAN/WAN", "SD-WAN", "Wi-Fi", "VPN"],
        },
        {
          title: "Servers & data center",
          body: "Physical and virtual servers, storage and backup set up, consolidated and maintained.",
          tags: ["Virtualization", "Storage", "Backup & recovery"],
        },
        {
          title: "Hybrid infrastructure",
          body: "On-premises systems and cloud services connected and managed as one environment.",
          tags: ["Hybrid cloud", "Identity", "Connectivity"],
        },
        {
          title: "Workplace & end-user technology",
          body: "Laptops, devices, collaboration tools and access set up so people can work securely from anywhere.",
          tags: ["Device management", "Microsoft 365", "Google Workspace", "Remote access"],
        },
      ],
    },
    highlights: {
      heading: "Infrastructure that stays out of the way",
      body: "Good infrastructure is the kind nobody has to think about.",
      items: [
        {
          title: "Reliable by design",
          body: "Redundancy and recovery planned in from the start.",
          points: ["Redundant links & hardware", "Tested backups", "Disaster recovery plans", "Capacity headroom"],
        },
        {
          title: "Secure at every layer",
          body: "Controls on the network, the servers and every device.",
          points: ["Network segmentation", "Firewall management", "Endpoint protection", "Identity & access control"],
        },
        {
          title: "Managed centrally",
          body: "One view of your infrastructure, with changes tracked and documented.",
          points: ["Central monitoring", "Automated patching", "Asset inventory", "Network & system diagrams"],
        },
      ],
    },
    process: {
      heading: "From audit to steady running",
      steps: [
        { title: "Audit", body: "We inventory your current network, servers and devices, and identify risks, gaps and bottlenecks." },
        { title: "Design", body: "A target architecture and a phased plan, sized to your budget and growth." },
        { title: "Deploy", body: "Equipment and services installed and configured in planned windows, with minimal disruption to your team." },
        { title: "Maintain", body: "Monitoring, patching and support to keep the environment healthy, with regular reviews." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["Cisco", "Fortinet", "Ubiquiti", "VMware", "Microsoft Hyper-V", "Windows Server", "Linux", "Microsoft Azure", "AWS", "Microsoft Intune"],
    },
    faqs: [
      { q: "Do you work with small offices as well as larger sites?", a: "Yes. We plan infrastructure around the size and growth of your business, from a single office to multiple locations and remote teams." },
      { q: "Should we keep servers on-premises or move to the cloud?", a: "It depends on your applications, data rules and costs. Many businesses land on a hybrid setup. We'll compare the options and recommend what fits." },
      { q: "Can you work with our existing hardware?", a: "Usually, yes. We assess what you have, keep what is still sound and recommend replacing only what needs it." },
      { q: "How do you handle remote and hybrid workers?", a: "We set up secure remote access, managed devices and cloud collaboration tools so people can work from anywhere with the same protections as the office." },
    ],
    cta: {
      heading: "Ready to strengthen your foundation",
      body: "Tell us about your sites, systems and team, and we'll recommend where to start.",
    },
  },

  cybersecurity: {
    slug: "cybersecurity",
    meta: {
      title: "Cybersecurity Services | Assessments to Response",
      description:
        "Cybersecurity services from assessments and pen testing to IAM and threat detection, plus managed cybersecurity services for SOC 2 and HIPAA. Close gaps.",
    },
    hero: {
      title: ["Cybersecurity", "services"],
      intro:
        "We find the gaps in your systems, close them and help you stay ahead of threats, across your cloud, applications, devices and people.",
    },
    statement: "Security is not a product you buy once. It is a set of habits, controls and checks that have to hold up every day.",
    labels: { statement: "Why security", offer: "Services", highlights: "How we protect", process: "Process", faq: "FAQ" },
    offer: {
      heading: "How we protect you",
      body: "Practical security work, prioritized by the risks that matter most to your business.",
      items: [
        {
          title: "Security assessments",
          body: "A clear picture of where you are exposed, from vulnerability scans and penetration tests to configuration reviews.",
          tags: ["Risk assessment", "Pen testing", "Vulnerability scanning"],
        },
        {
          title: "Cloud & application security",
          body: "Secure configurations, code reviews and pipeline checks for the software and cloud services you run.",
          tags: ["Cloud posture", "Secure SDLC", "OWASP"],
        },
        {
          title: "Identity & access management",
          body: "The right people with the right access, enforced with single sign-on, multi-factor authentication and regular reviews.",
          tags: ["SSO", "MFA", "Least privilege", "Zero trust"],
        },
        {
          title: "Threat detection & response",
          body: "Logging, alerting and a tested plan for what to do when something goes wrong.",
          tags: ["SIEM", "EDR", "Incident response"],
        },
      ],
    },
    highlights: {
      heading: "Security that fits how you work",
      body: "Controls only help if your team can live with them.",
      items: [
        {
          title: "Risk-based priorities",
          body: "We fix the issues most likely to hurt you first.",
          points: ["Asset & data inventory", "Threat modeling", "Prioritized remediation plans", "Clear risk reporting"],
        },
        {
          title: "Compliance readiness",
          body: "Controls and evidence that help you work toward the frameworks your customers ask about.",
          points: ["SOC 2 readiness", "HIPAA safeguards", "PCI DSS controls", "Policy & procedure writing"],
        },
        {
          title: "People and process",
          body: "Most incidents start with a person. We help your team spot and stop them.",
          points: ["Security awareness training", "Phishing simulations", "Incident response playbooks", "Tabletop exercises"],
        },
      ],
    },
    process: {
      heading: "From exposure to control",
      steps: [
        { title: "Assess", body: "We review your systems, data, access and policies to find where you are most exposed." },
        { title: "Prioritize", body: "Findings are ranked by risk and effort, and turned into a practical remediation roadmap." },
        { title: "Remediate", body: "We fix configurations, harden systems, roll out controls and train your team." },
        { title: "Monitor & improve", body: "Ongoing monitoring, periodic testing and reviews keep your defenses current." },
      ],
    },
    stack: {
      label: "Tools we work with",
      items: ["Microsoft Defender", "CrowdStrike", "Microsoft Sentinel", "Splunk", "Okta", "Microsoft Entra ID", "AWS Security Hub", "Wiz", "Burp Suite", "Snyk"],
    },
    faqs: [
      { q: "Where should a business start with cybersecurity?", a: "With an assessment. Knowing what you have, where your data lives and who can reach it shows which fixes will reduce the most risk for the effort." },
      { q: "Can you help us get SOC 2 or HIPAA ready?", a: "Yes. We help you put the required controls, policies and evidence in place and prepare for the audit. The certification itself comes from an independent auditor." },
      { q: "Do you offer penetration testing?", a: "Yes. We test web applications, APIs, networks and cloud environments, then report findings with clear steps to fix them and retest once they're addressed." },
      { q: "What happens if we have a security incident?", a: "We help contain the incident, investigate what happened, restore systems and close the gap that allowed it. We also help you prepare a response plan before anything goes wrong." },
    ],
    cta: {
      heading: "Ready to close the gaps",
      body: "Tell us what you're protecting, and we'll show you where to start.",
    },
  },

  "emerging-technologies": {
    slug: "emerging-technologies",
    meta: {
      title: "Computer Vision Development Services | AR/VR, RPA & More",
      description:
        "Computer vision development services plus AR/VR, blockchain and robotic process automation services, delivered as rapid prototypes. Test your idea.",
    },
    hero: {
      title: ["Emerging", "technologies"],
      intro:
        "We help you test new technologies against real business problems, with focused prototypes that show what works before you commit to a full build.",
    },
    statement: "New technology is only worth adopting when it solves a real problem. We find out quickly, with working prototypes rather than slide decks.",
    labels: { statement: "Why explore", offer: "Services", highlights: "How we work", process: "Process", faq: "FAQ" },
    offer: {
      heading: "What we explore",
      body: "Technologies that are ready for practical use, applied where they make a measurable difference.",
      items: [
        {
          title: "Computer vision",
          body: "Systems that read images and video to inspect products, count items, read documents or monitor spaces.",
          tags: ["Object detection", "OCR", "Video analytics"],
        },
        {
          title: "AR & VR experiences",
          body: "Immersive apps for training, product visualization and remote assistance, on phones, tablets and headsets.",
          tags: ["Augmented reality", "Virtual reality", "3D"],
        },
        {
          title: "Blockchain solutions",
          body: "Shared ledgers and smart contracts where several parties need a trusted, tamper-evident record.",
          tags: ["Smart contracts", "Tokenization", "Traceability"],
        },
        {
          title: "Robotic process automation & IoT",
          body: "Software bots for repetitive screen-based tasks, and connected sensors that bring physical operations into your data.",
          tags: ["RPA", "IoT sensors", "Edge devices"],
        },
      ],
    },
    highlights: {
      heading: "Grounded in real outcomes",
      body: "We treat every new technology as an experiment with a clear question to answer.",
      items: [
        {
          title: "Problem first",
          body: "We start with the business problem, then pick the technology, not the other way around.",
          points: ["Use-case workshops", "Feasibility checks", "Success criteria agreed up front", "Honest go/no-go calls"],
        },
        {
          title: "Rapid prototyping",
          body: "Working proofs of concept in weeks, tested with real users and real data.",
          points: ["Short build cycles", "Real-world testing", "User feedback sessions", "Clear findings reports"],
        },
        {
          title: "Path to production",
          body: "When a prototype proves itself, we plan and build the version that scales.",
          points: ["Integration with existing systems", "Security & data privacy review", "Scalable architecture", "Rollout planning"],
        },
      ],
    },
    process: {
      heading: "From idea to proven prototype",
      steps: [
        { title: "Explore", body: "We work through your challenges and shortlist the use cases where new technology could help most." },
        { title: "Validate", body: "We check feasibility, data, cost and risk, and agree on what success looks like." },
        { title: "Prototype", body: "A working proof of concept built in short cycles and tested in real conditions." },
        { title: "Scale", body: "If it delivers, we plan and build the production version and integrate it with your systems." },
      ],
    },
    stack: {
      label: "Technology stack",
      items: ["OpenCV", "PyTorch", "Unity", "ARKit", "ARCore", "WebXR", "Ethereum", "Solidity", "UiPath", "AWS IoT"],
    },
    faqs: [
      { q: "How do we know if a new technology is right for us?", a: "We start with the problem you want to solve and test the idea with a small prototype. If it doesn't deliver, you find out early and at low cost." },
      { q: "How long does a prototype take?", a: "Most focused proofs of concept take a few weeks, depending on the technology, data availability and how many systems they need to touch." },
      { q: "Is blockchain worth it for most businesses?", a: "Often it isn't. It makes sense when several parties need a shared, tamper-evident record and don't fully trust a single owner of the data. We'll tell you honestly if a regular database would do the job better." },
      { q: "Can a prototype become a production system?", a: "Yes. We build prototypes with a path to production in mind, then harden, secure and scale the parts that prove their value." },
    ],
    cta: {
      heading: "Ready to test a new idea",
      body: "Tell us the problem you're trying to solve, and we'll suggest a quick way to find out what's possible.",
    },
  },
} satisfies Record<string, ServiceContent>;
