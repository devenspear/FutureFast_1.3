import HeroSection from "../../components/HeroSection";
import FastLaneSection from "../../components/FastLaneSection";
import WeeklyIntelligenceDigest from "../../components/WeeklyIntelligenceDigest";
import VideoInterviewsSection from "../../components/VideoInterviewsSection";
import ResourceLibrarySection from "../../components/ResourceLibrarySection";
import ThoughtLeadersSection from "../../components/ThoughtLeadersSection";
import LearningResourcesSection from "../../components/LearningResourcesSection";
import AboutWithSubscription from "../../components/AboutWithSubscription";
import Footer from "../../components/Footer";

export default function Home() {

  return (
    <main className="bg-black min-h-screen w-full animated-background" role="main">
      <section aria-labelledby="hero-heading">
        <HeroSection />
      </section>
      <section aria-labelledby="fast-lane-heading">
        <FastLaneSection />
      </section>
      <section aria-labelledby="intelligence-digest-heading">
        <WeeklyIntelligenceDigest />
      </section>
      <section aria-labelledby="videos-heading">
        <VideoInterviewsSection />
      </section>
      <section aria-labelledby="resources-heading">
        <ResourceLibrarySection />
      </section>
      <section aria-labelledby="thought-leaders-heading">
        <ThoughtLeadersSection />
      </section>
      <section aria-labelledby="learning-heading">
        <LearningResourcesSection />
      </section>
      <section aria-labelledby="about-heading">
        <AboutWithSubscription />
      </section>
      <Footer />
    </main>
  );
}
