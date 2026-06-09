import type { Metadata } from 'next'
import { Space_Grotesk, Nunito_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-epilogue',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'IdeaBlocks — DIS 2026',
  description:
    'IdeaBlocks: Expressing and Reusing Divergent Intents for Graphic Design Exploration using Generative AI. Published at ACM DIS 2026.',
  openGraph: {
    title: 'IdeaBlocks — DIS 2026',
    description:
      'A structured framework for expressing and reusing divergent design intents via Exploration Blocks.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${nunitoSans.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
