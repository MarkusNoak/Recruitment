import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Automation Audit — Discover Your Potential',
  description:
    'Get a personalized AI automation analysis for your business in minutes. Identify your biggest opportunities, estimate ROI, and receive a custom implementation roadmap.',
  openGraph: {
    title: 'AI Automation Audit — Discover Your Potential',
    description:
      'Free AI-powered audit that reveals your top automation opportunities and estimated annual savings.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
