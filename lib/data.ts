import { EventItem, Registration } from './types';

export const EVENTS_DATA: EventItem[] = [
  {
    id: 'ev-1',
    name: 'ByteHacks 2K26 — 36Hr Flagship Hackathon',
    slug: 'bytehacks-2k26',
    category: 'Hackathon & Coding',
    tagline: 'Code the future, solve real-world industry problems in 36 continuous hours.',
    description: 'CodeHive’s signature 36-hour hackathon bringing together the sharpest minds across India to innovate across AI/ML, Decentralized Systems, FinTech, and Smart Healthcare. Mentored by top engineers with direct internship & incubation opportunities.',
    venue: 'Main Auditorium & Innovation Lab (Ground Floor)',
    date: 'Oct 24 - 25, 2026',
    startAt: '09:00 AM',
    endAt: '09:00 PM (Next Day)',
    capacity: 250,
    registeredCount: 198,
    teamSize: '2 - 4 Members',
    prizePool: '₹60,000 + Cloud Credits',
    entryFee: 'Free (Sponsored by GitHub)',
    coordinators: [
      { name: 'Arjun Sharma', phone: '+91 98401 23456' },
      { name: 'Priya Sundaram', phone: '+91 97890 54321' }
    ],
    rules: [
      'Teams must consist of 2 to 4 members from recognized universities.',
      'Projects must be initiated from scratch during the hackathon timeline.',
      'Open-source libraries are permitted; pre-built templates will lead to disqualification.',
      'All code must be committed to GitHub with regular hourly milestones.'
    ],
    tags: ['Hackathon', 'AI/ML', '36hr', 'GitHub', 'Flagship'],
    isFlagship: true,
  },
  {
    id: 'ev-2',
    name: 'CodeSprint: Algorithmic Duel',
    slug: 'codesprint-algorithmic-duel',
    category: 'Hackathon & Coding',
    tagline: 'Speed, accuracy, and algorithmic mastery under intense time pressure.',
    description: 'A 3-round competitive programming showdown modeled after ICPC and Codeforces grandmaster div. Test your data structures, dynamic programming, and greedy algorithms skills against India’s top coders.',
    venue: 'Computing Complex Lab 3',
    date: 'Oct 24, 2026',
    startAt: '10:30 AM',
    endAt: '01:30 PM',
    capacity: 120,
    registeredCount: 94,
    teamSize: 'Individual',
    prizePool: '₹25,000',
    entryFee: 'Free',
    coordinators: [
      { name: 'Rohit Verma', phone: '+91 94440 11223' }
    ],
    rules: [
      'Language choices: C++, Java, Python3, Rust.',
      'Standard ICPC penalty timing applies for wrong submissions.',
      'Plagiarism checks via MOSS will be conducted post-contest.'
    ],
    tags: ['Competitive Coding', 'Algorithms', 'DSA', 'Speed'],
    isFlagship: false,
  },
  {
    id: 'ev-3',
    name: 'NeuroClash: GenAI Agents Arena',
    slug: 'neuroclash-genai-arena',
    category: 'AI & Robotics',
    tagline: 'Design autonomous multi-agent systems and custom LLM workflows.',
    description: 'Teams will build autonomous LLM agents capable of autonomous research, web automation, tool execution, and strategic reasoning. Submissions are benchmarked on real-world task success rates.',
    venue: 'AI Center of Excellence, Block B',
    date: 'Oct 24, 2026',
    startAt: '02:00 PM',
    endAt: '06:00 PM',
    capacity: 80,
    registeredCount: 65,
    teamSize: '1 - 3 Members',
    prizePool: '₹30,000',
    entryFee: 'Free',
    coordinators: [
      { name: 'Kavitha R', phone: '+91 91234 56789' }
    ],
    rules: [
      'API keys provided by sponsors (OpenAI, Anthropic, Gemini).',
      'Agents must produce verifiable deterministic outputs given benchmark prompts.'
    ],
    tags: ['GenAI', 'LLM', 'Agents', 'Python'],
    isFlagship: true,
  },
  {
    id: 'ev-4',
    name: 'CyberDefend: 24Hr Capture The Flag (CTF)',
    slug: 'cyberdefend-ctf',
    category: 'Web3 & Security',
    tagline: 'Reverse engineering, binary exploitation, web vulnerabilities, and cryptography.',
    description: 'A jeopardy-style cybersecurity competition with realistic challenges simulating enterprise networks, cloud penetration, smart contract exploits, and firmware analysis.',
    venue: 'Cyber Security Lab (Advanced Networking Wing)',
    date: 'Oct 24 - 25, 2026',
    startAt: '12:00 PM',
    endAt: '12:00 PM (Next Day)',
    capacity: 100,
    registeredCount: 82,
    teamSize: '2 - 3 Members',
    prizePool: '₹35,000',
    entryFee: 'Free',
    coordinators: [
      { name: 'Vikram Joshi', phone: '+91 99887 66554' }
    ],
    rules: [
      'Do not attack the scoring server or infrastructure.',
      'Flag sharing between teams leads to instant ban.',
      'Dynamic scoring enabled: first blood bonuses apply.'
    ],
    tags: ['CTF', 'CyberSecurity', 'Reverse Engineering', 'Web3'],
    isFlagship: true,
  },
  {
    id: 'ev-5',
    name: 'PixelCraft: 6-Hour UI/UX Design Sprint',
    slug: 'pixelcraft-ui-ux-design-sprint',
    category: 'Design & Creative',
    tagline: 'Craft delightful spatial and glassmorphic interfaces for Next-Gen applications.',
    description: 'A high-octane design challenge where creators tackle complex product briefs. From user persona research to interactive high-fidelity Figma prototypes with seamless micro-animations.',
    venue: 'Design Studio Lab, 3rd Floor',
    date: 'Oct 25, 2026',
    startAt: '10:00 AM',
    endAt: '04:00 PM',
    capacity: 60,
    registeredCount: 45,
    teamSize: '1 - 2 Members',
    prizePool: '₹20,000',
    entryFee: 'Free',
    coordinators: [
      { name: 'Sneha Patel', phone: '+91 98765 43210' }
    ],
    rules: [
      'Figma or Spline must be used for prototyping.',
      'Submissions require design system documentation, typography scales, and interactive flows.'
    ],
    tags: ['UI/UX', 'Figma', 'Product Design', 'Aesthetics'],
    isFlagship: false,
  },
  {
    id: 'ev-6',
    name: 'RoboClash: Autonomous Bot Derby',
    slug: 'roboclash-autonomous-derby',
    category: 'AI & Robotics',
    tagline: 'Line-following, obstacle-dodging autonomous bots battling for supremacy.',
    description: 'Showcase your engineering mettle as autonomous rovers race through complex dynamic arenas with sensors, computer vision, and PID controllers.',
    venue: 'Open Quadrangle Tech Arena',
    date: 'Oct 25, 2026',
    startAt: '11:00 AM',
    endAt: '03:00 PM',
    capacity: 50,
    registeredCount: 42,
    teamSize: '2 - 4 Members',
    prizePool: '₹25,000',
    entryFee: 'Free',
    coordinators: [
      { name: 'Karthik N', phone: '+91 93456 78901' }
    ],
    rules: [
      'Robots must operate fully autonomously without RF/Bluetooth control.',
      'Dimensions must not exceed 25cm x 25cm x 25cm.'
    ],
    tags: ['Robotics', 'Hardware', 'Sensors', 'Autonomous'],
    isFlagship: false,
  },
  {
    id: 'ev-7',
    name: 'LAN Siege: Valorant & CS2 Arena',
    slug: 'lan-siege-esports',
    category: 'Gaming & Non-Tech',
    tagline: 'High-FPS, low-latency tactical tactical shooter esports championship.',
    description: 'National collegiate esports tournament hosted on high-refresh 240Hz tournament rigs. Live casted on Twitch & YouTube with custom casting desks.',
    venue: 'Gaming Arena (E-Sports Hub)',
    date: 'Oct 25, 2026',
    startAt: '01:00 PM',
    endAt: '07:00 PM',
    capacity: 64,
    registeredCount: 60,
    teamSize: '5 Members',
    prizePool: '₹20,000 + Gaming Peripherals',
    entryFee: 'Free',
    coordinators: [
      { name: 'Sameer Khan', phone: '+91 90123 45678' }
    ],
    rules: [
      'Standard competitive ruleset and map pool.',
      'Players must bring their own peripherals (Mice/Keyboards).'
    ],
    tags: ['Gaming', 'Esports', 'LAN', 'Valorant'],
    isFlagship: false,
  },
  {
    id: 'ev-8',
    name: 'Masterclass: Next.js 16 + WebGL 3D Spatial Web',
    slug: 'masterclass-nextjs-webgl',
    category: 'Workshops',
    tagline: 'Hands-on deep dive into Three.js, React Three Fiber, and high-performance WebGL.',
    description: 'Learn how to build jaw-dropping 3D spatial web experiences with Next.js 16, Three.js shaders, Theatre.js animations, and performance profiling from industry professionals.',
    venue: 'Seminar Hall 1',
    date: 'Oct 24, 2026',
    startAt: '03:00 PM',
    endAt: '06:00 PM',
    capacity: 150,
    registeredCount: 142,
    teamSize: 'Individual',
    prizePool: 'Certificates + GitHub Swag',
    entryFee: 'Free',
    coordinators: [
      { name: 'Dr. Suresh Kumar', phone: '+91 91122 33445' }
    ],
    rules: [
      'Bring your laptop with Node.js and code editor pre-installed.',
      'Hands-on starter repository will be shared before the session.'
    ],
    tags: ['Workshop', 'Three.js', 'Next.js 16', '3D Web'],
    isFlagship: false,
  }
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-001',
    registrationNumber: 'CH26-8F3K21',
    participant: {
      name: 'Aditya Narayanan',
      email: 'aditya.n@srmist.edu.in',
      phone: '+91 98401 99887',
      college: 'SRM Institute of Science and Technology',
      department: 'Computer Science and Engineering',
      year: '3rd Year',
    },
    eventId: 'ev-1',
    eventName: 'ByteHacks 2K26 — 36Hr Flagship Hackathon',
    teamName: 'CyberVortex',
    teamMembers: ['Aditya Narayanan', 'Rhea Sen', 'Gautam Menon', 'Tanvi Roy'],
    registeredAt: '2026-09-28 14:32:00',
    status: 'CONFIRMED',
    qrPayload: 'CODEHIVE-2K26:REG:CH26-8F3K21:EV1:CYBERVORTEX',
  },
  {
    id: 'reg-002',
    registrationNumber: 'CH26-4X9L10',
    participant: {
      name: 'Meera Krishnan',
      email: 'meera.k@iitm.ac.in',
      phone: '+91 94441 55667',
      college: 'IIT Madras',
      department: 'Electrical Engineering & AI',
      year: '4th Year',
    },
    eventId: 'ev-3',
    eventName: 'NeuroClash: GenAI Agents Arena',
    teamName: 'AgentX',
    teamMembers: ['Meera Krishnan', 'Surya P'],
    registeredAt: '2026-09-29 10:15:00',
    status: 'CHECKED_IN',
    checkedInAt: '2026-09-30 09:20:00',
    checkedInBy: 'Staff_Desk_02',
    qrPayload: 'CODEHIVE-2K26:REG:CH26-4X9L10:EV3:AGENTX',
  },
  {
    id: 'reg-003',
    registrationNumber: 'CH26-9P2W74',
    participant: {
      name: 'Siddharth Rao',
      email: 'siddharth.rao@bits-pilani.ac.in',
      phone: '+91 97891 22334',
      college: 'BITS Pilani',
      department: 'Information Systems',
      year: '2nd Year',
    },
    eventId: 'ev-2',
    eventName: 'CodeSprint: Algorithmic Duel',
    registeredAt: '2026-09-29 16:45:00',
    status: 'CONFIRMED',
    qrPayload: 'CODEHIVE-2K26:REG:CH26-9P2W74:EV2:SOLO',
  },
  {
    id: 'reg-004',
    registrationNumber: 'CH26-1M5Q88',
    participant: {
      name: 'Ananya Deshmukh',
      email: 'ananya.d@vit.ac.in',
      phone: '+91 91234 44332',
      college: 'Vellore Institute of Technology',
      department: 'Software Systems',
      year: '3rd Year',
    },
    eventId: 'ev-4',
    eventName: 'CyberDefend: 24Hr Capture The Flag (CTF)',
    teamName: 'NullPointers',
    teamMembers: ['Ananya Deshmukh', 'Farhan Ali', 'Deepak S'],
    registeredAt: '2026-09-30 11:05:00',
    status: 'CONFIRMED',
    qrPayload: 'CODEHIVE-2K26:REG:CH26-1M5Q88:EV4:NULLPOINTERS',
  }
];

