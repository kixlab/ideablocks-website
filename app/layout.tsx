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
    "IdeaBlocks: Expressing and Reusing Divergent Intents for Graphic Design Exploration using Generative AI. Published at ACM DIS 2026.",
  openGraph: {
    title: "IdeaBlocks",
    description:
      "IdeaBlocks: Expressing and Reusing Divergent Intents for Graphic Design Exploration using Generative AI. Published at ACM DIS 2026.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${nunitoSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FNN2SJPZGW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FNN2SJPZGW');
          `}
        </Script>
      </body>
    </html>
  );
}
