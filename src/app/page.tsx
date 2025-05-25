import HeroSection from "../../components/HeroSection";
import FastLaneSection from "../../components/FastLaneSection";
import NewsAndDisruptionSection from "../../components/NewsAndDisruptionSection";
import YouTubeChannelsSection from "../../components/YouTubeChannelsSection";
import LibraryGrid from "../../components/LibraryGrid";
import ThoughtLeadersSection from "../../components/ThoughtLeadersSection";
import LearningResourcesSection from "../../components/LearningResourcesSection";
import AboutWithSubscription from "../../components/AboutWithSubscription";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen w-full animated-background">
      <HeroSection />
      <FastLaneSection />
      <NewsAndDisruptionSection />
      <YouTubeChannelsSection />
      <LibraryGrid />
      <ThoughtLeadersSection />
      <LearningResourcesSection />
      <AboutWithSubscription />
      <Footer />
    </main>
  );
}
