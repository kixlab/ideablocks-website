"use client";

import { ENTITY_COLOR, STYLE_COLOR, BG_COLOR, ImportState, GraphRow, GraphRowViz } from "./reuse-shared";

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
        display: "flex",
        flexDirection: "column",
        gap: 0,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "#f1f5f9",
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {isSource && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "white",
              background: "#94a3b8",
              borderRadius: 999,
              padding: "2px 8px",
              flexShrink: 0,
            }}
          >
            source
          </span>
        )}
        <span style={{ fontSize: 11.5, fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>{title}</span>
      </div>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
      {!shown ? (
        <div
          style={{
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: 0.35,
          }}
        >
          <div style={{ fontSize: 22 }}>📋</div>
          <span style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", lineHeight: 1.4 }}>
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
    </div>
  );
}

export function ProjectLevelCanvas({
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
    fontSize: 11,
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
    <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
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
          gap: 12,
          flexShrink: 0,
          paddingTop: 52,
        }}
      >
        <button onClick={() => onImport("literal")} style={btnStyle(importState === "literal")}>
          Literal Import
        </button>
        <div style={{ fontSize: 26, color: "#cbd5e1" }}>→</div>
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
