import "server-only";

export interface KnowledgeSource {
  id: string;
  title: string;
  category: string;
  content: string;
  source: string;
  url?: string;
}

export const knowledgeBase: KnowledgeSource[] = [
  {
    id: "founder-profile",
    title: "Soniaa Specialist — Founder Profile",
    category: "profile",
    content: "Soniaa Specialist’s LinkedIn profile identifies her as founder of i-SmokeStack and Zero Confusion, based in the Los Angeles Metropolitan Area. Her headline describes 20 years of untangling startup challenges. The Experience section lists Chief Executive Officer at i-SmokeStack.",
    source: "LinkedIn profile PDF, pages 1–2",
    url: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "career-foundations",
    title: "Cross-industry Experience",
    category: "journey",
    content: "Soniaa states that she worked inside companies across industries for 15 years before starting i-SmokeStack. Her profile does not identify previous employers, individual job titles, education or detailed employment dates. Do not infer those details or add the 15 years to the 20-year headline.",
    source: "LinkedIn profile PDF, page 1",
    url: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "company-history",
    title: "i-SmokeStack — Founding",
    category: "journey",
    content: "Soniaa states that she started i-SmokeStack in 2019 after observing promising founders struggling to identify the real problems in their businesses. Her motivation was to offer direct and honest guidance.",
    source: "LinkedIn profile PDF, page 1",
    url: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "startup-support",
    title: "i-SmokeStack — Business Support",
    category: "expertise",
    content: "The venture works closely with early-stage and growing companies across positioning, communication, operations, customer experience, internal alignment, decision-making and growth direction. Soniaa describes the work as understanding problems and building solutions alongside clients.",
    source: "LinkedIn profile PDF, page 1",
    url: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "zero-confusion",
    title: "Zero Confusion",
    category: "journey",
    content: "Soniaa founded Zero Confusion for founders who have strong ideas but feel overwhelmed or are not ready for structured consulting. It provides space for clarity before scaling, branding, hiring, marketing or raising money. Its founding date is not given in the profile.",
    source: "LinkedIn profile PDF, page 1",
    url: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "leadership-approach",
    title: "Leadership and Collaboration",
    category: "leadership",
    content: "Soniaa describes a preference for honest conversations, direct guidance, clear thinking and solving the underlying problem. She emphasizes working with founders rather than merely advising. These statements describe her own account of her approach; the profile does not establish measurable leadership outcomes.",
    source: "LinkedIn profile PDF, pages 1–2",
    url: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "brand-clarity-example",
    title: "Brand Clarity — An Example",
    category: "philosophy",
    content: "Soniaa recounts an unnamed founder who wanted a complete brand revamp with logo direction and a website brief. When asked to explain the brand in two lines, the founder was unable to answer. She describes pausing the work to clarify purpose, audience, identity and the reason for the business before building. This is her reported anecdote, not an independently verified case study; no financial results are stated.",
    source: "LinkedIn profile PDF, pages 1–2",
    url: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "founder-philosophy",
    title: "Clarity Before Growth",
    category: "philosophy",
    content: "Soniaa emphasizes avoiding unnecessary noise and performative startup activity. Her approach prioritizes honest conversations and understanding what a founder is building and why before choosing a solution.",
    source: "LinkedIn profile PDF, pages 1–2",
    url: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "company-philosophy",
    title: "i-SmokeStack Philosophy",
    category: "philosophy",
    content: "The hiring challenge states the i-SmokeStack philosophy as Do More by Doing Less™.",
    source: "i-SmokeStack hiring challenge brief"
  },
  {
    id: "digital-experience",
    title: "About SONIA.OS",
    category: "profile",
    content: "SONIA.OS is an independent developer challenge experience, not an official company website, authorized representative of Soniaa or a direct channel to the founder. Its demonstration Connection Portal is operated by the project developer.",
    source: "SONIA.OS project concept"
  },
  {
    id: "possibility-engine",
    title: "The Possibility Engine",
    category: "philosophy",
    content: "Simplify, Focus and Amplify is an illustrative framework created for SONIA.OS and inspired by the company philosophy. It is not a documented personal methodology of Soniaa Specialist or a guarantee of results.",
    source: "SONIA.OS project concept"
  }
];
