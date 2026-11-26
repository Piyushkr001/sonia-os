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
    title: "Founder Profile",
    category: "profile",
    content: "The i-SmokeStack hiring challenge identifies Soniaa Specialist as the founder. Her public LinkedIn profile uses the professional name Soniaa Specialist. The accessible profile does not establish a complete employment or education history.",
    source: "Hiring challenge brief; public LinkedIn profile",
    url: "https://www.linkedin.com/in/soniaaspecialist/",
  },
  {
    id: "marketing-consultancy",
    title: "Marketing and Sales Consultancy",
    category: "expertise",
    content: "The SoniaaSpecialist LinkedIn company page describes experience in marketing and sales and a consultancy intended to help other organizations improve their marketing capabilities. It lists 2013 as its founding year.",
    source: "SoniaaSpecialist LinkedIn company page",
    url: "https://in.linkedin.com/company/soniaspecialist",
  },
  {
    id: "company-history",
    title: "i-SmokeStack Background",
    category: "journey",
    content: "The i-SmokeStack LinkedIn company page lists 2019 as the founding year. This is the company founding year, not necessarily the date of an individual appointment.",
    source: "i-SmokeStack LinkedIn company page",
    url: "https://www.linkedin.com/company/smokestackgeeks",
  },
  {
    id: "company-philosophy",
    title: "i-SmokeStack Philosophy",
    category: "philosophy",
    content: "The company uses the motto Do More by Doing Less™. Its public mission focuses on reducing complexity in startup operations through technology and practical solutions.",
    source: "i-SmokeStack LinkedIn company page",
    url: "https://www.linkedin.com/company/smokestackgeeks",
  },
  {
    id: "startup-support",
    title: "Startup Support",
    category: "expertise",
    content: "i-SmokeStack describes support for early-stage and B2B businesses. Its public description emphasizes process improvement and assistance for founders.",
    source: "i-SmokeStack LinkedIn company page",
    url: "https://www.linkedin.com/company/smokestackgeeks",
  },
  {
    id: "mentorship",
    title: "Mentorship and Talent Development",
    category: "leadership",
    content: "The company describes initiatives for startup founders and college students through Mrs. DoIT and Mr. DoIT. These are company initiatives; do not attribute every activity directly to Soniaa Specialist.",
    source: "i-SmokeStack LinkedIn company page",
    url: "https://www.linkedin.com/company/smokestackgeeks",
  },
  {
    id: "mentorship-testimonial",
    title: "Public Mentorship Testimonial",
    category: "leadership",
    content: "Former intern Aayushi Surana publicly thanked Soniaa Specialist and other i-SmokeStack colleagues for guidance and encouragement during her internship. This is an attributed testimonial, not an independently measured result.",
    source: "Aayushi Surana public LinkedIn post",
    url: "https://www.linkedin.com/posts/aayushi-surana-bbb92620b_intern-gratitude-gratitude-activity-6845992181291905024-7qfm",
  },
  {
    id: "digital-experience",
    title: "About SONIA.OS",
    category: "profile",
    content: "SONIA.OS is an independent developer challenge project, not an official company website or an authorized representative of the founder.",
    source: "SONIA.OS project concept",
  },
  {
    id: "possibility-engine",
    title: "The Possibility Engine",
    category: "philosophy",
    content: "Simplify, Focus and Amplify is an illustrative framework created for SONIA.OS. It is inspired by the company motto, not a documented methodology of Soniaa Specialist.",
    source: "SONIA.OS project concept",
  },
];
