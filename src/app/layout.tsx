import '@/css/main.css'
import 'prismjs/themes/prism-okaidia.css'
import { Metadata } from 'next'

import { siteConfig } from '@/config/site'
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import type { Viewport } from 'next'
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'

export const viewport: Viewport = {
  themeColor: '#f9fbfc',
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [
    {
      name: 'mdxnotes',
      url: 'https://mdxnotes.com',
    },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  creator: 'mdxnotes.com',
  publisher: 'mdxnotes.com',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mdxnotes.com'),
  icons: {
    icon: '/favicons/favicon.ico',
    shortcut: '/favicons/favicon-32x32.png',
    apple: '/favicons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  manifest: '/manifest.json',
  openGraph: {
    url: 'https://mdxnotes.com',
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: '/social-card.jpg',
        width: 1012,
        height: 506,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: '/social-card.jpg',
        width: 1012,
        height: 506,
      },
    ],
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <GoogleTagManager gtmId="GTM-5NXS7JR9" />
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
            <TailwindIndicator />
          </ThemeProvider>
        </body>
        <GoogleAnalytics gaId="G-5JNZYV86WB" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9163539254569883"
          crossOrigin="anonymous"
        ></Script>
      </html>
    </>
  )
}
