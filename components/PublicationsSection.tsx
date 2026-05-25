"use client";

import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

const publications = [
  {
    title: "DART: Diffusion-Inspired Speculative Decoding for Fast LLM Inference",
    authors:
      "Fuliang Liu, Xue Li, Ketai Zhao, Yinxi Gao, Ziyan Zhou, Zhonghui Zhang, Zhibin Wang, Wanchun Dou, Sheng Zhong, Chen Tian",
    venue: "arXiv, January 2026",
    stars: 57,
    links: {
      pdf: "https://fvliang.github.io/pdf/DART.pdf",
      github: "https://github.com/fvliang/DART",
    },
  },
];

export default function PublicationsSection() {
  return (
    <section id="publications" className="py-32 px-6 snap-start">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl font-bold mb-12 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"
        >
          Publications
        </motion.h2>
        <div className="space-y-6">
          {publications.map((pub, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <TiltCard className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {pub.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{pub.authors}</p>
                <p className="text-sm text-sky-600 mb-4">{pub.venue}</p>
                <div className="flex gap-3 items-center">
                  {pub.links.pdf && (
                    <a
                      href={pub.links.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-4 py-1.5 bg-sky-50 border border-sky-200 text-sky-600 rounded-md hover:bg-sky-100 hover:shadow-md transition-all duration-300"
                    >
                      PDF
                    </a>
                  )}
                  {pub.links.github && (
                    <a
                      href={pub.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-100 hover:shadow-md transition-all duration-300"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      GitHub
                      <span className="inline-flex items-center gap-0.5 text-yellow-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {pub.stars}
                      </span>
                    </a>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
