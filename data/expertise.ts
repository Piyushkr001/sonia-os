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
    heading: "Find the problem underneath.",
    description: "Her profile describes work across positioning, communication, operations, customer experience, internal alignment, decision-making and growth direction.",
    tags: [
      "Positioning",
      "Operations",
      "Customer Experience"
    ],
    icon: Brain,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "02",
    title: "Experience",
    heading: "Perspective shaped by experience.",
    description: "Soniaa describes 15 years working within companies across industries before starting i-SmokeStack; her headline describes 20 years of untangling startup challenges.",
    tags: [
      "Cross-industry experience",
      "Startup support",
      "Practical insight"
    ],
    icon: BriefcaseBusiness,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "03",
    title: "Leadership",
    heading: "Honest conversations first.",
    description: "As the listed CEO of i-SmokeStack, Soniaa describes an approach that prioritizes candid advice and helping founders identify what is actually holding them back.",
    tags: [
      "Clarity",
      "Decision-making",
      "Internal alignment"
    ],
    icon: Compass,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "04",
    title: "Approach",
    heading: "Understand before building.",
    description: "Her profile recounts pausing a planned brand revamp when a founder could not explain the brand clearly. She describes exploring purpose, audience and identity before building.",
    tags: [
      "Root-cause discovery",
      "Brand clarity",
      "Purpose"
    ],
    icon: Lightbulb,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "05",
    title: "Entrepreneurship",
    heading: "Two ventures. One focus on clarity.",
    description: "i-SmokeStack works with early-stage and growing businesses, while Zero Confusion helps founders clarify their thinking before committing to growth or structured consulting.",
    tags: [
      "i-SmokeStack",
      "Zero Confusion",
      "Founder support"
    ],
    icon: Rocket,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  }
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
    description: "Direct, honest guidance.",
    details: "Soniaa describes wanting to provide founders with straightforward answers instead of advice driven by other agendas. Her stated approach emphasizes honesty, clear thinking and the underlying issue.",
    icon: Compass,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "02",
    title: "Strategic Responsibilities",
    description: "Clarity across the business.",
    details: "Her profile lists her as CEO of i-SmokeStack and describes the venture’s work across business positioning, operations, communication, customer experience, internal alignment, decision-making and growth. It does not enumerate her individual executive duties.",
    icon: Target,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "03",
    title: "Collaboration",
    description: "Build alongside founders.",
    details: "Soniaa describes i-SmokeStack as working closely with companies to understand their challenges and build solutions together rather than only advising from the outside.",
    icon: Users,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "04",
    title: "Entrepreneurship",
    description: "Clarity at different stages.",
    details: "Soniaa founded i-SmokeStack in 2019. She also founded Zero Confusion for founders who need space to understand their ideas before structured consulting, scaling, branding, hiring, marketing or fundraising.",
    icon: Rocket,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  }
];
