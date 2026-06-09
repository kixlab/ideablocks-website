"use client";

import { useState, useEffect, useRef, type ReactNode, type Ref } from "react";

// ── Manifest ──────────────────────────────────────────────────────────────────

export const MANIFEST: Record<string, Record<string, Record<string, { text: string }[]>>> = {
  "Character Entity": {
    "Street Musician": {
      "1": [
        { text: "R&B street musician" },
        { text: "Guitar busker" },
        { text: "Modern street musician" },
        { text: "Hoodie street musician" },
      ],
      "2": [
        { text: "Bass guitar busker" },
        { text: "String street artist" },
        { text: "Violin busker" },
        { text: "Sidewalk singer" },
      ],
      "3": [
        { text: "Colorful scarf musician" },
        { text: "Busking on steps" },
        { text: "Hat wearing busker" },
        { text: "Steel-string guitarist" },
      ],
      "4": [
        { text: "Pocket trumpet player" },
        { text: "Cozy guitarist" },
        { text: "Cajon playing busker" },
        { text: "Subway platform musician" },
      ],
      "5": [
        { text: "Mime street performer" },
        { text: "Fire juggler busker" },
        { text: "Living statue act" },
        { text: "Balloon sculptor artist" },
      ],
    },
    Dancer: {
      "1": [
        { text: "Ballet dancer on stage" },
        { text: "Contemporary stage dancer" },
        { text: "Ballroom dance couple" },
        { text: "Folk dancer in costume" },
      ],
      "2": [
        { text: "Jazz dancer" },
        { text: "Hip-hop dancer" },
        { text: "Flamenco dancer" },
        { text: "Tap dancer" },
      ],
      "3": [
        { text: "Breakdancer" },
        { text: "Aerial silk dancer" },
        { text: "Dance battle" },
        { text: "Capoeira performer" },
      ],
      "4": [
        { text: "Butoh performer" },
        { text: "Body paint dancer" },
        { text: "Ritual movement dancer" },
        { text: "Sand dancer" },
      ],
      "5": [
        { text: "Robot dancer" },
        { text: "Hologram dancer" },
        { text: "Fire dancer" },
        { text: "Underwater dancer" },
      ],
    },
    Astronaut: {
      "1": [
        { text: "Rocket scientist" },
        { text: "Astro artist" },
        { text: "Astronaut kid" },
        { text: "Space pilot" },
      ],
      "2": [
        { text: "Lunar mentor" },
        { text: "Meteor artist" },
        { text: "Starship steward" },
        { text: "Cosmic scout" },
      ],
      "3": [
        { text: "Gravity pilot" },
        { text: "Cosmic child" },
        { text: "Orb explorer" },
        { text: "Galaxy kid" },
      ],
      "4": [
        { text: "Sun scout" },
        { text: "Comms specialist" },
        { text: "Rocket painter" },
        { text: "Nebula DJ" },
      ],
      "5": [
        { text: "Red panda hero" },
        { text: "Forest sprite" },
        { text: "Laser librarian" },
        { text: "Wizard guide" },
      ],
    },
    Samurai: {
      "1": [
        { text: "Quiet watch samurai" },
        { text: "Silver blade samurai" },
        { text: "Dawn lit samurai" },
        { text: "Sky spear samurai" },
      ],
      "2": [
        { text: "Silk glove samurai" },
        { text: "Sea wind samurai" },
        { text: "Pearl shield samurai" },
        { text: "Forest stride samurai" },
      ],
      "3": [
        { text: "Night wind samurai" },
        { text: "Bronze helm samurai" },
        { text: "Sakura dawn samurai" },
        { text: "Ember cloak samurai" },
      ],
      "4": [
        { text: "Lantern glow samurai" },
        { text: "Glacier blade samurai" },
        { text: "Jade koi samurai" },
        { text: "Watchful sword master" },
      ],
      "5": [
        { text: "Desert nomad" },
        { text: "Sky painter" },
        { text: "Silent monk" },
        { text: "Silver fox" },
      ],
    },
  },
  Scene: {
    "Starry Night": {
      "1": [
        { text: "Van Gogh swirling night sky" },
        { text: "Hilltop under constellations" },
        { text: "Moonlit ocean reflection" },
        { text: "Night village with glowing stars" },
      ],
      "2": [
        { text: "Telescope at observatory dusk" },
        { text: "Silhouette bridge at midnight" },
        { text: "Rooftop skyline under cosmos" },
        { text: "Moonlit sand dunes at night" },
      ],
      "3": [
        { text: "Windmill field under night sky" },
        { text: "Cliffside watch at nightfall" },
        { text: "Forest trail lit by moonlight" },
        { text: "River bridge in evening glow" },
      ],
      "4": [
        { text: "Owls under stars" },
        { text: "Starry temple courtyard" },
        { text: "Crescent moon stars" },
        { text: "Starfield over plains" },
      ],
      "5": [
        { text: "Minimalist skyline" },
        { text: "Floating shapes" },
        { text: "Pastel horizon" },
        { text: "Neon gradient wash" },
      ],
    },
    "City Night": {
      "1": [
        { text: "City skyline at night" },
        { text: "Neon-lit boulevard" },
        { text: "City waterfront at night" },
        { text: "Busy city intersection at night" },
      ],
      "2": [
        { text: "Rain-soaked city street at night" },
        { text: "Late night subway station" },
        { text: "Rooftop cityscape at midnight" },
        { text: "Foggy city alley at night" },
      ],
      "3": [
        { text: "Night market alley" },
        { text: "Empty plaza at 3am" },
        { text: "City overpass glow" },
        { text: "Jazz district street at night" },
      ],
      "4": [
        { text: "Long exposure light trails" },
        { text: "Monochrome city night" },
        { text: "Neon geometry abstraction" },
        { text: "City silhouette" },
      ],
      "5": [
        { text: "Ghost city at night" },
        { text: "Floating city dream" },
        { text: "Bioluminescent cityscape" },
        { text: "Mirror city reflection" },
      ],
    },
    "Cyberpunk City": {
      "1": [
        { text: "Byte-lit skyline" },
        { text: "Neon alley cats" },
        { text: "Cyber hawker towers" },
        { text: "Neon fog street" },
      ],
      "2": [
        { text: "Rain-soaked market stalls" },
        { text: "Glass dome corporate skyline" },
        { text: "Underground hacker den" },
        { text: "Hologram street vendor" },
      ],
      "3": [
        { text: "Bioluminescent alley walls" },
        { text: "Corporate drone swarm overhead" },
        { text: "Augmented reality billboard" },
        { text: "Crowded monorail platform" },
      ],
      "4": [
        { text: "Neon lanterns drift" },
        { text: "Subterranean tunnel glow" },
        { text: "Starry night sky" },
        { text: "Crystal rain reflections" },
      ],
      "5": [
        { text: "Sunrise over hills" },
        { text: "Vapor trails glow" },
        { text: "Ocean cliff edge" },
        { text: "Steel vines climb" },
      ],
    },
    "Enchanted Forest": {
      "1": [
        { text: "Fairy gate" },
        { text: "Misty glade" },
        { text: "Enchanted altar" },
        { text: "Forest portal" },
      ],
      "2": [
        { text: "Glowing fireflies" },
        { text: "Moonlit fern" },
        { text: "Emerald stream" },
        { text: "Dream dew" },
      ],
      "3": [
        { text: "Luminous ferns" },
        { text: "Glow mushrooms" },
        { text: "Crystal dragonfly" },
        { text: "Velvet foxfire" },
      ],
      "4": [
        { text: "Wisp path" },
        { text: "Velvet dusk" },
        { text: "Star lanterns" },
        { text: "Mossy arch" },
      ],
      "5": [
        { text: "Light bokeh" },
        { text: "Minimal linework" },
        { text: "Hollow stump" },
        { text: "Monochrome mood" },
      ],
    },
  },
};

