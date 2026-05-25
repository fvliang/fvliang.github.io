"use client";

import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

const links = [
  {
    label: "Email",
    href: "mailto:fuliangliu@smail.nju.edu.cn",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    label: "GitHub",
    href: "https://github.com/fvliang",
    icon: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/%E5%A4%8D%E8%89%AF-%E5%88%98-099166365/",
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Scholar",
    href: "https://scholar.google.com/citations?user=0Y3bcg0AAAAJ&hl=zh-CN",
    icon: "M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 100 14 7 7 0 000-14z",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-32 px-6 snap-start">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"
        >
          Get in Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-gray-500 mb-8 max-w-md mx-auto"
        >
          Feel free to reach out for research collaborations or just to say hi.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-sm text-gray-500 mb-12 space-y-1"
        >
          <p>Mobile: 15943832637 (China)</p>
          <p>WeChat: lfl15943832637 (also searchable via mobile number)</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex justify-center gap-4 sm:gap-6 flex-wrap"
        >
          {links.map((link) => (
            <TiltCard
              key={link.label}
              className="p-5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm"
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3"
              >
                <svg
                  className="w-7 h-7 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={link.icon} />
                </svg>
                <span className="text-sm text-gray-500">{link.label}</span>
              </a>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
