import { Idea } from '../types';

export const INITIAL_IDEAS: Idea[] = [
  {
    id: 'idea-unbuilt-commons',
    title: 'The Unbuilt Commons: Open Repository for Ideas & Real-World Friction',
    type: 'idea',
    tagline: 'A structured registry where ideas are donated to the public domain, prerequisites are linked, and teams form.',
    category: 'Productivity & Public Tech',
    complexity: '1-Month MVP',
    author: {
      name: 'Sohan S.',
      handle: '@sohan',
      role: 'Idea Donor & System Thinker'
    },
    createdAt: '2026-09-20',
    motivation: {
      problemStatement:
        'People who encounter acute everyday problems or conceive compelling system designs frequently lack the time, capital, or specific engineering skills to build them alone. Conversely, thousands of capable developers, designers, and domain experts want meaningful projects to build rather than another toy clone.',
      theGap:
        'There is an unbridged chasm between real-world problems experienced on the ground, the people generating high-fidelity solutions, and the builders equipped with the technical chops to execute them.',
      whoItAffects:
        'Engineers seeking side-projects, open-source maintainers, hackathon participants, and everyday practitioners facing solvable friction.',
      impactIfSolved:
        'Turns unexecuted brainstorms into collective public goods, preventing thousands of viable ideas from withering in personal note apps.'
    },
    feasibility: {
      assessment:
        'Extremely straightforward to implement. Fundamentally a structured relational web application with multi-faceted voting, skill tagging, and dependency graphing. Success hinges on pristine document schemas, friction-free search, and authentic community seed entries.',
      suggestedStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite / Cloud Run', 'PostgreSQL or Firestore'],
      firstStep:
        'Deploy the canonical web client with structured Markdown exports, multi-dimensional voting, and skill-requirement tagging.',
      pitfallsAndChallenges:
        'Ensuring quality over spam submissions. Needs section-by-section verification and constructive peer feedback instead of low-effort pitch text.'
    },
    existingSolutions: {
      alternatives: [
        {
          name: 'Reddit (r/SomebodyMakeThis, r/AppIdeas)',
          url: 'https://reddit.com',
          description: 'Flat, chronological forums prone to meme posts, ephemeral visibility, and zero structured requirements.'
        },
        {
          name: 'Product Hunt / IndieHackers',
          url: 'https://producthunt.com',
          description: 'Built for marketing already-shipped commercial products, not unbuilt public-interest ideas looking for builders.'
        },
        {
          name: 'GitHub Issues / Discussions',
          url: 'https://github.com',
          description: 'Siloed inside specific existing repositories; not designed for cross-discipline discovery before code exists.'
        }
      ],
      whyTheyFallShort:
        'Existing forums lack multi-vector voting (distinguishing "Is this a great concept?" from "Is this realistically feasible?" from "I suffer from this problem"). They offer no skill-tag matching for builders, no team assembly rosters, and no prerequisite graph linking.'
    },
    skillsNeeded: [
      { skill: 'Frontend Architecture', roleDescription: 'Build reactive UI, state management, and visual graph explorer', filledCount: 1, targetCount: 1 },
      { skill: 'UI/UX Design', roleDescription: 'Design typography hierarchy, modal flows, and clean data density', filledCount: 1, targetCount: 1 },
      { skill: 'Community & Moderation', roleDescription: 'Curate high-signal submissions and host builder matching rounds', filledCount: 0, targetCount: 2 },
      { skill: 'Backend / API', roleDescription: 'Implement persistent storage, user karma, and webhook notifications', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [],
    votes: {
      goodIdea: 142,
      feasible: 119,
      haveThisProblem: 88,
      wantToBuild: 47
    },
    userVotes: {
      goodIdea: true,
      feasible: true
    },
    team: {
      status: 'team_forming',
      members: [
        {
          id: 'mem-1',
          name: 'Elena Rostova',
          handle: '@elena_dev',
          role: 'Lead Frontend',
          skill: 'Frontend Architecture',
          joinedAt: '2026-09-21',
          message: 'Excited to scaffold the component system and prerequisite graph view.'
        },
        {
          id: 'mem-2',
          name: 'Marcus Vance',
          handle: '@mvance',
          role: 'Interface Designer',
          skill: 'UI/UX Design',
          joinedAt: '2026-09-22',
          message: 'Focusing on clean scannability, zero-pill aesthetics, and mobile touch targets.'
        }
      ]
    },
    discussions: [
      {
        id: 'disc-1',
        author: 'Julian Thorne',
        handle: '@jthorne',
        role: 'Open Source Advocate',
        sectionRef: 'feasibility',
        content: 'Crucial requirement: allow anyone to export any idea as an RFC Markdown file so it can be committed directly into a GitHub repo as a project charter.',
        createdAt: '2026-09-22',
        likes: 18
      },
      {
        id: 'disc-2',
        author: 'Aria Lin',
        handle: '@arialin',
        role: 'Product Engineer',
        sectionRef: 'existing_solutions',
        content: 'The 4-vector vote is the magic here. On Reddit a funny impractical idea gets 5k upvotes while a genuine high-leverage civic tool gets buried.',
        createdAt: '2026-09-23',
        likes: 24
      }
    ]
  },
  {
    id: 'problem-medical-nfc-card',
    title: 'Offline Emergency Triage NFC Card with Revocable QR Encryption',
    type: 'idea',
    tagline: 'Standardized physical wallet card readable in seconds by emergency EMTs without cellular network access.',
    category: 'Health & Public Safety',
    complexity: '1-Month MVP',
    author: {
      name: 'Dr. Tariq Mansour',
      handle: '@tmansour_md',
      role: 'Emergency Medicine Physician'
    },
    createdAt: '2026-09-18',
    motivation: {
      problemStatement:
        'When unconscious trauma patients arrive at triage, EMTs lose critical minutes determining severe drug allergies (e.g. penicillin, heparin), anticoagulant prescriptions, or rare blood types because cell service in tunnels/canyons fails or hospital servers require slow logins.',
      theGap:
        'Patients want emergency personnel to know their life-saving contraindications, but rightly refuse to store unencrypted personal health records on an open cloud database or public lock-screen note.',
      whoItAffects:
        '120M+ patients with asthma, diabetes, pacemaker implants, anaphylaxis, or chronic anti-coagulation therapy.',
      impactIfSolved:
        'Prevents fatal anaphylactic and pharmacological contraindications during golden-hour trauma triage.'
    },
    feasibility: {
      assessment:
        'High feasibility. Modern smartphones all read NTAG215/NTAG424 NFC chips natively without specialized apps. Data can be serialized in a compact CBOR/JSON schema under 500 bytes and signed with the patient’s local cryptographic key.',
      suggestedStack: ['WebNFC API', 'React PWA', 'NTAG215 Physical Cards', 'Elliptic Curve Cryptography', 'Offline SQLite'],
      firstStep:
        'Define the open 480-byte Emergency Medical Schema (Allergies, Medications, Blood Type, Emergency Contact, Organ Donor status).',
      pitfallsAndChallenges:
        'Standardization across regional paramedic services. Privacy safeguards to prevent rogue scanning by passersby.'
    },
    existingSolutions: {
      alternatives: [
        {
          name: 'Medical Alert Bracelets (MedicAlert)',
          url: 'https://medicalert.org',
          description: 'Engraved metal tags with limited 20-character space, cannot store full medication list, difficult to update.'
        },
        {
          name: 'Apple Health Medical ID',
          url: 'https://apple.com',
          description: 'Siloed to Apple hardware, requires physical access to an undamaged, powered-on device that may be shattered in accidents.'
        },
        {
          name: 'Cloud QR Bracelets (MyID)',
          description: 'Require active cellular internet connection to query an external web server; fails in disaster zones, basements, or remote routes.'
        }
      ],
      whyTheyFallShort:
        'They either rely on battery-dependent fragile smartphones, have zero digital storage capacity, or fail completely when off-grid.'
    },
    skillsNeeded: [
      { skill: 'Embedded / NFC Specialist', roleDescription: 'Program NTAG424 DNA security chips and verify WebNFC reader protocol', filledCount: 1, targetCount: 1 },
      { skill: 'Emergency Medicine / EMT Advisor', roleDescription: 'Validate protocol alignment with standard NREMT triage workflows', filledCount: 1, targetCount: 1 },
      { skill: 'Mobile Web / PWA Dev', roleDescription: 'Build offline-first zero-latency card writer and paramedic reader view', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [],
    votes: {
      goodIdea: 198,
      feasible: 154,
      haveThisProblem: 112,
      wantToBuild: 39
    },
    userVotes: {
      goodIdea: true,
      haveThisProblem: true
    },
    team: {
      status: 'team_forming',
      members: [
        {
          id: 'mem-3',
          name: 'Devon Keats',
          handle: '@dkeats_rfid',
          role: 'Hardware / NFC Lead',
          skill: 'Embedded / NFC Specialist',
          joinedAt: '2026-09-19',
          message: 'I have 500 NTAG sample cards ready to flash test payloads via WebNFC.'
        }
      ]
    },
    discussions: [
      {
        id: 'disc-3',
        author: 'Sarah Chen, Paramedic',
        handle: '@chen_paramedic',
        sectionRef: 'motivation',
        content: 'Can confirm this would save lives. In multivehicle highway pileups, phones are often crushed or battery dead. A laminated card in a wallet is indestructible.',
        createdAt: '2026-09-20',
        likes: 31
      }
    ]
  },
  {
    id: 'idea-offline-triage-reader',
    title: 'Paramedic Universal Field Reader: Instant Offline Triage App',
    type: 'idea',
    tagline: 'Instantaneous WebNFC reader app for first responders with high-contrast night vision mode.',
    category: 'Health & Public Safety',
    complexity: 'Weekend Prototype',
    author: {
      name: 'Sarah Chen',
      handle: '@chen_paramedic',
      role: 'Flight Paramedic'
    },
    createdAt: '2026-09-21',
    motivation: {
      problemStatement:
        'Even if patients carry NFC or QR emergency records, paramedics cannot waste 45 seconds downloading a proprietary app from the App Store in the back of an ambulance.',
      theGap:
        'First responders need a browser-native zero-install web application that activates instantly upon scanning any open medical payload.',
      whoItAffects: 'Paramedics, ER triage nurses, ski patrol, and disaster rescue teams.',
      impactIfSolved: 'Enables sub-3-second emergency medical history retrieval.'
    },
    feasibility: {
      assessment:
        'A single progressive web app using the WebNFC API and ZXing QR reader. Fully cached in service worker for 100% offline reliability. Can be prototyped in 48 hours.',
      suggestedStack: ['React', 'WebNFC', 'Service Worker Cache', 'Tailwind CSS'],
      firstStep: 'Fork the WebNFC sample repository and implement the 480-byte schema decoder.',
      pitfallsAndChallenges: 'iOS Safari partial restrictions on WebNFC (QR fallback handles iOS seamlessly).'
    },
    existingSolutions: {
      alternatives: [
        {
          name: 'Commercial Hospital EHR Tablets',
          description: 'Require enterprise VPN, 4-step biometric login, and 30-second synchronization delays.'
        }
      ],
      whyTheyFallShort: 'Heavy, slow, and completely unusable during high-stress field rescue operations.'
    },
    skillsNeeded: [
      { skill: 'Frontend / PWA', roleDescription: 'Build resilient offline service worker and ultra-high contrast dark UI', filledCount: 0, targetCount: 1 },
      { skill: 'Security Auditor', roleDescription: 'Verify data is never cached or leaked to telemetry endpoints', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [
      {
        targetId: 'problem-medical-nfc-card',
        relationship: 'blocked_by',
        note: 'Requires the standardized 480-byte Offline Emergency Schema defined in the NFC card project.'
      }
    ],
    votes: {
      goodIdea: 89,
      feasible: 104,
      haveThisProblem: 42,
      wantToBuild: 28
    },
    userVotes: {
      feasible: true
    },
    team: {
      status: 'open_for_builders',
      members: []
    },
    discussions: []
  },
  {
    id: 'problem-bakery-food-surplus',
    title: 'Nightly Surplus Bread & Pastry Dispatcher for Neighborhood Shelters',
    type: 'problem',
    tagline: 'Bridging the last-mile gap between artisan bakeries throwing away day-old carbs and local shelters with van volunteers.',
    category: 'Sustainability & Community',
    complexity: '1-Month MVP',
    author: {
      name: 'Claire Dupont',
      handle: '@claire_breads',
      role: 'Artisan Bakery Owner'
    },
    createdAt: '2026-09-17',
    motivation: {
      problemStatement:
        'Every single evening at 7:30 PM, independent bakeries throw away 30-60 loaves of fresh sourdough, baguettes, and pastries because city food banks require advance 48-hour scheduled pallet deliveries.',
      theGap:
        'Bakeries want zero waste, and shelters 2 miles away are desperate for high-calorie staples, but there is no lightweight automated dispatch mechanism for same-evening micro-hauls.',
      whoItAffects:
        'Independent food businesses, volunteer pickup drivers, and local community shelters.',
      impactIfSolved:
        'Diverts an estimated 2,000 lbs of edible artisan carbohydrates per neighborhood per week from municipal landfill incinerators.'
    },
    feasibility: {
      assessment:
        'High. A single 1-tap dispatch button for bakeries that fires a Telegram/Signal/SMS webhook to verified volunteer couriers within a 3-mile geofence.',
      suggestedStack: ['React', 'Twilio or Telegram Bot API', 'Node / Express', 'Leaflet OpenStreetMap'],
      firstStep:
        'Pilot with 3 local bakeries and 1 community center using simple SMS broadcasts with claim confirmation.',
      pitfallsAndChallenges:
        'Volunteer reliability (if a bakery triggers a pickup and no volunteer shows, trust degrades).'
    },
    existingSolutions: {
      alternatives: [
        {
          name: 'Too Good To Go',
          url: 'https://toogoodtogo.com',
          description: 'Commercial consumer marketplace for discounted grab bags; does not serve homeless shelters and takes a steep cut per transaction.'
        },
        {
          name: 'Feeding America / City Harvest',
          description: 'Logistics built for wholesale industrial pallets, grocery chains, and scheduled refrigerated trucks, not 2 garbage bags of baguettes.'
        }
      ],
      whyTheyFallShort:
        'Existing platforms either monetize consumer foodies or require enterprise warehouse logistical overhead that small independent bakeries cannot handle.'
    },
    skillsNeeded: [
      { skill: 'Full-Stack Developer', roleDescription: 'Build the 1-tap bakery interface and volunteer dispatch claim loop', filledCount: 0, targetCount: 1 },
      { skill: 'Community Outreach Lead', roleDescription: 'Partner with local soup kitchens and vet initial volunteer drivers', filledCount: 1, targetCount: 2 }
    ],
    prerequisites: [],
    votes: {
      goodIdea: 215,
      feasible: 180,
      haveThisProblem: 76,
      wantToBuild: 52
    },
    userVotes: {
      goodIdea: true,
      wantToBuild: true
    },
    team: {
      status: 'team_forming',
      members: [
        {
          id: 'mem-4',
          name: 'Mateo Ortiz',
          handle: '@mateo_civic',
          role: 'Community Partner',
          skill: 'Community Outreach Lead',
          joinedAt: '2026-09-18',
          message: 'Connected with 4 shelters in East District ready to accept nightly deliveries.'
        }
      ]
    },
    discussions: [
      {
        id: 'disc-4',
        author: 'Tomás Rivera',
        handle: '@trivera',
        role: 'Cyclist Volunteer',
        sectionRef: 'feasibility',
        content: 'Cargo bikes can do 90% of these deliveries within 20 minutes without parking issues. Set up a cargo bike group dispatch.',
        createdAt: '2026-09-19',
        likes: 19
      }
    ]
  },
  {
    id: 'problem-right-to-repair-exploded-views',
    title: 'Open Indexer for Right-to-Repair Disassembly & Screw-Length Maps',
    type: 'idea',
    tagline: 'Standardized crowdsourced exploded diagrams showing exact screw lengths and hidden plastic clip latch locations.',
    category: 'Hardware & Right-to-Repair',
    complexity: '1-Month MVP',
    author: {
      name: 'Niko Bell',
      handle: '@niko_repairs',
      role: 'Independent Electronics Technician'
    },
    createdAt: '2026-09-15',
    motivation: {
      problemStatement:
        '70% of amateur repair attempts fail when people accidentally puncture a lithium battery or strip a motherboard because the chassis had 4 hidden screw lengths (e.g. 3mm vs 3.5mm) or invisible snap tabs.',
      theGap:
        'YouTube videos are 25 minutes long and hard to pause with greasy fingers; iFixit has great guides for flagship iPhones, but millions of blenders, vacuum cleaners, monitors, and laptops have zero systematic screw maps.',
      whoItAffects: 'Everyday consumers, repair cafes, trade school students, and electronics tinkerers.',
      impactIfSolved: 'Drastically reduces accidental bricking and prevents consumer appliances from ending in landfills.'
    },
    feasibility: {
      assessment:
        'Interactive SVG photo-overlay tool where anyone can upload a photo of a opened device and drop numbered color-coded pins specifying screw pitch, torque, and clip release directions.',
      suggestedStack: ['React', 'SVG Canvas / Konva', 'WebP image hosting', 'Open Hardware Schema'],
      firstStep: 'Build the interactive browser pin-dropper widget that exports an open JSON spec for any device photo.',
      pitfallsAndChallenges: 'Moderation of inaccurate pin labels that could mislead someone into stripping threads.'
    },
    existingSolutions: {
      alternatives: [
        {
          name: 'iFixit Guides',
          url: 'https://ifixit.com',
          description: 'Superb quality, but editorial bottleneck limits them to high-volume top-selling consumer electronics.'
        },
        {
          name: 'YouTube teardown videos',
          description: 'Unindexed, unsearchable, requires scrubbing through ads with dirty hands in the middle of a teardown.'
        }
      ],
      whyTheyFallShort: 'No open, scalable, community-contributed screw-map database with instant interactive drill-down.'
    },
    skillsNeeded: [
      { skill: 'Interactive Canvas / UI Dev', roleDescription: 'Build the fast web-based image markup and pin placement editor', filledCount: 0, targetCount: 1 },
      { skill: 'Hardware Technician', roleDescription: 'Seed initial 50 common household teardowns with verified screw specs', filledCount: 1, targetCount: 2 }
    ],
    prerequisites: [],
    votes: {
      goodIdea: 174,
      feasible: 140,
      haveThisProblem: 133,
      wantToBuild: 45
    },
    userVotes: {
      goodIdea: true,
      haveThisProblem: true
    },
    team: {
      status: 'team_forming',
      members: [
        {
          id: 'mem-5',
          name: 'Niko Bell',
          handle: '@niko_repairs',
          role: 'Domain Lead',
          skill: 'Hardware Technician',
          joinedAt: '2026-09-15'
        }
      ]
    },
    discussions: []
  },
  {
    id: 'problem-civic-noise-grid',
    title: 'Civic Noise & Construction Violation Acoustic Heatmap',
    type: 'problem',
    tagline: 'Continuous, calibrated decibel logging with automated municipal complaint packet generation.',
    category: 'Civic Infrastructure',
    complexity: 'Multi-Month Project',
    author: {
      name: 'Rohan Joshi',
      handle: '@rohan_civic',
      role: 'Urban Planning Researcher'
    },
    createdAt: '2026-09-12',
    motivation: {
      problemStatement:
        'Commercial construction sites frequently operate unpermitted jackhammers at 5:30 AM or exceed 95dB legal limits. Individual citizen 311 calls are dismissed as "anecdotal" and closed without inspection.',
      theGap:
        'Municipal enforcement only takes action against timestamped, continuous, calibrated data streams with auditable audio spectrogram peaks.',
      whoItAffects: 'Urban residents, shift workers, parents with infants, and noise-sensitive individuals.',
      impactIfSolved: 'Empowers neighborhoods with legal-grade evidentiary documentation to enforce quiet-hours ordinances.'
    },
    feasibility: {
      assessment:
        'Moderate. Can be deployed on cheap Raspberry Pi Zero or ESP32 nodes with I2S MEMS microphones (e.g. INMP441) placed on window sills. Transmits only decibel metrics and FFT acoustic frequency envelopes (no raw audio recorded, preserving absolute neighbor privacy).',
      suggestedStack: ['ESP32 / MicroPython', 'MQTT', 'TimescaleDB / InfluxDB', 'Next.js / Chart.js', 'Automated PDF generator'],
      firstStep: 'Publish firmware calculating LAeq 15-minute decibel metrics and privacy-safe FFT hash on ESP32.',
      pitfallsAndChallenges: 'Calibrating cheap consumer microphones to match IEC 61672 Class 2 sound level standards.'
    },
    existingSolutions: {
      alternatives: [
        {
          name: 'City 311 Phone Line / Web Forms',
          description: 'Single-event complaints with no evidence; officers arrive 6 hours later after construction ends.'
        },
        {
          name: 'Smartphone Decibel Apps',
          description: 'Uncalibrated phone microphones, drain battery, cannot run 24/7 on an exterior window.'
        }
      ],
      whyTheyFallShort: 'Neither provides sustained, legally admissible longitudinal telemetry required for municipal court citations.'
    },
    skillsNeeded: [
      { skill: 'Embedded Audio / DSP', roleDescription: 'Implement IEC sound weighting (A-weighting filter) on microcontroller', filledCount: 0, targetCount: 1 },
      { skill: 'Data Visualization & Timeseries', roleDescription: 'Build public neighborhood decibel heatmaps and violation PDF generator', filledCount: 0, targetCount: 1 },
      { skill: 'Municipal Legal Advisor', roleDescription: 'Structure output reports to comply with local noise code evidentiary thresholds', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [],
    votes: {
      goodIdea: 161,
      feasible: 98,
      haveThisProblem: 145,
      wantToBuild: 22
    },
    userVotes: {
      haveThisProblem: true
    },
    team: {
      status: 'open_for_builders',
      members: []
    },
    discussions: []
  },
  {
    id: 'idea-elder-scam-shield',
    title: 'Elder Scam-Shield: Suspicious Coercion Phrase Detector for Voip/Landlines',
    type: 'idea',
    tagline: 'Privacy-preserving local audio assistant that sounds a gentle warning chime when high-risk scam scripts are spoken.',
    category: 'Privacy & Elder Care',
    complexity: '1-Month MVP',
    author: {
      name: 'Maya Goldstein',
      handle: '@maya_g',
      role: 'Family Caregiver'
    },
    createdAt: '2026-09-10',
    motivation: {
      problemStatement:
        'Over $10 Billion is stolen annually from elderly people through phone scams (fake IRS, kidnapped grandchild, gift-card payment demands). Once in a panic, victims stay on the phone and withdraw cash.',
      theGap:
        'Spam blockers filter known numbers, but spoofed numbers bypass filters. What is needed is intervention at the moment of verbal coercion.',
      whoItAffects: 'Millions of elderly seniors and their adult children who worry about vulnerable parents.',
      impactIfSolved: 'Intercepts financial predatory fraud before bank transfers or gift card purchases occur.'
    },
    feasibility: {
      assessment:
        'A small speaker puck running local tiny Whisper or local on-device phrase classifier. Triggers on keyword clusters like "Target gift card", "Federal warrant", "Do not hang up", "Wire transfer". Completely offline, zero audio uploaded to cloud.',
      suggestedStack: ['Raspberry Pi / Jetson Nano', 'Whisper.cpp / Vosk Offline ASR', 'Local Audio Processing', 'Bluetooth Gateway'],
      firstStep: 'Benchmark Vosk offline speech recognition latency on Raspberry Pi 4 for 15 known scam trigram phrases.',
      pitfallsAndChallenges: 'False alarms during normal conversations; ensuring seniors do not feel surveilled.'
    },
    existingSolutions: {
      alternatives: [
        {
          name: 'Robocall blockers (Truecaller, Nomorobo)',
          description: 'Only block based on caller ID database; useless against spoofed numbers or human social engineers.'
        },
        {
          name: 'Bank fraud alerts',
          description: 'Occur after the victim is already at the bank counter or ATM under severe psychological stress.'
        }
      ],
      whyTheyFallShort: 'Zero real-time conversational intervention when the victim is being actively coerced.'
    },
    skillsNeeded: [
      { skill: 'On-Device Speech / ASR', roleDescription: 'Optimize offline keyword spotting model for lightweight ARM hardware', filledCount: 0, targetCount: 1 },
      { skill: 'Gerontology / Caregiver UX', roleDescription: 'Design compassionate non-startling alerts and family companion app', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [],
    votes: {
      goodIdea: 248,
      feasible: 132,
      haveThisProblem: 189,
      wantToBuild: 34
    },
    userVotes: {
      goodIdea: true,
      haveThisProblem: true
    },
    team: {
      status: 'open_for_builders',
      members: []
    },
    discussions: []
  },
  {
    id: 'idea-building-tool-library',
    title: 'Lobby Tool & Appliance Share Hub with Smart Keyless Lockers',
    type: 'idea',
    tagline: 'Micro-library for high-cost, low-frequency tools (drills, carpet steamers, ladders) in multi-family apartments.',
    category: 'Sustainability & Community',
    complexity: 'Weekend Prototype',
    author: {
      name: 'Samir Patel',
      handle: '@samir_p',
      role: 'Tenant Association President'
    },
    createdAt: '2026-09-08',
    motivation: {
      problemStatement:
        'The average power drill is used for only 13 minutes in its entire lifespan. In an 80-unit apartment building, 50 people own separate power drills, carpet cleaners, and socket sets taking up closet space.',
      theGap:
        'People are happy to share tools, but informal borrowing leads to forgotten items, awkward reminders, and lost equipment.',
      whoItAffects: 'Apartment dwellers, DIY hobbyists, budget-conscious renters.',
      impactIfSolved: 'Saves residents hundreds of dollars in redundant tool purchases while building real building social capital.'
    },
    feasibility: {
      assessment:
        'Low complexity. A lightweight web app with QR code checkout, automated return reminders via WhatsApp/SMS, and integration with standard smart padlocks.',
      suggestedStack: ['React', 'Supabase or Local DB', 'QR Scanner', 'WhatsApp Business API'],
      firstStep: 'Deploy a 1-page checkout registry for a 10-item communal tool cabinet in one pilot building.',
      pitfallsAndChallenges: 'Accountability for broken tools or missing drill bits.'
    },
    existingSolutions: {
      alternatives: [
        {
          name: 'Municipal Tool Libraries',
          description: 'Located miles away across town, require driving, limited open hours (often 10am-2pm on Saturdays).'
        },
        {
          name: 'Home Depot Rentals',
          description: 'Expensive ($45/day minimum), requires transport and security deposits.'
        }
      ],
      whyTheyFallShort: 'Not hyper-local in the building basement or lobby where you can grab it in your slippers.'
    },
    skillsNeeded: [
      { skill: 'Web Developer', roleDescription: 'Build the zero-friction QR checkout and inventory status board', filledCount: 1, targetCount: 1 },
      { skill: 'Operations / Building Organizer', roleDescription: 'Manage tool sourcing and building board approval', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [],
    votes: {
      goodIdea: 188,
      feasible: 220,
      haveThisProblem: 167,
      wantToBuild: 61
    },
    userVotes: {
      goodIdea: true,
      feasible: true,
      haveThisProblem: true
    },
    team: {
      status: 'team_forming',
      members: [
        {
          id: 'mem-6',
          name: 'Samir Patel',
          handle: '@samir_p',
          role: 'Organizer',
          skill: 'Operations / Building Organizer',
          joinedAt: '2026-09-08'
        }
      ]
    },
    discussions: []
  }
];
