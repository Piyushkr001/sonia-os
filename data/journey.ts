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
    subtitle: "The beginning",
    heading: "Where it began.",
    description:
      "Explore the foundations of Sonia's professional identity.",
    details:
      "Verified educational qualifications and early professional experiences will be added here.",
    tags: [
      "Education",
      "Foundations",
    ],
    icon: BookOpen,
  },
  {
    id: "02",
    title: "Evolution",
    subtitle: "The path of growth",
    heading: "Learning. Growing. Evolving.",
    description:
      "Discover the experiences and transitions that shaped her professional journey.",
    details:
      "Verified career milestones, professional roles and responsibilities will be added here.",
    tags: [
      "Career Journey",
      "Professional Growth",
    ],
    icon: TrendingUp,
  },
  {
    id: "03",
    title: "Leadership",
    subtitle: "Leading with purpose",
    heading: "Beyond responsibilities.",
    description:
      "Explore professional leadership through experiences, responsibilities and ideas.",
    details:
      "Verified leadership roles, initiatives and professional contributions will be added here.",
    tags: [
      "Leadership",
      "Professional Experience",
    ],
    icon: Compass,
  },
  {
    id: "04",
    title: "Entrepreneurship",
    subtitle: "Building possibilities",
    heading: "Turning possibilities into reality.",
    description:
      "Explore Sonia's professional identity as the founder of i-SmokeStack.",
    details:
      "Discover the company philosophy of Do More by Doing Less™ and its emphasis on creative problem-solving.",
    tags: [
      "Founder",
      "i-SmokeStack",
      "Entrepreneurship",
    ],
    icon: Rocket,
  },
];