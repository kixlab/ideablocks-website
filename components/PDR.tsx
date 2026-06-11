"use client";

import { useState, useEffect, useRef } from "react";
import { GuideHint } from "./GuideHint";

type Component = "property" | "direction" | "range";

const config = {
  property: {
    label: "Property",
    subtitle: "What to explore",
    definition:
      "The specific design dimension to focus on — the axis along which exploration moves.",
    tags: ["Image Style", "Character Entity", "Background", "Color Palette"],
    quote: '"I like the character, just change the background style."',
    attribution: "— P7",
    accent: "#1D6FEB",
    light: "#EBF3FF",
    tabKey: "P",
  },
  direction: {
    label: "Direction",
    subtitle: "Where to center",
    definition:
      "The qualitative vector the designer steers toward within a property — the anchor of exploration.",
    tags: ["Watercolor", "Street Musician", "Starry Night"],
    quote: "\"I'm looking for a 'cyberpunk' atmosphere, but less aggressive.\"",
    attribution: "— P2",
    accent: "#D4740A",
    light: "#FFF4E0",
    tabKey: "D",
  },
  range: {
    label: "Range",
    subtitle: "How far to deviate",
    definition: "The magnitude of variance — how broadly to explore from the center direction.",
    tags: [],
    quote: '"I want to see totally different options, not just small tweaks."',
    attribution: "— P1",
    accent: "#6E30D8",
    light: "#F2EDFF",
    tabKey: "R",
  },
} as const;

