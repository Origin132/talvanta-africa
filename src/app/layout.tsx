import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { TaliaLauncher } from "@/components/talia/talia-launcher";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Talvanta Africa | AI-Powered Recruitment",
    template: "%s | Talvanta Africa",
  },
  description:
    "Talvanta Africa connects growing organisations with qualified professionals through intelligent, efficient, and human-centred recruitment solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="min-h-[60vh]" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <TaliaLauncher />
      </body>
    </html>
  );
}
