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
    subtitle: "Learning inside businesses",
    heading: "Recognizing the real problem.",
    description: "Soniaa describes spending 15 years working inside companies across industries before starting i-SmokeStack.",
    details: "She repeatedly encountered founders with promising ideas who were struggling to identify the root cause of their difficulties. This experience shaped her emphasis on direct, honest advice.",
    tags: [
      "Cross-industry experience",
      "Founder challenges",
      "Problem discovery"
    ],
    icon: BookOpen,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "02",
    title: "i-SmokeStack",
    subtitle: "2019 — Founding milestone",
    heading: "From advice to building together.",
    description: "In her LinkedIn summary, Soniaa states that she started i-SmokeStack in 2019 to help early-stage and growing companies address what is not working.",
    details: "The venture works across positioning, communication, operations, customer experience, internal alignment, decision-making and growth direction, with a hands-on approach rather than advice alone.",
    tags: [
      "2019",
      "Startup consulting",
      "Hands-on support"
    ],
    icon: TrendingUp,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "03",
    title: "Zero Confusion",
    subtitle: "Clarity before scaling",
    heading: "Making space for clearer thinking.",
    description: "Soniaa founded Zero Confusion after encountering founders whose ideas were strong but whose thinking was overwhelmed.",
    details: "The venture helps founders clarify what they are building and why before making decisions about branding, hiring, marketing, scaling or raising money. The profile does not specify its founding date.",
    tags: [
      "Founder clarity",
      "Prioritization",
      "Early-stage ideas"
    ],
    icon: Compass,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  },
  {
    id: "04",
    title: "Today",
    subtitle: "Founder & CEO",
    heading: "Solving the problem beneath the noise.",
    description: "Her LinkedIn headline describes 20 years of helping startups untangle complexity. Her Experience section lists her as Chief Executive Officer at i-SmokeStack.",
    details: "Across i-SmokeStack and Zero Confusion, Soniaa emphasizes honest conversations, clear thinking and addressing the underlying problem before committing resources to a solution.",
    tags: [
      "Founder",
      "Chief Executive Officer",
      "Clarity"
    ],
    icon: Rocket,
    sourceUrl: "https://www.linkedin.com/in/soniaaspecialist/"
  }
];
