"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import TiltCard from "./TiltCard";

const education = [
  {
    school: "Nanjing University",
    logo: "/nju-logo.png",
    color: "#7a2282",
    degree: "Ph.D. in Computer Science",
    period: "2025.09 – Present",
    detail: "School of Computer Science",
    advisors: [
      { name: "Chen Tian", url: "https://cs.nju.edu.cn/tianchen/team.html" },
      { name: "Zhibin Wang", url: "https://wzbxpy.github.io/" },
    ],
  },
  {
    school: "Harbin Institute of Technology",
    logo: "/hit-logo.png",
    color: "#0f5e8b",
    degree: "B.S. in Computer Science",
    period: "2021.09 – 2025.06",
    detail: "School of Future Technology",
    advisors: [],
  },
];

const experience = [
  {
    company: "Alibaba Tongyi Lab",
    logo: "/tongyi-logo.png",
    color: "#6d28d9",
    role: "Research Intern",
    period: "2026.01 – Present",
    department: "LLM Inference Optimization, Scheduling Optimization",
  },
  {
    company: "Alibaba Cloud",
    logo: "/alibaba-logo.png",
    color: "#ea580c",
    role: "Research Intern",
    period: "2024.11 – 2025.04",
    department: "Network Innovation Engineering, Multi-Agent Diagnosis",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 snap-start">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"
        >
          About Me
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-gray-600 leading-relaxed mb-14 max-w-2xl"
        >
          <p>
            I am a Ph.D. candidate in the{" "}
            <a href="https://cs.nju.edu.cn/cs_en/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline font-medium">
              School of Computer Science
            </a>{" "}
            at{" "}
            <a href="https://www.nju.edu.cn/en/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline font-medium">
              Nanjing University
            </a>
            . My research focuses on building efficient systems for Large Language Models.
          </p>
        </motion.div>

        {/* Education */}
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6"
        >
          Education
        </motion.h3>

        <div className="space-y-5 mb-14">
          {education.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <TiltCard className="p-5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-start gap-4">
                  {/* School logo */}
                  <div className="w-14 h-16 flex items-center justify-center shrink-0">
                    <Image
                      src={edu.logo}
                      alt={edu.school}
                      width={56}
                      height={56}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <h4
                        className="font-semibold text-base"
                        style={{ color: edu.color }}
                      >
                        {edu.school}
                      </h4>
                      <span className="text-xs text-gray-400 shrink-0">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5">{edu.degree}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{edu.detail}</p>
                    {edu.advisors.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Advised by{" "}
                        {edu.advisors.map((a, j) => (
                          <span key={j}>
                            {j > 0 && " and "}
                            <a
                              href={a.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                              style={{ color: edu.color }}
                            >
                              Prof. {a.name}
                            </a>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Experience */}
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6"
        >
          Experience
        </motion.h3>

        <div className="space-y-5">
          {experience.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <TiltCard className="p-5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-start gap-4">
                  {/* Company logo */}
                  <div className="w-14 h-16 flex items-center justify-center shrink-0">
                    <Image
                      src={exp.logo}
                      alt={exp.company}
                      width={56}
                      height={56}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <h4
                        className="font-semibold text-base"
                        style={{ color: exp.color }}
                      >
                        {exp.company}
                      </h4>
                      <span className="text-xs text-gray-400 shrink-0">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5">{exp.role}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{exp.department}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