export const SCHEDULE_DATA = [
  {
    day: 'Day 1 — Friday, Oct 24, 2026',
    items: [
      { time: '08:00 AM - 09:00 AM', title: 'On-site Registration & QR Badge Distribution', venue: 'Main Foyer' },
      { time: '09:00 AM - 10:15 AM', title: 'Inaugural Ceremony & Keynote Address by GitHub Team', venue: 'Auditorium' },
      { time: '10:30 AM', title: 'ByteHacks 36-Hour Hackathon Commences', venue: 'Innovation Lab' },
      { time: '10:30 AM - 01:30 PM', title: 'CodeSprint Algorithmic Duel Round 1 & 2', venue: 'Computing Lab 3' },
      { time: '12:00 PM', title: 'CyberDefend 24Hr CTF Flag Drops', venue: 'Networking Wing' },
      { time: '02:00 PM - 06:00 PM', title: 'NeuroClash GenAI Agent Evaluation', venue: 'AI Center' },
      { time: '03:00 PM - 06:00 PM', title: 'Next.js 16 + WebGL Spatial Web Workshop', venue: 'Seminar Hall 1' },
      { time: '08:00 PM', title: 'Midnight Dev Jam & Lightning Talks', venue: 'Open Lawn' }
    ]
  },
  {
    day: 'Day 2 — Saturday, Oct 25, 2026',
    items: [
      { time: '08:00 AM', title: 'Hackathon Milestone 3 Review & Breakfast', venue: 'Innovation Lab' },
      { time: '10:00 AM - 04:00 PM', title: 'PixelCraft UI/UX Design Sprint', venue: 'Design Studio' },
      { time: '11:00 AM - 03:00 PM', title: 'RoboClash Autonomous Derby Arena Battles', venue: 'Tech Quadrangle' },
      { time: '12:00 PM', title: 'CyberDefend CTF Final Tally & Post-Mortem', venue: 'Networking Wing' },
      { time: '01:00 PM - 07:00 PM', title: 'LAN Siege Esports Finals (Valorant / CS2)', venue: 'Gaming Arena' },
      { time: '05:00 PM', title: 'ByteHacks Top 10 Demos & Grand Jury Pitch', venue: 'Main Auditorium' },
      { time: '07:30 PM - 09:30 PM', title: 'Valedictory, Awards Ceremony & ₹1,50,000+ Prize Distribution', venue: 'Main Auditorium' }
    ]
  }
];

