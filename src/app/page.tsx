import dynamic from 'next/dynamic';
import HeroSection from "../../components/HeroSection";
import FastLaneSection from "../../components/FastLaneSection";

// Lazy load below-the-fold components to reduce initial bundle size
const NewsAndDisruptionSection = dynamic(() => import("../../components/NewsAndDisruptionSection"), {
  loading: () => <div className="h-96 bg-black" />,
});

const VideoInterviewsSection = dynamic(() => import("../../components/VideoInterviewsSection"), {
  loading: () => <div className="h-96 bg-black" />,
});

const ResourceLibrarySection = dynamic(() => import("../../components/ResourceLibrarySection"), {
  loading: () => <div className="h-96 bg-black" />,
});

const ThoughtLeadersSection = dynamic(() => import("../../components/ThoughtLeadersSection"), {
  loading: () => <div className="h-96 bg-black" />,
});

const LearningResourcesSection = dynamic(() => import("../../components/LearningResourcesSection"), {
  loading: () => <div className="h-96 bg-black" />,
});

const AboutWithSubscription = dynamic(() => import("../../components/AboutWithSubscription"), {
  loading: () => <div className="h-96 bg-black" />,
});

const Footer = dynamic(() => import("../../components/Footer"), {
  loading: () => <div className="h-48 bg-black" />,
});

export default function Home() {

  return (
    <main className="bg-black min-h-screen w-full animated-background" role="main">
      <section aria-labelledby="hero-heading">
        <HeroSection />
      </section>
      <section aria-labelledby="fast-lane-heading">
        <FastLaneSection />
      </section>
      <section aria-labelledby="news-heading">
        <NewsAndDisruptionSection />
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
