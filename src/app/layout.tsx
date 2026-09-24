import type { Metadata } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { WaitlistProvider } from "@/components/waitlist-provider";
import { site } from "@/lib/site";
import { siteOrigin } from "@/lib/site-url";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: "NeuroAd: know how your ad lands",
  description:
    "NeuroAd predicts attention, emotion, memory and purchase intent for video and image ads, then tells you exactly what to change.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "NeuroAd: know how your ad lands",
    description:
      "Predict attention, emotion, memory and purchase intent before you publish.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroAd: know how your ad lands",
    description:
      "Predict attention, emotion, memory and purchase intent before you publish.",
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${newsreader.variable} h-full`}
    >
      <body className="min-h-full font-sans">
        <Script id="loader-skip" strategy="beforeInteractive">
          {`try{if(sessionStorage.getItem("neuroad-loader")==="1"||window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("loader-skip")}}catch(e){}`}
        </Script>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <WaitlistProvider>{children}</WaitlistProvider>
        {site.launchState === "live" ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "NeuroAd",
                applicationCategory: "BusinessApplication",
                description:
                  "Predicts attention, emotion, memory and purchase intent for video and image ads.",
                url: siteOrigin(),
              }),
            }}
          />
        ) : null}
      </body>
    </html>
  );
}
