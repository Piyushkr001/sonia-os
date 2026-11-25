import {
  Workflow,
  Brain,
  Repeat,
  Layers,
  type LucideIcon,
} from "lucide-react";

export interface PossibilityChallenge {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  simplify: string;
  focus: string;
  amplify: string;
  outcome: {
    title: string;
    description: string;
    benefits: string[];
  };
}

export const possibilityChallenges: PossibilityChallenge[] = [
  {
    id: "workflow",
    title: "Complex Workflows",
    description: "Too many steps and unnecessary processes.",
    icon: Workflow,
    simplify: "Remove redundant steps.",
    focus: "Prioritize essential actions.",
    amplify: "Automate repeatable processes.",
    outcome: {
      title: "Simplify the workflow.",
      description:
        "Identify unnecessary steps, streamline decision-making and automate repetitive activities to create a more efficient workflow.",
      benefits: [
        "Less Friction",
        "Better Efficiency",
        "More Focus",
      ],
    },
  },
  {
    id: "information",
    title: "Information Overload",
    description: "Too much information and too little clarity.",
    icon: Brain,
    simplify: "Filter unnecessary information.",
    focus: "Identify meaningful insights.",
    amplify: "Turn insights into actions.",
    outcome: {
      title: "Transform information into clarity.",
      description:
        "Organize information around clear objectives, prioritize relevant insights and create actionable decisions instead of accumulating unnecessary data.",
      benefits: [
        "Greater Clarity",
        "Better Decisions",
        "Reduced Noise",
      ],
    },
  },
  {
    id: "repetition",
    title: "Repetitive Tasks",
    description: "Valuable time spent on recurring activities.",
    icon: Repeat,
    simplify: "Identify recurring activities.",
    focus: "Standardize essential processes.",
    amplify: "Automate predictable tasks.",
    outcome: {
      title: "Make time for meaningful work.",
      description:
        "Use appropriate automation and standardized workflows to reduce repetitive effort and create more opportunities for creative problem-solving.",
      benefits: [
        "Time Optimization",
        "Consistency",
        "Creative Freedom",
      ],
    },
  },
  {
    id: "complexity",
    title: "Unnecessary Complexity",
    description: "Complicated solutions to simple problems.",
    icon: Layers,
    simplify: "Question existing assumptions.",
    focus: "Identify the core problem.",
    amplify: "Build the simplest viable solution.",
    outcome: {
      title: "Less complexity. More value.",
      description:
        "Focus on the underlying problem, challenge unnecessary requirements and prioritize solutions that deliver meaningful value with minimal complexity.",
      benefits: [
        "Simplicity",
        "Maintainability",
        "Meaningful Impact",
      ],
    },
  },
];