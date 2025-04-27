import HeroSectionServer from "../../components/HeroSection.server";
import FastLaneSection from "../../components/FastLaneSection";
import NewsAndDisruptionSection from "../../components/NewsAndDisruptionSection";
import ScrollingQuotesServer from "../../components/ScrollingQuotes.server";
import LibraryGrid from "../../components/LibraryGrid";
import ThoughtLeadersSection from "../../components/ThoughtLeadersSection";
import AboutWithSubscription from "../../components/AboutWithSubscription";
import FooterServer from "../../components/Footer.server";
import AboutFutureFastServer from "../../components/AboutFutureFast.server";

export default function Home() {
  return (
    <main className="bg-black min-h-screen w-full">
      <HeroSectionServer />
      <FastLaneSection />
      <div className="w-full h-24 md:h-32 bg-gradient-to-b from-black via-purple-900/40 to-transparent blur-sm pointer-events-none -mb-8 md:-mb-16" aria-hidden="true" />
      <NewsAndDisruptionSection />
      <div className="w-full h-24 md:h-32 bg-gradient-to-b from-transparent via-purple-900/40 to-black blur-sm pointer-events-none -mt-8 md:-mt-16" aria-hidden="true" />
      <LibraryGrid />
      <div className="w-full h-24 md:h-32 bg-gradient-to-b from-black via-purple-900/30 to-transparent blur-sm pointer-events-none -mb-8 md:-mb-16" aria-hidden="true" />
      <ThoughtLeadersSection />
      <div className="w-full h-24 md:h-32 bg-gradient-to-b from-transparent via-purple-900/40 to-black blur-sm pointer-events-none -mt-8 md:-mt-16" aria-hidden="true" />
      <AboutFutureFastServer />
      <ScrollingQuotesServer />
      <AboutWithSubscription />
      <FooterServer />
    </main>
  );
}
