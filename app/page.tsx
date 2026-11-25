import Image from "next/image";
import HeroSection from "./_shared/HeroSection";
import Journey from "./components/Journey";
import Expertise from "./components/Expertise";
import Ideas from "./components/Ideas";

export default function Home() {
  return (
    <div>
      <HeroSection/>
      <Journey/>
      <Expertise/>
      <Ideas/>
    </div>
  );
}
