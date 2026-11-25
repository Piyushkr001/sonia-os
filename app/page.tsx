import Navbar from "./_shared/Navbar";
import HeroSection from "./_shared/HeroSection";
import Journey from "./components/Journey";
import Expertise from "./components/Expertise";
import Ideas from "./components/Ideas";
import AskIntelligence from "./components/AskIntelligence";
import ConnectionPortal from "./components/ConnectionPortal";
import Footer from "./components/Footer";
import AnalyticsProvider from "./components/AnalyticsProvider";

export default function Home() {
  return (
    <AnalyticsProvider>
      <div className="flex min-h-dvh w-full flex-col bg-[#080C10]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-emerald-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
        >
          Skip to main content
        </a>

        <Navbar />

        <main
          id="main-content"
          className="flex w-full flex-1 flex-col"
        >
          <HeroSection />
          <Journey />
          <Expertise />
          <Ideas />
          <AskIntelligence />
          <ConnectionPortal />
        </main>

        <Footer />
      </div>
    </AnalyticsProvider>
  );
}