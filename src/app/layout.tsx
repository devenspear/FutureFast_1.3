import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../../styles/animation.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FutureFast: Empowering Speed",
  description: "Animated, mobile-first homepage for FutureFast.com built with Next.js and Tailwind CSS.",
  metadataBase: new URL("https://futurefast.com"),
  robots: { index: true, follow: true },
  icons: { 
    icon: [
      { url: "/poker-chip-favicon.svg", type: "image/svg+xml" },
      { url: "/poker-chip-favicon.png", type: "image/png" }
    ],
    shortcut: "/poker-chip-favicon.png", 
    apple: "/poker-chip-favicon.png" 
  },
  openGraph: {
    title: "FutureFast: Empowering Speed",
    description: "Animated, mobile-first homepage for FutureFast.com built with Next.js and Tailwind CSS.",
    url: "https://futurefast.com",
    siteName: "FutureFast",
    images: [{ url: "https://futurefast.com/social-share.png", width: 1200, height: 630, alt: "FutureFast Social Share Image" }],
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "FutureFast: Empowering Speed", description: "Animated, mobile-first homepage for FutureFast.com built with Next.js and Tailwind CSS.", images: ["https://futurefast.com/twitter-share.png"] },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "" },
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/poker-chip-favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/poker-chip-favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/poker-chip-favicon.png" />
        <link rel="canonical" href="https://futurefast.com" />
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
            url: "https://futurefast.com",
            logo: "https://futurefast.com/favicon.svg",
            sameAs: ["https://twitter.com/yourprofile","https://www.linkedin.com/in/yourprofile"]
          }) }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden max-w-[100vw]`}>{children}</body>
    </html>
  );
}
