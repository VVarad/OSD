import HeroSection from "@/components/HeroSection";
import CurriculumSection from "@/components/CurriculumSection";
import ScheduleSection from "@/components/ScheduleSection";
import GallerySection from "@/components/GallerySection";
import EventsSection from "@/components/EventsSection";
import FAQSection from "@/components/FAQSection";
import AboutUsSection from "@/components/AboutUsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0E081F] text-white">
      <HeroSection />
      <CurriculumSection />
      <ScheduleSection />
      <EventsSection />
      <GallerySection />
      <AboutUsSection />
      <FAQSection />
    </main>
  );
}
