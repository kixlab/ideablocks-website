"use client";

import { useState, useEffect, useRef } from "react";
import {
  MANIFEST,
  BlockNode,
  ResultNode,
  DemoWrapper,
  BlockLibrarySidebar,
  GUIDE_COLOR,
} from "./shared";

// ── Create-a-block demo ───────────────────────────────────────────────────────

export function CreateBlockDemo() {
  const [property, setProperty] = useState<string | null>(null);
  const [direction, setDirection] = useState("");
  const [directionChosen, setDirectionChosen] = useState(false);
  const [typicality, setTypicality] = useState(2);
  const [typicalityChosen, setTypicalityChosen] = useState(false);
  const [result, setResult] = useState({ property: "", direction: "", typicality: 2 });
  const [pending, setPending] = useState(false);
  const [historyByProperty, setHistoryByProperty] = useState<Record<string, string[]>>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedChip, setSelectedChip] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suggestions =
    property && direction
      ? (MANIFEST[property]?.[direction]?.[String(typicality)] ?? []).map((e) => e.text)
      : [];

  useEffect(() => {
    if (!directionChosen || !typicalityChosen || !property || !direction) return;
    setPending(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setResult({ property, direction, typicality });
      setPending(false);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [property, direction, typicality, directionChosen, typicalityChosen]);

  const handleSelect = (p: string) => {
    setProperty(p);
    setDirection("");
    setDirectionChosen(false);
    setTypicalityChosen(false);
    setStep(1);
    setSelectedChip(null);
  };

  const handleExplore = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setResult({ property: property!, direction, typicality });
    setPending(false);
    setStep(2);
    setSelectedChip(null);
  };

  return (
    <DemoWrapper
      sidebar={
        <BlockLibrarySidebar historyByProperty={historyByProperty} onSelect={handleSelect} />
      }
    >
      {!property && (
        <p style={{ fontSize: 14, fontWeight: 600, color: GUIDE_COLOR, userSelect: "none" }}>
          ← Click a property card to start.
        </p>
      )}
      {property && (
        <div style={{ display: "flex", alignItems: "center", animation: "block-in 0.35s ease" }}>
          <BlockNode
            property={property}
            direction={direction}
            typicality={typicality}
            directionChosen={directionChosen}
            typicalityChosen={typicalityChosen}
            isCollapsed={step === 2}
            chips={suggestions}
            selectedChipIndex={selectedChip}
            onDirectionChange={(d) => {
              setDirection(d);
              setDirectionChosen(true);
              setTypicalityChosen(false);
            }}
            onTypicalityChange={(t) => {
              setTypicality(t);
              setTypicalityChosen(true);
            }}
            onStartTyping={() => setPending(true)}
            onDirectionTried={(d) =>
              setHistoryByProperty((prev) => {
                const existing = prev[property] ?? [];
                if (existing.includes(d)) return prev;
                return { ...prev, [property]: [...existing, d] };
              })
            }
            onExplore={handleExplore}
            onExpandClick={() => {
              setStep(1);
              setSelectedChip(null);
            }}
            onChipSelect={setSelectedChip}
          />
          {step === 2 && (
            <>
              <div style={{ flexShrink: 0, animation: "block-in 0.4s ease" }}>
                <ResultNode
                  property={result.property || property}
                  direction={result.direction || direction}
                  typicality={result.typicality}
                  loading={pending}
                  selectedIndex={selectedChip}
                  connector
                  connectorAnimate
                />
              </div>
            </>
          )}
        </div>
      )}
    </DemoWrapper>
  );
}
