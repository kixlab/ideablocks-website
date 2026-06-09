import { GuideHint } from "./GuideHint";

const findings = [
  {
    level: "Block Level",
    levelColor: "#0369A1",
    levelBg: "#E0F2FE",
    title: "Visual Assets as Personal Palettes",
    body: "Designers consistently reused visual properties (image styles, color palettes) as cross-project palettes reflecting personal taste. Semantic properties (entities, poses) were more context-dependent and often adapted.",
    quote:
      '"Just like storing color swatches, I treated styles and colors as palettes to apply across projects."',
    attribution: "— D4",
  },
  {
    level: "Path Level",
    levelColor: "#B91C1C",
    levelBg: "#FEE2E2",
    title: "Template-like Scaffolding",
    body: "Exploration paths (e.g., entity → style → pose) became recognized as recurring personal strategies. Path reuse grew steadily over three days: from 2.10 uses on Day 1 to 3.30 on Day 3.",
    quote:
      '"If we can make templates of the exploration order, it would allow quick, adaptive ideation for many topics with just one click."',
    attribution: "— D2",
  },
  {
    level: "Project Level",
    levelColor: "#15803D",
    levelBg: "#DCFCE7",
    title: "Social Reuse as Collective Exploration",
    body: "Project reuse served two purposes: bootstrapping (avoiding a blank start) and broadening options (finding inspiration when stuck). Others' explored projects were trusted more than algorithmic suggestions.",
    quote:
      '"Others\' projects felt more valuable because those people must have actually found good things."',
    attribution: "— D4",
  },
];

export function Findings() {
  return (
    <section id="findings" className="py-12 bg-white">
      <div className="max-w-[1080px] mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
          Longitudinal Study
        </p>
        <h2 className="font-display font-semibold text-[clamp(1.5rem,2.8vw,2.1rem)] leading-[1.22] text-slate-900 mb-2">
          How designers appropriate reuse features in practice.
        </h2>
        <p className="text-[0.97rem] text-slate-500 mb-4">Three-day deployment study · N=6</p>

        <GuideHint text="Hover cards to reveal participant quotes" className="mb-3" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {findings.map((f, i) => (
            <div
              key={f.level}
              className="flip-card animate-on-scroll h-full"
              style={{ perspective: "1000px" }}
              data-delay={String(i + 1)}
            >
              <div
                className="flip-card-inner w-full h-full cursor-pointer"
                style={{ display: "grid" }}
              >
                {/* Front */}
                <div
                  className="flip-card-front flex flex-col gap-3 p-5 rounded-xl border border-slate-200 bg-white shadow-sm"
                  style={{ gridArea: "1/1", minHeight: 0 }}
                >
                  <span
                    className="inline-block text-xs font-bold tracking-[0.08em] uppercase px-3 py-1 rounded-full w-fit"
                    style={{ background: f.levelBg, color: f.levelColor }}
                  >
                    {f.level}
                  </span>
                  <h3 className="font-display font-semibold text-[1.02rem] text-slate-900">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.body}</p>
                </div>

                {/* Back */}
                <div
                  className="flip-card-back flex flex-col justify-center gap-4 p-5 rounded-xl"
                  style={{ background: f.levelColor, gridArea: "1/1", minHeight: 0 }}
                >
                  <svg
                    width="28"
                    height="21"
                    viewBox="0 0 28 20"
                    fill="none"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                    className="shrink-0"
                  >
                    <path
                      d="M0 20V12.267C0 5.778 3.644 1.8 10.933 0l1.4 2.267C8.978 3.378 7.111 5.6 6.533 9.333H11.2V20H0zm16.8 0V12.267C16.8 5.778 20.444 1.8 27.733 0l1.4 2.267c-3.355 1.111-5.222 3.333-5.8 7.066H28V20H16.8z"
                      fill="currentColor"
                    />
                  </svg>
                  <blockquote className="text-[0.97rem] text-white leading-relaxed italic">
                    {f.quote}
                  </blockquote>
                  <cite
                    className="not-italic text-sm font-semibold"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {f.attribution}
                  </cite>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
