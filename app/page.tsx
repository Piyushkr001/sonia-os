import Image from "next/image";
import HeroSection from "./_shared/HeroSection";
import Journey from "./components/Journey";
import Expertise from "./components/Expertise";

export default function Home() {
  return (
    <div>
      <HeroSection/>
      <Journey/>
      <Expertise/>
    </div>
  );
}
