import type { Metadata } from "next";
import { Space_Grotesk, Nunito_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-epilogue",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IdeaBlocks",
  description:
    "A research website showcasing IdeaBlocks, a paper published at ACM DIS 2026 on generative graphic design exploration.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "IdeaBlocks: Expressing and Reusing Divergent Intents for Graphic Design Exploration",
    description:
      "A research website showcasing IdeaBlocks, a paper published at ACM DIS 2026 on generative graphic design exploration.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${nunitoSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* JSON-LD schema */}
        <script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "IdeaBlocks",
              description:
                "Project website for IdeaBlocks: Expressing and Reusing Divergent Intents for Graphic Design Exploration using Generative AI",
              keywords: ["divergent intent", "generative AI", "design exploration"],
              mainEntity: {
                "@type": "ScholarlyArticle",
                headline:
                  "IdeaBlocks: Expressing and Reusing Divergent Intents for Graphic Design Exploration using Generative AI",
                author: [
                  { "@type": "Person", name: "DaEun Choi" },
                  { "@type": "Person", name: "Kihoon Son" },
                  { "@type": "Person", name: "Jaesang Yu" },
                  { "@type": "Person", name: "HyunJoon Jung" },
                  { "@type": "Person", name: "Juho Kim" },
                ],
                datePublished: "2026-06-13",
                url: "https://arxiv.org/abs/2507.22163",
                isPartOf: {
                  "@type": "Event",
                  name: "ACM Designing Interactive Systems Conference 2026",
                  alternateName: "DIS 2026",
                  startDate: "2026-06-13",
                  endDate: "2026-06-17",
                  location: {
                    "@type": "Place",
                    name: "Singapore",
                  },
                  url: "https://dis.acm.org/",
                },
              },
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FNN2SJPZGW"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FNN2SJPZGW');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
