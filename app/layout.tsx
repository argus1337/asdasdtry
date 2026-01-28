import React from "react"
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: 'CreateSync | Influencer Marketing Agency',
  description: 'Full-service influencer marketing agency with end-to-end campaign management. We connect brands with creators on TikTok, Instagram, and YouTube.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/images/createsync-logo-icon-new.png',
        type: 'image/png',
      },
    ],
    apple: '/images/createsync-logo-icon-new.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
