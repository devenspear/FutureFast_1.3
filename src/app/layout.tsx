import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Orbitron } from "next/font/google";
import "./globals.css";
import "../../styles/animation.css";
import "../../styles/exponential-chart.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "FutureFast: Executive Insights on AI, Web3 & Technology Disruption",
  description: "Executive insights on AI, Web3, robotics & exponential technology disruption. Real signals, no hype - curated for decision makers navigating the future of business.",
  keywords: "AI, artificial intelligence, OpenAI, ChatGPT, Claude AI, Web3, blockchain, robotics, future of work, technology disruption, executive insights, C-suite strategy, digital transformation, exponential technology",
  metadataBase: new URL("https://futurefast.ai"),
  robots: { index: true, follow: true },
  icons: { 
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" }
    ],
    shortcut: "/favicon.ico", 
    apple: "/favicon.svg" 
  },
  openGraph: {
    title: "FutureFast: Executive Insights on AI, Web3 & Technology Disruption",
    description: "Executive insights on AI, Web3, robotics & exponential technology disruption. Real signals, no hype - curated for decision makers navigating the future of business.",
    url: "https://futurefast.ai",
    siteName: "FutureFast",
    images: [{ 
      url: "https://futurefast.ai/images/design-thinking-ai.jpg", 
      width: 1200, 
      height: 630, 
      alt: "FutureFast - Design Thinking AI" 
    }],
    locale: "en_US",
    type: "website",
  },
  twitter: { 
    card: "summary_large_image", 
    title: "FutureFast: Executive Insights on AI, Web3 & Technology Disruption", 
    description: "Executive insights on AI, Web3, robotics & exponential technology disruption. Real signals, no hype - curated for decision makers navigating the future of business.", 
    images: ["https://futurefast.ai/images/design-thinking-ai.jpg"] 
  },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="canonical" href="https://futurefast.ai" />
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION} />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=G-F4CGW7GF6P`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-F4CGW7GF6P', { page_path: window.location.pathname });`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "FutureFast",
              url: "https://futurefast.ai",
              description: "Executive insights on AI, Web3, robotics & exponential technology disruption",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://futurefast.ai/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
            name: "FutureFast",
            alternateName: "FutureFast.ai",
            url: "https://futurefast.ai",
            logo: "https://futurefast.ai/favicon.svg",
            description: "Executive insights on AI, Web3, robotics & exponential technology disruption. Real signals, no hype - curated for decision makers navigating the future of business.",
            foundingDate: "2025",
            expertise: [
              "Artificial Intelligence",
              "Web3 Technology", 
              "Robotics",
              "Future of Work",
              "Technology Disruption",
              "Executive Strategy"
            ],
            knowsAbout: [
              "OpenAI",
              "ChatGPT",
              "Claude AI", 
              "Blockchain",
              "Machine Learning",
              "Robotics",
              "Web3",
              "Digital Transformation",
              "Exponential Technology"
            ],
            audience: {
              "@type": "Audience",
              audienceType: "business executives"
            },
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              availableLanguage: "English"
            },
            sameAs: [
              "https://twitter.com/yourprofile",
              "https://www.linkedin.com/in/yourprofile"
            ]
            },
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Deven Spear",
              "jobTitle": "Technology Strategist and Founder",
              "worksFor": {
                "@type": "Organization", 
                "name": "FutureFast"
              },
              "description": "Six-time founder with 30+ years of experience turning technology disruption into scalable business opportunities. Expert in AI strategy, Web3 technology, and digital transformation for executives.",
              "expertise": [
                "Artificial Intelligence Strategy",
                "Web3 Technology Implementation",
                "Digital Transformation Leadership",
                "Future of Work Planning",
                "Technology Disruption Analysis",
                "Executive Strategy Consulting"
              ],
              "knowsAbout": [
                "OpenAI",
                "ChatGPT",
                "Claude AI", 
                "Blockchain Technology",
                "Machine Learning Implementation",
                "Industrial Robotics",
                "Web3 Business Models",
                "Digital Transformation Strategy",
                "Exponential Technology Adoption"
              ],
              "alumniOf": "Technology Leadership",
              "hasCredential": "30+ years technology leadership experience",
              "url": "https://futurefast.ai",
              "sameAs": [
                "https://www.linkedin.com/in/yourprofile"
              ]
            }
          ]) }}
        />

        <script src="https://analytics.ahrefs.com/analytics.js" data-key="SlfmGp5buoGyJwIAkH5BJQ" async defer></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased overflow-x-hidden max-w-[100vw]`}>
        {children}
      </body>
    </html>
  );
}
