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

    content:
      "Sonia is the founder of i-SmokeStack.",

    source: "i-SmokeStack hiring challenge brief",
  },

  {
    id: "company-philosophy",

    title: "i-SmokeStack Philosophy",

    category: "philosophy",

    content:
      "The stated philosophy of i-SmokeStack is Do More by Doing Less™.",

    source: "i-SmokeStack hiring challenge brief",
  },

  {
    id: "digital-experience",

    title: "About SONIA.OS",

    category: "profile",

    content:
      "SONIA.OS is an independently developed one-page digital experience designed to explore Sonia's professional identity through interactive storytelling.",

    source: "SONIA.OS project concept",
  },

  {
    id: "possibility-engine",

    title: "The Possibility Engine",

    category: "philosophy",

    content:
      "The SONIA.OS Possibility Engine uses Simplify, Focus and Amplify as an illustrative problem-solving framework inspired by the company philosophy. This framework was created for the application and is not a documented personal methodology of Sonia.",

    source: "SONIA.OS project concept",
  },
];