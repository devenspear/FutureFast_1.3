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
      <AboutWithSubscription />
      <Footer />
    </main>
  );
}
