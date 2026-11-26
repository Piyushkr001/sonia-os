import {
  Brain,
  BriefcaseBusiness,
  Compass,
  Lightbulb,
  Rocket,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface KnowledgeModule {
  id: string;
  title: string;
  heading: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
  sourceUrl?: string;
}

export const knowledgeModules: KnowledgeModule[] = [
  {
    id: "01",
    title: "Expertise",
    heading: "Marketing with purpose.",
    description: "Her consultancy describes marketing and sales expertise applied to helping other organizations strengthen their marketing capabilities.",
    tags: ["Marketing", "Sales", "Advisory"],
    icon: Brain,
    sourceUrl: "https://in.linkedin.com/company/soniaspecialist",
  },
  {
    id: "02",
    title: "Experience",
    heading: "Knowledge made useful.",
    description: "The SoniaaSpecialist consultancy, listed as founded in 2013, emphasizes translating experience into practical guidance for businesses.",
    tags: ["Consulting", "Knowledge Sharing", "Business Growth"],
    icon: BriefcaseBusiness,
    sourceUrl: "https://in.linkedin.com/company/soniaspecialist",
  },
  {
    id: "03",
    title: "Leadership",
    heading: "Helping talent develop.",
    description: "A public testimonial from a former intern credits Soniaa Specialist with encouragement and guidance at i-SmokeStack.",
    tags: ["Mentorship", "Talent Development"],
    icon: Compass,
    sourceUrl: "https://www.linkedin.com/posts/aayushi-surana-bbb92620b_intern-gratitude-gratitude-activity-6845992181291905024-7qfm",
  },
  {
    id: "04",
    title: "Approach",
    heading: "Simplify the work that matters.",
    description: "i-SmokeStack describes its approach as improving startup processes through technology, targeted interventions and tailored solutions.",
    tags: ["Process Improvement", "Technology", "Startup Operations"],
    icon: Lightbulb,
    sourceUrl: "https://www.linkedin.com/company/smokestackgeeks",
  },
  {
    id: "05",
    title: "Entrepreneurship",
    heading: "Building for founders.",
    description: "i-SmokeStack focuses on early-stage and B2B businesses, with an emphasis on reducing operational complexity and helping teams grow.",
    tags: ["Founder", "B2B", "Early-stage Startups"],
    icon: Rocket,
    sourceUrl: "https://www.linkedin.com/company/smokestackgeeks",
  },
];

export interface LeadershipModule {
  id: string;
  title: string;
  description: string;
  details: string;
  icon: LucideIcon;
  sourceUrl?: string;
}

export const leadershipModules: LeadershipModule[] = [
  {
    id: "01",
    title: "Leadership Approach",
    description: "A culture of encouragement.",
    details: "i-SmokeStack describes a supportive culture that recognizes progress and encourages early-career talent. These are stated company values, not a claim about every individual leadership decision.",
    icon: Compass,
    sourceUrl: "https://www.linkedin.com/company/smokestackgeeks",
  },
  {
    id: "02",
    title: "Strategic Responsibilities",
    description: "A founder-focused business mission.",
    details: "The company’s stated mission centers on helping startups improve business processes and address operational challenges. The public sources do not establish a detailed list of Soniaa Specialist’s individual responsibilities.",
    icon: Target,
    sourceUrl: "https://www.linkedin.com/company/smokestackgeeks",
  },
  {
    id: "03",
    title: "Collaboration",
    description: "Mentorship in practice.",
    details: "In a public LinkedIn post, former intern Aayushi Surana acknowledged Soniaa Specialist and other colleagues for their support during her time at i-SmokeStack.",
    icon: Users,
    sourceUrl: "https://www.linkedin.com/posts/aayushi-surana-bbb92620b_intern-gratitude-gratitude-activity-6845992181291905024-7qfm",
  },
  {
    id: "04",
    title: "Entrepreneurship",
    description: "Supporting startups and students.",
    details: "i-SmokeStack describes programs for startup founders and students, including its Mrs. DoIT and Mr. DoIT initiatives. The company aims to help emerging businesses and future professionals use technology more effectively.",
    icon: Rocket,
    sourceUrl: "https://www.linkedin.com/company/smokestackgeeks",
  },
];
