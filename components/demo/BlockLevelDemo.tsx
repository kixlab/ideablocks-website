"use client";

import { useState } from "react";
import { MANIFEST, ChainLink, ResultNode } from "./shared";
import { SCENE_COLOR, DragState, CollapsedBlock, ModalOptionButton } from "./reuse-shared";

export const LITERAL_SUGGESTIONS = [
  "City skyline at night",
  "Neon-lit boulevard",
  "City waterfront at night",
  "Busy city intersection at night",
];

export const ADAPTIVE_SUGGESTIONS = [
  "City stage glowing at night",
  "Neon-lit performance street",
  "Waterfront dance plaza at night",
  "Crowded night festival square",
];

export const REUSE_HISTORY: Record<string, string[]> = {
  "Character Entity": ["Astronaut", "Dancer"],
  Scene: ["Starry Night", "City Night"],
  Style: ["Watercolor", "Pixel Art"],
};

export const NODE_TYPICALITY: Record<string, Record<string, number>> = {
  "Character Entity": { Astronaut: 3, Dancer: 5 },
  Scene: { "Starry Night": 3, "City Night": 1 },
  Style: { Watercolor: 2, "Pixel Art": 4 },
};

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
      onDrop={(e) => { e.preventDefault(); onDrop(); }}
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
      <div style={{ fontSize: 9.5, color: isOver ? SCENE_COLOR : "#94a3b8", textAlign: "center", lineHeight: 1.5 }}>
        {isOver ? "Release to drop!" : "Drag a block\nfrom history here"}
      </div>
    </div>
  );
}

function ReuseChoiceModal({ onChoose }: { onChoose: (t: "literal" | "adaptive") => void }) {
  const OPTIONS = [
    { type: "literal" as const, title: "Exactly the Same", note: "Same directions as before", suggestions: LITERAL_SUGGESTIONS },
    { type: "adaptive" as const, title: "Variations Based on New Context", note: "Adapted to Dancer context", suggestions: ADAPTIVE_SUGGESTIONS },
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
            Scene: City Night / Highly Typical → after Dancer block
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {OPTIONS.map(({ type, title, note, suggestions }) => (
            <ModalOptionButton key={type} onClick={() => onChoose(type)} color={SCENE_COLOR} title={title} note={note}>
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
            </ModalOptionButton>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BlockLevelCanvas({
  dragState,
  onDrop,
  onChoose,
}: {
  dragState: DragState;
  onDrop: () => void;
  onChoose: (t: "literal" | "adaptive") => void;
}) {
  const [isOver, setIsOver] = useState(false);
  const dancerChips = MANIFEST["Character Entity"]["Dancer"]["5"].map((e) => e.text);
  const isPlaced = dragState === "placed-literal" || dragState === "placed-adaptive";
  const sceneChips = dragState === "placed-adaptive" ? ADAPTIVE_SUGGESTIONS : LITERAL_SUGGESTIONS;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: 320,
        alignSelf: "stretch",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", zoom: 0.85 }}>
        <CollapsedBlock property="Character Entity" direction="Dancer" typicality={5} suggestions={dancerChips} />
        <ResultNode property="Character Entity" direction="Dancer" typicality={5} loading={false} connector />
        <ChainLink />
        {!isPlaced && dragState !== "choosing" && (
          <DropZone
            isOver={isOver}
            onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
            onDragLeave={() => setIsOver(false)}
            onDrop={() => { setIsOver(false); onDrop(); }}
          />
        )}
        {(dragState === "choosing" || isPlaced) && (
          <>
            <CollapsedBlock property="Scene" direction="City Night" typicality={1} suggestions={sceneChips} animateIn />
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
                    (i) => `/demo_output/chained_reuse/dancer_city_night/${dragState === "placed-adaptive" ? "adaptive" : "literal"}/cluster_${i}.png`,
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
