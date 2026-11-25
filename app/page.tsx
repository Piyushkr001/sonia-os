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
        <main className="flex w-full flex-1 flex-col">
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