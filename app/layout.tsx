import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast-provider";
import "@/app/globals.css";

const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Film Forage | Find a Movie Worth Watching",
  description:
    "Film Forage helps you narrow a movie list by region, streaming services, runtime, and mood so you can choose something worth watching faster.",
  metadataBase: new URL("https://film-forage.vercel.app"),
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    title: "Film Forage | Find a Movie Worth Watching",
    description:
      "Film Forage helps you narrow a movie list by region, streaming services, runtime, and mood so you can choose something worth watching faster.",
    images: "/opengraph-image",
  },
  twitter: {
    card: "summary_large_image",
    title: "Film Forage | Find a Movie Worth Watching",
    description:
      "Film Forage helps you narrow a movie list by region, streaming services, runtime, and mood so you can choose something worth watching faster.",
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
        <ToastProvider />
      </body>
    </html>
  );
}
