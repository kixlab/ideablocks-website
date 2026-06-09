"use client";

import { useState, useRef, useEffect } from "react";
import { MANIFEST, ChainLink, BranchLinks, GUIDE_COLOR } from "./shared";
import {
  SCENE_COLOR,
  STYLE_COLOR,
  PathState,
  CollapsedBlock,
  GraphNodeData,
  GraphRowViz,
  guideEase,
  CursorSVG,
  ModalOptionButton,
} from "./reuse-shared";

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
            <ModalOptionButton
              key={type}
              onClick={() => onChoose(type)}
              color={SCENE_COLOR}
              title={title}
              note={note}
            >
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
            </ModalOptionButton>
          ))}
        </div>
      </div>
    </div>
  );
}

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

export function PathLevelCanvas({
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

  const copyButtonRef = useRef<HTMLButtonElement | null>(null);
  const blockRefs = useRef<Partial<Record<PathBlockId, HTMLDivElement | null>>>({});
  const guideAnimRafRef = useRef<number | null>(null);
  const guideAnimStartRef = useRef<number>(0);
  const pasteAreaRef = useRef<HTMLDivElement | null>(null);
  const clickAnimRafRef = useRef<number | null>(null);
  const clickAnimStartRef = useRef<number>(0);

  const isDragging = !!dragStart;
  const isSelectable = pathState === "idle" || pathState === "selecting";

  const selRect =
    dragStart && dragCurrent
      ? {
          x: Math.min(dragStart.x, dragCurrent.x),
          y: Math.min(dragStart.y, dragCurrent.y),
          w: Math.abs(dragCurrent.x - dragStart.x),
          h: Math.abs(dragCurrent.y - dragStart.y),
        }
      : null;

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

  // Guide selection animation
  const showGuideAnim = pathState === "idle" && !isDragging;
  const canCopyPath = selected.size >= PATH_BLOCK_IDS.length;
  const showPasteHintAnim = pathState === "copied";
  const showCopyHintAnim = isSelectable && canCopyPath;
  const showHintAnim = showPasteHintAnim || showCopyHintAnim;

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

  useEffect(() => {
    if (!showHintAnim) {
      if (clickAnimRafRef.current !== null) cancelAnimationFrame(clickAnimRafRef.current);
      clickAnimRafRef.current = null;
      clickAnimPosRef.current = null;
      return;
    }
    clickAnimStartRef.current = performance.now();
    const tick = (now: number) => {
      const targetRef = showPasteHintAnim
        ? pasteAreaRef.current
        : showCopyHintAnim
          ? copyButtonRef.current
          : null;
      const er = targetRef?.getBoundingClientRect();
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
  }, [showHintAnim, showPasteHintAnim]);

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

  const clickCursorScale =
    clickAnimT >= caT3 && clickAnimT < caT4
      ? 1 - 0.28 * Math.sin(Math.PI * ((clickAnimT - caT3) / CLICK_ANIM_PRESS))
      : 1;

  const rippleRaw =
    clickAnimT >= caT3 && clickAnimT < caT5
      ? (clickAnimT - caT3) / (CLICK_ANIM_PRESS + CLICK_ANIM_RIPPLE)
      : 0;
  const rippleActive = clickAnimT >= caT3 && clickAnimT < caT5;
  const rippleSize = rippleRaw * 54;
  const rippleOpacity = rippleActive ? Math.max(0, 1 - rippleRaw * 1.4) : 0;

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
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, zoom: 0.75 }}>
          <CollapsedBlock
            property="Character Entity"
            direction="Astronaut"
            typicality={4}
            suggestions={ASTRONAUT_CHIPS}
          />
          <ChainLink />

          <div
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
            {showGuideAnim && (
              <>
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
                  <CursorSVG clipId="cursor-guide" color={GUIDE_COLOR} />
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

        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          {isSelectable && (
            <button
              ref={copyButtonRef}
              onClick={() => {
                if (canCopyPath) onPathStateChange("copied");
              }}
              disabled={!canCopyPath}
              style={{
                padding: "8px 14px",
                borderRadius: 16,
                fontSize: 11,
                fontWeight: 600,
                cursor: canCopyPath ? "pointer" : "not-allowed",
                background: canCopyPath ? "#ffffff" : "#f8fafc",
                color: canCopyPath ? "#0f172a" : "#94a3b8",
                border: `1px solid ${canCopyPath ? "rgba(148,163,184,0.35)" : "#e2e8f0"}`,
                boxShadow: canCopyPath
                  ? "0 8px 20px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.8)"
                  : "none",
                transition: "all 0.2s",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 8px",
                    borderRadius: 8,
                    background: canCopyPath ? "#f8fafc" : "#eef2f7",
                    border: `1px solid ${canCopyPath ? "#dbe4ef" : "#e2e8f0"}`,
                    boxShadow: canCopyPath
                      ? "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 0 rgba(15,23,42,0.03)"
                      : "inset 0 1px 0 rgba(255,255,255,0.8)",
                  }}
                >
                  <span style={{ fontSize: 9.5, letterSpacing: 0.2 }}>Ctrl</span>
                  <span style={{ fontSize: 9, color: "#94a3b8" }}>+</span>
                  <span style={{ fontSize: 9.5, letterSpacing: 0.2 }}>C</span>
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 700 }}>
                  {canCopyPath ? `Copy ${selected.size} blocks` : "Select all blocks first"}
                </span>
              </span>
            </button>
          )}
          {(pathState === "copied" || isPlaced) && (
            <span
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
              ✓ {selected.size} blocks copied
            </span>
          )}
        </div>
      </div>

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

      <div style={{ display: "flex", alignItems: "center", gap: 0, zoom: 0.75 }}>
        <CollapsedBlock
          property="Character Entity"
          direction="Dancer"
          typicality={4}
          suggestions={DANCER_CHIPS}
        />
        {!isPlaced && (
          <>
            <ChainLink />
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
                  color: pathState === "copied" ? "#0f172a" : "#94a3b8",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {pathState === "copied" ? (
                    <>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "4px 8px",
                          borderRadius: 8,
                          background: "#f8fafc",
                          border: `1px solid #dbe4ef`,
                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 0 rgba(15,23,42,0.03)",
                        }}
                      >
                        <span style={{ fontSize: 9.5, letterSpacing: 0.2 }}>Ctrl</span>
                        <span style={{ fontSize: 9, color: "#94a3b8" }}>+</span>
                        <span style={{ fontSize: 9.5, letterSpacing: 0.2 }}>V</span>
                      </span>
                      <span
                        style={{
                          fontSize: 10.5,
                          color: "#0f172a",
                          textAlign: "center",
                          lineHeight: 1.4,
                          fontWeight: 700,
                        }}
                      >
                        Paste here
                      </span>
                    </>
                  ) : (
                    <span
                      style={{
                        fontSize: 9.5,
                        color: "#94a3b8",
                        textAlign: "center",
                        lineHeight: 1.5,
                      }}
                    >
                      Copy path first.
                    </span>
                  )}
                </span>
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

      {showHintAnim && clickAnimPosRef.current && (
        <>
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
            <CursorSVG clipId="cursor-click" color={GUIDE_COLOR} />
          </div>
        </>
      )}
    </div>
  );
}