export const PROPERTY_COLORS: Record<string, string> = {
  "Character Entity": "#3f6093",
  Scene: "#7B5EA7",
  Style: "#0F766E",
};

/** Blue accent for in-demo guide copy and hints */
export const GUIDE_COLOR = "#1D6FEB";

// Style is an image-type property — options are images, not text
export const STYLE_MANIFEST: Record<string, Record<string, { image: string }[]>> = {
  Watercolor: {
    "1": [
      { image: "style/watercolor/level_1/cluster_0.png" },
      { image: "style/watercolor/level_1/cluster_1.png" },
      { image: "style/watercolor/level_1/cluster_2.png" },
      { image: "style/watercolor/level_1/cluster_3.png" },
    ],
    "2": [
      { image: "style/watercolor/level_2/cluster_0.png" },
      { image: "style/watercolor/level_2/cluster_1.png" },
      { image: "style/watercolor/level_2/cluster_2.png" },
      { image: "style/watercolor/level_2/cluster_3.png" },
    ],
    "3": [
      { image: "style/watercolor/level_3/cluster_0.png" },
      { image: "style/watercolor/level_3/cluster_1.png" },
      { image: "style/watercolor/level_3/cluster_2.png" },
      { image: "style/watercolor/level_3/cluster_3.png" },
    ],
    "4": [
      { image: "style/watercolor/level_4/cluster_0.png" },
      { image: "style/watercolor/level_4/cluster_1.png" },
      { image: "style/watercolor/level_4/cluster_2.png" },
      { image: "style/watercolor/level_4/cluster_3.png" },
    ],
    "5": [
      { image: "style/watercolor/level_5/cluster_0.png" },
      { image: "style/watercolor/level_5/cluster_1.png" },
      { image: "style/watercolor/level_5/cluster_2.png" },
      { image: "style/watercolor/level_5/cluster_3.png" },
    ],
  },
  "Pixel Art": {
    "1": [
      { image: "style/pixel_art/level_1/cluster_0.png" },
      { image: "style/pixel_art/level_1/cluster_1.png" },
      { image: "style/pixel_art/level_1/cluster_2.png" },
      { image: "style/pixel_art/level_1/cluster_3.png" },
    ],
    "2": [
      { image: "style/pixel_art/level_2/cluster_0.png" },
      { image: "style/pixel_art/level_2/cluster_1.png" },
      { image: "style/pixel_art/level_2/cluster_2.png" },
      { image: "style/pixel_art/level_2/cluster_3.png" },
    ],
    "3": [
      { image: "style/pixel_art/level_3/cluster_0.png" },
      { image: "style/pixel_art/level_3/cluster_1.png" },
      { image: "style/pixel_art/level_3/cluster_2.png" },
      { image: "style/pixel_art/level_3/cluster_3.png" },
    ],
    "4": [
      { image: "style/pixel_art/level_4/cluster_0.png" },
      { image: "style/pixel_art/level_4/cluster_1.png" },
      { image: "style/pixel_art/level_4/cluster_2.png" },
      { image: "style/pixel_art/level_4/cluster_3.png" },
    ],
    "5": [
      { image: "style/pixel_art/level_5/cluster_0.png" },
      { image: "style/pixel_art/level_5/cluster_1.png" },
      { image: "style/pixel_art/level_5/cluster_2.png" },
      { image: "style/pixel_art/level_5/cluster_3.png" },
    ],
  },
};

