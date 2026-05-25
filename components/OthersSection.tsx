"use client";

import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

const others = [
  {
    title: "A New Language Modeling Paradigm: Diffusion Large Language Models",
    description: "Survey on Diffusion LLMs",
    links: [
      { label: "PDF", href: "/others/dllmsurvey2025.pdf" },
      { label: "TEX", href: "/others/dllmsurvey2025.zip" },
      { label: "PPT", href: "/others/dllmsurvey2025.pptx" },
    ],
  },
  {
    title: "OpenClaw (Synology DSM) Docker Deploy",
    description: "Deployment guide for OpenClaw on Synology NAS",
    links: [
      { label: "deploy.md", href: "/others/OpenClaw (Synology DSM) Docker Deploy/deploy.md" },
      { label: "deploy_fast.md", href: "/others/OpenClaw (Synology DSM) Docker Deploy/deploy_fast.md" },
    ],
  },
];

export default function OthersSection() {
  return (
    <section id="others" className="py-32 px-6 snap-start">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl font-bold mb-12 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"
        >
          Others
        </motion.h2>
        <div className="space-y-6">
          {others.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <TiltCard className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                <div className="flex gap-3 flex-wrap">
                  {item.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-100 hover:shadow-md transition-all duration-300"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
