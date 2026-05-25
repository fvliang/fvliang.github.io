import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Fuliang Liu - Ph.D. Candidate @ Nanjing University",
  description:
    "Personal website of Fuliang Liu. Research in LLM Systems and Speculative Decoding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${jetbrains.className} scroll-smooth`}>
      <body>{children}</body>
    </html>
  );
}
