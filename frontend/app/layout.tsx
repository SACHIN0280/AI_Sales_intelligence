import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "SalesMind",
  description:
    "AI-powered sales intelligence for modern teams. Score leads, summarize meetings, generate follow-ups, and close more deals with SalesMind AI.",
  keywords: "AI sales, lead scoring, sales intelligence, CRM, sales automation",
  openGraph: {
    title: "SalesMind AI",
    description: "AI-powered sales intelligence for modern teams.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: "#141414", color: "#e0e0e0", minHeight: "100vh" }}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#ffffff",
            },
          }}
        />
      </body>
    </html>
  );
}
