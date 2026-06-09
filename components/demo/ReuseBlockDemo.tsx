"use client";

import { useState, useRef, useEffect } from "react";
import {
  MANIFEST,
  PROPERTY_COLORS,
  TYPICALITY_LABELS,
  GUIDE_COLOR,
  DemoWrapper,
  BlockLibrarySidebar,
  BlockNode,
  ChainLink,
  BranchLinks,
  ResultNode,
  useDragScroll,
  styleImgSrc,
} from "./shared";

// ── Types ─────────────────────────────────────────────────────────────────────

type SubTab = "block" | "path" | "project";
type DragState = "idle" | "over" | "choosing" | "placed-literal" | "placed-adaptive";
type PathState =
  | "idle"
  | "selecting"
  | "copied"
  | "paste-choosing"
  | "placed-literal"
  | "placed-adaptive";
type ImportState = "idle" | "literal" | "adaptive";

// ── Colors ────────────────────────────────────────────────────────────────────

const ENTITY_COLOR = PROPERTY_COLORS["Character Entity"]; // #3f6093
const SCENE_COLOR = PROPERTY_COLORS["Scene"]; // #7B5EA7
const STYLE_COLOR = PROPERTY_COLORS["Style"]; // #0F766E
const BG_COLOR = "#CA8A04"; // amber — Background property

// ── Block-level data ──────────────────────────────────────────────────────────

const LITERAL_SUGGESTIONS = [
  "City skyline at night",
  "Neon-lit boulevard",
  "City waterfront at night",
  "Busy city intersection at night",
];
const ADAPTIVE_SUGGESTIONS = [
  "City stage glowing at night",
  "Neon-lit performance street",
  "Waterfront dance plaza at night",
  "Crowded night festival square",
];
const REUSE_HISTORY: Record<string, string[]> = {
  "Character Entity": ["Astronaut", "Dancer"],
  Scene: ["Starry Night", "City Night"],
  Style: ["Watercolor", "Pixel Art"],
};

// Typicality level shown in tooltip per node (City Night stays 1 — it's the draggable one)
const NODE_TYPICALITY: Record<string, Record<string, number>> = {
  "Character Entity": { Astronaut: 3, Dancer: 5 },
  Scene: { "Starry Night": 3, "City Night": 1 },
  Style: { Watercolor: 2, "Pixel Art": 4 },
};

// ── Path-level data ───────────────────────────────────────────────────────────

const ASTRONAUT_CHIPS = MANIFEST["Character Entity"]["Astronaut"]["4"].map((e) => e.text);
const DANCER_CHIPS = MANIFEST["Character Entity"]["Dancer"]["4"].map((e) => e.text);
const STARRY_NIGHT_CHIPS = MANIFEST["Scene"]["Starry Night"]["1"].map((e) => e.text);
const WATERCOLOR_CHIPS = [
  "Fluid ink wash",
  "Watercolor texture",
  "Soft brush strokes",
  "Color bleeding",
];
const PIXEL_ART_CHIPS = [
  "8-bit grid style",
  "Retro pixel art",
  "Low-res color blocks",
  "Pixelated edge",
];

const PATH_LITERAL_BLOCKS = [
  {
    property: "Scene",
    direction: "Starry Night",
    typicality: 1,
    color: SCENE_COLOR,
    chips: STARRY_NIGHT_CHIPS,
  },
  {
    property: "Style",
    direction: "Watercolor",
    typicality: 1,
    color: STYLE_COLOR,
    chips: WATERCOLOR_CHIPS,
  },
  {
    property: "Style",
    direction: "Pixel Art",
    typicality: 4,
    color: STYLE_COLOR,
    chips: PIXEL_ART_CHIPS,
  },
];
const PATH_ADAPTIVE_BLOCKS = [
  {
    property: "Scene",
    direction: "Dance Stage",
    typicality: 1,
    color: SCENE_COLOR,
    chips: ["Open-air dance stage", "Neon dance floor", "Mirror-walled studio", "Rooftop stage"],
  },
  {
    property: "Style",
    direction: "Fluid Ink",
    typicality: 1,
    color: STYLE_COLOR,
    chips: ["Expressive ink flow", "Dynamic brushwork", "Movement-based marks", "Gestural strokes"],
  },
  {
    property: "Style",
    direction: "Glitch Art",
    typicality: 4,
    color: STYLE_COLOR,
    chips: ["Data moshing", "Digital distortion", "Pixel displacement", "Signal noise"],
  },
];

const PATH_BLOCK_IDS = ["starrynight", "watercolor", "pixelart"] as const;
type PathBlockId = (typeof PATH_BLOCK_IDS)[number];

// ── Project-level data ────────────────────────────────────────────────────────

type GraphNodeData = { property: string; direction: string; color: string; changed?: boolean };
type GraphRow = { root: GraphNodeData; branches: GraphNodeData[][] };

const MUSIC_GRAPH: GraphRow[] = [
  {
    root: { property: "Character Entity", direction: "Street Musician", color: ENTITY_COLOR },
    branches: [
      [
        { property: "Style", direction: "Watercolor", color: STYLE_COLOR },
        { property: "Background", direction: "Skyline", color: BG_COLOR },
      ],
      [
        { property: "Style", direction: "Retro", color: STYLE_COLOR },
        { property: "Background", direction: "Modern Room", color: BG_COLOR },
      ],
    ],
  },
  {
    root: { property: "Character Entity", direction: "Cute Animal", color: ENTITY_COLOR },
    branches: [[{ property: "Background", direction: "Urban Park", color: BG_COLOR }]],
  },
  {
    root: { property: "Character Entity", direction: "Abstract Shape", color: ENTITY_COLOR },
    branches: [],
  },
];

const KIDS_ADAPTIVE_GRAPH: GraphRow[] = [
  {
    root: {
      property: "Character Entity",
      direction: "Programmer",
      color: ENTITY_COLOR,
      changed: true,
    },
    branches: [
      [
        { property: "Style", direction: "Illustration", color: STYLE_COLOR, changed: true },
        { property: "Background", direction: "Playground", color: BG_COLOR, changed: true },
      ],
      [
        { property: "Style", direction: "Cartoon", color: STYLE_COLOR, changed: true },
        { property: "Background", direction: "Classroom", color: BG_COLOR, changed: true },
      ],
    ],
  },
  {
    root: { property: "Character Entity", direction: "Cute Animal", color: ENTITY_COLOR },
    branches: [
      [{ property: "Background", direction: "Park Yard", color: BG_COLOR, changed: true }],
    ],
  },
  {
    root: { property: "Character Entity", direction: "Abstract Shape", color: ENTITY_COLOR },
    branches: [],
  },
];

