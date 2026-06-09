"use client";

import { useState, useEffect, useRef } from "react";
import { AssetImage } from "./AssetPlaceholder";
import { GuideHint } from "./GuideHint";

interface StatDef {
  target: number;
  decimals: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: StatDef[] = [
  {
    target: 1.77,
    decimals: 2,
    suffix: "×",
    label: "More input blocks created",
    description:
      "<strong>23.25 blocks on average</strong> vs. 13.17 with the baseline. Separating property, direction, and range made intent expression feel <strong>low-commitment</strong>, encouraging more frequent articulation.",
  },
  {
    target: 2.13,
    decimals: 2,
    suffix: "×",
    label: "More images generated",
    description:
      "<strong>123.42 images on average</strong> vs. 58.00 with the baseline. Enabled by <strong>intent reuse</strong> — rather than starting from scratch each time, participants built on previously articulated blocks, reducing effort and <strong>sustaining momentum throughout the session</strong>.",
  },
  {
    target: 12.5,
    decimals: 1,
    suffix: "%",
    label: "Greater visual diversity",
    description:
      "Measured as <strong>max pairwise cosine distance</strong> between CLIP embeddings (IdeaBlocks: <strong>0.638</strong> vs. Baseline: 0.568), indicating a broader range of visual concepts explored within the same session.",
  },
  {
    target: 2.14,
    decimals: 2,
    suffix: "×",
    label: "Higher link entropy",
    description:
      "Measured via <strong>linkography analysis</strong> — indicating participants pursued <strong>multiple parallel conceptual directions</strong> rather than a narrow, linear trajectory.",
  },
];

function StatCard({
  stat,
  delay,
  active,
  onHover,
}: {
  stat: StatDef;
  delay: number;
  active: boolean;
  onHover: (label: string | null) => void;
}) {
  const [value, setValue] = useState(stat.target);
  const triggered = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const duration = 1400;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(stat.target * eased);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(ref.current!);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [stat.target]);

  return (
    <div
      ref={ref}
      className="animate-on-scroll"
      data-delay={String(delay)}
      onMouseEnter={() => onHover(stat.label)}
      onMouseLeave={() => onHover(null)}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        className="text-center py-7 px-5 rounded-xl border bg-paper"
        style={{
          width: "100%",
          borderColor: active ? "#1e293b" : "#e2e8f0",
          background: active ? "#f8fafc" : "white",
          boxShadow: active ? "0 6px 24px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
          transform: active ? "translateY(-3px)" : "translateY(0)",
          transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s, background 0.2s",
          cursor: "pointer",
        }}
      >
        <div
          className="font-display font-bold text-[clamp(1.8rem,3vw,2.4rem)] leading-none mb-2"
          style={{ color: active ? "#1e293b" : "#0f172a" }}
        >
          {value.toFixed(stat.decimals)}
          {stat.suffix}
        </div>
        <div
          className="text-sm leading-snug"
          style={{ color: active ? "#475569" : "#94a3b8", transition: "color 0.2s" }}
        >
          {stat.label}
        </div>
      </div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          marginTop: 6,
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-4px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

export function Results() {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const activeStat = stats.find((s) => s.label === hoveredLabel) ?? null;

  return (
    <section id="results" className="py-16 bg-white">
      <style>{`#results .stat-desc strong { color: #1e293b; font-weight: 600; }`}</style>
      <div className="max-w-[1080px] mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
          Comparative Study
        </p>
        <h2 className="font-display font-semibold text-[clamp(1.5rem,2.8vw,2.1rem)] leading-[1.22] text-slate-900 mb-2">
          IdeaBlocks significantly enhances divergent exploration.
        </h2>
        <p className="text-[0.97rem] text-slate-500 mb-6">
          Within-subjects comparative study · N=12
        </p>

        {/* Stats */}
        <GuideHint text="Hover each stat to see more detail" className="mb-3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={i + 1}
              active={hoveredLabel === stat.label}
              onHover={setHoveredLabel}
            />
          ))}
        </div>

        {/* Description panel */}
        <div
          style={{
            minHeight: "3.5rem",
            opacity: activeStat ? 1 : 0,
            transition: "opacity 0.22s ease",
          }}
        >
          {activeStat && (
            <p
              className="stat-desc text-[1.05rem] leading-relaxed"
              style={{ color: "#64748b", marginTop: "1rem" }}
              dangerouslySetInnerHTML={{ __html: activeStat.description }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
