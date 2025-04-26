import HeroSection from "../../components/HeroSection";
import NewsAndDisruptionSection from "../../components/NewsAndDisruptionSection";
import QuotationsRibbonSection from "../../components/QuotationsRibbonSection";
import LibraryGrid from "../../components/LibraryGrid";
import SubscribeSection from "../../components/SubscribeSection";
import AboutMe from "../../components/AboutMe";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen w-full">
      <HeroSection />
      <NewsAndDisruptionSection />
      <QuotationsRibbonSection />
      <div className="w-full h-24 md:h-32 bg-gradient-to-b from-transparent via-purple-900/40 to-gray-950/90 blur-sm pointer-events-none -mt-8 md:-mt-16" aria-hidden="true" />
      <LibraryGrid />
      <div className="w-full h-24 md:h-32 bg-gradient-to-b from-gray-950/90 via-purple-900/30 to-transparent blur-sm pointer-events-none -mb-8 md:-mb-16" aria-hidden="true" />
      <SubscribeSection />
      <div className="w-full h-24 md:h-32 bg-gradient-to-b from-transparent via-purple-900/40 to-gray-950/90 blur-sm pointer-events-none -mt-8 md:-mt-16" aria-hidden="true" />
      <AboutMe />
      <Footer />
    </main>
  );
}
