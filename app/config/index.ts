import { PerformanceBudget, QualityLevel } from "../types";

export const COLORS = {
  background: "#050505",
  surface: "#111111",
  elevatedSurface: "#171717",
  emeraldPrimary: "#00E38C",
  emeraldSoft: "#45F5B2",
  emeraldDeep: "#00A86B",
  highlightBlue: "#4DA3FF",
} as const;

export const TYPOGRAPHY = {
  fontPrimary: "var(--font-geist-sans)",
  fontFallback: "Inter, sans-serif",
} as const;

export const MOTION = {
  hoverDuration: 0.18,
  buttonDuration: 0.22,
  cardDuration: 0.3,
  sectionRevealDuration: 0.5,
  largeTransitionDuration: 0.9,
  sceneTransitionDuration: 1.2,
  easePrimary: "power3.out", // easeOutCubic equivalent for GSAP
  easeSecondary: "power3.inOut",
} as const;

export const PERFORMANCE_PRESETS: Record<QualityLevel, PerformanceBudget> = {
  Ultra: {
    maxParticles: 300,
    dpr: [1, 2],
    enablePostProcessing: true,
    enableVolumetricFog: true,
    textureResolution: "high",
  },
  High: {
    maxParticles: 150,
    dpr: [1, 2],
    enablePostProcessing: true,
    enableVolumetricFog: false,
    textureResolution: "high",
  },
  Medium: {
    maxParticles: 75,
    dpr: [1, 1.5],
    enablePostProcessing: false,
    enableVolumetricFog: false,
    textureResolution: "low",
  },
  Low: {
    maxParticles: 30,
    dpr: [1, 1],
    enablePostProcessing: false,
    enableVolumetricFog: false,
    textureResolution: "low",
  },
  Fallback: {
    maxParticles: 0,
    dpr: [1, 1],
    enablePostProcessing: false,
    enableVolumetricFog: false,
    textureResolution: "low",
  },
};

export const CORE_PARAMETERS = {
  radius: 2,
  detail: 2,
  nodeCount: 80,
  connectionDist: 1.2,
};

export const CAMERA_PRESETS = {
  marketing_hero: [1.5, 0.5, 4.5] as [number, number, number],
  top_down: [0, 5, 0] as [number, number, number],
  macro_core: [0, 0, 2.5] as [number, number, number],
};

export const SCENE_DEFINITIONS = [
  {
    id: 0,
    name: "ARRIVAL",
    camera: { target: [0, 0, 6] as [number, number, number] },
    core: { scale: 1.5, rotationY: 0 },
  },
  {
    id: 1,
    name: "ENGINEERING_PHILOSOPHY",
    camera: { target: [0, 1, 4] as [number, number, number] },
    core: { scale: 1.5, rotationY: Math.PI / 4 },
  },
  {
    id: 2,
    name: "CAPABILITIES",
    camera: { target: [0, 0, 9] as [number, number, number] },
    core: { scale: 1.0, rotationY: Math.PI / 2 },
  },
  {
    id: 3,
    name: "PIPELINE",
    camera: { target: [0, 0, 2] as [number, number, number] },
    core: { scale: 1.0, rotationY: Math.PI },
  }
];

export const ENGINEERING_DOMAINS = [
  {
    id: "ai",
    title: "Artificial Intelligence",
    desc: "Neural network visualization. Soft flowing connections.",
    capabilities: ["AI Agents", "Large Language Models", "Machine Learning", "Computer Vision", "Predictive Analytics"],
    pos: [-3.5, 1.5, -1] as [number, number, number],
    color: "#FFFFFF",
    geometry: "icosahedron",
  },
  {
    id: "data",
    title: "Data Engineering",
    desc: "Flowing data streams. Animated pipelines.",
    capabilities: ["Data Platforms", "ETL", "Dashboards", "Analytics", "Data Warehousing"],
    pos: [2.5, -2.5, 1.5] as [number, number, number],
    color: "#00E38C",
    geometry: "octahedron",
  },
  {
    id: "cloud",
    title: "Cloud Infrastructure",
    desc: "Floating cloud architecture. Connected servers.",
    capabilities: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"],
    pos: [-2.5, -1.5, 3] as [number, number, number],
    color: "#3B82F6",
    geometry: "box",
  },
  {
    id: "enterprise",
    title: "Enterprise Systems",
    desc: "Modular software architecture. Expandable interface blocks.",
    capabilities: ["SaaS Platforms", "ERP", "CRM", "Automation", "Internal Tools"],
    pos: [4, 1.5, -2] as [number, number, number],
    color: "#F59E0B",
    geometry: "dodecahedron",
  },
  {
    id: "cyber",
    title: "Cybersecurity",
    desc: "Protected digital shield. Encrypted network.",
    capabilities: ["Security Reviews", "Secure Development", "Authentication", "Monitoring", "Risk Assessment"],
    pos: [0, 3.5, 0.5] as [number, number, number],
    color: "#EF4444",
    geometry: "tetrahedron",
  }
];

export const PIPELINE_STAGES = [
  {
    id: "discover",
    title: "Discover",
    desc: "Understand the business problem, users, constraints, and success metrics before proposing solutions.",
    pos: [-2.5, 0, -4] as [number, number, number],
    color: "#00E38C",
    geometry: "torus",
  },
  {
    id: "architect",
    title: "Architect",
    desc: "Design scalable, secure, and maintainable system architecture.",
    pos: [2.5, 0, -9] as [number, number, number],
    color: "#3B82F6",
    geometry: "box-wireframe",
  },
  {
    id: "engineer",
    title: "Engineer",
    desc: "Develop modular, production-ready software using modern engineering practices.",
    pos: [-2.5, 0, -14] as [number, number, number],
    color: "#F59E0B",
    geometry: "stacked-boxes",
  },
  {
    id: "validate",
    title: "Validate",
    desc: "Performance testing, accessibility, security, quality assurance, and cross-device verification.",
    pos: [2.5, 0, -19] as [number, number, number],
    color: "#FFFFFF",
    geometry: "shield-rings",
  },
  {
    id: "deploy",
    title: "Deploy",
    desc: "Reliable deployment with monitoring, observability, rollback strategy, and automation.",
    pos: [-2.5, 0, -24] as [number, number, number],
    color: "#EF4444",
    geometry: "burst",
  },
  {
    id: "evolve",
    title: "Evolve",
    desc: "Continuous improvement driven by real-world feedback and measurable outcomes.",
    pos: [0, 0, -29] as [number, number, number],
    color: "#A855F7",
    geometry: "infinity",
  }
];

