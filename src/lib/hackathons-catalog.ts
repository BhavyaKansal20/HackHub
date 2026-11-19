import type { Hackathon } from "./hackathons";

export const VERIFIED_HACKATHONS: Hackathon[] = [
  // 1. UNSTOP
  {
    id: "unstop-galuxium-v3",
    external_id: "galuxium-nexus-v3",
    source: "Unstop",
    title: "Galuxium Nexus V3: The Global AI, Autonomous Systems & Venture SaaS Championship",
    organizer: "Galuxium Technologies & Unstop",
    url: "https://unstop.com/hackathons/galuxium-nexus-v3-global-ai-championship",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online (Global)",
    starts_at: "2026-11-08T14:07:00Z",
    ends_at: "2027-02-28T14:07:00Z",
    reg_ends_at: "2027-02-28T14:07:00Z",
    dates_label: "08 Nov 2026 – 28 Feb 2027",
    prize: "₹ 15,00,000",
    participants: 18450,
    tags: ["AI Engineering", "Autonomous Systems", "SaaS", "Software Development"],
    description: `### Overview & Problem Statement
Galuxium Nexus V3 is Unstop's flagship engineering championship challenging student developers to build production-grade Autonomous Multi-Agent AI systems and scalable enterprise micro-SaaS platforms.

### Key Tracks
1. **Agentic Workflows**: Multi-agent LLM systems for automated operations and business intelligence.
2. **Autonomous Cloud Infrastructure**: Self-healing CI/CD, auto-scaling clusters, and Kubernetes optimization.
3. **Enterprise Venture SaaS**: High-velocity vertical SaaS with verifiable telemetry and billing integrations.

### Stages & Timeline
- **Round 1 (Blueprint Submission)**: Submit System Architecture Diagram and GitHub repo schema.
- **Round 2 (Prototype Sprint)**: Deliver working API endpoints and containerized demo.
- **Grand Finale (Demo Day)**: Live virtual pitch to venture capital scouts and tech leads.

### Eligibility & Rules
- Teams of 1 to 4 members. Cross-college and cross-specialization teams permitted.
- Fresh code only; pre-existing closed repositories are disqualified.
- Thapar Institute participants qualify for DoSA academic duty leave (OD) endorsement upon shortlisted status.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "unstop-sih-2026",
    external_id: "sih-2026",
    source: "Unstop",
    title: "Smart India Hackathon (SIH 2026) - Nationwide Innovation Championship",
    organizer: "Ministry of Education Innovation Cell & AICTE",
    url: "https://unstop.com/hackathons/smart-india-hackathon-2026",
    image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
    mode: "Hybrid",
    location: "Thapar Nodal Center & Nationwide",
    starts_at: "2026-12-01T09:00:00Z",
    ends_at: "2027-01-15T18:00:00Z",
    reg_ends_at: "2026-12-20T23:59:00Z",
    dates_label: "01 Dec 2026 – 15 Jan 2027",
    prize: "₹ 1,00,00,000+",
    participants: 45200,
    tags: ["Smart Governance", "Healthcare", "Defense Tech", "Clean Energy", "AI/ML"],
    description: `### World's Largest Student Innovation Initiative
Smart India Hackathon provides students with a platform to solve pressing problems of ministries, departments, industries, and non-governmental organizations.

### Problem Areas
- **Smart Automation & Governance**: Digital public infrastructure, automated subsidy verifications.
- **Defense & Aerospace**: Secure communications, optical drone tracking, terrain analysis.
- **Healthcare & MedTech**: Rural diagnostic pipelines, EHR inter-operability, telemetry.

### Rules & Guidelines
- Exactly 6 students per team with mandatory inclusion of at least one female team member.
- University internal screening required; top nominated teams represent TIET at national nodal centers.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "unstop-lighthouse",
    external_id: "lighthouse-cu-2026",
    source: "Unstop",
    title: "LightHouse Hackathon: Regional AI & Cyber-Physical Systems Challenge",
    organizer: "Osmium & Chandigarh University",
    url: "https://unstop.com/hackathons/lighthouse-hackathon-cu",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
    mode: "In-person",
    location: "Ajitgarh, Punjab",
    starts_at: "2026-12-10T10:00:00Z",
    ends_at: "2026-12-12T17:00:00Z",
    reg_ends_at: "2026-12-05T23:59:00Z",
    dates_label: "10 Dec – 12 Dec 2026",
    prize: "₹ 5,10,000",
    participants: 3400,
    tags: ["Cybersecurity", "Embedded Systems", "Pre-Placement Interviews"],
    description: `### Regional Flagship Cyber Sprint
A 36-hour in-person hackathon bringing together top engineering talent across Punjab, Haryana, Himachal Pradesh, and Delhi-NCR.

### Tracks
- **Threat Detection & Zero-Trust**: Network anomaly sensors and automated incident response.
- **Smart Edge Computing**: Real-time IoT micro-controllers with low-power ML inference.
- **Pre-Placement Fast Track**: Top 10 teams receive direct interview rounds with partner technology firms.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "unstop-competitions-hub",
    external_id: "unstop-national-hub",
    source: "Unstop",
    title: "Unstop National Innovation & Technology Championship Series",
    organizer: "Unstop Enterprise & University Partners",
    url: "https://unstop.com/hackathons",
    image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online / National",
    starts_at: "2026-11-20T00:00:00Z",
    ends_at: "2027-03-31T23:59:00Z",
    reg_ends_at: "2027-03-15T23:59:00Z",
    dates_label: "Open National Series",
    prize: "₹ 50,00,000+",
    participants: 98000,
    tags: ["Case Competitions", "Quizzes", "Hackathons", "College Festivals"],
    description: `### Unstop Verified National Competition Hub
Browse verified national hackathons, technical case competitions, corporate challenges (Flipkart GRiD, Tata Crucible, L'Oréal Brandstorm, Amazon ML), and inter-college festivals across India.`,
    updated_at: new Date().toISOString(),
  },

  // 2. DEVFOLIO
  {
    id: "devfolio-hacktu-8",
    external_id: "hacktu-8-0",
    source: "Devfolio",
    title: "HackTU 8.0: North India's Biggest Flagship Collegiate Hackathon",
    organizer: "Creative Computing Society (CCS TIET)",
    url: "https://hacktu-8.devfolio.co/",
    image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    mode: "In-person",
    location: "Thapar Institute of Engg & Tech, Patiala",
    starts_at: "2027-02-12T09:00:00Z",
    ends_at: "2027-02-14T18:00:00Z",
    reg_ends_at: "2027-02-05T23:59:00Z",
    dates_label: "12 Feb – 14 Feb 2027",
    prize: "₹ 5,00,000",
    participants: 9400,
    tags: ["Generative AI", "FinTech", "Web3", "Smart Campus", "TIET Official"],
    description: `### Official Flagship Hackathon of Thapar Institute
Hosted by Creative Computing Society (CCS) at Thapar Institute of Engineering and Technology (TIET), Patiala. Over 36 hours, builders from IITs, NITs, and top institutions collaborate to engineer production-ready prototypes.

### Tracks
- **Autonomous Multi-Agent AI**: Self-orchestrating LLM systems with tool calling.
- **FinTech & Zero-Knowledge Rails**: Scalable payment infrastructure and cryptographic proofs.
- **Smart Campus & Sustainable IoT**: Automated power telemetry, campus transport scheduling.
- **Open Innovation**: Disruptive prototypes tackling healthcare, logistics, and defense.

### On-Duty (OD) Leave & Logistics
- 100% TIET On-Duty (OD) attendance leave provided for verified student participants.
- Full hardware lab access and 24/7 food, snacks, and mentorship inside the TSDC complex.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "devfolio-ethindia-2026",
    external_id: "ethindia-2026",
    source: "Devfolio",
    title: "ETHIndia 2026: Asia's Largest Ethereum BUIDLathon",
    organizer: "Devfolio & Ethereum Foundation",
    url: "https://ethindia.co/",
    image_url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80",
    mode: "In-person",
    location: "KTPO, Bengaluru, Karnataka",
    starts_at: "2026-12-04T12:00:00Z",
    ends_at: "2026-12-06T18:00:00Z",
    reg_ends_at: "2026-11-25T23:59:00Z",
    dates_label: "04 Dec – 06 Dec 2026",
    prize: "$100,000+",
    participants: 12500,
    tags: ["Web3", "Ethereum", "Smart Contracts", "DeFi", "Zero Knowledge"],
    description: `### Asia's Marquee Web3 Gathering
ETHIndia brings together thousands of the world's most passionate decentralized protocol engineers, designers, and visionaries for a 36-hour builder sprint.

### Tracks & Bounties
- Layer-2 Rollups & Scaling (Arbitrum, Optimism, Polygon, Base).
- Account Abstraction (ERC-4337) and seamless consumer UX.
- Decentralized Identity (DID) and Zero-Knowledge proofs.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "devfolio-hackthisfall",
    external_id: "hackthisfall-2026",
    source: "Devfolio",
    title: "Hack This Fall 2026: Innovate For Good",
    organizer: "Hack This Fall Community & Devfolio",
    url: "https://hackthisfall.devfolio.co/",
    image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1600&q=80",
    mode: "In-person",
    location: "Delhi-NCR, India",
    starts_at: "2026-12-18T10:00:00Z",
    ends_at: "2026-12-20T17:00:00Z",
    reg_ends_at: "2026-12-10T23:59:00Z",
    dates_label: "18 Dec – 20 Dec 2026",
    prize: "₹ 7,50,000",
    participants: 6800,
    tags: ["Social Impact", "Beginner Friendly", "AI", "Diversity in Tech"],
    description: `### Community-First Inclusive Hackathon
Hack This Fall is a welcoming tech sprint focused on building solutions for social impact, accessibility, and community empowerment.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "devfolio-texus-2027",
    external_id: "texus-2027",
    source: "Devfolio",
    title: "Texus 2027: 24 Hours of High-Velocity Innovation",
    organizer: "SRM IST & Devfolio",
    url: "https://texus27.devfolio.co/",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    mode: "In-person",
    location: "Chennai, Tamil Nadu",
    starts_at: "2027-02-20T09:00:00Z",
    ends_at: "2027-02-21T18:00:00Z",
    reg_ends_at: "2027-02-12T23:59:00Z",
    dates_label: "20 Feb – 21 Feb 2027",
    prize: "₹ 3,00,000",
    participants: 4100,
    tags: ["Open Innovation", "FinTech", "Machine Learning"],
    description: `### 24 Hours. Infinite Possibilities.
An intensive in-person hackathon bringing together creative technologists across the country to solve cross-disciplinary problems.`,
    updated_at: new Date().toISOString(),
  },

  // 3. DEVPOST
  {
    id: "devpost-kiroween-2026",
    external_id: "kiroween-2026",
    source: "Devpost",
    title: "Kiroween 2026: Global Open AI & Creative Computing Challenge",
    organizer: "Kiro AI & Devpost",
    url: "https://kiroween.devpost.com/",
    image_url: "https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/005/585/149/datas/medium_square.png",
    mode: "Online",
    location: "Online (Global)",
    starts_at: "2026-10-30T00:00:00Z",
    ends_at: "2026-12-04T23:59:00Z",
    reg_ends_at: "2026-12-04T23:59:00Z",
    dates_label: "Closes 04 Dec 2026",
    prize: "$100,000",
    participants: 7200,
    tags: ["Beginner Friendly", "Machine Learning/AI", "Open Ended"],
    description: `### Global Developer Challenge on Devpost
Build open-ended generative and agentic AI projects. Open worldwide with cash awards, cloud compute grants, and mentorship.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "devpost-codegeist-2026",
    external_id: "codegeist-2026",
    source: "Devpost",
    title: "Codegeist 2026: Build with Context. Ship with Confidence.",
    organizer: "Atlassian & Devpost",
    url: "https://codegeist2026.devpost.com/",
    image_url: "https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/005/624/479/datas/medium_square.png",
    mode: "Online",
    location: "Online (Global)",
    starts_at: "2026-10-15T00:00:00Z",
    ends_at: "2026-12-18T23:59:00Z",
    reg_ends_at: "2026-12-18T23:59:00Z",
    dates_label: "Closes 18 Dec 2026",
    prize: "$120,000",
    participants: 8900,
    tags: ["Atlassian Forge", "Developer Tools", "Enterprise Productivity"],
    description: `### Atlassian's Flagship Global Developer Contest
Create apps that integrate seamlessly into Jira, Confluence, and Bitbucket using Forge. Winner takes home $25,000 top prize.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "devpost-firebase-hybrid",
    external_id: "firebase-hybrid-ai-2026",
    source: "Devpost",
    title: "#BuildHybridAI 2026: Google Firebase & Cloud AI Hackathon",
    organizer: "Google Cloud & Firebase",
    url: "https://firebasehybridaihackathon.devpost.com/",
    image_url: "https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/005/784/130/datas/medium_square.png",
    mode: "Online",
    location: "Online",
    starts_at: "2026-10-20T00:00:00Z",
    ends_at: "2026-12-16T23:59:00Z",
    reg_ends_at: "2026-12-16T23:59:00Z",
    dates_label: "Closes 16 Dec 2026",
    prize: "$30,000",
    participants: 6100,
    tags: ["Firebase", "Gemini API", "Cloud Functions", "Mobile/Web"],
    description: `### Build Full-Stack AI with Firebase
Build applications leveraging Firebase Genkit, Gemini 1.5 Pro, and Firestore Vector Search for real-time intelligent mobile and web apps.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "devpost-paypal-ai",
    external_id: "paypal-ai-hackathon",
    source: "Devpost",
    title: "PayPal AI Global Developer Innovation Sprint",
    organizer: "PayPal Developer Ecosystem",
    url: "https://paypalaihackathon.devpost.com/",
    image_url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online (Global)",
    starts_at: "2026-10-01T00:00:00Z",
    ends_at: "2026-12-15T23:59:00Z",
    reg_ends_at: "2026-12-15T23:59:00Z",
    dates_label: "Closes in 25 days",
    prize: "$67,500",
    participants: 5800,
    tags: ["FinTech", "AI Agents", "Commerce", "Payments API"],
    description: `### Reimagining Global Commerce with AI
Build next-generation commerce tools and payment experiences using PayPal SDKs paired with cutting-edge LLMs and multimodal AI models.`,
    updated_at: new Date().toISOString(),
  },

  // 4. HACK2SKILL
  {
    id: "hack2skill-india-ai",
    external_id: "india-ai-grand-challenge",
    source: "Hack2Skill",
    title: "IndiaAI Innovation Grand Challenge 2026",
    organizer: "MeitY, Digital India Corporation & Hack2Skill",
    url: "https://hack2skill.com/hack/india-ai-grand-challenge",
    image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "New Delhi & Online",
    starts_at: "2026-11-15T00:00:00Z",
    ends_at: "2027-02-10T18:00:00Z",
    reg_ends_at: "2027-01-15T23:59:00Z",
    dates_label: "15 Nov 2026 – 10 Feb 2027",
    prize: "₹ 50,00,000",
    participants: 11200,
    tags: ["Bhashini Indic AI", "Agritech", "Healthcare", "Government of India"],
    description: `### National Artificial Intelligence Mission
Organized under the IndiaAI initiative by MeitY, this competition seeks sovereign AI solutions for India's linguistic, agricultural, and public administration challenges. Top 3 teams receive ₹25 Lakhs incubation support.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "hack2skill-portal",
    external_id: "hack2skill-innovation-hub",
    source: "Hack2Skill",
    title: "Hack2Skill Enterprise & National Ecosystem Hackathon Hub",
    organizer: "Hack2Skill India",
    url: "https://hack2skill.com/",
    image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "India (Nationwide)",
    starts_at: "2026-11-01T00:00:00Z",
    ends_at: "2027-03-31T23:59:00Z",
    reg_ends_at: "2027-03-15T23:59:00Z",
    dates_label: "Continuous Hackathons",
    prize: "₹ 35,00,000+",
    participants: 42000,
    tags: ["Enterprise Tech", "Hardware/IoT", "Student Hackathons"],
    description: `### Hack2Skill Official Competitions
Discover innovation challenges, student competitions, and corporate sprints powered by Hack2Skill across enterprise cloud, AI, and developer tools.`,
    updated_at: new Date().toISOString(),
  },

  // 5. HACKEREARTH
  {
    id: "hackerearth-global-challenges",
    external_id: "hackerearth-challenges-portal",
    source: "HackerEarth",
    title: "HackerEarth Global Corporate Hackathons & Coding Challenges",
    organizer: "HackerEarth & Global Enterprise Sponsors",
    url: "https://www.hackerearth.com/challenges/",
    image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online",
    starts_at: "2026-11-20T12:00:00Z",
    ends_at: "2027-02-28T18:00:00Z",
    reg_ends_at: "2027-02-15T23:59:00Z",
    dates_label: "Open Corporate Contests",
    prize: "$150,000+ Total Pools",
    participants: 76000,
    tags: ["Corporate Hackathons", "Algorithms", "AI Ops", "Hiring Track"],
    description: `### Premier Corporate Engineering Contests
Solve enterprise engineering problems, compete in algorithmic leaderboards, and get hired by Fortune 500 tech companies through HackerEarth.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "hackerearth-hackathons-portal",
    external_id: "hackerearth-hackathons-hub",
    source: "HackerEarth",
    title: "HackerEarth International AI, Blockchain & Cloud Hackathons",
    organizer: "HackerEarth Community",
    url: "https://www.hackerearth.com/challenges/hackathon/",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online (Global)",
    starts_at: "2026-11-25T00:00:00Z",
    ends_at: "2027-03-15T18:00:00Z",
    reg_ends_at: "2027-02-28T23:59:00Z",
    dates_label: "Ongoing Seasons",
    prize: "₹ 40,00,000+",
    participants: 51000,
    tags: ["Hackathons", "Full Stack", "Deep Learning", "FinTech"],
    description: `### HackerEarth Official Hackathon Hub
Direct access to live, ongoing hackathons featuring software architecture, computer vision, data science, and web engineering.`,
    updated_at: new Date().toISOString(),
  },

  // 6. MAJOR LEAGUE HACKING (MLH)
  {
    id: "mlh-global-hack-week",
    external_id: "ghw-ai-ml-2026",
    source: "Major League Hacking (MLH)",
    title: "Global Hack Week: AI & Machine Learning Edition",
    organizer: "Major League Hacking (MLH)",
    url: "https://ghw.mlh.com/",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online (Global)",
    starts_at: "2026-12-08T15:00:00Z",
    ends_at: "2026-12-15T23:59:00Z",
    reg_ends_at: "2026-12-14T23:59:00Z",
    dates_label: "08 Dec – 15 Dec 2026",
    prize: "$25,000 in Hardware & Swag",
    participants: 14800,
    tags: ["Beginner Friendly", "AI/ML", "Workshops", "Global Community"],
    description: `### Build, Learn, and Ship in 7 Days
MLH Global Hack Week is a worldwide celebration of learning. Daily technical challenges, live mentor sessions, project feedback livestreams, and beginner tracks.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "mlh-hack-the-north",
    external_id: "hack-the-north-2026",
    source: "Major League Hacking (MLH)",
    title: "Hack the North: Canada's Biggest Collegiate Hackathon",
    organizer: "Techvibes & University of Waterloo (MLH Partner)",
    url: "https://hackthenorth.com/",
    image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1600&q=80",
    mode: "Hybrid",
    location: "Waterloo, ON & Global Online",
    starts_at: "2027-01-16T12:00:00Z",
    ends_at: "2027-01-18T18:00:00Z",
    reg_ends_at: "2026-12-28T23:59:00Z",
    dates_label: "16 Jan – 18 Jan 2027",
    prize: "$75,000 CAD",
    participants: 16000,
    tags: ["Collegiate Flagship", "Hardware", "Software", "Travel Grants"],
    description: `### Global Premier Student Hackathon
Over 1,000 of the world's most innovative students gather for 36 hours of invention, collaboration, and high-impact software construction.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "mlh-season-events",
    external_id: "mlh-season-calendar",
    source: "Major League Hacking (MLH)",
    title: "MLH Official Member Hackathon Season Calendar",
    organizer: "Major League Hacking (MLH)",
    url: "https://www.mlh.com/seasons/2025/events",
    image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
    mode: "Hybrid",
    location: "Global & Regional",
    starts_at: "2026-11-20T00:00:00Z",
    ends_at: "2027-06-30T23:59:00Z",
    reg_ends_at: "2027-06-15T23:59:00Z",
    dates_label: "Official Collegiate Season",
    prize: "$250,000+ Total Season",
    participants: 65000,
    tags: ["MLH Official", "College Hackathons", "Community"],
    description: `### The Official Student Hackathon League
Access every sanctioned MLH student hackathon globally with official hardware labs, GitHub Student Developer Pack integrations, and digital badges.`,
    updated_at: new Date().toISOString(),
  },

  // 7. RESKILLL
  {
    id: "reskilll-official-portal",
    external_id: "reskilll-hackathons",
    source: "Reskilll",
    title: "Reskilll Global Developer Hackathons & Tech Challenges",
    organizer: "Reskilll & Cloud Ecosystem Partners",
    url: "https://reskilll.com/",
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online / India",
    starts_at: "2026-12-01T00:00:00Z",
    ends_at: "2027-02-28T23:59:00Z",
    reg_ends_at: "2027-02-15T23:59:00Z",
    dates_label: "Open Registration",
    prize: "₹ 15,00,000",
    participants: 12400,
    tags: ["Microsoft Azure", "Cloud Native", "Dev Community", "AI"],
    description: `### Community & Ecosystem Builder Hackathons
Participate in developer programs, ecosystem technology challenges, and corporate cloud hackathons organized across India.`,
    updated_at: new Date().toISOString(),
  },

  // 8. HACKINDIA
  {
    id: "hackindia-national",
    external_id: "hackindia-championship",
    source: "HackIndia",
    title: "HackIndia: India's Largest Web3, AI & Robotics Hackathon",
    organizer: "HackIndia Foundation & Ecosystem Partners",
    url: "https://hackindia.org/",
    image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80",
    mode: "Hybrid",
    location: "Delhi-NCR & National Nodal Hubs",
    starts_at: "2027-01-08T09:00:00Z",
    ends_at: "2027-01-10T18:00:00Z",
    reg_ends_at: "2026-12-30T23:59:00Z",
    dates_label: "08 Jan – 10 Jan 2027",
    prize: "₹ 25,00,000",
    participants: 13400,
    tags: ["Robotics", "Web3", "Autonomous Hardware", "National Final"],
    description: `### India's Largest Frontier Tech Hackathon
HackIndia unites engineers across 50 top universities for a national battle in autonomous robotics, decentralized finance, and edge artificial intelligence.`,
    updated_at: new Date().toISOString(),
  },

  // 9. HACKERRANK
  {
    id: "hackerrank-contests-portal",
    external_id: "hackerrank-contests-hub",
    source: "HackerRank",
    title: "HackerRank Contests: Competitive Coding, AI & Systems Challenges",
    organizer: "HackerRank",
    url: "https://www.hackerrank.com/contests",
    image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online",
    starts_at: "2026-11-20T00:00:00Z",
    ends_at: "2027-03-31T23:59:00Z",
    reg_ends_at: "2027-03-31T23:59:00Z",
    dates_label: "Official Ongoing Contests",
    prize: "$50,000+ & Direct Hiring",
    participants: 120000,
    tags: ["Algorithms", "Data Structures", "Distributed Systems", "Hiring Contest"],
    description: `### Official HackerRank Contests Hub
Compete in skill-based coding challenges, algorithmic contests, and corporate recruitment hackathons with direct hiring tracks.`,
    updated_at: new Date().toISOString(),
  },

  // 10. ALL HACKATHONS
  {
    id: "allhackathons-global-directory",
    external_id: "allhackathons-directory",
    source: "All Hackathons",
    title: "All Hackathons: Global Hackathon Directory & Event Radar",
    organizer: "AllHackathons.com",
    url: "https://allhackathons.com/",
    image_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Worldwide (Online & In-person)",
    starts_at: "2026-11-20T00:00:00Z",
    ends_at: "2027-04-30T23:59:00Z",
    reg_ends_at: "2027-04-15T23:59:00Z",
    dates_label: "Curated Global Index",
    prize: "€ 100,000+ Aggregated",
    participants: 35000,
    tags: ["Global Directory", "ClimateTech", "AI", "Open Source"],
    description: `### Official Global Hackathon Aggregator
Curated directory of upcoming online and offline hackathons across computer vision, decentralized technologies, climate change, and robotics.`,
    updated_at: new Date().toISOString(),
  },
];
