import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PWAInstaller } from '@/components/pwa-installer'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10b981' },
    { media: '(prefers-color-scheme: dark)', color: '#059669' },
  ],
}

export const metadata: Metadata = {
  title: 'NutriTrack - Your Friendly Diet Companion',
  description: 'Track your nutrition, budget, and health goals with a warm, encouraging approach',
  generator: 'v0.app',
  applicationName: 'NutriTrack',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NutriTrack',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
    shortcut: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <PWAInstaller />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
