import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {
  Geist,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";

import "./globals.css";

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

function resolveMetadataBase(): URL | undefined {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (!configured) {
    return undefined;
  }

  const normalized =
    configured.startsWith("http://") ||
    configured.startsWith("https://")
      ? configured
      : `https://${configured}`;

  try {
    return new URL(normalized);
  } catch {
    return undefined;
  }
}

const title = "SONIA.OS — Beyond the Profile";
const description =
  "An interactive digital identity experience exploring Sonia, founder of i-SmokeStack, leadership, ideas, and the Do More by Doing Less™ philosophy.";

export const viewport: Viewport = {
  themeColor: "#080C10",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  ...(resolveMetadataBase()
    ? { metadataBase: resolveMetadataBase() }
    : {}),
  title: {
    default: title,
    template: "%s | SONIA.OS",
  },
  description,
  applicationName: "SONIA.OS",
  keywords: [
    "Sonia",
    "i-SmokeStack",
    "SONIA.OS",
    "Do More by Doing Less",
    "Leadership",
    "Digital Experience",
    "Professional Identity",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "SONIA.OS",
    locale: "en_US",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${jetBrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-[#080C10] font-sans text-slate-100">
        {children}
      </body>
    </html>
  );
}