export const TYPICALITY_LABELS = [
  "Highly Typical",
  "Typical",
  "Unusual",
  "Atypical",
  "Highly Atypical",
];

export const SEMANTIC_SIBLINGS: Record<string, [string, string][]> = {
  "Character Entity": [["Street Musician", "Dancer"]],
  Scene: [["Starry Night", "City Night"]],
};

export function slugify(t: string) {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/, "");
}

export function imgSrc(property: string, direction: string, level: number, cluster: number) {
  return `/demo_output/${slugify(property)}/${slugify(direction)}/level_${level}/cluster_${cluster}.png`;
}

export function styleImgSrc(direction: string, level: number, cluster: number) {
  return `/demo_output/style/${slugify(direction)}/level_${level}/cluster_${cluster}.png`;
}

export function chainedStyleImgSrc(direction: string, level: number, cluster: number) {
  return `/demo_output/chained/style/${slugify(direction)}/level_${level}/cluster_${cluster}.png`;
}

// ── Direction input ───────────────────────────────────────────────────────────

export function DirectionInput({
  property,
  direction,
  color,
  onChange,
  onStartTyping,
  onDirectionTried,
}: {
  property: string;
  direction: string;
  color: string;
  onChange: (d: string) => void;
  onStartTyping: () => void;
  onDirectionTried: (d: string) => void;
}) {
  const directions = Object.keys(MANIFEST[property]);
  const [displayed, setDisplayed] = useState(direction);
  const [typing, setTyping] = useState(false);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!typing) setDisplayed(direction);
  }, [direction, typing]);

  const handleSelect = (d: string) => {
    if (typing || d === direction) return;
    onDirectionTried(d);
    if (typingRef.current) clearInterval(typingRef.current);
    onStartTyping();
    setTyping(true);
    setDisplayed("");
    let i = 0;
    typingRef.current = setInterval(() => {
      i++;
      setDisplayed(d.slice(0, i));
      if (i >= d.length) {
        clearInterval(typingRef.current!);
        setTyping(false);
        onChange(d);
      }
    }, 38);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div
        style={{
          borderRadius: 10,
          border: "1px solid rgba(27,115,231,0.4)",
          backgroundColor: "white",
          boxShadow: "0px 0px 20px 2px rgba(0,0,0,0.06)",
          padding: "7px 10px",
          fontSize: 12,
          minHeight: 34,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ color: displayed ? "#1e293b" : "#94a3b8", flex: 1 }}>
          {displayed || "Type here"}
          {typing && (
            <span
              style={{
                display: "inline-block",
                width: 1.5,
                height: 12,
                background: "#1b73e7",
                borderRadius: 1,
                marginLeft: 1,
                verticalAlign: "middle",
                animation: "caret-blink 0.8s step-end infinite",
              }}
            />
          )}
        </span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap" }}>Try:</span>
        {directions.map((d) => (
          <button
            key={d}
            onClick={() => handleSelect(d)}
            disabled={typing}
            style={{
              padding: "3px 10px",
              borderRadius: 999,
              fontSize: 11,
              cursor: typing ? "default" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              transition: "all 0.15s",
              background: d === direction ? `${color}18` : "white",
              color: d === direction ? color : "#64748b",
              border: `1px solid ${d === direction ? `${color}50` : "#e2e8f0"}`,
              fontWeight: d === direction ? 600 : 400,
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Typicality slider ─────────────────────────────────────────────────────────

export function TypicalitySlider({
  value,
  chosen,
  onChange,
  color,
}: {
  value: number;
  chosen: boolean;
  onChange: (v: number) => void;
  color: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const getValueFromX = (clientX: number) => {
    if (!trackRef.current) return 1;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(pct * 4) + 1;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    setIsDragging(true);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    onChange(getValueFromX(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    onChange(getValueFromX(e.clientX));
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
    setIsDragging(false);
  };

  const thumbPct = `${(value - 1) * 25}%`;
  const fillPct = `${(value - 1) * 25}%`;
  const eased = !isDragging ? "0.15s ease" : "none";

  return (
    <div
      style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, padding: "0 8px" }}
    >
      <div
        ref={trackRef}
        style={{ position: "relative", height: 24, cursor: isDragging ? "grabbing" : "pointer" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 4,
            transform: "translateY(-50%)",
            borderRadius: 2,
            background: "#e2e8f0",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: chosen ? fillPct : 0,
            height: 4,
            transform: "translateY(-50%)",
            borderRadius: 2,
            background: chosen ? color : "transparent",
            transition: `width ${eased}, background 0.15s`,
            pointerEvents: "none",
          }}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${i * 25}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: chosen && i + 1 <= value ? color : "#d1d5db",
              transition: `background ${eased}`,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: chosen ? thumbPct : "0%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "white",
            border: `2.5px solid ${chosen ? color : "#d1d5db"}`,
            boxShadow: chosen
              ? `0 2px 8px ${color}50, 0 1px 4px rgba(0,0,0,0.1)`
              : "0 1px 3px rgba(0,0,0,0.12)",
            transition: `left ${eased}, border-color 0.15s, box-shadow 0.15s`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#cbd5e1" }}
      >
        <span>Typical</span>
        <span>Atypical</span>
      </div>
    </div>
  );
}

// ── Block node ────────────────────────────────────────────────────────────────

export function BlockNode({
  property,
  direction,
  typicality,
  directionChosen,
  typicalityChosen,
  isCollapsed = false,
  locked = false,
  chips = [],
  selectedChipIndex = null,
  selected = false,
  isPasteTarget = false,
  animateIn = false,
  onSelect,
  onDirectionChange,
  onTypicalityChange,
  onStartTyping,
  onDirectionTried,
  onExplore,
  onExpandClick,
  onChipSelect,
}: {
  property: string;
  direction: string;
  typicality: number;
  directionChosen: boolean;
  typicalityChosen: boolean;
  isCollapsed?: boolean;
  locked?: boolean;
  chips?: string[];
  selectedChipIndex?: number | null;
  selected?: boolean;
  isPasteTarget?: boolean;
  animateIn?: boolean;
  onSelect?: () => void;
  onDirectionChange: (d: string) => void;
  onTypicalityChange: (t: number) => void;
  onStartTyping: () => void;
  onDirectionTried: (d: string) => void;
  onExplore?: () => void;
  onExpandClick?: () => void;
  onChipSelect?: (i: number) => void;
}) {
  const color = PROPERTY_COLORS[property];
  const canExplore = directionChosen && typicalityChosen;
  const typLabel = TYPICALITY_LABELS[typicality - 1];

  return (
    <div
      onClick={onSelect}
      style={{
        width: 268,
        padding: 12,
        borderRadius: 12,
        background: "#f7f7f7",
        border: selected
          ? `2px dashed ${color}`
          : isPasteTarget
            ? `2px dashed ${color}70`
            : "2px solid rgba(0,0,0,0.08)",
        boxShadow: selected
          ? `0 0 0 3px ${color}20, 0 4px 24px rgba(0,0,0,0.08)`
          : "0 4px 24px rgba(0,0,0,0.08)",
        flexShrink: 0,
        overflow: "hidden",
        cursor: onSelect ? "pointer" : undefined,
        animation: animateIn ? "block-in 0.35s ease" : undefined,
        transition: "border 0.2s, box-shadow 0.2s",
        position: "relative",
      }}
    >
      {selected && (
        <div
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 18,
            height: 18,
            borderRadius: 999,
            background: color,
            color: "white",
            fontSize: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            zIndex: 1,
          }}
        >
          ✓
        </div>
      )}
      {isPasteTarget && !selected && (
        <div style={{ position: "absolute", top: -8, right: -8, fontSize: 14, zIndex: 1 }}>📋</div>
      )}
      {/* Property badge — always visible */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            color: "white",
            fontWeight: 600,
            borderRadius: 999,
            fontSize: 12,
            padding: "4px 16px",
            backgroundColor: color,
          }}
        >
          {property}
        </div>
      </div>

      {/* ── Step 1: full parameter form ── */}
      {!isCollapsed && (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div className="w-full flex flex-col gap-2">
            <p className="w-full" style={{ fontSize: 12, color: "#64748b" }}>
              What kind of <strong>{property}</strong> do you want?
            </p>
            <DirectionInput
              property={property}
              direction={direction}
              color={color}
              onChange={onDirectionChange}
              onStartTyping={onStartTyping}
              onDirectionTried={onDirectionTried}
            />
          </div>

          <div style={{ width: "100%", height: 1, background: "rgba(0,0,0,0.07)" }} />

          <div
            className="w-full flex flex-col gap-2"
            style={{
              opacity: directionChosen ? 1 : 0.35,
              transition: "opacity 0.3s",
              pointerEvents: directionChosen ? "auto" : "none",
            }}
          >
            <p style={{ fontSize: 12, color: "#64748b" }}>How typical should results be?</p>
            <TypicalitySlider
              value={typicality}
              chosen={typicalityChosen}
              onChange={onTypicalityChange}
              color={color}
            />
          </div>

          {/* Explore button — only renders when ready, so block height wraps */}
          {canExplore && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                animation: "step2-in 0.25s ease",
              }}
            >
              <button
                onClick={onExplore}
                style={{
                  padding: "4px 16px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: color,
                  color: "white",
                  border: "none",
                  boxShadow: `0 2px 8px ${color}45`,
                  transition: "opacity 0.15s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                Explore →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: compact summary + 2×2 chip grid ── */}
      {isCollapsed && (
        <div
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            animation: "step2-in 0.3s ease",
          }}
        >
          {/* Summary row — click to expand when not locked */}
          <div
            onClick={locked ? undefined : onExpandClick}
            style={{
              cursor: locked ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "2px 6px",
              borderRadius: 6,
              transition: "background 0.15s",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              if (!locked)
                (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.04)";
            }}
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background = "transparent")
            }
          >
            <span style={{ fontSize: 12, fontWeight: 500, color: "#1e293b" }}>{direction}</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}> / {typLabel}</span>
            {!locked && (
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            )}
          </div>

          {/* 2×2 chip grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              width: "100%",
            }}
          >
            {chips.map((chip, i) => (
              <button
                key={i}
                onClick={() => onChipSelect?.(i)}
                style={{
                  padding: "8px 6px",
                  borderRadius: 12,
                  fontSize: 11,
                  textAlign: "center",
                  cursor: "pointer",
                  lineHeight: 1.35,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 44,
                  transition: "all 0.18s",
                  background: selectedChipIndex === i ? `${color}12` : "white",
                  color: selectedChipIndex === i ? color : "#334155",
                  border: `1.5px solid ${selectedChipIndex === i ? `${color}55` : "#e2e8f0"}`,
                  fontWeight: selectedChipIndex === i ? 600 : 400,
                  boxShadow:
                    selectedChipIndex === i ? `0 2px 8px ${color}20` : "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Skeleton / image cards ────────────────────────────────────────────────────

export function SkeletonCard() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 10,
          background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }}
      />
      <div
        style={{
          width: 64,
          height: 8,
          borderRadius: 4,
          background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite 0.2s",
        }}
      />
    </div>
  );
}

export function ImageCard({
  src,
  label,
  highlighted = false,
  dimmed = false,
  highlightColor = "#3f6093",
}: {
  src: string;
  label: string;
  highlighted?: boolean;
  dimmed?: boolean;
  highlightColor?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
  }, [src]);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 10,
          overflow: "hidden",
          position: "relative",
          boxShadow: highlighted ? `0 2px 14px ${highlightColor}55` : "0 2px 10px rgba(0,0,0,0.12)",
          background: "#f1f5f9",
          outline: highlighted ? `2.5px solid ${highlightColor}` : "2.5px solid transparent",
          transform: highlighted ? "scale(1.06)" : "scale(1)",
          opacity: dimmed ? 0.4 : 1,
          transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s, outline-color 0.2s",
          zIndex: highlighted ? 1 : 0,
        }}
      >
        {!loaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.4s infinite",
            }}
          />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label}
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
      </div>
    </div>
  );
}

// ── Result node ───────────────────────────────────────────────────────────────

export function ResultNode({
  property,
  direction,
  typicality,
  loading,
  selectedIndex = null,
  connector = false,
  connectorAnimate = false,
  srcs,
}: {
  property: string;
  direction: string;
  typicality: number;
  loading: boolean;
  selectedIndex?: number | null;
  connector?: boolean;
  connectorAnimate?: boolean;
  srcs?: [string, string, string, string];
}) {
  const color = PROPERTY_COLORS[property];
  const entries = MANIFEST[property]?.[direction]?.[String(typicality)] ?? [];
  const key = `${property}|${direction}|${typicality}`;
  const node = (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 16,
        border: "2px solid rgba(188,49,234,0.35)",
        background: "#fff",
        boxShadow: "0 4px 24px rgba(188,49,234,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
      }}
    >
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div key={key} className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <ImageCard
              key={i}
              src={srcs ? srcs[i] : imgSrc(property, direction, typicality, i)}
              label={entries[i]?.text ?? ""}
              highlighted={selectedIndex === i}
              dimmed={selectedIndex !== null && selectedIndex !== i}
              highlightColor={color}
            />
          ))}
        </div>
      )}
    </div>
  );
  if (connector)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          animation: connectorAnimate ? "block-in 0.4s ease" : undefined,
        }}
      >
        <div
          style={{
            width: 30,
            height: 2,
            flexShrink: 0,
            backgroundColor: "rgba(188,49,234,0.5)",
            animation: connectorAnimate ? "step2-in 0.4s ease" : undefined,
          }}
        />
        {node}
      </div>
    );
  return node;
}

// ── Demo wrapper ──────────────────────────────────────────────────────────────

// ── Drag-to-scroll hook ───────────────────────────────────────────────────────
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const state = useRef<{ startX: number; scrollLeft: number } | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    // Don't hijack clicks on interactive elements
    const tag = (e.target as HTMLElement).tagName;
    if (["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"].includes(tag)) return;
    const el = ref.current;
    if (!el) return;
    state.current = { startX: e.clientX, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!state.current) return;
    const el = ref.current;
    if (!el) return;
    el.scrollLeft = state.current.scrollLeft - (e.clientX - state.current.startX);
  };

  const stopDrag = () => {
    state.current = null;
    const el = ref.current;
    if (!el) return;
    el.style.cursor = "";
    el.style.userSelect = "";
  };

  return { ref, onMouseDown, onMouseMove, onMouseUp: stopDrag, onMouseLeave: stopDrag };
}

export function DemoWrapper({
  sidebar,
  children,
  canvasRef: externalRef,
}: {
  sidebar?: ReactNode;
  children: ReactNode;
  canvasRef?: Ref<HTMLDivElement>;
}) {
  const drag = useDragScroll();

  // Merge drag ref with optional external ref
  const setRef = (el: HTMLDivElement | null) => {
    (drag.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    if (typeof externalRef === "function") externalRef(el);
    else if (externalRef)
      (externalRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  return (
    <div
      style={{
        borderRadius: 20,
        border: "1.5px solid #e2e8f0",
        background: "white",
        boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex" }}>
        {sidebar}
        <div
          ref={setRef}
          onMouseDown={drag.onMouseDown}
          onMouseMove={drag.onMouseMove}
          onMouseUp={drag.onMouseUp}
          onMouseLeave={drag.onMouseLeave}
          style={{
            flex: 1,
            padding: "40px 24px",
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            minHeight: 450,
            overflowX: "auto",
            overflowY: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "max-content",
              minWidth: "100%",
              minHeight: "100%",
              margin: "0 auto",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Placeholder demo ──────────────────────────────────────────────────────────

// ── Property history graph (shared / exported) ───────────────────────────────

export function PropertyHistoryGraph({
  name,
  history,
  highlightedDir,
  dimmedDir,
  onNodeHover,
  onDragStart,
  draggableDir,
}: {
  name: string;
  history: string[];
  highlightedDir?: string;
  dimmedDir?: string;
  onNodeHover?: (dir: string | null, rect: DOMRect | null) => void;
  onDragStart?: (dir: string) => void;
  draggableDir?: string;
}) {
  const color = PROPERTY_COLORS[name];
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragFromNode = useRef(false);

  if (history.length === 0) {
    return (
      <svg viewBox="0 0 148 40" style={{ width: "100%", height: 40, display: "block" }}>
        <circle cx={10} cy={20} r={4} fill="#d1d5db" />
        <text x={18} y={24} style={{ fontSize: "9px", fill: "#d1d5db", fontFamily: "inherit" }}>
          Not explored yet
        </text>
      </svg>
    );
  }

  const siblingMap = new Map<string, string>();
  for (const [a, b] of SEMANTIC_SIBLINGS[name] ?? []) {
    siblingMap.set(a, b);
    siblingMap.set(b, a);
  }

  const parentOf = new Map<string, string | null>();
  for (const dir of history) {
    const sibling = siblingMap.get(dir);
    const siblingIndex = sibling !== undefined ? history.indexOf(sibling) : -1;
    const myIndex = history.indexOf(dir);
    parentOf.set(dir, siblingIndex !== -1 && siblingIndex < myIndex ? sibling! : null);
  }

  const rootChildren = history.filter((d) => parentOf.get(d) === null);
  const svgH = Math.max(50, rootChildren.length * 30 + 14);
  const rootY = svgH / 2;

  const yOf = new Map<string, number>();
  rootChildren.forEach((d, i) => {
    const frac = rootChildren.length === 1 ? 0.5 : i / (rootChildren.length - 1);
    yOf.set(d, 14 + frac * (svgH - 28));
  });
  for (const dir of history) {
    const par = parentOf.get(dir);
    if (par !== null && par !== undefined) yOf.set(dir, yOf.get(par)!);
  }

  const xOf = (dir: string) => (parentOf.get(dir) === null ? 63 : 118);

  type Edge = { x1: number; y1: number; x2: number; y2: number };
  const edges: Edge[] = [];
  for (const dir of history) {
    const par = parentOf.get(dir);
    const x2 = xOf(dir);
    const y2 = yOf.get(dir)!;
    if (par === null) {
      edges.push({ x1: 10, y1: rootY, x2, y2 });
    } else if (par !== undefined) {
      edges.push({ x1: xOf(par), y1: yOf.get(par)!, x2, y2 });
    }
  }

  const svg = (
    <svg
      viewBox={`0 0 148 ${svgH}`}
      style={{ width: "100%", height: svgH, display: "block", overflow: "visible" }}
    >
      <style>{`@keyframes history-node-pulse { 0%,100%{opacity:.8} 50%{opacity:.2} }`}</style>
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={`${color}80`}
          strokeWidth={1.5}
        />
      ))}
      <circle cx={10} cy={rootY} r={4} fill={color} />
      {history.map((dir) => {
        const cx = xOf(dir);
        const cy = yOf.get(dir)!;
        const isHighlighted = dir === highlightedDir;
        const isDimmed = dir === dimmedDir;
        return (
          <g
            key={dir}
            data-guide-node={dir === draggableDir && onDragStart ? "true" : undefined}
            style={{
              opacity: isDimmed ? 0.3 : 1,
              transition: "opacity 0.3s",
              cursor: dir === draggableDir && onDragStart ? "grab" : undefined,
            }}
            onMouseDown={
              dir === draggableDir && onDragStart
                ? () => {
                    dragFromNode.current = true;
                    if (wrapperRef.current) {
                      wrapperRef.current.setAttribute("draggable", "true");
                    }
                  }
                : undefined
            }
            onMouseUp={
              dir === draggableDir && onDragStart
                ? () => {
                    dragFromNode.current = false;
                    if (wrapperRef.current) {
                      wrapperRef.current.removeAttribute("draggable");
                    }
                  }
                : undefined
            }
            onMouseEnter={
              onNodeHover
                ? (e) => onNodeHover(dir, (e.currentTarget as SVGGElement).getBoundingClientRect())
                : undefined
            }
            onMouseLeave={onNodeHover ? () => onNodeHover(null, null) : undefined}
          >
            {isHighlighted && (
              <circle
                cx={cx}
                cy={cy}
                r={11}
                fill={`${color}12`}
                stroke={`${color}45`}
                strokeWidth={1.5}
                style={{ animation: "history-node-pulse 2s ease-in-out infinite" }}
              />
            )}
            <circle cx={cx} cy={cy} r={5} fill={color} stroke={color} strokeWidth={1.5} />
            <text
              x={cx}
              y={cy + 13}
              textAnchor="middle"
              style={{ fontSize: "7.5px", fill: "#475569", fontFamily: "inherit" }}
            >
              {dir}
            </text>
          </g>
        );
      })}
    </svg>
  );

  return (
    <div
      ref={wrapperRef}
      onDragStart={
        onDragStart && draggableDir
          ? (e) => {
              if (!dragFromNode.current) {
                e.preventDefault();
                return;
              }
              e.dataTransfer.setData("text/plain", draggableDir);
              e.dataTransfer.effectAllowed = "copy";
              // Custom drag ghost — collapsed block card
              const ghost = document.createElement("div");
              ghost.style.cssText = `
                position:fixed;top:-1000px;left:-1000px;pointer-events:none;
                width:160px;padding:10px 12px;border-radius:12px;
                background:white;border:2px solid ${color}50;
                box-shadow:0 6px 20px rgba(0,0,0,0.15);
                display:flex;flex-direction:column;align-items:center;gap:6px;
                font-family:inherit;
              `;
              ghost.innerHTML = `
                <div style="background:${color};color:white;font-weight:600;border-radius:999px;padding:3px 14px;font-size:11px;">${name}</div>
                <div style="font-size:12px;font-weight:600;color:#1e293b;">${draggableDir}</div>
              `;
              document.body.appendChild(ghost);
              e.dataTransfer.setDragImage(ghost, 80, 30);
              setTimeout(() => document.body.removeChild(ghost), 0);
              onDragStart(draggableDir);
            }
          : undefined
      }
      onDragEnd={() => {
        dragFromNode.current = false;
        wrapperRef.current?.removeAttribute("draggable");
      }}
    >
      {svg}
    </div>
  );
}

// ── Property drag card (shared / exported) ────────────────────────────────────

export function PropertyCard({
  name,
  history,
  onHoverChange,
  onSelect,
  draggableDir,
  usedDir,
  onDragStart,
  onNodeHover,
}: {
  name: string;
  history: string[];
  onHoverChange?: (h: boolean) => void;
  onSelect?: (name: string) => void;
  draggableDir?: string;
  usedDir?: string;
  onDragStart?: (dir: string) => void;
  onNodeHover?: (dir: string | null, rect: DOMRect | null) => void;
}) {
  const color = PROPERTY_COLORS[name];
  const [hovered, setHovered] = useState(false);
  const isAvailable = !!draggableDir && draggableDir !== usedDir;
  const isUsed = !!draggableDir && draggableDir === usedDir;

  return (
    <div
      onClick={() => onSelect?.(name)}
      onMouseEnter={() => {
        setHovered(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverChange?.(false);
      }}
      style={{
        padding: "12px 10px",
        borderRadius: 10,
        background: hovered ? "white" : "#f7f7f7",
        border: `2px solid ${hovered ? `${color}40` : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered ? `0 4px 16px ${color}25` : "0 2px 8px rgba(0,0,0,0.06)",
        cursor: onSelect ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        transform: hovered && onSelect ? "scale(1.04)" : "scale(1)",
        transition: "box-shadow 0.15s, transform 0.18s, border-color 0.15s, background 0.15s",
        userSelect: "none",
      }}
    >
      <div
        style={{
          backgroundColor: color,
          color: "white",
          fontWeight: 600,
          borderRadius: 999,
          padding: "2px 12px",
          fontSize: 11,
        }}
      >
        {name}
      </div>
      <div
        style={{
          width: "100%",
          borderRadius: 8,
          background: "#f0f2f5",
          border: `1px solid ${isAvailable ? `${color}40` : "rgba(0,0,0,0.06)"}`,
          padding: "6px 6px 4px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          transition: "border-color 0.2s",
        }}
      >
        <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8" }}>
          Exploration History
        </span>
        <PropertyHistoryGraph
          name={name}
          history={history}
          highlightedDir={isAvailable ? draggableDir : undefined}
          dimmedDir={isUsed ? usedDir : undefined}
          onNodeHover={onNodeHover}
          onDragStart={isAvailable && onDragStart ? onDragStart : undefined}
          draggableDir={isAvailable ? draggableDir : undefined}
        />
      </div>
    </div>
  );
}

// ── Chain link — result node → next block node (purple line with end circles) ─

const CHAIN_COLOR = "rgba(188,49,234,0.5)";

// ── Connector size tokens ─────────────────────────────────────────────────────
// Normal (path-level full-size blocks)
const CHAIN_W  = 100;
const CHAIN_R  = 8;
const BENT_H   = 93;   // blockH/2(76.5) + branchGap/2(8) + r(8) — CollapsedBlock ≈153px, gap 16px
const STROKE   = "1.5";
// Compact (project-level NodeBlock / modal mini-graphs)
const CHAIN_W_C = 56;
const CHAIN_R_C = 5;
const BENT_H_C  = 26;  // blockH/2(17) + branchGap/2(4) + r(5)  — NodeBlock ≈34px, gap 8px
const STROKE_C  = "1";

// ── Straight connector ────────────────────────────────────────────────────────
export function ChainLink({ compact = false }: { compact?: boolean } = {}) {
  const r  = compact ? CHAIN_R_C : CHAIN_R;
  const w  = compact ? CHAIN_W_C : CHAIN_W;
  const sw = compact ? STROKE_C  : STROKE;
  const h  = r * 2 + 4;
  const cy = h / 2;
  return (
    <div style={{ flexShrink: 0, margin: `0 -${r}px`, display: "flex", alignItems: "center", position: "relative", zIndex: 1 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
        <line x1={r} y1={cy} x2={w - r} y2={cy} stroke={CHAIN_COLOR} strokeWidth={sw} />
        <circle cx={r}     cy={cy} r={r - 1} fill="white" stroke={CHAIN_COLOR} strokeWidth={sw} />
        <circle cx={w - r} cy={cy} r={r - 1} fill="white" stroke={CHAIN_COLOR} strokeWidth={sw} />
      </svg>
    </div>
  );
}

// ── Z-shaped bent connector (two bends, single arm) ───────────────────────────
// "up"  : from bottom-left → right → up → right → top-right circle
// "down": from top-left    → right → down → right → bottom-right circle
// Primary use: standalone bent connection. For branching use BranchLinks.
export function BentChainLink({ direction, compact = false }: { direction: "up" | "down"; compact?: boolean }) {
  const r  = compact ? CHAIN_R_C : CHAIN_R;
  const w  = compact ? CHAIN_W_C : CHAIN_W;
  const h  = compact ? BENT_H_C  : BENT_H;
  const sw = compact ? STROKE_C  : STROKE;
  const midX = Math.round(w / 2);
  const isUp = direction === "up";
  const startY = isUp ? h - r : r;   // source circle y (within bounds)
  const endY   = isUp ? r     : h - r; // target circle y
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" style={{ display: "block", flexShrink: 0 }}>
      <line x1={r}    y1={startY} x2={midX} y2={startY} stroke={CHAIN_COLOR} strokeWidth={sw} />
      <line x1={midX} y1={startY} x2={midX} y2={endY}   stroke={CHAIN_COLOR} strokeWidth={sw} />
      <line x1={midX} y1={endY}   x2={w - r} y2={endY}  stroke={CHAIN_COLOR} strokeWidth={sw} />
      <circle cx={r}     cy={startY} r={r - 1} fill="white" stroke={CHAIN_COLOR} strokeWidth={sw} />
      <circle cx={w - r} cy={endY}   r={r - 1} fill="white" stroke={CHAIN_COLOR} strokeWidth={sw} />
    </svg>
  );
}

// ── Branch connector (two Z-arms sharing one source circle) ───────────────────
// Replaces "two BentChainLinks stacked" — start points are EXACTLY coincident.
// SVG height = BENT_H * 2; source circle sits at midpoint (y = BENT_H).
// Up arm   → top-right circle (aligns with upper target block centre).
// Down arm → bottom-right circle (aligns with lower target block centre).
export function BranchLinks({ compact = false }: { compact?: boolean }) {
  const r     = compact ? CHAIN_R_C : CHAIN_R;
  const w     = compact ? CHAIN_W_C : CHAIN_W;
  const halfH = compact ? BENT_H_C  : BENT_H;
  const totalH = halfH * 2;
  const midX  = Math.round(w / 2);
  const sw    = compact ? STROKE_C  : STROKE;
  return (
    <div style={{ flexShrink: 0, margin: `0 -${r}px`, zIndex: 1 }}>
      <svg width={w} height={totalH} fill="none">
        {/* Shared first horizontal: source circle → midX */}
        <line x1={r}    y1={halfH} x2={midX} y2={halfH} stroke={CHAIN_COLOR} strokeWidth={sw} />
        {/* Up arm: vertical up then horizontal right */}
        <line x1={midX} y1={halfH} x2={midX} y2={r}          stroke={CHAIN_COLOR} strokeWidth={sw} />
        <line x1={midX} y1={r}     x2={w - r} y2={r}          stroke={CHAIN_COLOR} strokeWidth={sw} />
        {/* Down arm: vertical down then horizontal right */}
        <line x1={midX} y1={halfH} x2={midX} y2={totalH - r} stroke={CHAIN_COLOR} strokeWidth={sw} />
        <line x1={midX} y1={totalH - r} x2={w - r} y2={totalH - r} stroke={CHAIN_COLOR} strokeWidth={sw} />
        {/* Circles */}
        <circle cx={r}     cy={halfH}      r={r - 1} fill="white" stroke={CHAIN_COLOR} strokeWidth={sw} />
        <circle cx={w - r} cy={r}          r={r - 1} fill="white" stroke={CHAIN_COLOR} strokeWidth={sw} />
        <circle cx={w - r} cy={totalH - r} r={r - 1} fill="white" stroke={CHAIN_COLOR} strokeWidth={sw} />
      </svg>
    </div>
  );
}


// ── Block library sidebar (shared / exported) ─────────────────────────────────

export function BlockLibrarySidebar({
  title = "Block Library",
  historyByProperty,
  properties,
  onSelect,
  draggableConfig,
  onNodeHover,
}: {
  title?: string;
  historyByProperty: Record<string, string[]>;
  properties?: string[];
  onSelect?: (name: string) => void;
  draggableConfig?: {
    property: string;
    dir: string;
    used: boolean;
    onDragStart: (dir: string) => void;
  };
  onNodeHover?: (dir: string | null, rect: DOMRect | null, property: string) => void;
}) {
  const [, setCardHovered] = useState(false);
  const propList = properties ?? Object.keys(MANIFEST);

  return (
    <div
      style={{
        width: 200,
        flexShrink: 0,
        borderRight: "1.5px solid #f1f5f9",
        background: "#fafafa",
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
      {propList.map((p) => (
        <PropertyCard
          key={p}
          name={p}
          history={historyByProperty[p] ?? []}
          onHoverChange={setCardHovered}
          onSelect={onSelect}
          draggableDir={draggableConfig?.property === p ? draggableConfig.dir : undefined}
          usedDir={
            draggableConfig?.used && draggableConfig?.property === p
              ? draggableConfig.dir
              : undefined
          }
          onDragStart={draggableConfig?.onDragStart}
          onNodeHover={onNodeHover ? (dir, rect) => onNodeHover(dir, rect, p) : undefined}
        />
      ))}
    </div>
  );
}
