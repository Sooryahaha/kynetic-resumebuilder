import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Kynetic — AI Resume Builder",
  description: "Connect GitHub and LinkedIn. AI synthesizes a perfectly ATS-optimized resume for your target role in under 2 minutes.",
  keywords: ["resume builder", "ATS resume", "AI resume", "LinkedIn resume", "GitHub resume", "career"],
  authors: [{ name: "Kynetic" }],
  openGraph: {
    title: "Kynetic — AI Resume Builder",
    description: "Import from LinkedIn + GitHub. AI generates your perfect resume in seconds.",
    type: "website",
    siteName: "Kynetic Resume OS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kynetic — AI Resume Builder",
    description: "AI-powered ATS-optimized resume platform",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="antialiased bg-black">
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#ffffff",
            },
          }}
        />
      </body>
    </html>
  );
}
