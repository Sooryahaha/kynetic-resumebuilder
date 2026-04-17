import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Kynetic Resume Builder — AI-Powered ATS-Friendly Resumes",
  description:
    "Build world-class ATS-optimized resumes in minutes. Import from LinkedIn and GitHub, let AI craft your career story, and land your dream job.",
  keywords: [
    "resume builder",
    "ATS resume",
    "AI resume",
    "LinkedIn resume",
    "GitHub resume",
    "job application",
    "career",
    "kynetic",
  ],
  authors: [{ name: "Kynetic" }],
  openGraph: {
    title: "Kynetic Resume Builder — AI-Powered ATS-Friendly Resumes",
    description:
      "Import from LinkedIn + GitHub. AI generates your perfect resume in seconds.",
    type: "website",
    siteName: "Kynetic Resume Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kynetic Resume Builder",
    description: "AI-powered ATS-friendly resume generation platform",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              color: "#f8fafc",
              backdropFilter: "blur(20px)",
            },
          }}
        />
      </body>
    </html>
  );
}
