"use client";

import { useState, useRef, useCallback } from "react";
import { FaGithub, FaLink } from "react-icons/fa6";
import { SiArxiv } from "react-icons/si";
import { GuideHint } from "./GuideHint";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const SPARKLE_COLORS = ["#60A5FA", "#818CF8", "#A78BFA", "#C4B5FD", "#93C5FD", "#E0E7FF"];
const SHAPES = ["✦", "✧", "⋆", "✶"];

interface HonorSparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  dx: number;
}

const HONOR_EMOJIS = ["🏆", "⭐", "🥇", "✨", "🌟", "🎉"];

const authors = [
  {
    name: "DaEun Choi",
    affiliation: "KAIST",
    href: "https://daeunchoi.com/",
    photo: "/assets/authors/daeun.jpg",
  },
  {
    name: "Kihoon Son",
    affiliation: "KAIST",
    href: "https://kihoon-son.github.io/",
    photo: "/assets/authors/kihoon.jpg",
  },
  {
    name: "Jaesang Yu",
    affiliation: "KAIST",
    href: "#",
    photo: "/assets/authors/jaesang.jpg",
  },
  {
    name: "HyunJoon Jung",
    affiliation: "MPhora.ai",
    href: "https://www.linkedin.com/in/hyunvincero/",
    photo: "/assets/authors/hyunjoon.jpg",
  },
  {
    name: "Juho Kim",
    affiliation: "KAIST / SkillBench",
    href: "https://juhokim.com/",
    photo: "/assets/authors/juho.jpg",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0].toUpperCase())
    .join("")
    .slice(0, 2);
}

function AuthorAvatar({ name, photo }: { name: string; photo: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-400 select-none">
        {initials(name)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo}
      alt={name}
      className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
      onError={() => setError(true)}
    />
  );
}

