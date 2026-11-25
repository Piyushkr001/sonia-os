import {
  Handshake,
  Network,
  Lightbulb,
  BriefcaseBusiness,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

export const connectionIntentValues = [
  "collaboration",
  "networking",
  "innovation",
  "opportunity",
  "general",
] as const;

export type ConnectionIntent =
  (typeof connectionIntentValues)[number];

export interface ConnectionOption {
  id: ConnectionIntent;
  title: string;
  description: string;
  placeholder: string;
  icon: LucideIcon;
}

export const connectionOptions: ConnectionOption[] = [
  {
    id: "collaboration",
    title: "Collaboration",
    description: "Build something meaningful.",
    placeholder:
      "Tell us about the project or collaboration you have in mind...",
    icon: Handshake,
  },
  {
    id: "networking",
    title: "Professional Networking",
    description: "Expand professional connections.",
    placeholder:
      "Introduce yourself and tell us why you would like to connect...",
    icon: Network,
  },
  {
    id: "innovation",
    title: "Ideas & Innovation",
    description: "Share a new perspective.",
    placeholder:
      "Share your idea, perspective or potential solution...",
    icon: Lightbulb,
  },
  {
    id: "opportunity",
    title: "Professional Opportunity",
    description: "Explore future possibilities.",
    placeholder:
      "Tell us about the professional opportunity...",
    icon: BriefcaseBusiness,
  },
  {
    id: "general",
    title: "General Enquiry",
    description: "Start a conversation.",
    placeholder:
      "What would you like to discuss?",
    icon: MessageCircle,
  },
];