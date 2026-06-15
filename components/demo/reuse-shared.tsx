"use client";

import { type ReactNode } from "react";
import { PROPERTY_COLORS, ChainLink, BranchLinks, BlockNode, MANIFEST, styleImgSrc } from "./shared";

export const ENTITY_COLOR = PROPERTY_COLORS["Character Entity"];
export const SCENE_COLOR = PROPERTY_COLORS["Scene"];
export const STYLE_COLOR = PROPERTY_COLORS["Style"];
export const BG_COLOR = "#CA8A04";

export type SubTab = "block" | "path" | "project";
export type DragState = "idle" | "over" | "choosing" | "placed-literal" | "placed-adaptive";
export type PathState =
  | "idle"
  | "selecting"
  | "copied"
  | "paste-choosing"
  | "placed-literal"
  | "placed-adaptive";
export type ImportState = "idle" | "literal" | "adaptive";
export type GraphNodeData = { property: string; direction: string; color: string; changed?: boolean };
export type GraphRow = { root: GraphNodeData; branches: GraphNodeData[][] };

export function guideEase(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function CursorSVG({ clipId, color }: { clipId: string; color: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 16 16"
      fill="none"
      style={{ filter: `drop-shadow(0px 2px 6px ${color}90)` }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="16" height="16" fill="white" transform="translate(6.99382e-07 16) rotate(-90)" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M2.182 1.918C2.25353 1.84652 2.34506 1.7984 2.44451 1.78002C2.54395 1.76163 2.64663 1.77382 2.739 1.815L15.467 7.472C15.556 7.51152 15.6316 7.57619 15.6843 7.65805C15.7371 7.73991 15.7648 7.8354 15.7641 7.93279C15.7633 8.03019 15.7342 8.12524 15.6801 8.20629C15.6261 8.28733 15.5496 8.35084 15.46 8.389L10.694 10.43L8.652 15.197C8.6136 15.2863 8.55002 15.3624 8.46902 15.4161C8.38803 15.4698 8.29314 15.4988 8.19596 15.4994C8.09878 15.5001 8.00352 15.4724 7.92183 15.4197C7.84014 15.3671 7.77557 15.2918 7.736 15.203L2.079 2.475C2.03805 2.38276 2.02597 2.28028 2.04435 2.18104C2.06274 2.0818 2.11072 1.98945 2.182 1.918Z"
          fill={color}
        />
      </g>
    </svg>
  );
}

export function ModalOptionButton({
  onClick,
  color,
  title,
  note,
  children,
}: {
  onClick: () => void;
  color: string;
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
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
        (e.currentTarget as HTMLButtonElement).style.border = `1.5px solid ${color}`;
        (e.currentTarget as HTMLButtonElement).style.background = `${color}08`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #e2e8f0";
        (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 9, color: "#94a3b8", marginBottom: 8 }}>{note}</div>
      {children}
    </button>
  );
}

export function CollapsedBlock({
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

export function NodeBlock({ property, direction, color, changed }: GraphNodeData) {
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

export function GraphRowViz({ root, branches }: GraphRow) {
  const hasFork = branches.length > 1;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <NodeBlock {...root} />
      {branches.length > 0 && !hasFork && <ChainLink compact />}
      {hasFork && <BranchLinks compact />}
      {branches.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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

export type TooltipInfo = { dir: string; property: string; rect: DOMRect; typicality: number } | null;

export function NodeTooltip({ info }: { info: Exclude<TooltipInfo, null> }) {
  const isStyle = info.property === "Style";
  const color = PROPERTY_COLORS[info.property] ?? "#94a3b8";

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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
          {[0, 1, 2, 3].map((i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={styleImgSrc(info.dir, info.typicality, i)}
              alt=""
              style={{ width: 68, height: 68, objectFit: "cover", borderRadius: 7, border: "1.5px solid #e2e8f0" }}
            />
          ))}
        </div>
      ) : (
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
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
