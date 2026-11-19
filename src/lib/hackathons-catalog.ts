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

  // 2. DEVFOLIO
  {
    id: "devfolio-hacktu-6",
    external_id: "hacktu-6-0",
    source: "Devfolio",
    title: "HackTU 6.0: North India's Premier Collegiate Hackathon",
    organizer: "Creative Computing Society (CCS TIET)",
    url: "https://hacktu.ccs-tiet.org",
    image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    mode: "In-person",
    location: "Thapar Institute of Engg & Tech, Patiala",
    starts_at: "2027-02-12T09:00:00Z",
    ends_at: "2027-02-14T18:00:00Z",
    reg_ends_at: "2027-02-05T23:59:00Z",
    dates_label: "12 Feb – 14 Feb 2027",
    prize: "₹ 4,50,000",
    participants: 8200,
    tags: ["Generative AI", "FinTech", "Web3", "Smart Campus", "TIET Official"],
    description: `### Official Flagship Hackathon of Thapar Institute
Hosted by Creative Computing Society (CCS), HackTU is the marquee annual collegiate hackathon attracting top builders from IITs, NITs, BITS, and across India to the TIET Patiala campus.

### Key Tracks
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
    title: "ETHIndia 2026: Asia's Largest Ethereum Hackathon",
    organizer: "Devfolio & Ethereum Foundation",
    url: "https://ethindia.co",
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

  // 3. DEVPOST
  {
    id: "devpost-paypal-ai",
    external_id: "paypal-ai-hackathon",
    source: "Devpost",
    title: "PayPal AI Global Innovation Challenge 2026",
    organizer: "PayPal Developer Ecosystem",
    url: "https://paypalaihackathon.devpost.com",
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
Build next-generation commerce tools and payment experiences using PayPal SDKs paired with cutting-edge LLMs and multimodal AI models.

### Submission Guidelines
- Working GitHub repository with MIT/Apache license.
- 3-minute video walkthrough demonstrating an active sandbox checkout or agent transaction.
- Comprehensive technical architecture documentation.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "devpost-meta-vr",
    external_id: "meta-vr-spatial-2026",
    source: "Devpost",
    title: "Meta VR Start & Spatial Computing Developer Championship",
    organizer: "Meta Reality Labs",
    url: "https://metavrstart.devpost.com",
    image_url: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online",
    starts_at: "2026-10-15T00:00:00Z",
    ends_at: "2027-01-20T23:59:00Z",
    reg_ends_at: "2027-01-20T23:59:00Z",
    dates_label: "Open Submissions",
    prize: "$1,000,000",
    participants: 9400,
    tags: ["Spatial Computing", "Meta Quest", "Unity", "WebXR", "Computer Vision"],
    description: `### Next Frontier of Immersive Interaction
Create applications for Meta Quest 3 and spatial headsets across Productivity, Healthcare Simulation, Collaborative Engineering, and Mixed Reality Gaming.`,
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
Organized under the IndiaAI initiative by MeitY, this competition seeks sovereign AI solutions for India's linguistic, agricultural, and public administration challenges.

### Priority Tracks
- **Indic Language Models**: Multilingual agents leveraging Bhashini APIs.
- **Precision Agriculture**: Edge computer vision models for crop pest detection.
- **Venture Incubation**: Top 3 teams receive incubation grants up to ₹25 Lakhs.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "hack2skill-intel-oneapi",
    external_id: "intel-oneapi-challenge",
    source: "Hack2Skill",
    title: "Intel OneAPI Deep Learning Student Challenge India",
    organizer: "Intel Software & Hack2Skill",
    url: "https://hack2skill.com/hack/intel-oneapi-challenge",
    image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online",
    starts_at: "2026-12-01T00:00:00Z",
    ends_at: "2027-01-25T18:00:00Z",
    reg_ends_at: "2027-01-10T23:59:00Z",
    dates_label: "01 Dec 2026 – 25 Jan 2027",
    prize: "₹ 8,00,000",
    participants: 6700,
    tags: ["High Performance Computing", "OneAPI", "Deep Learning", "SYCL"],
    description: `### Heterogeneous Computing Sprint
Optimize deep learning pipelines across CPUs, GPUs, and FPGAs utilizing Intel oneAPI Toolkits, PyTorch extensions, and SYCL programming.`,
    updated_at: new Date().toISOString(),
  },

  // 5. HACKEREARTH
  {
    id: "hackerearth-ibm-quantum",
    external_id: "ibm-quantum-developer-2026",
    source: "HackerEarth",
    title: "IBM Quantum Developer Global Challenge 2026",
    organizer: "IBM Quantum & HackerEarth",
    url: "https://www.hackerearth.com/challenges/hackathon/ibm-quantum-developer-2026",
    image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online",
    starts_at: "2026-11-20T12:00:00Z",
    ends_at: "2027-01-30T18:00:00Z",
    reg_ends_at: "2027-01-15T23:59:00Z",
    dates_label: "20 Nov 2026 – 30 Jan 2027",
    prize: "$50,000",
    participants: 7400,
    tags: ["Quantum Computing", "Qiskit", "Algorithms", "Optimization"],
    description: `### Quantum Algorithm Innovation Sprint
Solve combinatorial optimization and molecular simulation problems on IBM Quantum Eagle and Heron superconducting processors using Qiskit 1.0.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "hackerearth-capgemini-tech",
    external_id: "capgemini-tech-challenge-2026",
    source: "HackerEarth",
    title: "Capgemini Tech Challenge: Autonomous Enterprise Cloud",
    organizer: "Capgemini India",
    url: "https://techchallenge.in.capgemini.com",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online",
    starts_at: "2026-12-05T00:00:00Z",
    ends_at: "2027-02-15T18:00:00Z",
    reg_ends_at: "2027-01-28T23:59:00Z",
    dates_label: "05 Dec 2026 – 15 Feb 2027",
    prize: "₹ 20,00,000",
    participants: 28400,
    tags: ["Cloud Architecture", "DevOps", "AI Ops", "Hiring Track"],
    description: `### Premier Corporate Engineering Challenge
Solve multi-tier enterprise architecture challenges. Top performing teams and solo coders receive immediate interview invitations for Senior Engineer roles.`,
    updated_at: new Date().toISOString(),
  },

  // 6. MAJOR LEAGUE HACKING (MLH)
  {
    id: "mlh-global-hack-week-ai",
    external_id: "ghw-ai-ml-2026",
    source: "Major League Hacking (MLH)",
    title: "Global Hack Week: AI & Machine Learning Edition",
    organizer: "Major League Hacking (MLH)",
    url: "https://ghw.mlh.io",
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
    title: "Hack the North 2026: Canada's Biggest Collegiate Hackathon",
    organizer: "Techvibes & University of Waterloo (MLH Partner)",
    url: "https://hackthenorth.com",
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

  // 7. RESKILLL
  {
    id: "reskilll-microsoft-fabric",
    external_id: "microsoft-fabric-hack-2026",
    source: "Reskilll",
    title: "Microsoft Fabric & Azure AI Global Student Hackathon",
    organizer: "Microsoft India & Reskilll",
    url: "https://reskilll.com/hack/microsoft-fabric-2026",
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online",
    starts_at: "2026-12-02T00:00:00Z",
    ends_at: "2027-01-20T23:59:00Z",
    reg_ends_at: "2027-01-10T23:59:00Z",
    dates_label: "02 Dec 2026 – 20 Jan 2027",
    prize: "₹ 10,00,000",
    participants: 8900,
    tags: ["Microsoft Azure", "Fabric Lakehouse", "OpenAI", "Data Engineering"],
    description: `### Enterprise Analytics & Generative Intelligence
Architect data-driven intelligent agents using Microsoft Fabric, OneLake, and Azure OpenAI Service to solve modern corporate decision bottlenecks.`,
    updated_at: new Date().toISOString(),
  },

  // 8. HACKINDIA
  {
    id: "hackindia-national-2026",
    external_id: "hackindia-national-championship",
    source: "HackIndia",
    title: "HackIndia 2026: National Web3, AI & Robotics Championship",
    organizer: "HackIndia & SingularityDAO",
    url: "https://hackindia.xyz",
    image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80",
    mode: "Hybrid",
    location: "Delhi-NCR & TIET Patiala Nodal Hub",
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
    id: "hackerrank-world-codesprint",
    external_id: "hackerrank-world-codesprint-2026",
    source: "HackerRank",
    title: "HackerRank World CodeSprint: High-Scale Distributed Systems",
    organizer: "HackerRank Engineering",
    url: "https://www.hackerrank.com/contests/world-codesprint-2026",
    image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online",
    starts_at: "2026-12-19T14:00:00Z",
    ends_at: "2026-12-21T14:00:00Z",
    reg_ends_at: "2026-12-19T13:00:00Z",
    dates_label: "19 Dec – 21 Dec 2026",
    prize: "$30,000 + FAANG Fast Track",
    participants: 22100,
    tags: ["Algorithms", "Data Structures", "Distributed Systems", "Hiring Contest"],
    description: `### Algorithmic Prowess & High-Throughput Engineering
Compete in a 48-hour global challenge featuring algorithmic problem-solving and distributed concurrent system design.`,
    updated_at: new Date().toISOString(),
  },

  // 10. ALL HACKATHONS
  {
    id: "allhackathons-climate-tech",
    external_id: "global-climate-tech-2026",
    source: "All Hackathons",
    title: "Global Climate Tech & Clean Energy Innovation Sprint 2026",
    organizer: "AllHackathons.com & ClimateTech Foundation",
    url: "https://allhackathons.com/hackathons/global-climate-tech-2026",
    image_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online",
    starts_at: "2026-12-12T00:00:00Z",
    ends_at: "2027-01-18T23:59:00Z",
    reg_ends_at: "2027-01-10T23:59:00Z",
    dates_label: "12 Dec 2026 – 18 Jan 2027",
    prize: "€ 40,000",
    participants: 4900,
    tags: ["ClimateTech", "Clean Energy", "Carbon Accounting", "Open Innovation"],
    description: `### Engineering a Sustainable Planet
Curated via the All Hackathons directory, this global sprint focuses on smart grids, carbon offset tracking, and green computational efficiency.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: "allhackathons-open-agents",
    external_id: "open-source-ai-agents-2026",
    source: "All Hackathons",
    title: "Open Source AI Agents Hackathon: Llama-3 & Mistral Ecosystem",
    organizer: "Hugging Face, Mistral & AllHackathons",
    url: "https://allhackathons.com/hackathons/open-source-ai-agents-2026",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
    mode: "Online",
    location: "Online (Global)",
    starts_at: "2026-11-25T00:00:00Z",
    ends_at: "2026-12-30T23:59:00Z",
    reg_ends_at: "2026-12-25T23:59:00Z",
    dates_label: "25 Nov – 30 Dec 2026",
    prize: "$45,000 in GPU Clusters",
    participants: 7600,
    tags: ["Open Source AI", "Llama 3", "Fine-Tuning", "Agentic Systems"],
    description: `### Sovereign, Open-Weight Artificial Intelligence
Build local and privacy-first autonomous agents utilizing open-source LLMs without proprietary API dependencies.`,
    updated_at: new Date().toISOString(),
  },
];
