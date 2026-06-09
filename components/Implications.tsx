const implications = [
  {
    num: '01',
    headline: 'Differentiate reuse mechanisms by property type and expertise.',
    body: 'Visual properties and properties where users have strong familiarity benefit from literal reuse as cross-project palettes. Semantic properties benefit from adaptive reuse for contextual flexibility.',
  },
  {
    num: '02',
    headline: 'Help users recognize and formalize their exploration strategies as path templates.',
    body: 'Path-level patterns should be surfaceable so designers can save and reapply their own recurring strategies across topics.',
  },
  {
    num: '03',
    headline: 'Treat bootstrapping and broadening as distinct purposes in social reuse.',
    body: 'For bootstrapping, surface the overall flow of intent evolution. For broadening, foreground intermediate steps and strategies rather than full processes or final outputs.',
  },
  {
    num: '04',
    headline:
      'Offer adaptive variants alongside literal reuse, and introduce nudges to prevent fixation.',
    body: 'Recency fading (de-emphasizing recently reused blocks) can discourage over-reliance and encourage discovery of less familiar strategies.',
  },
]

export function Implications() {
  return (
    <section id="implications" className="py-16 bg-paper">
      <div className="max-w-[1080px] mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
          Design Implications
        </p>
        <h2 className="font-display font-semibold text-[clamp(1.5rem,2.8vw,2.1rem)] leading-[1.22] text-slate-900 max-w-xl mb-8">
          Design Implications for Future Intent-Reuse Systems
        </h2>

        <div className="divide-y divide-slate-200 border-t border-slate-200">
          {implications.map((item, i) => (
            <div
              key={item.num}
              className="animate-on-scroll grid gap-6 py-8"
              style={{ gridTemplateColumns: '48px 1fr' }}
              data-delay={String((i % 4) + 1)}
            >
              <span className="font-display font-semibold text-2xl text-slate-300 pt-0.5 leading-snug">
                {item.num}
              </span>
              <div>
                <h3 className="font-semibold text-[0.97rem] text-slate-900 leading-snug mb-2">
                  {item.headline}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
