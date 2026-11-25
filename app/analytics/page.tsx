import type { Metadata } from "next";
import AnalyticsDashboard from "../components/AnalyticsDashboard";



export const metadata: Metadata = {
  title: "Intelligence Insights | SONIA.OS",

  description:
    "Private engagement analytics for SONIA.OS.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}