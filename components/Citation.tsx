"use client";

import { useState, useEffect, useRef } from "react";

const BIBTEX = `@misc{choi2025ideablocks,
  title={IdeaBlocks: Expressing and Reusing Divergent Intents for Graphic Design Exploration using Generative AI}, 
  author={DaEun Choi and Kihoon Son and Jaesang Yu and Hyunjoon Jung and Juho Kim},
  year={2025},
  eprint={2507.22163},
  archivePrefix={arXiv},
  primaryClass={cs.HC},
  url={https://arxiv.org/abs/2507.22163}, 
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
