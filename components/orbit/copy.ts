export const SCENES = [
  { id: 'arrival', index: '01', label: 'ARRIVAL' },
  { id: 'core', index: '02', label: 'THE CORE' },
  { id: 'network', index: '03', label: 'CAPABILITIES' },
  { id: 'pipeline', index: '04', label: 'THE PIPELINE' },
  { id: 'outcomes', index: '05', label: 'OUTCOMES' },
  { id: 'architecture', index: '06', label: 'ARCHITECTURE' },
  { id: 'partnership', index: '07', label: 'PARTNERSHIP' },
  { id: 'handshake', index: '08', label: 'START' },
] as const

export type SceneId = (typeof SCENES)[number]['id']

export const HERO = {
  eyebrow: 'GREENCHRONIX ENGINEERING STUDIO',
  title: 'Engineering, without the excess.',
  sub: 'A lean studio shipping web platforms, AI agents, blockchain systems and cloud infrastructure. Clean code. Honest timelines. No bloat.',
  scrollHint: 'Scroll to enter',
}

export const CORE = {
  eyebrow: 'HOW WE OPERATE',
  title: 'Small team. Machined process.',
  body: 'Every project runs through the same precision core: locked scope, visible progress, and a delivery window we actually hit. Senior engineers only. No handoffs to juniors, no agency layers.',
  stats: [
    { value: '15 to 35', unit: 'DAYS', label: 'Typical delivery' },
    { value: '30', unit: 'DAYS', label: 'Included support' },
    { value: 'Next.js', unit: 'CORE', label: 'Primary stack' },
  ],
}

export const SERVICES = {
  eyebrow: 'WHAT WE BUILD',
  title: 'Six disciplines. One standard.',
  items: [
    {
      name: 'Web Applications',
      detail: 'Production-grade platforms in Next.js and React. Fast, accessible, built to scale.',
    },
    {
      name: 'AI Agents & Chatbots',
      detail: 'Custom LLM-powered agents that answer, automate and act on real business data.',
    },
    {
      name: 'Blockchain & Web3',
      detail: 'Smart contracts, wallet integrations and token dashboards. Audited and shipped.',
    },
    {
      name: 'Data & Automation',
      detail: 'Pipelines, scrapers and workflow automation that remove hours of manual work.',
    },
    {
      name: 'Cloud, APIs & DevOps',
      detail: 'API design, serverless infrastructure and CI/CD that deploys without drama.',
    },
    {
      name: 'Deploy & Maintain',
      detail: 'Zero-downtime launches with 30 days of post-launch care included on every build.',
    },
  ],
}

export const PIPELINE = {
  eyebrow: 'THE PROCESS',
  title: 'Scope locked. Progress visible. Handoff included.',
  steps: [
    {
      name: 'Scope',
      detail: 'One call. We define exactly what ships, what it costs and when it lands, in writing.',
    },
    {
      name: 'Build',
      detail: 'Weekly demos on a live staging URL. You watch it come together in real time.',
    },
    {
      name: 'Ship',
      detail: 'Deployed to production with docs, credentials and a full handoff. It is yours.',
    },
  ],
}

export const PROJECTS = {
  eyebrow: 'SELECTED WORK',
  title: 'Built. Shipped. Running.',
  items: [
    {
      name: 'Restaurant Platform',
      outcome: 'Online ordering and reservations, with bookings up from day one.',
      stack: 'Next.js · Stripe',
    },
    {
      name: 'Invoice Automation',
      outcome: 'Generation, delivery and reconciliation automated end to end.',
      stack: 'Node · Postgres',
    },
    {
      name: 'Sales Dashboard',
      outcome: 'Live revenue analytics replacing a week of spreadsheet work.',
      stack: 'Next.js · Charts',
    },
    {
      name: 'Support Chatbot',
      outcome: 'AI agent resolving the majority of tickets without a human.',
      stack: 'LLM · RAG',
    },
    {
      name: 'Web3 Wallet Dashboard',
      outcome: 'Multi-chain balances, tokens and transactions in one view.',
      stack: 'Ethers · Next.js',
    },
    {
      name: 'API Platform',
      outcome: 'Public API designed, documented and deployed on serverless.',
      stack: 'Serverless · CI/CD',
    },
  ],
}

export const ARCHITECTURE = {
  eyebrow: 'WHY LEAN WINS',
  title: 'Structure over headcount.',
  body: 'Big agencies sell hours. We sell outcomes. A small senior team with a rigid delivery frame outbuilds a large one with meetings, every time.',
  values: [
    { name: 'Direct access', detail: 'You talk to the engineers building your product. No account managers.' },
    { name: 'Honest scoping', detail: 'If something takes three weeks, we say three weeks. Then we hit it.' },
    { name: 'Code you own', detail: 'Full repository handoff, documented and deployable without us.' },
  ],
}

export const PARTNERSHIP = {
  eyebrow: 'AFTER LAUNCH',
  title: 'We stay in the loop.',
  body: 'Shipping is the start, not the end. Every engagement includes 30 days of support, and most clients keep us on for the next build.',
  points: [
    { name: 'Weekly updates', detail: 'Progress you can see. Staging links, not status reports.' },
    { name: 'Quality gates', detail: 'Type-safe code, reviews and tests before anything reaches production.' },
    { name: 'Post-launch care', detail: 'Fixes, tweaks and guidance for 30 days after go-live, included.' },
  ],
}

export const CONTACT = {
  eyebrow: 'START A PROJECT',
  title: "Tell us what you're building.",
  body: 'One conversation is enough to scope most projects. We reply within 24 hours.',
  email: 'build@greenchronix.com',
  phoneDisplay: '+91 76230 79600',
  whatsapp: 'https://wa.me/917623079600',
  location: 'Gandhinagar, Gujarat · Remote worldwide',
}
