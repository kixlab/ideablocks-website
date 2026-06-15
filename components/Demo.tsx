"use client";

import { useState } from "react";

function PipelineDetails() {
  const [open, setOpen] = useState(false);

  const steps = [
    {
      n: "1",
      title: "Generates Candidates",
      desc: "GPT-4o creates alternative directions around your input",
    },
    {
      n: "2",
      title: "Filters by Typicality",
      desc: "Uses GloVe (text) or CLIP (images) to measure similarity and match your typicality level",
    },
    {
      n: "3",
      title: "Clusters & Presents",
      desc: "Groups similar ideas using K-means and shows the 4 most distinct options",
    },
  ];

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-[0.8125rem] font-medium text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <path
            d="M4.5 2.5L9.5 7L4.5 11.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        How does the pipeline work?
      </button>

      <div
        className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-5 py-4"
        style={{ display: open ? "block" : "none" }}
      >
        <p className="text-[0.8125rem] text-slate-500 mb-4">
          When you set a direction and typicality level, IdeaBlocks:
        </p>
        <div className="flex flex-col gap-3">
          {steps.map((s) => (
            <div key={s.n} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: "#1e293b", marginTop: 1 }}
              >
                {s.n}
              </span>
              <p className="text-[0.8125rem] text-slate-600 leading-snug">
                <strong className="font-semibold text-slate-800">{s.title}</strong> — {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import { CreateBlockDemo } from "./demo/CreateBlockDemo";
import { ConnectBlockDemo } from "./demo/ConnectBlockDemo";
import { ReuseBlockDemo } from "./demo/ReuseBlockDemo";

// ── Tab definitions ───────────────────────────────────────────────────────────

const TABS = [
  {
    id: "create",
    label: "① Create a Block",
    icon: "🧩",
    title: "Exploration Block",
    supports:
      "IdeaBlocks lets you create Exploration Blocks by specifying Property, Direction, and Range — and generate suggestions as text or images.",
    tryInDemo:
      "In the demo below, pick a property card, set a direction and typicality, and browse the suggestions!",
  },
  {
    id: "connect",
    label: "② Connect Blocks",
    icon: "🔗",
    title: "Block Chaining",
    supports:
      "IdeaBlocks connects blocks across properties, carrying previously explored options forward to build intent step by step.",
    tryInDemo: "In the demo below, see how a Character Entity block chains into Scene exploration!",
  },
  {
    id: "reuse",
    label: "③ Reuse a Block",
    icon: "♻️",
    title: "Intent Reuse",
    supports:
      "IdeaBlocks supports reusing prior intents at the Block, Path, or Project level — as literal copies or context-adaptive variants.",
    tryInDemo:
      "Try reusing blocks at three levels: individual Block, exploration Path, or entire Project — as literal copies or context-adaptive variants.",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ── Main section ──────────────────────────────────────────────────────────────

export function Demo() {
  const [activeTab, setActiveTab] = useState<TabId>("create");
  const activeTabMeta = TABS.find((t) => t.id === activeTab)!;

  return (
    <section id="demo" className="relative py-16 bg-white">
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes caret-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes block-in { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes step2-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .demo-try-hint { animation: step2-in 0.22s ease forwards; }
      `}</style>
      <div className="max-w-[1080px] mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
          The System
        </p>
        <h2 className="font-display font-semibold text-[clamp(1.5rem,2.8vw,2.1rem)] leading-[1.22] text-slate-900 mb-2">
          IdeaBlocks lets designers modularize divergent intents into Exploration Blocks — and reuse
          them.
        </h2>
        <p className="text-[0.97rem] text-slate-500 mb-8">
          Try out demo of three core features of IdeaBlocks (operating with pre-generated examples).
        </p>

        <div className="relative">
          {/* Tab buttons */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {TABS.map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className="flex items-center justify-center gap-2 rounded-[14px] px-4 py-3.5 text-[13px] font-semibold transition-all duration-[180ms] hover:-translate-y-px"
                  style={{
                    background: active ? "#1e293b" : "white",
                    border: `1.5px solid ${active ? "#1e293b" : "#e2e8f0"}`,
                    boxShadow: active
                      ? "0 4px 18px rgba(0,0,0,0.15)"
                      : "0 1px 4px rgba(0,0,0,0.04)",
                    color: active ? "white" : "#1e293b",
                  }}
                >
                  <span className="hidden sm:inline text-lg leading-none">{t.icon}</span>
                  <span>{t.title}</span>
                </button>
              );
            })}
          </div>

          <p
            key={activeTab}
            className="demo-try-hint mb-5 pl-3 text-[0.8125rem] text-slate-500 leading-snug m-0 border-l-2 border-slate-300"
          >
            {activeTabMeta.supports} {activeTabMeta.tryInDemo}
          </p>

          {/* Demo content */}
          {activeTab === "create" && <CreateBlockDemo />}
          {activeTab === "connect" && <ConnectBlockDemo />}
          {activeTab === "reuse" && <ReuseBlockDemo />}

          {activeTab === "create" && <PipelineDetails />}
        </div>

        {/* System walkthrough video */}
        <div className="mt-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
            System Walkthrough
          </p>
          <p className="text-[0.97rem] text-slate-500 mb-6">
            For the full workflow of using IdeaBlocks, check out this video figure.
          </p>
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{
              paddingBottom: "56.25%",
              border: "2px solid rgba(0,0,0,0.08)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/AdxrW-Zdotk"
              title="System Walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
