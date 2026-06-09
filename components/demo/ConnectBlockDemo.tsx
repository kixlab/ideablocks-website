"use client";

import { useState, useEffect, useRef } from "react";
import {
  MANIFEST,
  STYLE_MANIFEST,
  PROPERTY_COLORS,
  TYPICALITY_LABELS,
  TypicalitySlider,
  BlockNode,
  ResultNode,
  ChainLink,
  DemoWrapper,
  GUIDE_COLOR,
  styleImgSrc,
  chainedStyleImgSrc,
} from "./shared";

// ── Style block node (image-type, mirrors BlockNode step 1/2 pattern) ─────────

function StyleBlockNode({
  direction,
  typicality,
  directionChosen,
  typicalityChosen,
  isCollapsed,
  onDirectionChange,
  onTypicalityChange,
  onExplore,
  onExpandClick,
}: {
  direction: string;
  typicality: number;
  directionChosen: boolean;
  typicalityChosen: boolean;
  isCollapsed: boolean;
  onDirectionChange: (d: string) => void;
  onTypicalityChange: (t: number) => void;
  onExplore: () => void;
  onExpandClick: () => void;
}) {
  const color = PROPERTY_COLORS["Style"];
  const directions = Object.keys(STYLE_MANIFEST);
  const canExplore = directionChosen && typicalityChosen;
  const typLabel = TYPICALITY_LABELS[typicality - 1];

  return (
    <div
      style={{
        width: 254,
        padding: 16,
        borderRadius: 12,
        background: "#f7f7f7",
        border: "2px solid rgba(0,0,0,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Property pill — always visible */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            color: "white",
            fontWeight: 600,
            borderRadius: 999,
            fontSize: 12,
            padding: "5px 16px",
            backgroundColor: color,
          }}
        >
          Style
        </div>
      </div>

      {/* ── Step 1: direction picker + slider + Explore button ── */}
      {!isCollapsed && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Direction input */}
          <div className="w-full flex flex-col gap-2">
            <p className="italic w-full" style={{ fontSize: 12, color: "#64748b" }}>
              What kind of <strong>Style</strong> do you want?
            </p>
            {/* Fake input field */}
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
              <span style={{ color: direction ? "#1e293b" : "#94a3b8", flex: 1 }}>
                {direction || "Select a style"}
              </span>
            </div>
            {/* Try: chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap" }}>Try:</span>
              {directions.map((d) => (
                <button
                  key={d}
                  onClick={() => onDirectionChange(d)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    cursor: "pointer",
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

          <div style={{ width: "100%", height: 1, background: "rgba(0,0,0,0.07)" }} />

          {/* Typicality slider */}
          <div
            className="w-full flex flex-col gap-2"
            style={{
              opacity: directionChosen ? 1 : 0.35,
              transition: "opacity 0.3s",
              pointerEvents: directionChosen ? "auto" : "none",
            }}
          >
            <p className="italic" style={{ fontSize: 12, color: "#64748b" }}>
              How typical should results be?
            </p>
            <TypicalitySlider
              value={typicality}
              chosen={typicalityChosen}
              onChange={onTypicalityChange}
              color={color}
            />
          </div>

          {/* Explore button */}
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
                  padding: "5px 16px",
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

      {/* ── Step 2: compact summary + 2×2 style image grid ── */}
      {isCollapsed && (
        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            animation: "step2-in 0.3s ease",
          }}
        >
          {/* Clickable summary */}
          <div
            onClick={onExpandClick}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "2px 6px",
              borderRadius: 6,
              transition: "background 0.15s",
              width: "100%",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.04)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background = "transparent")
            }
          >
            <span style={{ fontSize: 12, fontWeight: 500, color: "#1e293b" }}>{direction}</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}> / {typLabel}</span>
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
          </div>

          <div style={{ width: 36, height: 1, background: "#d1d5db" }} />

          {/* 2×2 style option images */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%" }}>
            {[0, 1, 2, 3].map((i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={styleImgSrc(direction, typicality, i)}
                alt={`${direction} option ${i + 1}`}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "1.5px solid #e2e8f0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Connect-blocks demo ───────────────────────────────────────────────────────

export function ConnectBlockDemo() {
  const [direction, setDirection] = useState("");
  const [typicality, setTypicality] = useState(2);
  const [directionChosen, setDirectionChosen] = useState(false);
  const [typicalityChosen, setTypicalityChosen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [result, setResult] = useState({ direction: "", typicality: 2 });
  const [pending, setPending] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step !== 2 || !direction) return;
    setPending(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setResult({ direction, typicality });
      setPending(false);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [direction, typicality, step]);

  useEffect(() => {
    if (step !== 2) return;
    const el = canvasRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ left: el.scrollWidth - el.clientWidth, behavior: "smooth" });
    });
  }, [step]);

  const handleExplore = () => {
    setResult({ direction, typicality });
    setStep(2);
  };

  return (
    <DemoWrapper canvasRef={canvasRef}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "0 auto",
          width: "max-content",
          transform: "scale(0.8)",
          transformOrigin: "center center",
          paddingBottom: 44,
        }}
      >
        {/* Block 1: locked — caption is absolutely positioned so it doesn't affect row alignment */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <BlockNode
            property="Character Entity"
            direction="Astronaut"
            typicality={2}
            directionChosen
            typicalityChosen
            isCollapsed
            locked
            chips={MANIFEST["Character Entity"]["Astronaut"]["2"].map((e) => e.text)}
            onDirectionChange={() => {}}
            onTypicalityChange={() => {}}
            onStartTyping={() => {}}
            onDirectionTried={() => {}}
          />
          <p
            style={{
              position: "absolute",
              top: "calc(100% + 14px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: 210,
              margin: 0,
              fontSize: 11.5,
              fontWeight: 600,
              color: GUIDE_COLOR,
              textAlign: "center",
              lineHeight: 1.45,
              pointerEvents: "none",
            }}
          >
            This block is fixed — its context carries over to the next block.
          </p>
        </div>

        {/* Block 1 → Result 1 */}
        <ResultNode
          property="Character Entity"
          direction="Astronaut"
          typicality={2}
          loading={false}
          connector
        />

        {/* Result 1 → Block 2 */}
        <ChainLink />

        {/* Block 2: Style (image-type), step 1/2 */}
        <StyleBlockNode
          direction={direction}
          typicality={typicality}
          directionChosen={directionChosen}
          typicalityChosen={typicalityChosen}
          isCollapsed={step === 2}
          onDirectionChange={(d) => {
            setDirection(d);
            setDirectionChosen(true);
            setTypicalityChosen(false);
          }}
          onTypicalityChange={(t) => {
            setTypicality(t);
            setTypicalityChosen(true);
          }}
          onExplore={handleExplore}
          onExpandClick={() => setStep(1)}
        />

        {/* Block 2 → Chained result (step 2 only) */}
        {step === 2 && (
          <ResultNode
            property="Style"
            direction={result.direction || direction}
            typicality={result.typicality}
            loading={pending}
            connector
            connectorAnimate
            srcs={
              [0, 1, 2, 3].map((i) =>
                chainedStyleImgSrc(result.direction || direction, result.typicality, i),
              ) as [string, string, string, string]
            }
          />
        )}
      </div>
    </DemoWrapper>
  );
}
