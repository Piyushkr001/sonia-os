import Image from "next/image";
import HeroSection from "./_shared/HeroSection";
import Journey from "./components/Journey";
import Expertise from "./components/Expertise";
import Ideas from "./components/Ideas";
import AskIntelligence from "./components/AskIntelligence";
import ConnectionPortal from "./components/ConnectionPortal";

export default function Home() {
  return (
    <div>
      <HeroSection/>
      <Journey/>
      <Expertise/>
      <Ideas/>
      <AskIntelligence/>
      <ConnectionPortal/>
    </div>
  );
}