// ──────────────────────────────────────────────
// Cone SVG
// ──────────────────────────────────────────────
function ConeDiagram({
  selected,
  onSelect,
  rangePos,
  highlightAll,
}: {
  selected: Component;
  onSelect: (c: Component) => void;
  rangePos: number;
  highlightAll: boolean;
}) {
  const isActive = (c: Component) => highlightAll || selected === c;
  const gray = "#94A3B8";
  const grayLight = "#C8D0DC";
  const { property: p, direction: d, range: r } = config;

  // Cone half-width driven by slider: narrow (20) at Typical, wide (80) at Atypical
  const hw = 20 + (rangePos / 100) * 60;
  const coneLeft = 150 - hw;
  const coneRight = 150 + hw;

  // Layout (viewBox 0 0 300 210):
  // Property  = parallelogram plane in perspective (bottom)
  // Range     = teardrop cone rising upward from the plane center
  // Direction = arrow lying on the plane surface

  // Plane corners: TL(72,118) TR(258,118) BR(228,198) BL(42,198)
  // Cone base ellipse: cx=150, cy=148, rx=65, ry=16
  // Cone peak: (150, 22)

  const FONT = "var(--font-epilogue), sans-serif";

  return (
    <svg
      viewBox="0 0 300 210"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[320px]"
      role="img"
      aria-label="Interactive PDR diagram: click the plane (Property), the cone (Range), or the arrow (Direction)"
    >
      <defs>
        <marker id="arr-def" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={gray} />
        </marker>
        <marker id="arr-dir" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={d.accent} />
        </marker>
      </defs>

      {/* ── Range teardrop cone (drawn first so plane overlaps base) ── */}
      <path
        d={`M ${coneLeft} 148 L 150 22 L ${coneRight} 148 C ${coneRight} 168, ${coneLeft} 168, ${coneLeft} 148 Z`}
        fill={isActive("range") ? "rgba(110,48,216,0.13)" : "rgba(200,192,225,0.18)"}
        stroke={isActive("range") ? r.accent : grayLight}
        strokeWidth={isActive("range") ? 2 : 1.2}
        style={{ transition: "d 0.05s ease, fill 0.25s ease, stroke 0.25s ease" }}
      />

      {/* ── Property plane (parallelogram, drawn over cone base) ── */}
      <path
        d="M 42 198 L 72 118 L 258 118 L 228 198 Z"
        fill={isActive("property") ? "rgba(29,111,235,0.09)" : "rgba(200,208,220,0.25)"}
        stroke={isActive("property") ? p.accent : gray}
        strokeWidth={isActive("property") ? 2 : 1.4}
        style={{ transition: "all 0.25s ease" }}
      />

      {/* ── Cone base ellipse on the plane surface ── */}
      <ellipse
        cx="150"
        cy="148"
        rx={hw}
        ry="16"
        fill="none"
        stroke={isActive("range") ? r.accent : grayLight}
        strokeWidth={isActive("range") ? 1.8 : 1}
        strokeDasharray="4,3"
        style={{ transition: "rx 0.05s ease, stroke 0.25s ease, stroke-width 0.25s ease" }}
      />

      {/* ── Direction: initial axis (cone peak → origin) ── */}
      <line
        x1="150"
        y1="22"
        x2="150"
        y2="141"
        stroke={isActive("direction") ? d.accent : gray}
        strokeWidth={isActive("direction") ? 2.5 : 1.8}
        markerEnd={isActive("direction") ? "url(#arr-dir)" : "url(#arr-def)"}
        style={{ transition: "all 0.25s ease" }}
      />

      {/* ── Direction: exploration drift (origin → shifted point on plane) ── */}
      <line
        x1="150"
        y1="148"
        x2="90"
        y2="168"
        stroke={isActive("direction") ? d.accent : gray}
        strokeWidth={isActive("direction") ? 2 : 1.4}
        strokeDasharray="4,3"
        markerEnd={isActive("direction") ? "url(#arr-dir)" : "url(#arr-def)"}
        style={{ transition: "all 0.25s ease" }}
      />

      {/* ── Origin dot ── */}
      <circle
        cx="150"
        cy="148"
        r="4.5"
        fill={isActive("direction") ? d.accent : gray}
        style={{ transition: "fill 0.25s ease" }}
      />

      {/* ── Drift endpoint dot (Direction only) ── */}
      <circle
        cx="90"
        cy="168"
        r="3.5"
        fill={isActive("direction") ? d.accent : gray}
        fillOpacity={isActive("direction") ? 1 : 0.4}
        style={{ transition: "all 0.25s ease" }}
      />

      {/* ── Hit areas ── */}
      <path
        d="M 42 198 L 72 118 L 258 118 L 228 198 Z"
        fill="transparent"
        className="cursor-pointer"
        onClick={() => onSelect("property")}
      />
      <path
        d={`M ${coneLeft} 148 L 150 22 L ${coneRight} 148 C ${coneRight} 168, ${coneLeft} 168, ${coneLeft} 148 Z`}
        fill="transparent"
        className="cursor-pointer"
        onClick={() => onSelect("range")}
      />
      {/* Direction hit areas drawn last so they sit on top of the cone */}
      <rect
        x="78"
        y="140"
        width="80"
        height="38"
        fill="transparent"
        className="cursor-pointer"
        onClick={() => onSelect("direction")}
      />
      <rect
        x="143"
        y="22"
        width="14"
        height="126"
        fill="transparent"
        className="cursor-pointer"
        onClick={() => onSelect("direction")}
      />

      {/* ── Labels (drawn last so they sit above hit areas and receive clicks) ── */}
      <text
        x="240"
        y="194"
        fontSize="11"
        fontFamily={FONT}
        fontWeight="600"
        fill={isActive("property") ? p.accent : gray}
        className="cursor-pointer"
        style={{ transition: "fill 0.25s ease" }}
        onClick={() => onSelect("property")}
      >
        Property
      </text>

      <text
        x="158"
        y="28"
        fontSize="11"
        fontFamily={FONT}
        fontWeight="600"
        fill={isActive("range") ? r.accent : gray}
        className="cursor-pointer"
        style={{ transition: "fill 0.25s ease" }}
        onClick={() => onSelect("range")}
      >
        Range
      </text>

      <text
        x="60"
        y="185"
        fontSize="11"
        fontFamily={FONT}
        fontWeight="600"
        fill={isActive("direction") ? d.accent : gray}
        className="cursor-pointer"
        style={{ transition: "fill 0.25s ease" }}
        onClick={() => onSelect("direction")}
      >
        Direction
      </text>
    </svg>
  );
}

