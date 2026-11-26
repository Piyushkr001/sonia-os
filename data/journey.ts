import {
  BookOpen,
  TrendingUp,
  Compass,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export interface JourneyChapter {
  id: string;
  title: string;
  subtitle: string;
  heading: string;
  description: string;
  details: string;
  tags: string[];
  icon: LucideIcon;
  sourceUrl?: string;
}

export const journeyChapters: JourneyChapter[] = [
  {
    id: "01",
    title: "Foundations",
    subtitle: "Marketing and sales",
    heading: "Understanding how businesses grow.",
    description: "Soniaa Specialist’s public consultancy page describes a professional background in marketing and sales.",
    details: "The focus is on sharing practical marketing knowledge with organizations adapting to modern business needs. Her detailed education history is not confirmed by the accessible primary sources.",
    tags: ["Marketing", "Sales", "Consulting"],
    icon: BookOpen,
    sourceUrl: "https://in.linkedin.com/company/soniaspecialist",
  },
  {
    id: "02",
    title: "Evolution",
    subtitle: "From experience to advisory",
    heading: "Turning knowledge into action.",
    description: "The SoniaaSpecialist consultancy page lists 2013 as its founding year.",
    details: "Its public description presents consulting as a way to help organizations develop their marketing capabilities. This chapter highlights the move from professional expertise to knowledge-sharing, rather than claiming a complete career timeline.",
    tags: ["2013 — Consultancy", "Knowledge Sharing", "Marketing Advisory"],
    icon: TrendingUp,
    sourceUrl: "https://in.linkedin.com/company/soniaspecialist",
  },
  {
    id: "03",
    title: "Leadership",
    subtitle: "Guidance and encouragement",
    heading: "Creating space for others to grow.",
    description: "A former i-SmokeStack intern publicly thanked Soniaa Specialist for guidance during her internship.",
    details: "The testimonial provides a specific example of mentorship, alongside the company’s stated interest in developing early-career talent.",
    tags: ["Mentorship", "Professional Development", "Collaboration"],
    icon: Compass,
    sourceUrl: "https://www.linkedin.com/posts/aayushi-surana-bbb92620b_intern-gratitude-gratitude-activity-6845992181291905024-7qfm",
  },
  {
    id: "04",
    title: "Entrepreneurship",
    subtitle: "i-SmokeStack",
    heading: "Less friction. More possibility.",
    description: "The challenge introduces Soniaa Specialist as the founder of i-SmokeStack. Its LinkedIn company page lists 2019 as the founding year.",
    details: "The organization describes its work as helping early-stage businesses streamline operations, use technology effectively and support student development.",
    tags: ["2019 — Company Founded", "Startup Support", "Entrepreneurship"],
    icon: Rocket,
    sourceUrl: "https://www.linkedin.com/company/smokestackgeeks",
  },
];
