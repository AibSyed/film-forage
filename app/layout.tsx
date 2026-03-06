import type { Metadata } from "next";
import { Archivo, Manrope } from "next/font/google";
import "@/app/globals.css";

const display = Archivo({ subsets: ["latin"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Film Forage | Find the Movie. Keep the Shortlist.",
  description: "Film Forage helps you land on one strong movie, compare a few backups, and check live streaming availability by region.",
  metadataBase: new URL("https://film-forage.vercel.app"),
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    title: "Film Forage | Find the Movie. Keep the Shortlist.",
    description: "Film Forage helps you land on one strong movie, compare a few backups, and check live streaming availability by region.",
    images: "/opengraph-image",
  },
  twitter: {
    card: "summary_large_image",
    title: "Film Forage | Find the Movie. Keep the Shortlist.",
    description: "Film Forage helps you land on one strong movie, compare a few backups, and check live streaming availability by region.",
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
