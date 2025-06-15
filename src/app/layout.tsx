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
  title: "FutureFast: Empowering Speed",
  description: "Animated, mobile-first homepage for FutureFast.ai built with Next.js and Tailwind CSS.",
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
    title: "FutureFast: Empowering Speed",
    description: "Animated, mobile-first homepage for FutureFast.ai built with Next.js and Tailwind CSS.",
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
    title: "FutureFast: Empowering Speed", 
    description: "Animated, mobile-first homepage for FutureFast.ai built with Next.js and Tailwind CSS.", 
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "FutureFast",
            url: "https://futurefast.ai",
            logo: "https://futurefast.ai/favicon.svg",
            sameAs: ["https://twitter.com/yourprofile","https://www.linkedin.com/in/yourprofile"]
          }) }}
        />

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased overflow-x-hidden max-w-[100vw]`}>{children}</body>
    </html>
  );
}
