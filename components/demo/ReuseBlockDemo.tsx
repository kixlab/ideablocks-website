"use client";

import { useState, useRef, useEffect } from "react";
import { GUIDE_COLOR, BlockLibrarySidebar, DemoWrapper } from "./shared";
import {
  SubTab,
  DragState,
  PathState,
  ImportState,
  TooltipInfo,
  NodeTooltip,
  guideEase,
  CursorSVG,
} from "./reuse-shared";
import { BlockLevelCanvas, REUSE_HISTORY, NODE_TYPICALITY } from "./BlockLevelDemo";
import { PathLevelCanvas } from "./PathLevelDemo";
import { ProjectLevelCanvas } from "./ProjectLevelDemo";

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
      measurePos();
      setDragGuideT((now - dragGuideStartRef.current) % DRAG_GUIDE_LOOP);
      dragGuideRafRef.current = requestAnimationFrame(tick);
    };
    dragGuideRafRef.current = requestAnimationFrame(tick);

    return () => {
      if (dragGuideRafRef.current) cancelAnimationFrame(dragGuideRafRef.current);
    };
  }, [showDragGuide]);

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

  return (
    <div ref={containerRef}>
      <style>{`@keyframes history-node-pulse { 0%,100%{opacity:.8} 50%{opacity:.2} }`}</style>

      <ReuseSubTabs active={subTab} onChange={handleTabChange} />

      <div style={{ marginTop: 10 }}>
        <DemoWrapper sidebar={sidebar}>
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
        </DemoWrapper>
      </div>

      {tooltip && <NodeTooltip info={tooltip} />}

      {showDragGuide && dragGuidePosRef.current && (
        <div
          style={{
            position: "fixed",
            left: dgCursorX - 4,
            top: dgCursorY - 4,
            pointerEvents: "none",
            zIndex: 9999,
            opacity: dgOpacity,
          }}
        >
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
          <CursorSVG clipId="cursor-drag-guide" color={GUIDE_COLOR} />
        </div>
      )}
    </div>
  );
}
