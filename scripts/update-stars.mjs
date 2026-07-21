#!/usr/bin/env node
// Hourly GitHub star updater for the static homepage.
// Invoked by .github/workflows/update-stars.yml (cron) or manually.
// REPOS must be kept in sync with the github links in components/PublicationsSection.tsx.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const REPOS = ["fvliang/DART"];

const __dirname = dirname(fileURLToPath(import.meta.url));
const STARS_FILE = resolve(__dirname, "../data/stars.json");

const token = process.env.GITHUB_TOKEN;
const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function readStars() {
  try {
    const parsed = JSON.parse(await readFile(STARS_FILE, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function fetchStars(repo) {
  const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${repo}`);
  const data = await res.json();
  return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
}

async function main() {
  const current = await readStars();
  const next = { ...current };
  let changed = false;

  for (const repo of REPOS) {
    try {
      const count = await fetchStars(repo);
      if (count === null) {
        console.log(`skip ${repo}: no stargazers_count in response`);
        continue;
      }
      if (current[repo] !== count) {
        next[repo] = count;
        changed = true;
        console.log(`${repo}: ${current[repo] ?? "—"} -> ${count}`);
      } else {
        console.log(`${repo}: ${count} (unchanged)`);
      }
    } catch (err) {
      console.log(`error ${repo}: ${err.message} (keeping ${current[repo] ?? "—"})`);
    }
  }

  if (changed) {
    await writeFile(STARS_FILE, JSON.stringify(next, null, 2) + "\n", "utf8");
    console.log("updated data/stars.json");
  } else {
    console.log("no changes");
  }
}

main().catch((err) => {
  console.error("update-stars failed:", err);
  process.exit(0);
});
