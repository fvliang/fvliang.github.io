"use client";

import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

const research = [
  {
    title: "Speculative Decoding for LLMs",
    description:
      "Developing novel approaches to accelerate large language model inference through speculative decoding. By leveraging diffusion-inspired methods, we can generate multiple tokens simultaneously while maintaining output quality, achieving significant speedups in real-world serving scenarios.",
  },
  {
    title: "LLM Serving Systems",
    description:
      "Building efficient systems for serving large language models at scale, focusing on optimizing throughput and latency through system-level innovations in scheduling, memory management, and parallelism strategies.",
  },
];

export default function ResearchSection() {
  return (
    <section id="research" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl font-bold mb-12 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"
        >
          Research
        </motion.h2>
        <div className="space-y-8">
          {research.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <TiltCard className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
