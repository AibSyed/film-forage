import type { Metadata } from "next";
import { Inter_Tight, Oswald } from "next/font/google";
import "@/app/globals.css";

const display = Oswald({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const body = Inter_Tight({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Film Forage | Find a Movie to Watch Tonight",
  description: "Film Forage helps you filter by region, services, runtime, and mood so you can find a movie to watch tonight without the endless scroll.",
  metadataBase: new URL("https://film-forage.vercel.app"),
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    title: "Film Forage | Find a Movie to Watch Tonight",
    description: "Film Forage helps you filter by region, services, runtime, and mood so you can find a movie to watch tonight without the endless scroll.",
    images: "/opengraph-image",
  },
  twitter: {
    card: "summary_large_image",
    title: "Film Forage | Find a Movie to Watch Tonight",
    description: "Film Forage helps you filter by region, services, runtime, and mood so you can find a movie to watch tonight without the endless scroll.",
    images: "/twitter-image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
