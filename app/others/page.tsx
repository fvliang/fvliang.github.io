"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import OthersSection from "@/components/OthersSection";

const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground"),
  { ssr: false }
);

export default function OthersPage() {
  return (
    <>
      <ParticleBackground />
      <div className="min-h-screen text-gray-900 relative z-10">
        <Navbar />
        <OthersSection />
        <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-200">
          <p>&copy; 2026 Fuliang Liu. Built with Next.js & Three.js</p>
        </footer>
      </div>
    </>
  );
}
