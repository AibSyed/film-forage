import type { Metadata } from "next";
import { Space_Grotesk, Fraunces } from "next/font/google";
import { Providers } from "@/components/providers";
import "@/app/globals.css";

const heading = Fraunces({ subsets: ["latin"], variable: "--font-heading" });
const body = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Film Forage 2.0",
  description: "Cinematic discovery engine with mood-led exploration and resilient data pipelines.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
