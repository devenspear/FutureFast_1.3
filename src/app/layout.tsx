import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" />
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
