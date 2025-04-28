import HeroSection from "../../components/HeroSection";
import FastLaneSection from "../../components/FastLaneSection";
import NewsAndDisruptionSection from "../../components/NewsAndDisruptionSection";
import LibraryGrid from "../../components/LibraryGrid";
import ThoughtLeadersSection from "../../components/ThoughtLeadersSection";
import AboutWithSubscription from "../../components/AboutWithSubscription";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen w-full">
      <HeroSection />
      <FastLaneSection />
      <NewsAndDisruptionSection />
      <LibraryGrid />
      <ThoughtLeadersSection />
      {/* Keep only this gradient divider below Thought Leaders */}
      <div className="w-full h-24 md:h-32 bg-gradient-to-b from-transparent via-purple-900/40 to-black blur-sm pointer-events-none -mt-8 md:-mt-16" aria-hidden="true" />
      <AboutWithSubscription />
      <Footer />
    </main>
  );
}
