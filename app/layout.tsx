import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import { Providers } from "@/components/providers";
import "@/app/globals.css";

const display = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Film Forage — Neo-noir Discovery",
  description: "Editorial cinematic discovery experience with resilient provider orchestration.",
  metadataBase: new URL("https://film-forage.vercel.app"),
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    title: "Film Forage",
    description: "Mood-driven cinematic discovery with shortlist momentum.",
    images: "/opengraph-image",
  },
  twitter: {
    card: "summary_large_image",
    title: "Film Forage",
    description: "Mood-driven cinematic discovery with shortlist momentum.",
    images: "/twitter-image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
