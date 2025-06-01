import HeroSection from "../../../components/HeroSection";
import FastLaneSection from "../../../components/FastLaneSection";
import NewsAndDisruptionSection from "../../../components/NewsAndDisruptionSection";
import VideoInterviewsSection from "../../../components/VideoInterviewsSection";
import ResourceLibrarySection from "../../../components/ResourceLibrarySection";
import ThoughtLeadersSection from "../../../components/ThoughtLeadersSection";
import LearningResourcesSection from "../../../components/LearningResourcesSection";
import AboutWithSubscription from "../../../components/AboutWithSubscription";
import Footer from "../../../components/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen w-full animated-background">
      <HeroSection />
      <FastLaneSection />
      <NewsAndDisruptionSection />
      <VideoInterviewsSection />
      <ResourceLibrarySection />
      <ThoughtLeadersSection />
      <LearningResourcesSection />
      <AboutWithSubscription />
      <Footer />
    </main>
  );
}
