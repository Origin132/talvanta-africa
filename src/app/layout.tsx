import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { TaliaLauncher } from "@/components/talia/talia-launcher";
import { CookieConsent } from "@/components/legal/cookie-consent";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl } from "@/lib/site-url";
import { organisationStructuredData, websiteStructuredData } from "@/lib/structured-data";
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
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Talvanta Africa | Recruitment and Workforce Solutions",
    template: "%s | Talvanta Africa",
  },
  description:
    "Talvanta Africa connects employers with professional talent through permanent recruitment, contract staffing, executive search, graduate recruitment, candidate screening, and HR advisory services.",
  applicationName: "Talvanta Africa",
  creator: "Talvanta Africa",
  publisher: "Talvanta Africa",
  category: "Recruitment and workforce services",
  keywords: ["recruitment services", "workforce solutions", "permanent recruitment", "contract staffing", "executive search", "graduate recruitment"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Talvanta Africa",
    title: "Talvanta Africa | Recruitment and Workforce Solutions",
    description: "Connecting professional talent with growing businesses through human-led recruitment and workforce services.",
    url: getSiteUrl(),
  },
  twitter: {
    card: "summary",
    title: "Talvanta Africa | Recruitment and Workforce Solutions",
    description: "Connecting professional talent with growing businesses through human-led recruitment and workforce services.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <JsonLd data={organisationStructuredData()} />
        <JsonLd data={websiteStructuredData()} />
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="min-h-[60vh]" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <TaliaLauncher />
        <CookieConsent />
      </body>
    </html>
  );
}
