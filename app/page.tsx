import { Hero } from '@/components/Hero'
import { Problem } from '@/components/Problem'
import { PDR } from '@/components/PDR'
import { ReuseDesignSpace } from '@/components/ReuseDesignSpace'
import { Demo } from '@/components/Demo'
import { Results } from '@/components/Results'
import { Findings } from '@/components/Findings'
import { Implications } from '@/components/Implications'
import { Citation } from '@/components/Citation'
import { ScrollAnimations } from '@/components/ScrollAnimations'

export default function Home() {
  return (
    <>
      <ScrollAnimations />
      <main>
        <Hero />
        <Problem />
        <PDR />
        <ReuseDesignSpace />
        <Demo />
        <Results />
        <Findings />
        <Implications />
        <Citation />
      </main>
      <footer className="py-10 px-6 text-center border-t border-slate-200 text-sm text-slate-400">
        <p>
          Published at{' '}
          <span className="font-medium text-slate-500">ACM DIS 2026</span>
          {' · '}
          <a href="#hero" className="hover:text-slate-700 transition-colors">
            IdeaBlocks
          </a>
        </p>
      </footer>
    </>
  )
}