// ──────────────────────────────────────────────
// Typicality Slider (visual only)
// ──────────────────────────────────────────────
function TypicalitySlider({ pos, onChange }: { pos: number; onChange: (v: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    onChange(pct);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) updatePos(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (dragging.current) updatePos(e.touches[0].clientX);
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="my-4">
      <div className="flex justify-between text-xs text-slate-400 mb-2">
        <span>Typical</span>
        <span>Atypical</span>
      </div>
      <div ref={trackRef} className="relative h-[6px] bg-slate-200 rounded-full">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${pos}%`, background: "linear-gradient(to right, #9B6EFF, #6E30D8)" }}
        />
        <div
          className="typicality-thumb"
          style={{ left: `${pos}%` }}
          onMouseDown={() => {
            dragging.current = true;
            document.body.style.userSelect = "none";
          }}
          onTouchStart={() => {
            dragging.current = true;
            document.body.style.userSelect = "none";
          }}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Panel content per component
// ──────────────────────────────────────────────
function PanelContent({
  component,
  rangePos,
  onRangeChange,
}: {
  component: Component;
  rangePos: number;
  onRangeChange: (v: number) => void;
}) {
  const c = config[component];

  return (
    <div key={component} style={{ animation: "fadeInUp 0.3s ease forwards" }}>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-display text-xl font-extrabold mb-1" style={{ color: c.accent }}>
          {c.label}
        </h3>
        <p className="text-sm font-medium italic text-slate-500">"{c.subtitle}"</p>
      </div>
      <p className="text-[0.93rem] text-slate-600 leading-relaxed mb-4">{c.definition}</p>

      <hr className="border-slate-100 mb-4" />

      {c.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {c.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: c.light, color: c.accent }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {component === "range" && <TypicalitySlider pos={rangePos} onChange={onRangeChange} />}

      <blockquote
        className="text-sm italic text-slate-500 pl-3 mt-auto"
        style={{ borderLeft: `3px solid ${c.accent}` }}
      >
        {c.quote} <cite className="not-italic font-medium">{c.attribution}</cite>
      </blockquote>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main PDR section
// ──────────────────────────────────────────────
export function PDR() {
  const [selected, setSelected] = useState<Component>("property");
  const [pulseTabs, setPulseTabs] = useState(false);
  const [rangePos, setRangePos] = useState(68);
  const [highlightAll, setHighlightAll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPulseTabs(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  const tabComponents: Component[] = ["property", "direction", "range"];
  const handleSelect = (comp: Component) => {
    setHighlightAll(false);
    setSelected(comp);
  };

  return (
    <section id="pdr" className="py-16 bg-paper">
      <div className="max-w-[1080px] mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
          Divergent Intent Framework
        </p>
        <h2 className="font-display font-semibold text-[clamp(1.5rem,2.8vw,2.1rem)] leading-[1.22] text-slate-900 mb-3">
          We define Divergent Intent as a parameterizable construct.
        </h2>
        <p className="text-[0.97rem] text-slate-500 max-w-lg mb-7">
          Through formative study analysis, we identified three components that together define the
          space a designer intends to explore.
        </p>

        {/* Layout: SVG (left) + Panel (right) */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 items-start mb-7">
          {/* Left: SVG */}
          <div className="md:sticky" style={{ top: "calc(var(--nav-h) + 24px)" }}>
            <div className="flex justify-center md:justify-start">
              <ConeDiagram
                selected={selected}
                onSelect={handleSelect}
                rangePos={rangePos}
                highlightAll={highlightAll}
              />
            </div>
            <div className="mt-3 flex justify-center md:justify-start">
              <button
                type="button"
                onClick={() => setHighlightAll((v) => !v)}
                className="px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors"
                style={
                  highlightAll
                    ? { borderColor: "#1D6FEB", color: "#1D6FEB", background: "#EBF3FF" }
                    : { borderColor: "#CBD5E1", color: "#64748B", background: "white" }
                }
              >
                {highlightAll ? "전체 강조 끄기" : "세 개 모두 켜기"}
              </button>
            </div>
            <GuideHint
              text="Click a region to see details."
              className="text-center md:text-left mt-3"
            />
          </div>

          {/* Right: Description panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-7 min-h-[240px] shadow-sm">
            {tabComponents.map((comp) => (
              <div key={comp} style={{ display: comp === selected ? "block" : "none" }}>
                <PanelContent component={comp} rangePos={rangePos} onRangeChange={setRangePos} />
              </div>
            ))}
          </div>
        </div>

        {/* P / D / R Tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {tabComponents.map((comp) => {
            const c = config[comp];
            const isActive = selected === comp;
            return (
              <button
                key={comp}
                onClick={() => handleSelect(comp)}
                className={`pdr-tab flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all hover:-translate-y-px hover:shadow-sm ${
                  pulseTabs && !isActive ? "animate-tab-pulse" : ""
                }`}
                style={
                  isActive
                    ? { borderColor: c.accent, color: c.accent, background: c.light }
                    : { borderColor: "#E2E8F0", color: "#64748B", background: "white" }
                }
                onAnimationEnd={() => setPulseTabs(false)}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
