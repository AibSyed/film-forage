import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import "@/app/globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const body = Sora({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Film Forage | Pick Tonight's Movie",
  description: "Choose one movie for tonight with cleaner filters, real watch availability, and a local-first watchlist.",
  metadataBase: new URL("https://film-forage.vercel.app"),
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    title: "Film Forage | Pick Tonight's Movie",
    description: "Choose a movie with real watch availability, honest fit reasons, and a local-first watchlist.",
    images: "/opengraph-image",
  },
  twitter: {
    card: "summary_large_image",
    title: "Film Forage | Pick Tonight's Movie",
    description: "Choose a movie with real watch availability, honest fit reasons, and a local-first watchlist.",
    images: "/twitter-image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
