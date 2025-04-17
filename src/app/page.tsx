import HeroSection from "../../components/HeroSection";
import LibraryGrid from "../../components/LibraryGrid";
// import FeaturedInsight from "../../components/FeaturedInsight";
// import ExponentialTimeline from "../../components/ExponentialTimeline";
import SubscribeSection from "../../components/SubscribeSection";
import AboutMe from "../../components/AboutMe";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen w-full">
      <HeroSection />
      <LibraryGrid />
      {/* <FeaturedInsight /> */}
      {/* <ExponentialTimeline /> */}
      <SubscribeSection />
      <AboutMe />
      <Footer />
    </main>
  );
}
