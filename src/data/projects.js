// ---------------------------------------------------------------------------
// The Archive — project entries for the /projects world.
//
// Each project is a capsule: a handful of legible facts plus a color palette
// used as its "artwork" on the orbiting panel. `youtube` is the id that opens
// in the modal (replace with real case-study videos when available).
//
// Palette format: [tint, core, glow] — tint wraps the panel edge, core paints
// the body, glow emits from behind. Keep them in the same hue family per
// project so the cylinder reads as a gradient catalog as you scroll.
// ---------------------------------------------------------------------------

export const PROJECTS = [
  {
    id: 'ai-launch',
    code: 'AX / 001',
    title: 'AI Launch Experience',
    tagline: 'A product becomes a presence.',
    description:
      'Full-bleed launch story for a frontier AI platform. Scroll-led cinematics frame the product as an inevitable force — not a tool, an atmosphere.',
    subjects: ['Concept', 'Art direction', 'WebGL', 'Motion'],
    year: '2025',
    palette: ['#8a5cff', '#2a1557', '#c89bff'],
    youtube: 'aqz-KE-bpKQ'
  },
  {
    id: 'heritage',
    code: 'AX / 002',
    title: 'Heritage Brand Platform',
    tagline: 'Craft, in the future tense.',
    description:
      'A modern re-framing of an old-world craft house. Editorial typography, archival layers, and quiet shader atmospherics hold the brand between library and laboratory.',
    subjects: ['Brand', 'Web design', '3D', 'Development'],
    year: '2024',
    palette: ['#e8a95a', '#2b1a08', '#ffd69a'],
    youtube: 'ScMzIvxBSi4'
  },
  {
    id: 'ai-showcase',
    code: 'AX / 003',
    title: 'AI Product Showcase',
    tagline: 'A clean, future-facing object room.',
    description:
      'A sleek product site for an intelligent platform. Spatial product portraits, precise copy, and responsive WebGL moments built around a story of trust and power.',
    subjects: ['Concept', 'Web design', 'WebGL', '3D design'],
    year: '2024',
    palette: ['#6ef0ff', '#061820', '#a8f6ff'],
    youtube: 'jNQXAC9IVRw'
  },
  {
    id: 'luxury-film',
    code: 'AX / 004',
    title: 'Luxury Motion Film',
    tagline: 'Four acts. One engine. No shortcuts.',
    description:
      'CG-driven short film for a premium automotive campaign. A four-stage visual journey told through digital art, motion design and cinematic compositing — built for large-format rooms.',
    subjects: ['Creative concept', '3D design', 'Motion', 'Compositing'],
    year: '2024',
    palette: ['#ff6b2c', '#1b0a04', '#ffc48a'],
    youtube: 'aqz-KE-bpKQ'
  },
  {
    id: 'synthetic-human',
    code: 'AX / 005',
    title: 'Synthetic Human Interface',
    tagline: 'A face you can speak to.',
    description:
      'A real-time conversational interface for a synthetic presenter. Built with facial capture, procedural lighting and a custom voice-reactive shader core.',
    subjects: ['R&D', 'Real-time 3D', 'Shader', 'Interaction'],
    year: '2025',
    palette: ['#ff3ebf', '#22061d', '#ffa8e0'],
    youtube: 'ScMzIvxBSi4'
  },
  {
    id: 'conference',
    code: 'AX / 006',
    title: 'Conference Digital Experience',
    tagline: 'A building-scale welcome.',
    description:
      'Generative stage content, speaker packages and an on-site web companion for a technology conference. One visual language across 30,000 sqm and a phone in your pocket.',
    subjects: ['Creative direction', 'Stage content', 'Web', 'Motion'],
    year: '2024',
    palette: ['#b85c38', '#120a06', '#f7b27b'],
    youtube: 'jNQXAC9IVRw'
  },
  {
    id: 'web3-market',
    code: 'AX / 007',
    title: 'Web3 Marketplace Platform',
    tagline: 'A gallery for the chain.',
    description:
      'A marketplace rebuilt as an exhibition — infinite spatial grid, reactive previews, and a calm, archival tone that lets the work be the loudest thing in the room.',
    subjects: ['Product design', 'WebGL', 'Development', 'Brand'],
    year: '2024',
    palette: ['#7d8bff', '#0a0e2a', '#c2c9ff'],
    youtube: 'aqz-KE-bpKQ'
  },
  {
    id: 'play-world',
    code: 'AX / 008',
    title: 'Interactive Play World',
    tagline: 'A room children redraw by moving.',
    description:
      'A permanent interactive installation for a family space. Floor projection, motion capture and particle choreography, tuned to turn running into drawing.',
    subjects: ['Installation', 'Real-time', 'Projection', 'Interaction'],
    year: '2023',
    palette: ['#6ef0ff', '#04121c', '#d5f8ff'],
    youtube: 'ScMzIvxBSi4'
  },
  {
    id: 'tech-brand',
    code: 'AX / 009',
    title: 'Technology Brand Launch',
    tagline: 'Hardware, announced like a film.',
    description:
      'A launch site and film package for a consumer hardware brand. Synced cinematics, product cutaways, spec reveals — the whole beat sheet of a theatrical debut.',
    subjects: ['Launch', 'Web', 'Motion', 'Film'],
    year: '2024',
    palette: ['#e8e4d5', '#121212', '#ffffff'],
    youtube: 'aqz-KE-bpKQ'
  },
  {
    id: 'spatial-fusion',
    code: 'AX / 010',
    title: 'Spatial Fusion Experience',
    tagline: 'Rooms that answer back.',
    description:
      'A brand residency built around sensor-driven spatial states. The room reads its guests and shifts light, sound, and story beats — a living exhibit.',
    subjects: ['Spatial', 'Real-time', 'Sensor fusion', 'Sound'],
    year: '2025',
    palette: ['#c9401a', '#150603', '#ffa472'],
    youtube: 'jNQXAC9IVRw'
  },
  {
    id: 'data-globe',
    code: 'AX / 011',
    title: 'Interactive Data Globe',
    tagline: 'A planet of signals.',
    description:
      'A browser-native globe for a global logistics brand. Millions of GPU-instanced data points, streaming updates, and a calm cartographic art direction.',
    subjects: ['Data viz', 'WebGL', 'GPU compute', 'Product'],
    year: '2024',
    palette: ['#8a5cff', '#0a0620', '#d4c2ff'],
    youtube: 'ScMzIvxBSi4'
  },
  {
    id: 'x-lab',
    code: 'AX / 012',
    title: 'X Event Lab Platform',
    tagline: 'Our own weather system.',
    description:
      'Our internal R&D platform — a dedicated space for ongoing research, new technical ideas and future-facing creative exploration, opened up for clients and partners.',
    subjects: ['Concept', 'Web design', 'WebGL', '3D design'],
    year: '2025',
    palette: ['#ff6b2c', '#1a0903', '#ffd6b0'],
    youtube: 'aqz-KE-bpKQ'
  },
  {
    id: 'storybook',
    code: 'AX / 013',
    title: 'Storybook Experience',
    tagline: 'A children’s book you walk through.',
    description:
      'An illustrated, scroll-led micro-site for a publishing house. Hand-drawn art layered into a parallax diorama, paced like a bedtime reading.',
    subjects: ['Art direction', 'Illustration', 'Web', 'Motion'],
    year: '2023',
    palette: ['#f5d9a8', '#1e150a', '#ffffff'],
    youtube: 'jNQXAC9IVRw'
  },
  {
    id: 'ar-beverage',
    code: 'AX / 014',
    title: 'AR Beverage Activation',
    tagline: 'Pour. Point. Portal.',
    description:
      'A global AR activation around a drink label. Image-tracked portals, generative label worlds, and a mechanic designed to live inside the fridge-aisle moment.',
    subjects: ['AR', 'Realtime 3D', 'Brand', 'Campaign'],
    year: '2024',
    palette: ['#ff3ebf', '#1c051a', '#ffb4e0'],
    youtube: 'aqz-KE-bpKQ'
  }
];
