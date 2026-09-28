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
    prerequisites: [
      {
        targetId: 'problem-right-to-repair-exploded-views',
        relationship: 'blocked_by',
        note: 'Requires standardized maintenance & disassembly diagrams to safely service communal equipment.'
      }
    ],
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
  },
  {
    id: 'problem-offline-mesh-protocol',
    title: 'LoRa Off-Grid Disaster Mesh Protocol & Solar Radio Packet Relay',
    type: 'idea',
    tagline: 'Open-source $15 ESP32 LoRa radio mesh firmware for neighborhood emergency messaging without cellular networks.',
    category: 'Public Safety & Infrastructure',
    complexity: '1-Month MVP',
    author: {
      name: 'Kai Berg',
      handle: '@kai_mesh',
      role: 'Embedded Radio Engineer'
    },
    createdAt: '2026-09-05',
    motivation: {
      problemStatement:
        'When hurricanes, earthquakes, or wildfires knock down cell towers, rescue coordination instantly reverts to shouting and chaotic manual paper logs.',
      theGap:
        'Satellite phones cost $1,500 with steep subscriptions; commercial radios lack digital structured packet routing. A $15 solar micro-repeater can bridge entire neighborhoods.',
      whoItAffects: 'Disaster zone victims, community emergency response teams (CERT), rural firefighters.',
      impactIfSolved: 'Guarantees resilient, decentralized telemetry and text dispatching when 100% of municipal grid power fails.'
    },
    feasibility: {
      assessment:
        'High. Built on Meshtastic / SX1262 LoRa modules. Transmits low-bitrate encrypted packet beacons over 915MHz/868MHz with zero cellular or internet infrastructure.',
      suggestedStack: ['C++ / Arduino / ESP-IDF', 'Meshtastic', 'SX1262 LoRa', 'Solar MPPT charger'],
      firstStep: 'Publish firmware build for Heltec V3 ESP32 boards with automated packet hopping.',
      pitfallsAndChallenges: 'Radio spectrum duty cycle constraints and RF antenna line-of-sight propagation.'
    },
    existingSolutions: {
      alternatives: [
        { name: 'Amateur Ham Radio', description: 'Requires FCC licensing exams and heavy, power-hungry equipment.' },
        { name: 'Starlink Satellite', description: 'Requires heavy 100W power draw and expensive terminals.' }
      ],
      whyTheyFallShort: 'Neither is ultra-cheap, disposable, or able to run for weeks on a tiny $8 solar panel.'
    },
    skillsNeeded: [
      { skill: 'Embedded / Hardware', roleDescription: 'Optimize RF packet hop algorithm and power states', filledCount: 1, targetCount: 1 },
      { skill: 'Firmware Engineer', roleDescription: 'Implement packet crypto and Bluetooth LE bridge', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [],
    votes: { goodIdea: 195, feasible: 168, haveThisProblem: 84, wantToBuild: 52 },
    userVotes: { goodIdea: true, feasible: true },
    team: {
      status: 'team_forming',
      members: [
        { id: 'mem-mesh-1', name: 'Kai Berg', handle: '@kai_mesh', role: 'Radio Lead', skill: 'Embedded / Hardware', joinedAt: '2026-09-05' }
      ]
    },
    discussions: []
  },
  {
    id: 'idea-mass-casualty-mesh-coordinator',
    title: 'Autonomous Mass-Casualty Mesh Triage Dispatcher',
    type: 'idea',
    tagline: 'Converged incident command console syncing patient vitals across field responders via decentralized mesh radio.',
    category: 'Health & Public Safety',
    complexity: 'Multi-Month Project',
    author: {
      name: 'Dr. Tariq Mansour',
      handle: '@tmansour_md',
      role: 'Emergency Medicine Physician'
    },
    createdAt: '2026-09-06',
    motivation: {
      problemStatement:
        'During mass-casualty incidents (train derailments, building collapses), incident command boards lose track of patient triage tags (Immediate / Delayed / Minor) because field medics cannot relay updates to central triage.',
      theGap:
        'Medics have patient NFC data, and dispatchers have radios, but no software synthesizes patient scans and radio mesh into a real-time live triage board without cloud servers.',
      whoItAffects: 'Field triage officers, trauma surgeons, ambulance fleet chiefs.',
      impactIfSolved: 'Reduces time-to-surgery by 40% and ensures red-tag critical patients are prioritized for the nearest suitable trauma hospital.'
    },
    feasibility: {
      assessment:
        'Fully feasible. A browser-native PWA that pairs via Bluetooth with a pocket LoRa radio puck and decodes emergency NFC cards to broadcast encrypted triage packets.',
      suggestedStack: ['React PWA', 'WebBluetooth API', 'WebNFC', 'Local SQLite / CRDT', 'Tailwind CSS'],
      firstStep: 'Build WebBluetooth bridge to listen to incoming LoRa triage packets and render live triage queue.',
      pitfallsAndChallenges: 'Maintaining state consistency across partition-tolerant mesh networks with high packet loss.'
    },
    existingSolutions: {
      alternatives: [
        { name: 'Physical Paper SMART Triage Tags', description: 'Paper tags attached to wrists; must be physically inspected by runners.' },
        { name: 'Enterprise FirstNet Portals', description: 'Requires LTE cell towers that are congested or damaged during disasters.' }
      ],
      whyTheyFallShort: 'Paper cannot communicate across incident perimeters, and LTE collapses under disaster load.'
    },
    skillsNeeded: [
      { skill: 'Frontend Architecture', roleDescription: 'Design responsive high-contrast triage board with audio cues', filledCount: 0, targetCount: 1 },
      { skill: 'Distributed Systems / CRDT', roleDescription: 'Implement mesh state synchronization over low-bandwidth packets', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [
      {
        targetId: 'problem-medical-nfc-card',
        relationship: 'blocked_by',
        note: 'Requires the standardized 480-byte emergency medical NFC schema.'
      },
      {
        targetId: 'idea-offline-triage-reader',
        relationship: 'blocked_by',
        note: 'Consumes triage scans generated by the field paramedic reader.'
      },
      {
        targetId: 'problem-offline-mesh-protocol',
        relationship: 'blocked_by',
        note: 'Relies on the off-grid LoRa mesh transport to transmit without cell towers.'
      }
    ],
    votes: { goodIdea: 242, feasible: 135, haveThisProblem: 91, wantToBuild: 48 },
    userVotes: { goodIdea: true },
    team: { status: 'open_for_builders', members: [] },
    discussions: []
  },
  {
    id: 'idea-er-capacity-beacon',
    title: 'Hospital Trauma ER Live Bed & Blood Reserves Radio Beacon',
    type: 'idea',
    tagline: 'Direct-to-ambulance radio broadcast of real-time ER surgical suite availability and blood bank supplies.',
    category: 'Health & Public Safety',
    complexity: '1-Month MVP',
    author: {
      name: 'Sarah Chen',
      handle: '@chen_paramedic',
      role: 'Flight Paramedic'
    },
    createdAt: '2026-09-07',
    motivation: {
      problemStatement:
        'Ambulances transport critical patients to the closest hospital only to find its CT scanner is down or the O-negative blood supply is depleted, forcing immediate secondary transport.',
      theGap:
        'Hospitals know their live status, but transmit it through clunky state regional web portals that paramedics in transit cannot access.',
      whoItAffects: 'Trauma patients in transit, dispatch operators, ER triage directors.',
      impactIfSolved: 'Routes ambulances directly to facilities with available operating suites and blood reserves on the first trip.'
    },
    feasibility: {
      assessment:
        'Low-cost radio beacon broadcasting a 64-byte signed telemetry string every 30 seconds containing bed, CT, and blood status.',
      suggestedStack: ['Embedded / LoRa', 'React Dashboard', 'Open Health Beacon Schema'],
      firstStep: 'Standardize 64-byte ER status bitfield payload.',
      pitfallsAndChallenges: 'Hospital administrative approval for live capability broadcasts.'
    },
    existingSolutions: {
      alternatives: [
        { name: 'Regional Web Dashboards (EMResource)', description: 'Requires desktop logins, rarely updated in real-time by busy nurses.' },
        { name: 'Voice Radio Check-ins', description: 'Ties up dispatch frequencies with verbal updates.' }
      ],
      whyTheyFallShort: 'Neither provides zero-latency passive heads-up display inside moving ambulances.'
    },
    skillsNeeded: [
      { skill: 'Health Informatics Specialist', roleDescription: 'Ensure compliance with HIPAA while streaming non-PHI resource data', filledCount: 0, targetCount: 1 },
      { skill: 'Mobile / PWA Dev', roleDescription: 'Build in-cab HUD map showing real-time hospital beacons', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [
      {
        targetId: 'idea-mass-casualty-mesh-coordinator',
        relationship: 'blocked_by',
        note: 'Integrates directly with the field triage mesh coordinator to balance regional hospital intake.'
      }
    ],
    votes: { goodIdea: 178, feasible: 144, haveThisProblem: 62, wantToBuild: 31 },
    userVotes: { feasible: true },
    team: { status: 'open_for_builders', members: [] },
    discussions: []
  },
  {
    id: 'idea-cargo-bike-relay',
    title: 'Hyperlocal Cargo Bike Haul Router & Route Optimizer',
    type: 'idea',
    tagline: 'Dynamic volunteer cyclist dispatch system routing evening bakery pick-ups through neighborhood bike paths.',
    category: 'Sustainability & Community',
    complexity: 'Weekend Prototype',
    author: {
      name: 'Tomás Rivera',
      handle: '@trivera',
      role: 'Cyclist Volunteer'
    },
    createdAt: '2026-09-08',
    motivation: {
      problemStatement:
        'Car drivers attempting bakery surplus pickups struggle with double parking and one-way streets, whereas cargo bikes complete urban deliveries 3x faster.',
      theGap:
        'Navigation apps optimize for automobiles, not cargo bikes carrying 40kg of sourdough through grade-separated cycleways.',
      whoItAffects: 'Volunteer food rescue couriers, urban bakeries.',
      impactIfSolved: 'Cuts food rescue transit time in half with zero tailpipe emissions.'
    },
    feasibility: {
      assessment:
        'Lightweight progressive web app utilizing OpenStreetMap and Valhalla routing engine with bicycle infrastructure weighting.',
      suggestedStack: ['React', 'Leaflet', 'OpenStreetMap', 'Valhalla API'],
      firstStep: 'Deploy route planner weighted for grade-separated bike paths and low slope gradients.',
      pitfallsAndChallenges: 'Accurate bike infrastructure data in suburban districts.'
    },
    existingSolutions: {
      alternatives: [
        { name: 'Google Maps Cycling Mode', description: 'Routes onto high-speed multi-lane roads with narrow painted gutters.' }
      ],
      whyTheyFallShort: 'Not tailored for heavy cargo bikes carrying fragile baked goods.'
    },
    skillsNeeded: [
      { skill: 'Frontend Developer', roleDescription: 'Build turn-by-turn cyclist HUD and pickup claim queue', filledCount: 1, targetCount: 1 }
    ],
    prerequisites: [
      {
        targetId: 'problem-bakery-food-surplus',
        relationship: 'blocked_by',
        note: 'Consumes surplus bakery dispatch alerts from participating bakeries and delis.'
      }
    ],
    votes: { goodIdea: 164, feasible: 198, haveThisProblem: 55, wantToBuild: 44 },
    userVotes: { feasible: true, wantToBuild: true },
    team: {
      status: 'team_forming',
      members: [
        { id: 'mem-cb-1', name: 'Tomás Rivera', handle: '@trivera', role: 'Cycle Lead', skill: 'Frontend Developer', joinedAt: '2026-09-08' }
      ]
    },
    discussions: []
  },
  {
    id: 'idea-cold-chain-locker',
    title: 'Solar-Powered Insulated Porch Drop-Box with Smart SMS Lockers',
    type: 'idea',
    tagline: 'Autonomous insulated temperature-monitored community lockers for after-hours food bank drop-offs.',
    category: 'Sustainability & Community',
    complexity: '1-Month MVP',
    author: {
      name: 'Mateo Ortiz',
      handle: '@mateo_civic',
      role: 'Community Partner'
    },
    createdAt: '2026-09-09',
    motivation: {
      problemStatement:
        'Bakeries close at 8 PM, but community shelters often lock doors at 7 PM, creating a 12-hour gap where food spoils on loading docks.',
      theGap:
        'Shelters lack overnight staff to receive deliveries, and commercial refrigerated lockers cost upwards of $12,000.',
      whoItAffects: 'Volunteer delivery drivers, shelter staff, community kitchens.',
      impactIfSolved: 'Provides a secure, verified 24/7 drop point ensuring uninterrupted food safety.'
    },
    feasibility: {
      assessment:
        'Re-purposing insulated shipping totes with 12V thermoelectric Peltier cooling and a solenoid latch driven by an ESP32 cell module.',
      suggestedStack: ['ESP32', 'Peltier Cooler', 'Twilio SMS', 'React Admin Panel'],
      firstStep: 'Construct prototype locker with SMS one-time passcode unlock and DS18B20 temperature logger.',
      pitfallsAndChallenges: 'Maintaining sub-4°C cooling during peak summer heat waves.'
    },
    existingSolutions: {
      alternatives: [
        { name: 'Amazon Hub Lockers', description: 'Proprietary, non-insulated, strictly for commercial parcel deliveries.' }
      ],
      whyTheyFallShort: 'No temperature monitoring or community access protocol.'
    },
    skillsNeeded: [
      { skill: 'Hardware Technician', roleDescription: 'Wire Peltier cooling, insulation foam, and solenoid lock', filledCount: 0, targetCount: 1 },
      { skill: 'Backend / API', roleDescription: 'Handle SMS authentication webhook and temperature alerts', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [
      {
        targetId: 'problem-bakery-food-surplus',
        relationship: 'blocked_by',
        note: 'Provides physical receiving depots for late-night bakery hauls.'
      }
    ],
    votes: { goodIdea: 182, feasible: 156, haveThisProblem: 71, wantToBuild: 38 },
    userVotes: { goodIdea: true },
    team: { status: 'open_for_builders', members: [] },
    discussions: []
  },
  {
    id: 'idea-zero-waste-neighborhood-network',
    title: 'Zero-Waste Neighborhood Food Clearinghouse & Redistribution Hub',
    type: 'idea',
    tagline: 'Closed-loop municipal platform coordinating surplus food pickups, volunteer transport, and cold-storage lockers.',
    category: 'Sustainability & Community',
    complexity: 'Multi-Month Project',
    author: {
      name: 'Claire Dupont',
      handle: '@claire_breads',
      role: 'Artisan Bakery Owner'
    },
    createdAt: '2026-09-10',
    motivation: {
      problemStatement:
        'Scaling food rescue from 3 friendly bakeries to an entire district of 80 grocers, cafes, and delis requires an end-to-end automated logistics orchestration platform.',
      theGap:
        'Without integrated routing and storage, excess food is either rejected or arrives spoiled because couriers have nowhere to drop off items.',
      whoItAffects: 'City sustainability departments, food banks, independent grocers.',
      impactIfSolved: 'Recovers over 20,000 lbs of edible food per neighborhood monthly.'
    },
    feasibility: {
      assessment:
        'A full-stack municipal orchestration engine that matches donor bakery listings with active cargo bike volunteers and reserves vacant locker slots in real-time.',
      suggestedStack: ['React', 'Node.js / Express', 'PostGIS', 'WebSockets', 'Tailwind CSS'],
      firstStep: 'Integrate the cargo bike routing API with locker availability telemetry.',
      pitfallsAndChallenges: 'Balancing volunteer courier availability with fluctuating donor food volumes.'
    },
    existingSolutions: {
      alternatives: [
        { name: 'Spreadsheets & WhatsApp Groups', description: 'Manual, error-prone, and collapses as soon as volume exceeds 10 daily deliveries.' }
      ],
      whyTheyFallShort: 'Lacks automated real-time dispatch, route calculation, and storage reservation.'
    },
    skillsNeeded: [
      { skill: 'Full-Stack Developer', roleDescription: 'Lead backend dispatch engine and database schema', filledCount: 0, targetCount: 1 },
      { skill: 'UI/UX Design', roleDescription: 'Design clear multi-user status dashboard for bakeries, couriers, and shelters', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [
      {
        targetId: 'idea-cargo-bike-relay',
        relationship: 'blocked_by',
        note: 'Requires volunteer cargo bike routing network for rapid haulage.'
      },
      {
        targetId: 'idea-cold-chain-locker',
        relationship: 'blocked_by',
        note: 'Requires smart locker storage infrastructure for unattended distribution.'
      }
    ],
    votes: { goodIdea: 228, feasible: 172, haveThisProblem: 88, wantToBuild: 56 },
    userVotes: { goodIdea: true, wantToBuild: true },
    team: { status: 'open_for_builders', members: [] },
    discussions: []
  },
  {
    id: 'problem-3d-cad-replacement-parts',
    title: 'Open CAD Repository for Discontinued Appliance Wear Components',
    type: 'idea',
    tagline: 'Standardized parametric 3D-printable models for broken plastic gears, latches, and blender couplings.',
    category: 'Hardware & Right-to-Repair',
    complexity: '1-Month MVP',
    author: {
      name: 'Niko Bell',
      handle: '@niko_repairs',
      role: 'Independent Electronics Technician'
    },
    createdAt: '2026-09-02',
    motivation: {
      problemStatement:
        'Manufacturers routinely declare 4-year-old washing machines and blenders "unrepairable" because a tiny $0.30 plastic gear snapped and OEM replacement parts are discontinued.',
      theGap:
        '3D printing can fabricate replacement nylon gears in 20 minutes, but models are scattered across Thingiverse, Printables, and obscure forums with no verification.',
      whoItAffects: 'Consumers with broken appliances, repair cafes, trade school students.',
      impactIfSolved: 'Extends appliance lifespans by 5-10 years and saves consumers hundreds in premature replacement costs.'
    },
    feasibility: {
      assessment:
        'A dedicated open-source repository of verified STEP/STL parametric files tagged by appliance brand, model number, and material spec (e.g. PETG, Nylon).',
      suggestedStack: ['React', 'Three.js / STL viewer', 'PostgreSQL', 'Tailwind CSS'],
      firstStep: 'Publish 50 verified CAD models for top 10 most common broken gears in KitchenAid and Oster appliances.',
      pitfallsAndChallenges: 'Ensuring dimensional accuracy and thermal resilience of 3D-printed materials.'
    },
    existingSolutions: {
      alternatives: [
        { name: 'Thingiverse / Printables', description: 'General 3D printing sites full of decorative toys; impossible to search by appliance model number.' },
        { name: 'AppliancePartsPros', description: 'Only sells expensive OEM injection-molded parts when still in stock.' }
      ],
      whyTheyFallShort: 'No verified mechanical tolerance grading or organized appliance compatibility ontology.'
    },
    skillsNeeded: [
      { skill: 'CAD / Mechanical Engineer', roleDescription: 'Reverse engineer broken plastic gears using calipers and FreeCAD', filledCount: 1, targetCount: 2 },
      { skill: 'Web Developer', roleDescription: 'Build in-browser 3D model inspector and appliance compatibility filter', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [],
    votes: { goodIdea: 210, feasible: 185, haveThisProblem: 142, wantToBuild: 50 },
    userVotes: { goodIdea: true, haveThisProblem: true },
    team: {
      status: 'team_forming',
      members: [
        { id: 'mem-cad-1', name: 'Niko Bell', handle: '@niko_repairs', role: 'Mechanical Lead', skill: 'CAD / Mechanical Engineer', joinedAt: '2026-09-02' }
      ]
    },
    discussions: []
  },
  {
    id: 'idea-community-repair-station',
    title: 'Automated Community Repair Diagnostic Kiosk & Parts 3D-Print Station',
    type: 'idea',
    tagline: 'All-in-one public repair workshop unit combining diagnostic software, disassembly maps, and on-demand parts manufacturing.',
    category: 'Hardware & Right-to-Repair',
    complexity: 'Multi-Month Project',
    author: {
      name: 'Elena Rostova',
      handle: '@elena_dev',
      role: 'Lead Frontend'
    },
    createdAt: '2026-09-04',
    motivation: {
      problemStatement:
        'People want to fix their broken items, but lack the tools, the exploded screw diagrams, and the specific replacement gear required.',
      theGap:
        'Repair requires three things in one place: the right tool (from a tool library), the disassembly guide (from an indexer), and the replacement component (from a CAD parts registry).',
      whoItAffects: 'Apartment communities, maker spaces, public libraries.',
      impactIfSolved: 'Makes right-to-repair fully accessible to everyday non-technical citizens.'
    },
    feasibility: {
      assessment:
        'A touchscreen kiosk installed inside a public library or tool hub, equipped with a calibrated 3D printer, precision bit set, and digital repair guidance.',
      suggestedStack: ['React Kiosk PWA', 'OctoPrint API', 'WebUSB', 'Tailwind CSS'],
      firstStep: 'Build unified search tying appliance model numbers to disassembly guides and printable parts.',
      pitfallsAndChallenges: 'Print time (30-60 minutes per part) and kiosk hardware maintenance.'
    },
    existingSolutions: {
      alternatives: [
        { name: 'Standalone Maker Spaces', description: 'Expensive monthly memberships ($100+/mo), require specialized training.' }
      ],
      whyTheyFallShort: 'Not tailored for rapid, guided household appliance repair.'
    },
    skillsNeeded: [
      { skill: 'Hardware Technician', roleDescription: 'Assemble and maintain kiosk 3D printer and precision tool set', filledCount: 0, targetCount: 1 },
      { skill: 'Frontend Developer', roleDescription: 'Build intuitive touch-screen kiosk interface with step-by-step repair guides', filledCount: 1, targetCount: 1 }
    ],
    prerequisites: [
      {
        targetId: 'problem-right-to-repair-exploded-views',
        relationship: 'blocked_by',
        note: 'Loads exploded assembly diagrams and screw-length specifications.'
      },
      {
        targetId: 'problem-3d-cad-replacement-parts',
        relationship: 'blocked_by',
        note: 'Sources verified printable STEP/STL models for broken mechanical components.'
      },
      {
        targetId: 'idea-building-tool-library',
        relationship: 'blocked_by',
        note: 'Integrates with shared community locker infrastructure for specialized tool loans.'
      }
    ],
    votes: { goodIdea: 265, feasible: 148, haveThisProblem: 175, wantToBuild: 68 },
    userVotes: { goodIdea: true, wantToBuild: true },
    team: {
      status: 'team_forming',
      members: [
        { id: 'mem-kiosk-1', name: 'Elena Rostova', handle: '@elena_dev', role: 'UI Lead', skill: 'Frontend Developer', joinedAt: '2026-09-04' }
      ]
    },
    discussions: []
  },
  {
    id: 'idea-municipal-noise-packet-generator',
    title: 'Automated Evidentiary 311 Citation Dossier Generator',
    type: 'idea',
    tagline: 'Generates court-admissible PDF violation dossiers with FFT spectrograms and calibrated decibel logs for code enforcement.',
    category: 'Civic Infrastructure',
    complexity: 'Weekend Prototype',
    author: {
      name: 'Rohan Joshi',
      handle: '@rohan_civic',
      role: 'Urban Planning Researcher'
    },
    createdAt: '2026-09-11',
    motivation: {
      problemStatement:
        'Even when citizens log noise sensor data, municipal courts dismiss complaints because reports lack certified calibration stamps, environmental temperature corrections, or formal legal formatting.',
      theGap:
        'A sensor is only as good as the legal admissibility of its output packet in administrative court hearings.',
      whoItAffects: 'Tenants suffering from illegal commercial noise, municipal code enforcement officers.',
      impactIfSolved: 'Transforms raw acoustic sensor telemetry into binding legal citations with a single click.'
    },
    feasibility: {
      assessment:
        'A browser-based client that ingests sensor JSON timeseries data, calculates standard LAeq metrics, and generates a formatted PDF compliant with municipal evidence codes.',
      suggestedStack: ['React', 'PDFKit / jsPDF', 'Chart.js', 'Tailwind CSS'],
      firstStep: 'Create PDF layout template matching standard municipal noise violation complaint forms.',
      pitfallsAndChallenges: 'Varying statutory evidentiary standards across different city jurisdictions.'
    },
    existingSolutions: {
      alternatives: [
        { name: 'Manual Screenshot Logs', description: 'Ignored by court clerks for lack of certification.' }
      ],
      whyTheyFallShort: 'Unformatted, lacking mathematical rigor and acoustic weighting metadata.'
    },
    skillsNeeded: [
      { skill: 'Data Visualization & Timeseries', roleDescription: 'Generate acoustic spectrogram charts and decibel plots for PDF', filledCount: 0, targetCount: 1 },
      { skill: 'Municipal Legal Advisor', roleDescription: 'Draft boilerplate affidavits matching city noise ordinances', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [
      {
        targetId: 'problem-civic-noise-grid',
        relationship: 'blocked_by',
        note: 'Processes calibrated continuous decibel telemetry from the acoustic sensor grid.'
      }
    ],
    votes: { goodIdea: 158, feasible: 205, haveThisProblem: 118, wantToBuild: 37 },
    userVotes: { feasible: true },
    team: { status: 'open_for_builders', members: [] },
    discussions: []
  },
  {
    id: 'idea-acoustic-wildlife-corridor-tracker',
    title: 'Urban Bird & Bat Acoustic Habitat Health Monitor',
    type: 'idea',
    tagline: 'Uses acoustic noise sensors to measure how industrial noise levels suppress migratory bird and pollinator activity.',
    category: 'Civic Infrastructure',
    complexity: '1-Month MVP',
    author: {
      name: 'Rohan Joshi',
      handle: '@rohan_civic',
      role: 'Urban Planning Researcher'
    },
    createdAt: '2026-09-13',
    motivation: {
      problemStatement:
        'Chronic urban noise above 65dB destroys avian mating calls and bat echolocation, causing local pollinator collapse in urban parks.',
      theGap:
        'Ecologists conduct rare manual field surveys; noise sensors installed on city buildings can simultaneously monitor bioacoustic soundscapes.',
      whoItAffects: 'Urban wildlife, city arborists, environmental research institutes.',
      impactIfSolved: 'Guides urban tree planting and sound barrier placement to restore urban biodiversity corridors.'
    },
    feasibility: {
      assessment:
        'Applying BirdNET bioacoustic classifier models to nighttime audio spectrograms recorded by exterior noise sensors.',
      suggestedStack: ['Python / TFLite', 'BirdNET', 'React Dashboard', 'PostGIS'],
      firstStep: 'Run offline BirdNET model on sample 1-hour window recordings from quiet vs noisy parks.',
      pitfallsAndChallenges: 'Distinguishing bird calls from squeaking vehicle brakes and sirens.'
    },
    existingSolutions: {
      alternatives: [
        { name: 'Manual Binocular Bird Counts', description: 'Done once a year during Audubon Christmas Bird Counts; zero continuous insight.' }
      ],
      whyTheyFallShort: 'Cannot measure daily correlation between human construction noise and animal departure.'
    },
    skillsNeeded: [
      { skill: 'Data / ML', roleDescription: 'Integrate BirdNET TFLite model for automated bioacoustic detection', filledCount: 0, targetCount: 1 }
    ],
    prerequisites: [
      {
        targetId: 'problem-civic-noise-grid',
        relationship: 'blocked_by',
        note: 'Leverages continuous urban microphone nodes deployed on residential windows.'
      }
    ],
    votes: { goodIdea: 172, feasible: 154, haveThisProblem: 68, wantToBuild: 41 },
    userVotes: { goodIdea: true },
    team: { status: 'open_for_builders', members: [] },
    discussions: []
  }
];
