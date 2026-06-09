import { AssetImage } from "./AssetPlaceholder";

export function Problem() {
  return (
    <section id="problem" className="py-16 bg-white">
      <div className="max-w-[1080px] mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
          Motivation
        </p>
        <h2 className="font-display font-semibold text-[clamp(1.5rem,2.8vw,2.1rem)] leading-[1.22] text-slate-900 max-w-2xl mb-8">
          Current Generative AI is optimized for convergence — not exploration.
        </h2>

        {/* Two problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div
            className="animate-on-scroll rounded-xl px-6 py-4 border"
            data-delay="1"
            style={{ background: "#FFF8ED", borderColor: "#FDDEA0" }}
          >
            <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">
              No control over exploration boundaries
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Current GenAI interactions encourage users to specify a fixed target through prompt
              refinement, leaving no mechanism to define the scope or direction of exploration
              parametrically.
            </p>
          </div>

          <div
            className="animate-on-scroll rounded-xl px-6 py-4 border"
            data-delay="2"
            style={{ background: "#F4F0FF", borderColor: "#D8CCFA" }}
          >
            <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">
              Exploration strategies can't be transferred
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Text prompts entangle content (what to draw) with exploration logic (how to vary),
              making it impossible to decouple and reuse a successful search strategy in a new
              context.
            </p>
          </div>
        </div>

        <figure className="animate-on-scroll rounded-xl overflow-hidden">
          <AssetImage
            src="/assets/figure2.png"
            alt="Conceptual distinction between convergent AI interactions and divergent exploration, showing how current tools fail to support Expression and Reuse of exploration intent"
            label="Conceptual Distinction — Figure 2"
          />
        </figure>
      </div>
    </section>
  );
}
