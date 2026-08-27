"use client";

import starsByRepo from "@/data/stars.json";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

function CodeLink({ github }: { github: string }) {
  const match = github.match(/github\.com\/([^/]+\/[^/]+)/);
  const repo = match?.[1];
  const stars = repo ? (starsByRepo as Record<string, number>)[repo] : undefined;
  return (
    <a
      href={github}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sky-600 hover:underline"
    >
      {" [Github]"}
      {typeof stars === "number" && (
        <span className="text-yellow-600">
          {"<star:"}
          {stars}
          {">"}
        </span>
      )}
    </a>
  );
}

const MY_NAME = "Fuliang Liu";

type Venue = {
  full: string;
  abbr?: string;
  detail?: string;
};

type Publication = {
  title: string;
  authors: string;
  venue: Venue;
  links: { pdf: string; github?: string };
};

const isFirstAuthor = (pub: Publication) =>
  pub.authors.split(",")[0].trim() === MY_NAME;

function Authors({ authors, venue }: { authors: string; venue: Venue }) {
  return (
    <p className="text-sm text-gray-500">
      {authors.split(",").map((name, i) => {
        const trimmed = name.trim();
        return (
          <span key={i}>
            {i > 0 && ", "}
            {trimmed === MY_NAME ? (
              <strong className="font-semibold text-gray-800">{trimmed}</strong>
            ) : (
              trimmed
            )}
          </span>
        );
      })}
      <span> · {venue.full}</span>
      {venue.abbr && (
        <strong className="font-bold text-gray-900"> ({venue.abbr})</strong>
      )}
      {venue.detail && <span>, {venue.detail}</span>}
    </p>
  );
}

const publications: Publication[] = [
  {
    title: "SpecLA: Efficient Speculative Decoding for Linear-Attention Models",
    authors:
      "Zhibin Wang, Xuying Han, Zhaohua Yang, Fuliang Liu, Xue Li, Rong Gu, Sheng Zhong, Chen Tian",
    venue: { full: "arXiv", detail: "July 2026" },
    links: {
      pdf: "https://arxiv.org/abs/2607.16673",
    },
  },
  {
    title: "DART: Low-Latency Parallel Drafting with Continuity-Aware Tree Pruning for Speculative Decoding",
    authors:
      "Fuliang Liu, Xue Li, Ketai Zhao, Yinxi Gao, Ziyan Zhou, Zhonghui Zhang, Wanchun Dou, Sheng Zhong, Zhibin Wang, Chen Tian",
    venue: {
      full: "Conference on Empirical Methods in Natural Language Processing, 2026",
      abbr: "EMNLP'26",
      detail: "Main Conference (AR: 15.4%, 2719/17669)",
    },
    links: {
      pdf: "https://arxiv.org/abs/2601.19278",
      github: "https://github.com/fvliang/DART",
    },
  },
];

export function PublicationsList() {
  return (
    <div className="space-y-6">
      {/* My first-author papers first; stable sort keeps time order within each group */}
      {[...publications]
        .sort((a, b) => Number(isFirstAuthor(b)) - Number(isFirstAuthor(a)))
        .map((pub, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <TiltCard className="px-5 py-3">
              <h3 className="text-base font-semibold mb-1 text-sky-600">
                {pub.title}
                {pub.links.pdf && (
                  <a
                    href={pub.links.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:underline"
                  >
                    {" [PDF]"}
                  </a>
                )}
                {pub.links.github && (
                  <CodeLink github={pub.links.github} />
                )}
              </h3>
              <Authors authors={pub.authors} venue={pub.venue} />
            </TiltCard>
          </motion.div>
        ))}
    </div>
  );
}
