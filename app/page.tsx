"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ResearchSection from "@/components/ResearchSection";
import PublicationsSection from "@/components/PublicationsSection";
import ContactSection from "@/components/ContactSection";
import OthersSection from "@/components/OthersSection";

const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <ParticleBackground />
      <div className="h-screen overflow-y-auto text-gray-900 relative z-10 md:snap-y md:snap-mandatory scroll-smooth">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <ResearchSection />
        <PublicationsSection />
        <OthersSection />
        <ContactSection />
        <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-200">
          <p>&copy; 2026 Fuliang Liu. Built with Next.js & Three.js</p>
        </footer>
      </div>
    </>
  );
}
