"use client";

import { useState, useEffect, useRef } from "react";

const BIBTEX = `@inproceedings{10.1145/3800645.3813005,
  author = {Choi, DaEun and Son, Kihoon and Yu, Jaesang and Jung, HyunJoon and Kim, Juho},
  title = {IdeaBlocks: Expressing and Reusing Divergent Intents for Graphic Design Exploration using Generative AI},
  year = {2026},
  isbn = {9798400725630},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  url = {https://doi.org/10.1145/3800645.3813005},
  doi = {10.1145/3800645.3813005},
  abstract = {While designers increasingly leverage Generative AI for divergent exploration, current interaction is optimized for convergent refinement, forcing users to specify fixed targets rather than open-ended search spaces. Based on a formative study (N=7), we define the anatomy of Divergent Intent, comprising property, direction, and range, and identified two critical barriers: the lack of mechanisms to explicitly shape the parametric boundaries of exploration and the difficulty of reusing successful search strategies. We present IdeaBlocks, where users can modularize divergent intents into Exploration Blocks. Users can reuse prior intents at multiple levels (block, path, and project) with options for literal or context-adaptive reuse. In our comparative study (N=12), participants using IdeaBlocks explored 2.13 times more images with 12.5\\% greater visual diversity than the baseline, demonstrating how structured intent expression and reuse support divergent exploration. A three-day longitudinal study (N=6) further revealed how different reuse mechanisms allowed distinct creative strategies, offering design implications for future intent-aware design support tools.},
  booktitle = {Proceedings of the 2026 Designing Interactive Systems Conference},
  pages = {621–642},
  numpages = {22},
  keywords = {Creativity support tool, Design exploration, Generative AI, Graphic design, Divergent intent},
  location = {Singapore, Singapore},
  series = {DIS '26}
}`;

export function Citation() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(BIBTEX);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = BIBTEX;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy"); // deprecated fallback; replace if browser support widens
      document.body.removeChild(ta);
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    setCopied(true);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="citation" className="py-16 bg-white">
      <div className="max-w-[1080px] mx-auto px-6">
        <h2 className="font-display font-semibold text-[clamp(1.5rem,2.8vw,2.1rem)] leading-[1.22] text-slate-900 mb-8">
          Citation
        </h2>

        <div className="relative rounded-xl overflow-hidden" style={{ background: "#1C1C1E" }}>
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              copied
                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                : "bg-white/10 border border-white/15 text-slate-300 hover:bg-white/18 hover:text-white"
            }`}
            aria-label="Copy BibTeX"
          >
            {copied ? (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>

          {/* BibTeX */}
          <pre
            className="citation-code font-mono text-[0.83rem] leading-[1.7] text-slate-200 p-8 overflow-x-auto"
            style={{ fontFamily: "var(--font-jetbrains), Courier New, monospace" }}
          >
            {BIBTEX}
          </pre>
        </div>
      </div>
    </section>
  );
}
