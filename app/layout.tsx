import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Geist,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";

import "./globals.css";
import Navbar from "./_shared/Navbar";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SONIA.OS — Beyond the Profile",
  description:
    "An interactive digital experience exploring leadership, professional identity, ideas, and possibilities.",
  applicationName: "SONIA.OS",
  keywords: [
    "Sonia",
    "i-SmokeStack",
    "Leadership",
    "Digital Experience",
    "Professional Identity",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${jetBrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-[#080C10] font-sans text-slate-100">
        <Navbar/>
        {children}
      </body>
    </html>
  );
}