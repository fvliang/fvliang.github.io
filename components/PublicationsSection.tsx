"use client";

import { motion } from "framer-motion";
import { PublicationsList } from "./PublicationsList";

export default function PublicationsSection() {
  return (
    <section id="publications" className="py-32 px-6 snap-start">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl font-bold mb-12 text-sky-600"
        >
          Publications
        </motion.h2>
        <PublicationsList />
      </div>
    </section>
  );
}