// ── Tooltip ───────────────────────────────────────────────────────────────────

type TooltipInfo = { dir: string; property: string; rect: DOMRect; typicality: number } | null;

function NodeTooltip({ info }: { info: Exclude<TooltipInfo, null> }) {
  const isStyle = info.property === "Style";
  const color = PROPERTY_COLORS[info.property] ?? "#94a3b8";

  // Style → 2×2 images; others → 2×2 text chips
  const textEntries = isStyle
    ? []
    : ((MANIFEST as Record<string, Record<string, Record<string, { text: string }[]>>>)[
        info.property
      ]?.[info.dir]?.[String(info.typicality)]?.map((e) => e.text) ?? []);

  if (!isStyle && textEntries.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: info.rect.right + 6,
        top: info.rect.top - 8,
        zIndex: 9999,
        background: "white",
        border: "1.5px solid #e2e8f0",
        borderRadius: 10,
        padding: "10px 12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        pointerEvents: "none",
        animation: "step2-in 0.12s ease",
      }}
    >
      {isStyle ? (
        // 2×2 image grid for Style
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
          {[0, 1, 2, 3].map((i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={styleImgSrc(info.dir, info.typicality, i)}
              alt=""
              style={{
                width: 68,
                height: 68,
                objectFit: "cover",
                borderRadius: 7,
                border: "1.5px solid #e2e8f0",
              }}
            />
          ))}
        </div>
      ) : (
        // 2×2 text chip grid
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, width: 210 }}>
          {textEntries.map((text, i) => (
            <div
              key={i}
              style={{
                fontSize: 9.5,
                color: "#334155",
                padding: "5px 7px",
                borderRadius: 7,
                background: `${color}08`,
                border: `1px solid ${color}20`,
                lineHeight: 1.35,
              }}
            >
              {text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sub-tab bar ───────────────────────────────────────────────────────────────

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "block", label: "Block-level" },
  { id: "path", label: "Path-level" },
  { id: "project", label: "Project-level" },
];

function ReuseSubTabs({ active, onChange }: { active: SubTab; onChange: (t: SubTab) => void }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {SUB_TABS.map(({ id, label }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 10.5,
              fontWeight: isActive ? 700 : 500,
              cursor: "pointer",
              background: isActive ? "#1e293b" : "rgba(255,255,255,0.9)",
              color: isActive ? "white" : "#64748b",
              border: `1.5px solid ${isActive ? "#1e293b" : "#e2e8f0"}`,
              transition: "all 0.15s",
              boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ── Shared canvas primitives ──────────────────────────────────────────────────

// Block card (full-size, with 2×2 suggestion chips)
// Convenience shorthand — renders BlockNode in locked collapsed state with reuse-demo props
function CollapsedBlock({
  property,
  direction,
  typicality,
  suggestions,
  animateIn,
  selected,
  onSelect,
  isPasteTarget,
}: {
  property: string;
  direction: string;
  typicality: number;
  suggestions: string[];
  animateIn?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  isPasteTarget?: boolean;
}) {
  return (
    <BlockNode
      property={property}
      direction={direction}
      typicality={typicality}
      directionChosen
      typicalityChosen
      isCollapsed
      locked
      chips={suggestions}
      selected={selected}
      isPasteTarget={isPasteTarget}
      animateIn={animateIn}
      onSelect={onSelect}
      onDirectionChange={() => {}}
      onTypicalityChange={() => {}}
      onStartTyping={() => {}}
      onDirectionTried={() => {}}
    />
  );
}

// ── Graph visualization primitives ────────────────────────────────────────────

// Compact node block for graph views (property pill + direction text)
function NodeBlock({ property, direction, color, changed }: GraphNodeData) {
  return (
    <div
      style={{
        borderRadius: 8,
        overflow: "hidden",
        flexShrink: 0,
        minWidth: 76,
        border: `1.5px solid ${changed ? color + "50" : "rgba(0,0,0,0.08)"}`,
        background: changed ? `${color}08` : "white",
        boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
      }}
    >
      <div
        style={{
          background: color,
          color: "white",
          fontSize: 8,
          fontWeight: 700,
          padding: "3px 8px",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {property}
      </div>
      <div
        style={{
          fontSize: 9,
          color: "#334155",
          padding: "3px 6px 4px",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {direction}
      </div>
    </div>
  );
}

// Y-fork connector — branches from center of the left side to top/bottom of right side
// Renders one "row" of a project/path graph: root block → connector → branches
function GraphRowViz({ root, branches }: GraphRow) {
  const branchGap = 8;
  const hasFork = branches.length > 1;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <NodeBlock {...root} />
      {/* Straight connector for single branch; branch connector for fork */}
      {branches.length > 0 && !hasFork && <ChainLink compact />}
      {hasFork && <BranchLinks compact />}
      {branches.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: branchGap }}>
          {branches.map((branch, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              {branch.map((node, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center" }}>
                  {j > 0 && <ChainLink compact />}
                  <NodeBlock {...node} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Block-level demo ──────────────────────────────────────────────────────────

function DropZone({
  isOver,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  isOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: () => void;
}) {
  return (
    <div
      data-guide-drop-zone="true"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      style={{
        width: 160,
        height: 110,
        borderRadius: 12,
        flexShrink: 0,
        border: `2px dashed ${isOver ? SCENE_COLOR : "#d1d5db"}`,
        background: isOver ? `${SCENE_COLOR}08` : "#fafafa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "all 0.2s",
      }}
    >
      <div style={{ fontSize: 20, opacity: isOver ? 0.6 : 0.25 }}>⬇</div>
      <div
        style={{
          fontSize: 9.5,
          color: isOver ? SCENE_COLOR : "#94a3b8",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        {isOver ? "Release to drop!" : "Drag a block\nfrom history here"}
      </div>
    </div>
  );
}

// Modal for block-level reuse choice — 2×2 chip grid
function ReuseChoiceModal({ onChoose }: { onChoose: (t: "literal" | "adaptive") => void }) {
  const OPTIONS = [
    {
      type: "literal" as const,
      title: "Exactly the Same",
      note: "Same directions as before",
      suggestions: LITERAL_SUGGESTIONS,
    },
    {
      type: "adaptive" as const,
      title: "Variations Based on New Context",
      note: "Adapted to Dancer context",
      suggestions: ADAPTIVE_SUGGESTIONS,
    },
  ];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        animation: "step2-in 0.2s ease",
        borderRadius: 18,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "22px 24px",
          maxWidth: 460,
          boxShadow: "0 16px 48px rgba(0,0,0,0.13)",
          border: "1.5px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: "0 0 3px" }}>
            How do you want to reuse?
          </p>
          <p style={{ fontSize: 10.5, color: "#64748b", margin: 0 }}>
            Scene: City Night / {TYPICALITY_LABELS[0]} → after Dancer block
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {OPTIONS.map(({ type, title, note, suggestions }) => (
            <button
              key={type}
              onClick={() => onChoose(type)}
              style={{
                borderRadius: 12,
                padding: "14px 12px",
                border: "1.5px solid #e2e8f0",
                background: "#f8fafc",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.border = `1.5px solid ${SCENE_COLOR}`;
                (e.currentTarget as HTMLButtonElement).style.background = `${SCENE_COLOR}08`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #e2e8f0";
                (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>
                {title}
              </div>
              <div style={{ fontSize: 9, color: "#94a3b8", marginBottom: 8 }}>{note}</div>
              {/* 2×2 chip grid — same style as CollapsedBlock */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "5px 6px",
                      borderRadius: 7,
                      fontSize: 9.5,
                      textAlign: "center",
                      background: "white",
                      color: "#334155",
                      border: "1.5px solid #e2e8f0",
                      lineHeight: 1.3,
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlockLevelCanvas({
  dragState,
  onDrop,
  onChoose,
}: {
  dragState: DragState;
  onDrop: () => void;
  onChoose: (t: "literal" | "adaptive") => void;
}) {
  const [isOver, setIsOver] = useState(false);
  // Very Atypical (level 5): Robot dancer, Hologram dancer, Fire dancer, Underwater dancer
  const dancerChips = MANIFEST["Character Entity"]["Dancer"]["5"].map((e) => e.text);
  const isPlaced = dragState === "placed-literal" || dragState === "placed-adaptive";
  const sceneChips =
    dragState === "placed-literal"
      ? LITERAL_SUGGESTIONS
      : dragState === "placed-adaptive"
        ? ADAPTIVE_SUGGESTIONS
        : LITERAL_SUGGESTIONS;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", zoom: 0.85 }}>
        <CollapsedBlock
          property="Character Entity"
          direction="Dancer"
          typicality={5}
          suggestions={dancerChips}
        />
        {/* Dancer / Very Atypical results — actual images from demo_output */}
        <ResultNode
          property="Character Entity"
          direction="Dancer"
          typicality={5}
          loading={false}
          connector
        />
        <ChainLink />
        {!isPlaced && dragState !== "choosing" && (
          <DropZone
            isOver={isOver}
            onDragOver={(e) => {
              e.preventDefault();
              setIsOver(true);
            }}
            onDragLeave={() => setIsOver(false)}
            onDrop={() => {
              setIsOver(false);
              onDrop();
            }}
          />
        )}
        {(dragState === "choosing" || isPlaced) && (
          <>
            <CollapsedBlock
              property="Scene"
              direction="City Night"
              typicality={1}
              suggestions={sceneChips}
              animateIn
            />
            {isPlaced && (
              <ResultNode
                property="Scene"
                direction="City Night"
                typicality={1}
                loading={false}
                connector
                connectorAnimate
                srcs={
                  [0, 1, 2, 3].map(
                    (i) =>
                      `/demo_output/chained_reuse/dancer_city_night/${dragState === "placed-adaptive" ? "adaptive" : "literal"}/cluster_${i}.png`,
                  ) as [string, string, string, string]
                }
              />
            )}
          </>
        )}
      </div>
      {dragState === "choosing" && <ReuseChoiceModal onChoose={onChoose} />}
    </div>
  );
}

// ── Path-level demo ───────────────────────────────────────────────────────────

// Modal for path-level reuse choice — shows mini graph of each option
function PathChoiceModal({ onChoose }: { onChoose: (t: "literal" | "adaptive") => void }) {
  const OPTIONS: {
    type: "literal" | "adaptive";
    title: string;
    note: string;
    root: GraphNodeData;
    branches: GraphNodeData[][];
  }[] = [
    {
      type: "literal",
      title: "Literal Copy",
      note: "Same directions as original",
      root: { property: "Scene", direction: "Starry Night", color: SCENE_COLOR },
      branches: [
        [{ property: "Style", direction: "Watercolor", color: STYLE_COLOR }],
        [{ property: "Style", direction: "Pixel Art", color: STYLE_COLOR }],
      ],
    },
    {
      type: "adaptive",
      title: "Adjusted Copy",
      note: "Adapted to Dancer context",
      root: { property: "Scene", direction: "Dance Stage", color: SCENE_COLOR },
      branches: [
        [{ property: "Style", direction: "Fluid Ink", color: STYLE_COLOR }],
        [{ property: "Style", direction: "Glitch Art", color: STYLE_COLOR }],
      ],
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        animation: "step2-in 0.2s ease",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "22px 24px",
          width: "fit-content",
          boxShadow: "0 16px 48px rgba(0,0,0,0.13)",
          border: "1.5px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: "0 0 3px" }}>
            How do you want to paste this path?
          </p>
          <p style={{ fontSize: 10.5, color: "#64748b", margin: 0 }}>
            3 selected blocks → after Dancer block
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {OPTIONS.map(({ type, title, note, root, branches }) => (
            <button
              key={type}
              onClick={() => onChoose(type)}
              style={{
                borderRadius: 12,
                padding: "14px 12px",
                border: "1.5px solid #e2e8f0",
                background: "#f8fafc",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.border = `1.5px solid ${SCENE_COLOR}`;
                (e.currentTarget as HTMLButtonElement).style.background = `${SCENE_COLOR}08`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #e2e8f0";
                (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>
                {title}
              </div>
              <div style={{ fontSize: 9, color: "#94a3b8", marginBottom: 10 }}>{note}</div>
              {/* Mini graph visualization */}
              <div
                style={{
                  padding: "10px 8px",
                  borderRadius: 8,
                  background: "white",
                  border: "1px solid #f1f5f9",
                }}
              >
                <GraphRowViz root={root} branches={branches} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Click-hint animation constants (pathState === "copied")
const CLICK_ANIM_DELAY = 400;
const CLICK_ANIM_FADEIN = 200;
const CLICK_ANIM_PRE_CLICK = 300;
const CLICK_ANIM_PRESS = 200;
const CLICK_ANIM_RIPPLE = 450;
const CLICK_ANIM_HOLD = 300;
const CLICK_ANIM_FADEOUT = 250;
const CLICK_ANIM_LOOP =
  CLICK_ANIM_DELAY +
  CLICK_ANIM_FADEIN +
  CLICK_ANIM_PRE_CLICK +
  CLICK_ANIM_PRESS +
  CLICK_ANIM_RIPPLE +
  CLICK_ANIM_HOLD +
  CLICK_ANIM_FADEOUT +
  900;

// Guide drag-hint animation constants
const GUIDE_ANIM_DELAY = 600;
const GUIDE_ANIM_FADEIN = 200;
const GUIDE_ANIM_MOVE = 1400;
const GUIDE_ANIM_HOLD = 700;
const GUIDE_ANIM_FADEOUT = 300;
const GUIDE_ANIM_LOOP =
  GUIDE_ANIM_DELAY +
  GUIDE_ANIM_FADEIN +
  GUIDE_ANIM_MOVE +
  GUIDE_ANIM_HOLD +
  GUIDE_ANIM_FADEOUT +
  1000;

function guideEase(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Drag-guide animation constants (block-level demo)
const DRAG_GUIDE_DELAY = 500;
const DRAG_GUIDE_FADEIN = 200;
const DRAG_GUIDE_MOVE = 1100;
const DRAG_GUIDE_HOLD = 350;
const DRAG_GUIDE_FADEOUT = 300;
const DRAG_GUIDE_LOOP =
  DRAG_GUIDE_DELAY +
  DRAG_GUIDE_FADEIN +
  DRAG_GUIDE_MOVE +
  DRAG_GUIDE_HOLD +
  DRAG_GUIDE_FADEOUT +
  1000;

function PathLevelCanvas({
  pathState,
  onPathStateChange,
}: {
  pathState: PathState;
  onPathStateChange: (s: PathState) => void;
}) {
  const [selected, setSelected] = useState<Set<PathBlockId>>(new Set());
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [liveSelect, setLiveSelect] = useState<Set<PathBlockId>>(new Set());
  const [guideAnimT, setGuideAnimT] = useState(0);
  const [clickAnimT, setClickAnimT] = useState(0);
  const clickAnimPosRef = useRef<{ ex: number; ey: number } | null>(null);

  const explorationRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Partial<Record<PathBlockId, HTMLDivElement | null>>>({});
  const guideAnimRafRef = useRef<number | null>(null);
  const guideAnimStartRef = useRef<number>(0);
  const copyStatusRef = useRef<HTMLSpanElement | null>(null);
  const pasteAreaRef = useRef<HTMLDivElement | null>(null);
  const clickAnimRafRef = useRef<number | null>(null);
  const clickAnimStartRef = useRef<number>(0);

  const isDragging = !!dragStart;
  const isSelectable = pathState === "idle" || pathState === "selecting";

  // Selection rect in client viewport coordinates
  const selRect =
    dragStart && dragCurrent
      ? {
          x: Math.min(dragStart.x, dragCurrent.x),
          y: Math.min(dragStart.y, dragCurrent.y),
          w: Math.abs(dragCurrent.x - dragStart.x),
          h: Math.abs(dragCurrent.y - dragStart.y),
        }
      : null;

  // Hit test using client viewport coordinates directly — no container offset needed
  const hitTest = (rect: { x: number; y: number; w: number; h: number }) => {
    const hits = new Set<PathBlockId>();
    for (const id of PATH_BLOCK_IDS) {
      const ref = blockRefs.current[id];
      if (!ref) continue;
      const br = ref.getBoundingClientRect();
      if (
        br.left < rect.x + rect.w &&
        br.left + br.width > rect.x &&
        br.top < rect.y + rect.h &&
        br.top + br.height > rect.y
      )
        hits.add(id);
    }
    return hits;
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent) => {
      if (!dragStart) return;
      const cur = { x: e.clientX, y: e.clientY };
      setDragCurrent(cur);
      const rect = {
        x: Math.min(dragStart.x, cur.x),
        y: Math.min(dragStart.y, cur.y),
        w: Math.abs(cur.x - dragStart.x),
        h: Math.abs(cur.y - dragStart.y),
      };
      setLiveSelect(hitTest(rect));
    };

    const onUp = () => {
      if (liveSelect.size > 0) {
        setSelected(liveSelect);
        onPathStateChange("selecting");
      } else {
        setSelected(new Set());
        if (pathState === "selecting") onPathStateChange("idle");
      }
      setDragStart(null);
      setDragCurrent(null);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragStart, liveSelect]);

  const showGuideAnim = pathState === "idle" && !isDragging;

  useEffect(() => {
    if (!showGuideAnim) {
      if (guideAnimRafRef.current !== null) cancelAnimationFrame(guideAnimRafRef.current);
      guideAnimRafRef.current = null;
      return;
    }
    guideAnimStartRef.current = performance.now();
    const tick = (now: number) => {
      setGuideAnimT((now - guideAnimStartRef.current) % GUIDE_ANIM_LOOP);
      guideAnimRafRef.current = requestAnimationFrame(tick);
    };
    guideAnimRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (guideAnimRafRef.current !== null) cancelAnimationFrame(guideAnimRafRef.current);
      guideAnimRafRef.current = null;
    };
  }, [showGuideAnim]);

  const animRawProgress =
    guideAnimT < GUIDE_ANIM_DELAY + GUIDE_ANIM_FADEIN
      ? 0
      : guideAnimT < GUIDE_ANIM_DELAY + GUIDE_ANIM_FADEIN + GUIDE_ANIM_MOVE
        ? (guideAnimT - GUIDE_ANIM_DELAY - GUIDE_ANIM_FADEIN) / GUIDE_ANIM_MOVE
        : 1;
  const animMove = guideEase(Math.min(animRawProgress, 1));

  const animOpacity =
    guideAnimT < GUIDE_ANIM_DELAY
      ? 0
      : guideAnimT < GUIDE_ANIM_DELAY + GUIDE_ANIM_FADEIN
        ? (guideAnimT - GUIDE_ANIM_DELAY) / GUIDE_ANIM_FADEIN
        : guideAnimT < GUIDE_ANIM_DELAY + GUIDE_ANIM_FADEIN + GUIDE_ANIM_MOVE + GUIDE_ANIM_HOLD
          ? 1
          : guideAnimT <
              GUIDE_ANIM_DELAY +
                GUIDE_ANIM_FADEIN +
                GUIDE_ANIM_MOVE +
                GUIDE_ANIM_HOLD +
                GUIDE_ANIM_FADEOUT
            ? 1 -
              (guideAnimT -
                GUIDE_ANIM_DELAY -
                GUIDE_ANIM_FADEIN -
                GUIDE_ANIM_MOVE -
                GUIDE_ANIM_HOLD) /
                GUIDE_ANIM_FADEOUT
            : 0;

  // ── Click-hint animation (pathState === "copied") ───────────────────────────
  const showClickAnim = pathState === "copied";

  useEffect(() => {
    if (!showClickAnim) {
      if (clickAnimRafRef.current !== null) cancelAnimationFrame(clickAnimRafRef.current);
      clickAnimRafRef.current = null;
      clickAnimPosRef.current = null;
      return;
    }
    clickAnimStartRef.current = performance.now();
    const tick = (now: number) => {
      // Re-measure every frame — always tracks paste area position
      const er = pasteAreaRef.current?.getBoundingClientRect();
      if (er) {
        clickAnimPosRef.current = {
          ex: er.left + er.width / 2 - 4,
          ey: er.top + er.height / 2 - 4,
        };
      }
      setClickAnimT((now - clickAnimStartRef.current) % CLICK_ANIM_LOOP);
      clickAnimRafRef.current = requestAnimationFrame(tick);
    };
    clickAnimRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (clickAnimRafRef.current !== null) cancelAnimationFrame(clickAnimRafRef.current);
      clickAnimRafRef.current = null;
    };
  }, [showClickAnim]);

  const caT1 = CLICK_ANIM_DELAY;
  const caT2 = caT1 + CLICK_ANIM_FADEIN;
  const caT3 = caT2 + CLICK_ANIM_PRE_CLICK;
  const caT4 = caT3 + CLICK_ANIM_PRESS;
  const caT5 = caT4 + CLICK_ANIM_RIPPLE;
  const caT6 = caT5 + CLICK_ANIM_HOLD;
  const caT7 = caT6 + CLICK_ANIM_FADEOUT;

  const clickOpacity =
    clickAnimT < caT1
      ? 0
      : clickAnimT < caT2
        ? (clickAnimT - caT1) / CLICK_ANIM_FADEIN
        : clickAnimT < caT6
          ? 1
          : clickAnimT < caT7
            ? 1 - (clickAnimT - caT6) / CLICK_ANIM_FADEOUT
            : 0;

  const clickPos = clickAnimPosRef.current;
  const clickCursorX = clickPos ? clickPos.ex : 0;
  const clickCursorY = clickPos ? clickPos.ey : 0;

  // Cursor scale: sine press curve 1 → 0.72 → 1
  const clickCursorScale =
    clickAnimT >= caT3 && clickAnimT < caT4
      ? 1 - 0.28 * Math.sin(Math.PI * ((clickAnimT - caT3) / CLICK_ANIM_PRESS))
      : 1;

  // Ripple: expands from cursor tip starting at press
  const rippleRaw =
    clickAnimT >= caT3 && clickAnimT < caT5
      ? (clickAnimT - caT3) / (CLICK_ANIM_PRESS + CLICK_ANIM_RIPPLE)
      : 0;
  const rippleActive = clickAnimT >= caT3 && clickAnimT < caT5;
  const rippleSize = rippleRaw * 54;
  const rippleOpacity = rippleActive ? Math.max(0, 1 - rippleRaw * 1.4) : 0;

  // mouseDown can start anywhere in the canvas — bail out on interactive targets so their click events aren't suppressed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSelectable) return;
    if ((e.target as HTMLElement).closest("button, a, input, [role='button']")) return;
    e.preventDefault();
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragCurrent({ x: e.clientX, y: e.clientY });
    setLiveSelect(new Set());
  };

  const displaySelected = isDragging ? liveSelect : selected;
  const isPlaced = pathState === "placed-literal" || pathState === "placed-adaptive";
  const isChoosing = pathState === "paste-choosing";
  const placedBlocks = pathState === "placed-literal" ? PATH_LITERAL_BLOCKS : PATH_ADAPTIVE_BLOCKS;

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "relative",
        width: "100%",
        minHeight: 440,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 16,
        padding: "0 32px",
        userSelect: "none",
        cursor: isSelectable ? "crosshair" : "default",
      }}
    >
      {/* Exploration section */}
      <div
        style={{
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 0, zoom: 0.75 }}>
          {/* Astronaut — fixed context block, outside the selection guide box */}
          <CollapsedBlock
            property="Character Entity"
            direction="Astronaut"
            typicality={4}
            suggestions={ASTRONAUT_CHIPS}
          />
          <ChainLink />

          {/* Guide box — only wraps the 3 selectable blocks */}
          <div
            ref={explorationRef}
            style={{
              position: "relative",
              left: -28,
              padding: "20px 28px",
              borderRadius: 16,
              border:
                pathState === "copied" ? `2px solid ${SCENE_COLOR}60` : "2px solid transparent",
              background: pathState === "copied" ? `${SCENE_COLOR}04` : "transparent",
              transition: "border 0.3s, background 0.3s",
            }}
          >
            {/* Guide drag-hint animation: cursor fades in at top-left, moves to bottom-right while selection box grows */}
            {showGuideAnim && (
              <>
                {/* Growing selection rect — same size as explorationRef, dashed */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: `${animMove * 100}%`,
                    height: `${animMove * 100}%`,
                    border: `2px dashed ${GUIDE_COLOR}`,
                    background: `${GUIDE_COLOR}14`,
                    borderRadius: 14,
                    pointerEvents: "none",
                    zIndex: 4,
                    opacity: animOpacity,
                  }}
                />
                {/* Fake cursor */}
                <div
                  style={{
                    position: "absolute",
                    left: `${animMove * 100}%`,
                    top: `${animMove * 100}%`,
                    pointerEvents: "none",
                    zIndex: 5,
                    opacity: animOpacity,
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ filter: `drop-shadow(0px 2px 6px ${GUIDE_COLOR}90)` }}
                  >
                    <defs>
                      <clipPath id="cursor-clip">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(6.99382e-07 16) rotate(-90)"
                        />
                      </clipPath>
                    </defs>
                    <g clipPath="url(#cursor-clip)">
                      <path
                        d="M2.182 1.918C2.25353 1.84652 2.34506 1.7984 2.44451 1.78002C2.54395 1.76163 2.64663 1.77382 2.739 1.815L15.467 7.472C15.556 7.51152 15.6316 7.57619 15.6843 7.65805C15.7371 7.73991 15.7648 7.8354 15.7641 7.93279C15.7633 8.03019 15.7342 8.12524 15.6801 8.20629C15.6261 8.28733 15.5496 8.35084 15.46 8.389L10.694 10.43L8.652 15.197C8.6136 15.2863 8.55002 15.3624 8.46902 15.4161C8.38803 15.4698 8.29314 15.4988 8.19596 15.4994C8.09878 15.5001 8.00352 15.4724 7.92183 15.4197C7.84014 15.3671 7.77557 15.2918 7.736 15.203L2.079 2.475C2.03805 2.38276 2.02597 2.28028 2.04435 2.18104C2.06274 2.0818 2.11072 1.98945 2.182 1.918Z"
                        fill={GUIDE_COLOR}
                      />
                    </g>
                  </svg>
                </div>
              </>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <div
                style={{ flexShrink: 0 }}
                ref={(el) => {
                  blockRefs.current.starrynight = el;
                }}
              >
                <CollapsedBlock
                  property="Scene"
                  direction="Starry Night"
                  typicality={1}
                  suggestions={STARRY_NIGHT_CHIPS}
                  selected={displaySelected.has("starrynight")}
                />
              </div>
              <BranchLinks />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div
                  style={{ flexShrink: 0 }}
                  ref={(el) => {
                    blockRefs.current.watercolor = el;
                  }}
                >
                  <CollapsedBlock
                    property="Style"
                    direction="Watercolor"
                    typicality={1}
                    suggestions={WATERCOLOR_CHIPS}
                    selected={displaySelected.has("watercolor")}
                  />
                </div>
                <div
                  style={{ flexShrink: 0 }}
                  ref={(el) => {
                    blockRefs.current.pixelart = el;
                  }}
                >
                  <CollapsedBlock
                    property="Style"
                    direction="Pixel Art"
                    typicality={4}
                    suggestions={PIXEL_ART_CHIPS}
                    selected={displaySelected.has("pixelart")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selection rect — position: fixed so it renders correctly regardless of drag start point */}
        {selRect && selRect.w > 4 && selRect.h > 4 && (
          <div
            style={{
              position: "fixed",
              left: selRect.x,
              top: selRect.y,
              width: selRect.w,
              height: selRect.h,
              border: `2px solid ${GUIDE_COLOR}`,
              background: `${GUIDE_COLOR}12`,
              borderRadius: 4,
              pointerEvents: "none",
              zIndex: 9999,
            }}
          />
        )}

        {/* Copy / status button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          {isSelectable && (
            <button
              onClick={() => {
                if (selected.size >= PATH_BLOCK_IDS.length) onPathStateChange("copied");
              }}
              disabled={selected.size < PATH_BLOCK_IDS.length}
              style={{
                padding: "6px 18px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                cursor: selected.size >= PATH_BLOCK_IDS.length ? "pointer" : "not-allowed",
                background: selected.size >= PATH_BLOCK_IDS.length ? SCENE_COLOR : "#f1f5f9",
                color: selected.size >= PATH_BLOCK_IDS.length ? "white" : "#94a3b8",
                border: "none",
                boxShadow:
                  selected.size >= PATH_BLOCK_IDS.length ? `0 2px 8px ${SCENE_COLOR}45` : "none",
                transition: "all 0.2s",
              }}
            >
              {selected.size >= PATH_BLOCK_IDS.length
                ? `Copy ${selected.size} selected blocks`
                : "Select all blocks first"}
            </button>
          )}
          {(pathState === "copied" || isPlaced) && (
            <span
              ref={copyStatusRef}
              style={{
                fontSize: 10,
                color: SCENE_COLOR,
                fontWeight: 700,
                padding: "5px 14px",
                borderRadius: 999,
                background: `${SCENE_COLOR}12`,
                border: `1px solid ${SCENE_COLOR}30`,
              }}
            >
              ✓ {selected.size} blocks copied — click after Dancer to paste
            </span>
          )}
        </div>
      </div>

      {/* Separator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "60%",
          alignSelf: "center",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        <span style={{ fontSize: 10, color: "#94a3b8" }}>New Branch</span>
        <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
      </div>

      {/* New Dancer branch */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, zoom: 0.75 }}>
        <CollapsedBlock
          property="Character Entity"
          direction="Dancer"
          typicality={4}
          suggestions={DANCER_CHIPS}
        />
        {!isPlaced && (
          <>
            <div
              style={{
                width: 14,
                height: 2,
                background: pathState === "copied" ? `${SCENE_COLOR}60` : "#d1d5db",
                flexShrink: 0,
                transition: "background 0.3s",
              }}
            />
            <div
              ref={pasteAreaRef}
              onClick={
                pathState === "copied" ? () => onPathStateChange("paste-choosing") : undefined
              }
              style={{
                width: 150,
                height: 90,
                borderRadius: 10,
                border: `2px dashed ${pathState === "copied" ? SCENE_COLOR + "70" : "#d1d5db"}`,
                background: pathState === "copied" ? `${SCENE_COLOR}05` : "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.3s",
                cursor: pathState === "copied" ? "pointer" : "default",
              }}
            >
              <span
                style={{
                  fontSize: 9.5,
                  color: pathState === "copied" ? SCENE_COLOR : "#94a3b8",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                {pathState === "copied" ? "Click here to paste" : "Copy path first"}
              </span>
            </div>
          </>
        )}
        {isPlaced &&
          (() => {
            const [sceneBlock, ...styleBlocks] = placedBlocks;
            return (
              <>
                <ChainLink />
                <div style={{ animation: "block-in 0.4s ease 0s both" }}>
                  <CollapsedBlock
                    property={sceneBlock.property}
                    direction={sceneBlock.direction}
                    typicality={sceneBlock.typicality}
                    suggestions={sceneBlock.chips}
                    animateIn
                  />
                </div>
                <BranchLinks />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {styleBlocks.map((block, i) => (
                    <CollapsedBlock
                      key={i}
                      property={block.property}
                      direction={block.direction}
                      typicality={block.typicality}
                      suggestions={block.chips}
                      animateIn
                    />
                  ))}
                </div>
              </>
            );
          })()}
      </div>

      {isChoosing && (
        <PathChoiceModal onChoose={(t) => onPathStateChange(`placed-${t}` as PathState)} />
      )}

      {/* Click-hint cursor + ripple overlay (position:fixed, viewport-relative) */}
      {showClickAnim && clickAnimPosRef.current && (
        <>
          {/* Ripple ring expanding from cursor tip */}
          {rippleActive && (
            <div
              style={{
                position: "fixed",
                left: clickCursorX - rippleSize / 2,
                top: clickCursorY - rippleSize / 2,
                width: rippleSize,
                height: rippleSize,
                borderRadius: "50%",
                border: `2px solid ${GUIDE_COLOR}`,
                pointerEvents: "none",
                zIndex: 9997,
                opacity: rippleOpacity,
              }}
            />
          )}
          {/* Cursor */}
          <div
            style={{
              position: "fixed",
              left: clickCursorX,
              top: clickCursorY,
              transform: `scale(${clickCursorScale})`,
              transformOrigin: "0 0",
              pointerEvents: "none",
              zIndex: 9998,
              opacity: clickOpacity,
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: `drop-shadow(0px 2px 6px ${GUIDE_COLOR}90)` }}
            >
              <defs>
                <clipPath id="cursor-clip-2">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(6.99382e-07 16) rotate(-90)"
                  />
                </clipPath>
              </defs>
              <g clipPath="url(#cursor-clip-2)">
                <path
                  d="M2.182 1.918C2.25353 1.84652 2.34506 1.7984 2.44451 1.78002C2.54395 1.76163 2.64663 1.77382 2.739 1.815L15.467 7.472C15.556 7.51152 15.6316 7.57619 15.6843 7.65805C15.7371 7.73991 15.7648 7.8354 15.7641 7.93279C15.7633 8.03019 15.7342 8.12524 15.6801 8.20629C15.6261 8.28733 15.5496 8.35084 15.46 8.389L10.694 10.43L8.652 15.197C8.6136 15.2863 8.55002 15.3624 8.46902 15.4161C8.38803 15.4698 8.29314 15.4988 8.19596 15.4994C8.09878 15.5001 8.00352 15.4724 7.92183 15.4197C7.84014 15.3671 7.77557 15.2918 7.736 15.203L2.079 2.475C2.03805 2.38276 2.02597 2.28028 2.04435 2.18104C2.06274 2.0818 2.11072 1.98945 2.182 1.918Z"
                  fill={GUIDE_COLOR}
                />
              </g>
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

// ── Project-level demo ────────────────────────────────────────────────────────

function ProjectGraphCard({
  title,
  rows,
  isSource,
  shown,
  importState,
}: {
  title: string;
  rows: GraphRow[];
  isSource?: boolean;
  shown: boolean;
  importState: ImportState;
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: "1.5px solid #e2e8f0",
        background: "white",
        boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {isSource && (
          <span
            style={{
              fontSize: 8,
              fontWeight: 700,
              color: "white",
              background: "#94a3b8",
              borderRadius: 999,
              padding: "1px 7px",
              flexShrink: 0,
            }}
          >
            source
          </span>
        )}
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#1e293b" }}>{title}</span>
      </div>
      {!shown ? (
        <div
          style={{
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: 0.35,
          }}
        >
          <div style={{ fontSize: 22 }}>📋</div>
          <span style={{ fontSize: 9.5, color: "#94a3b8", textAlign: "center", lineHeight: 1.4 }}>
            Import a project
            <br />
            to see it here
          </span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 0.3s ease ${i * 0.15}s, transform 0.3s ease ${i * 0.15}s`,
              }}
            >
              <GraphRowViz root={row.root} branches={row.branches} />
            </div>
          ))}
          {importState === "adaptive" && !isSource && (
            <div style={{ fontSize: 9, color: "#94a3b8", fontStyle: "italic", marginTop: 2 }}>
              ✦ Highlighted blocks are adapted to new context
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectLevelCanvas({
  importState,
  onImport,
}: {
  importState: ImportState;
  onImport: (s: ImportState) => void;
}) {
  const targetRows = importState === "adaptive" ? KIDS_ADAPTIVE_GRAPH : MUSIC_GRAPH;

  const btnStyle = (active: boolean) => ({
    padding: "7px 14px",
    borderRadius: 999,
    fontSize: 10.5,
    fontWeight: 600,
    cursor: "pointer" as const,
    background: active ? "#1e293b" : "white",
    color: active ? "white" : "#334155",
    border: `1.5px solid ${active ? "#1e293b" : "#e2e8f0"}`,
    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  });

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 18, zoom: 0.85 }}>
      <ProjectGraphCard
        title="Urban Music Festival Mascot"
        rows={MUSIC_GRAPH}
        isSource
        shown
        importState={importState}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
          paddingTop: 46,
        }}
      >
        <button onClick={() => onImport("literal")} style={btnStyle(importState === "literal")}>
          Literal Import
        </button>
        <div style={{ fontSize: 22, color: "#cbd5e1" }}>→</div>
        <button onClick={() => onImport("adaptive")} style={btnStyle(importState === "adaptive")}>
          Adaptive Import
        </button>
      </div>

      <ProjectGraphCard
        title="Kids Coding Platform Mascot"
        rows={targetRows}
        shown={importState !== "idle"}
        importState={importState}
      />
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function ReuseBlockDemo() {
  const [subTab, setSubTab] = useState<SubTab>("block");
  const [dragState, setDragState] = useState<DragState>("idle");
  const [pathState, setPathState] = useState<PathState>("idle");
  const [importState, setImportState] = useState<ImportState>("idle");
  const [tooltip, setTooltip] = useState<TooltipInfo>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragGuideRafRef = useRef<number | null>(null);
  const dragGuideStartRef = useRef<number>(0);
  const [dragGuideT, setDragGuideT] = useState(0);
  // Position stored in ref — updated every animation frame so layout changes are reflected immediately
  const dragGuidePosRef = useRef<{ sx: number; sy: number; ex: number; ey: number } | null>(null);

  const handleTabChange = (t: SubTab) => {
    setSubTab(t);
    if (t === "block") setDragState("idle");
    if (t === "path") setPathState("idle");
    if (t === "project") setImportState("idle");
  };

  const showDragGuide = subTab === "block" && dragState === "idle";

  useEffect(() => {
    if (!showDragGuide) {
      if (dragGuideRafRef.current) cancelAnimationFrame(dragGuideRafRef.current);
      dragGuidePosRef.current = null;
      return;
    }

    dragGuideStartRef.current = performance.now();

    const measurePos = () => {
      const container = containerRef.current;
      if (!container) return;
      const nodeEl = container.querySelector("[data-guide-node]");
      const dropEl = container.querySelector("[data-guide-drop-zone]");
      if (!nodeEl || !dropEl) return;
      const nr = nodeEl.getBoundingClientRect();
      const dr = dropEl.getBoundingClientRect();
      dragGuidePosRef.current = {
        sx: nr.left + nr.width / 2,
        sy: nr.top + nr.height / 2,
        ex: dr.left + dr.width / 2,
        ey: dr.top + dr.height / 2,
      };
    };

    const tick = (now: number) => {
      // Re-measure every frame — free from resize/scroll listeners, always in sync
      measurePos();
      setDragGuideT((now - dragGuideStartRef.current) % DRAG_GUIDE_LOOP);
      dragGuideRafRef.current = requestAnimationFrame(tick);
    };
    dragGuideRafRef.current = requestAnimationFrame(tick);

    return () => {
      if (dragGuideRafRef.current) cancelAnimationFrame(dragGuideRafRef.current);
    };
  }, [showDragGuide]);

  // Drag guide computed values
  const dgT1 = DRAG_GUIDE_DELAY;
  const dgT2 = dgT1 + DRAG_GUIDE_FADEIN;
  const dgT3 = dgT2 + DRAG_GUIDE_MOVE;
  const dgT4 = dgT3 + DRAG_GUIDE_HOLD;
  const dgT5 = dgT4 + DRAG_GUIDE_FADEOUT;

  const dgOpacity =
    dragGuideT < dgT1
      ? 0
      : dragGuideT < dgT2
        ? (dragGuideT - dgT1) / DRAG_GUIDE_FADEIN
        : dragGuideT < dgT3
          ? 1
          : dragGuideT < dgT4
            ? 1
            : dragGuideT < dgT5
              ? 1 - (dragGuideT - dgT4) / DRAG_GUIDE_FADEOUT
              : 0;

  const dgMoveRaw =
    dragGuideT < dgT2 ? 0 : dragGuideT < dgT3 ? (dragGuideT - dgT2) / DRAG_GUIDE_MOVE : 1;
  const dgMove = guideEase(Math.min(dgMoveRaw, 1));

  const pos = dragGuidePosRef.current;
  const dgCursorX = pos ? pos.sx + (pos.ex - pos.sx) * dgMove : 0;
  const dgCursorY = pos ? pos.sy + (pos.ey - pos.sy) * dgMove : 0;

  const sidebar =
    subTab === "block" ? (
      <BlockLibrarySidebar
        historyByProperty={REUSE_HISTORY}
        properties={Object.keys(REUSE_HISTORY)}
        draggableConfig={{
          property: "Scene",
          dir: "City Night",
          used: dragState !== "idle",
          onDragStart: () => setDragState("over"),
        }}
        onNodeHover={(dir, rect, property) => {
          if (dir && rect)
            setTooltip({ dir, rect, property, typicality: NODE_TYPICALITY[property]?.[dir] ?? 1 });
          else setTooltip(null);
        }}
      />
    ) : undefined;

  const canvasDrag = useDragScroll();

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: 20,
        border: "1.5px solid #e2e8f0",
        background: "white",
        boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
        overflow: "hidden",
      }}
    >
      <style>{`@keyframes history-node-pulse { 0%,100%{opacity:.8} 50%{opacity:.2} }`}</style>

      <div style={{ display: "flex" }}>
        {sidebar}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            minHeight: 440,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Sub-tabs */}
          <div
            style={{
              padding: "14px 20px 0",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(4px)",
            }}
          >
            <ReuseSubTabs active={subTab} onChange={handleTabChange} />
          </div>
          {/* Canvas */}
          <div
            ref={canvasDrag.ref}
            onMouseDown={canvasDrag.onMouseDown}
            onMouseMove={canvasDrag.onMouseMove}
            onMouseUp={canvasDrag.onMouseUp}
            onMouseLeave={canvasDrag.onMouseLeave}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 32px 28px",
              overflowX: "auto",
              overflowY: "hidden",
            }}
          >
            {subTab === "block" && (
              <BlockLevelCanvas
                dragState={dragState}
                onDrop={() => setDragState("choosing")}
                onChoose={(t) => setDragState(`placed-${t}` as DragState)}
              />
            )}
            {subTab === "path" && (
              <PathLevelCanvas pathState={pathState} onPathStateChange={setPathState} />
            )}
            {subTab === "project" && (
              <ProjectLevelCanvas importState={importState} onImport={setImportState} />
            )}
          </div>
        </div>
      </div>
      {tooltip && <NodeTooltip info={tooltip} />}

      {/* Drag guide overlay */}
      {showDragGuide && dragGuidePosRef.current && (
        <div
          style={{
            position: "fixed",
            left: dgCursorX - 4,
            top: dgCursorY - 4,
            pointerEvents: "none",
            zIndex: 9999,
            opacity: dgOpacity,
            transform: "translate(0,0)",
          }}
        >
          {/* Drag ghost label */}
          <div
            style={{
              position: "absolute",
              left: 20,
              top: -6,
              background: GUIDE_COLOR,
              color: "white",
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              boxShadow: `0 2px 8px ${GUIDE_COLOR}55`,
              opacity: dgMoveRaw > 0.05 ? 1 : 0,
              transition: "opacity 0.15s",
            }}
          >
            City Night
          </div>
          {/* Cursor SVG */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 16 16"
            fill="none"
            style={{ filter: `drop-shadow(0px 2px 6px ${GUIDE_COLOR}90)` }}
          >
            <defs>
              <clipPath id="cursor-clip-drag">
                <rect
                  width="16"
                  height="16"
                  fill="white"
                  transform="translate(6.99382e-07 16) rotate(-90)"
                />
              </clipPath>
            </defs>
            <g clipPath="url(#cursor-clip-drag)">
              <path
                d="M2.182 1.918C2.25353 1.84652 2.34649 1.79798 2.44754 1.77966C2.54859 1.76134 2.65283 1.77411 2.74648 1.81626L13.5465 6.81626C13.6435 6.86073 13.7247 6.93378 13.7796 7.02576C13.8344 7.11775 13.8602 7.22427 13.8535 7.33115C13.8468 7.43803 13.8079 7.54039 13.7421 7.62467C13.6763 7.70895 13.5866 7.77116 13.4848 7.80296L8.69277 9.29826L7.19747 14.0903C7.16527 14.192 7.10275 14.2815 7.01829 14.3469C6.93383 14.4123 6.83137 14.4508 6.72447 14.4572C6.61758 14.4636 6.51117 14.4374 6.41936 14.3822C6.32754 14.327 6.25466 14.2453 6.21047 14.148L1.21047 3.34796C1.16866 3.25422 1.15621 3.14993 1.17474 3.04893C1.19326 2.94793 1.24191 2.85508 1.31347 2.78296L2.182 1.918Z"
                fill={GUIDE_COLOR}
              />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