export function Hero() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const sparkleId = useRef(0);
  const [honorSparkles, setHonorSparkles] = useState<HonorSparkle[]>([]);
  const honorSparkleId = useRef(0);

  const handleHonorMouseEnter = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const count = 8;
    const burst: HonorSparkle[] = Array.from({ length: count }, (_, i) => {
      const id = honorSparkleId.current++;
      const dx = ((i / (count - 1)) * 2 - 1) * 90 + (Math.random() - 0.5) * 20;
      return {
        id,
        x: cx + (Math.random() - 0.5) * 10,
        y: cy,
        size: Math.random() * 8 + 12,
        emoji: HONOR_EMOJIS[Math.floor(Math.random() * HONOR_EMOJIS.length)],
        dx,
      };
    });
    setHonorSparkles(burst);
    const ids = burst.map((s) => s.id);
    setTimeout(() => setHonorSparkles((prev) => prev.filter((s) => !ids.includes(s.id))), 1650);
  }, []);

  const handleTitleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = sparkleId.current++;
    const sparkle: Sparkle = {
      id,
      x: e.clientX - rect.left + (Math.random() - 0.5) * 20,
      y: e.clientY - rect.top + (Math.random() - 0.5) * 20,
      size: Math.random() * 10 + 8,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
    };
    setSparkles((prev) => [...prev.slice(-12), sparkle]);
    setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== id)), 650);
  }, []);

  return (
    <section id="hero" className="text-center pt-14 pb-14">
      <div className="max-w-[1080px] mx-auto px-6">
        {/* Venue */}
        <div className="flex justify-center items-center gap-2 mb-5">
          <span
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold uppercase"
            style={{
              background: "linear-gradient(90deg, #DBEAFE, #EDE9FE)",
              border: "1px solid #A5B4FC",
              color: "#4338CA",
            }}
          >
            ACM DIS 2026
          </span>
          <span
            className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide cursor-default select-none"
            style={{
              background: "linear-gradient(90deg, #FEF9C3, #FDE68A)",
              border: "1px solid #F59E0B",
              color: "#92400E",
            }}
            onMouseEnter={handleHonorMouseEnter}
          >
            {honorSparkles.map((s) => (
              <span
                key={s.id}
                className="fountain-particle"
                style={{
                  left: s.x,
                  top: s.y,
                  fontSize: s.size,
                  ["--dx" as string]: `${s.dx}px`,
                }}
              >
                {s.emoji}
              </span>
            ))}
            🏅 Honorable Mention
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-bold leading-[1.18] tracking-[-0.01em] max-w-[820px] mx-auto mb-7 text-slate-900">
          <div className="relative" onMouseMove={handleTitleMouseMove}>
            {sparkles.map((s) => (
              <span
                key={s.id}
                className="sparkle-particle"
                style={{
                  left: s.x,
                  top: s.y,
                  fontSize: s.size,
                  color: s.color,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {SHAPES[s.id % SHAPES.length]}
              </span>
            ))}
            <span
              className="block mb-2 text-[clamp(1.9rem,3.8vw,2.8rem)]"
              style={{
                background: "linear-gradient(90deg, #60A5FA 0%, #818CF8 50%, #A78BFA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              IdeaBlocks
            </span>
            <span className="block text-[clamp(1.25rem,2.2vw,1.55rem)] text-slate-600 font-semibold leading-snug">
              <span className="md-linebreak">Expressing and Reusing Divergent Intents for</span>
              {" "}Graphic Design Exploration using Generative AI
            </span>
          </div>
        </h1>

        {/* Author cards */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {authors.map(({ name, affiliation, href, photo }) => (
            <a key={name} href={href} className="flex flex-col items-center w-28">
              <AuthorAvatar name={name} photo={photo} />
              <span className="text-sm font-medium text-slate-700 leading-snug mt-2">{name}</span>
              <span className="text-xs text-slate-400 leading-snug">{affiliation}</span>
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <a
            href="https://arxiv.org/abs/2507.22163"
            className="inline-flex items-center gap-2 px-5 py-2 bg-slate-800 text-white text-sm font-semibold rounded-full hover:bg-slate-700 transition-all hover:-translate-y-px shadow-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiArxiv />
            arXiv
          </a>

          <span className="relative group inline-flex cursor-not-allowed">
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-slate-100 text-slate-400 text-sm font-medium rounded-full border border-slate-200">
              <FaLink />
              DL ACM
            </span>
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md">
              Link coming soon
              <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800" />
            </span>
          </span>

          <span className="relative group inline-flex cursor-not-allowed">
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-slate-100 text-slate-400 text-sm font-medium rounded-full border border-slate-200">
              <FaGithub />
              GitHub
            </span>
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md">
              Coming soon
              <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800" />
            </span>
          </span>
        </div>

        {/* TL;DR cards */}
        <p className="text-2xl font-bold text-slate-800 mb-1">TL;DR</p>
        <GuideHint text="Hover each card to jump to the relevant section" className="justify-center mb-4" />
        <div className="max-w-[860px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {/* Card 1 — Divergent Intent Framework */}
          <a
            href="#pdr"
            className="flip-card block"
            style={{ perspective: "1000px", minHeight: 220 }}
          >
            <div className="flip-card-inner relative w-full" style={{ minHeight: 220 }}>
              <div className="flip-card-front absolute inset-0 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 flex flex-col gap-3 overflow-hidden">
                <span className="text-xl">🔍</span>
                <p className="text-[0.88rem] text-slate-600 leading-relaxed">
                  Divergent intent can be decomposed into{" "}
                  <span className="font-semibold" style={{ color: "#1D6FEB" }}>
                    Property
                  </span>
                  ,{" "}
                  <span className="font-semibold" style={{ color: "#D4740A" }}>
                    Direction
                  </span>
                  , and{" "}
                  <span className="font-semibold" style={{ color: "#6E30D8" }}>
                    Range
                  </span>{" "}
                  — yet current GenAI tools lack mechanisms to express or reuse it.
                </p>
              </div>
              <div className="flip-card-back absolute inset-0 rounded-2xl border border-slate-200 bg-white flex flex-col items-center justify-center gap-2 px-6 text-center overflow-hidden">
                <span className="text-2xl mb-1">🔍</span>
                <p className="text-sm font-bold text-slate-800">Divergent Intent Framework</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  How we formalized divergent intent into three composable dimensions: Property,
                  Direction &amp; Range
                </p>
                <span className="text-xs font-semibold mt-2" style={{ color: "#4338CA" }}>
                  Explore the framework →
                </span>
              </div>
            </div>
          </a>

          {/* Card 2 — The System */}
          <a
            href="#demo"
            className="flip-card block"
            style={{ perspective: "1000px", minHeight: 220 }}
          >
            <div className="flip-card-inner relative w-full" style={{ minHeight: 220 }}>
              <div className="flip-card-front absolute inset-0 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 flex flex-col gap-3 overflow-hidden">
                <span className="text-xl">🧩</span>
                <p className="text-[0.88rem] text-slate-600 leading-relaxed">
                  IdeaBlocks modularizes divergent intents into reusable{" "}
                  <span className="font-semibold text-slate-800">Exploration Blocks</span> — shareable
                  across Block, Path, and Project levels.
                </p>
              </div>
              <div className="flip-card-back absolute inset-0 rounded-2xl border border-slate-200 bg-white flex flex-col items-center justify-center gap-2 px-6 text-center overflow-hidden">
                <span className="text-2xl mb-1">🧩</span>
                <p className="text-sm font-bold text-slate-800">Try the IdeaBlocks Demo!</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Create Exploration Blocks, chain properties, and see block reuse in action
                </p>
                <span className="text-xs font-semibold mt-2" style={{ color: "#4338CA" }}>
                  Try the demo →
                </span>
              </div>
            </div>
          </a>

          {/* Card 3 — Comparative Study */}
          <a
            href="#results"
            className="flip-card block"
            style={{ perspective: "1000px", minHeight: 220 }}
          >
            <div className="flip-card-inner relative w-full" style={{ minHeight: 220 }}>
              <div className="flip-card-front absolute inset-0 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 flex flex-col gap-3 overflow-hidden">
                <span className="text-xl">📊</span>
                <p className="text-[0.88rem] text-slate-600 leading-relaxed">
                  Users generated{" "}
                  <span className="font-semibold text-slate-800">2.13× more images</span> with{" "}
                  <span className="font-semibold text-slate-800">12.5% greater diversity</span>; a
                  3-day study revealed distinct reuse strategies across all three levels.
                </p>
              </div>
              <div className="flip-card-back absolute inset-0 rounded-2xl border border-slate-200 bg-white flex flex-col items-center justify-center gap-2 px-6 text-center overflow-hidden">
                <span className="text-2xl mb-1">📊</span>
                <p className="text-sm font-bold text-slate-800">Comparative Study</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  See how IdeaBlocks users explored 2× more images with greater diversity across a
                  3-day study
                </p>
                <span className="text-xs font-semibold mt-2" style={{ color: "#4338CA" }}>
                  View results →
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
