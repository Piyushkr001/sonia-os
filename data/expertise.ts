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
    heading: "Knowledge creates possibilities.",
    description:
      "Explore Sonia's professional knowledge, specializations and areas of expertise.",
    tags: ["Knowledge", "Professional Expertise"],
    icon: Brain,
  },
  {
    id: "02",
    title: "Experience",
    heading: "Experience shapes perspective.",
    description:
      "Discover the professional experiences and responsibilities behind her career journey.",
    tags: ["Experience", "Professional Journey"],
    icon: BriefcaseBusiness,
  },
  {
    id: "03",
    title: "Leadership",
    heading: "Leadership gives direction.",
    description:
      "Explore documented leadership roles, professional responsibilities and organizational experiences.",
    tags: ["Leadership", "Responsibilities"],
    icon: Compass,
  },
  {
    id: "04",
    title: "Approach",
    heading: "Think beyond the obvious.",
    description:
      "Explore the ideas and problem-solving philosophy associated with i-SmokeStack.",
    tags: ["Problem Solving", "Creative Thinking"],
    icon: Lightbulb,
  },
  {
    id: "05",
    title: "Entrepreneurship",
    heading: "Building new possibilities.",
    description:
      "Discover Sonia's professional identity as the founder of i-SmokeStack.",
    tags: ["Founder", "i-SmokeStack"],
    icon: Rocket,
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
    description: "Explore professional perspectives.",
    details:
      "Documented leadership perspectives and professional experiences will be presented here once verified.",
    icon: Compass,
  },
  {
    id: "02",
    title: "Strategic Responsibilities",
    description: "Discover professional responsibilities.",
    details:
      "Explore verified strategic responsibilities, initiatives and organizational contributions.",
    icon: Target,
  },
  {
    id: "03",
    title: "Collaboration",
    description: "Explore professional relationships.",
    details:
      "Discover documented experiences involving professional collaboration and organizational engagement.",
    icon: Users,
  },
  {
    id: "04",
    title: "Entrepreneurship",
    description: "Building possibilities.",
    details:
      "Sonia is the founder of i-SmokeStack, whose stated philosophy is Do More by Doing Less™.",
    icon: Rocket,
  },
];