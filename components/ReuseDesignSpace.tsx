import Image from "next/image";

export function ReuseDesignSpace() {
  return (
    <section id="reuse-design-space" className="py-16 bg-paper">
      <div className="max-w-[1080px] mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
          Interaction Design Space
        </p>
        <h2 className="font-display font-semibold text-[clamp(1.5rem,2.8vw,2.1rem)] leading-[1.22] text-slate-900 mb-2">
          Divergent intent reuse operates across two dimensions.
        </h2>
        <p className="text-[0.97rem] text-slate-500 mb-12">
          What granularity is reused, and how flexibly it adapts to new contexts.
        </p>

        <div className="flex flex-col gap-16">
          {/* Units */}
          <div className="animate-on-scroll grid md:grid-cols-2 gap-16 items-center" data-delay="1">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
                Units
              </p>
              <h3 className="font-display font-semibold text-[1.15rem] text-slate-900 mb-3 leading-snug">
                What granularity of exploration strategy should be reusable?
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Block-level", color: "#1D6FEB", desc: "A single property intent" },
                  { label: "Path-level", color: "#D4740A", desc: "A multi-step exploration strategy" },
                  { label: "Project-level", color: "#6E30D8", desc: "An entire design space template" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="mt-[3px] flex-shrink-0 w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <p className="text-[0.875rem] text-slate-600 leading-snug">
                      <strong className="font-semibold text-slate-800">{item.label}</strong>
                      {" — "}
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Image
              src="/assets/unit.png"
              alt="Block-level, Path-level, and Project-level reuse granularity"
              width={800}
              height={500}
              className="w-full h-auto"
            />
          </div>

          {/* Adaptivity */}
          <div className="animate-on-scroll grid md:grid-cols-2 gap-16 items-center" data-delay="2">
            <div className="md:order-2">
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
                Adaptivity
              </p>
              <h3 className="font-display font-semibold text-[1.15rem] text-slate-900 mb-3 leading-snug">
                How fixed or flexible should that reuse be?
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Literal copy", desc: "Exact intent applied verbatim" },
                  { label: "Context-adaptive copy", desc: "Intent reinterpreted for the new context" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="mt-[3px] flex-shrink-0 w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <p className="text-[0.875rem] text-slate-600 leading-snug">
                      <strong className="font-semibold text-slate-800">{item.label}</strong>
                      {" — "}
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Image
              src="/assets/adaptivity.png"
              alt="Literal copy vs Context-adaptive copy"
              width={800}
              height={500}
              className="md:order-1 w-full h-auto max-w-[85%] mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