export const FAQS = [
  {
    q: 'Who can participate in CodeHive 2K26?',
    a: 'Any enrolled student from undergraduate, postgraduate, or diploma programs across colleges and universities across India can register. Both solo and team participants are welcome!'
  },
  {
    q: 'Is there any registration fee?',
    a: 'No! All flagship events, hackathons, and workshops at CodeHive 2K26 are completely free of charge, generously sponsored by our community partners and GitHub.'
  },
  {
    q: 'How does check-in work on event day?',
    a: 'Upon registering, you receive a digital ticket pass containing your unique Registration Number (e.g., CH26-8F3K21) and a secure QR Code. Simply present this QR code on your phone to our check-in desk for instant verification and badge issuance.'
  },
  {
    q: 'Can I register for multiple events?',
    a: 'Yes, provided the event timelines do not overlap. The ByteHacks 36-hour hackathon requires full attendance, but participants can attend workshops and symposium sessions during review breaks.'
  },
  {
    q: 'Will participants receive certificates and food?',
    a: 'Yes! All verified participants receive official digital certificates of participation. Hackathon and all-day participants are provided with meals, snacks, and midnight refreshments.'
  }
];

export const SPONSORS = [
  { name: 'GitHub', tier: 'Title Partner', logoText: 'GitHub' },
  { name: 'Vercel', tier: 'Deployment Partner', logoText: 'Vercel' },
  { name: 'Cloudinary', tier: 'Media Partner', logoText: 'Cloudinary' },
  { name: 'Resend', tier: 'Communication Partner', logoText: 'Resend' },
  { name: 'Neon Postgres', tier: 'Database Partner', logoText: 'Neon' },
  { name: 'Clerk', tier: 'Auth Partner', logoText: 'Clerk' }
];
