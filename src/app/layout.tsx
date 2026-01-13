import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ===================== SEO METADATA =====================
export const metadata: Metadata = {
  metadataBase: new URL("https://digrosys.com"),
  title: "DIGROSYS | AI Automation, App & Web Development Agency",
  description:
    "Scale your revenue with engineering-driven growth. We build high-performance Websites, Mobile Apps, AI Agents, and Digital Marketing systems. Starting at ₹5,000.",
  keywords: [
    "Web Development India",
    "AI Automation Agency",
    "Mobile App Development",
    "Performance Marketing",
    "Digital Growth Systems",
    "Digrosys",
  ],
  authors: [{ name: "DIGROSYS", url: "https://digrosys.com" }],
  creator: "DIGROSYS",
  publisher: "DIGROSYS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://digrosys.com",
    siteName: "DIGROSYS",
    title: "DIGROSYS | AI Automation, App & Web Development Agency",
    description:
      "Scale your revenue with engineering-driven growth. We build high-performance Websites, Mobile Apps, AI Agents, and Digital Marketing systems. Starting at ₹5,000.",
    images: [
      {
        url: "https://digrosys.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DIGROSYS - Digital Growth Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DIGROSYS | AI Automation, App & Web Development Agency",
    description:
      "Scale your revenue with engineering-driven growth. We build high-performance Websites, Mobile Apps, AI Agents, and Digital Marketing systems.",
    images: ["https://digrosys.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION_KEY", // Replace with actual key
  },
  alternates: {
    canonical: "https://digrosys.com",
  },
};

// ===================== JSON-LD STRUCTURED DATA =====================
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "DIGROSYS",
  url: "https://digrosys.com",
  logo: "https://digrosys.com/logo.png",
  description: "System-driven performance marketing and development agency.",
  priceRange: "₹5,000 - ₹2,50,000",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
    addressLocality: "Kolkata",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91 91630 34822",
    contactType: "sales",
    email: "hello@digrosys.com",
  },
  sameAs: ["https://www.linkedin.com/company/digrosys/"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* Google Analytics 4 */}
        <GoogleAnalytics gaId="G-5DJLN4Y3LJ" />

        {/* Microsoft Clarity */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "v0xjd3d5x1");
            `,
          }}
        />
      </body>
    </html>
  );
}
