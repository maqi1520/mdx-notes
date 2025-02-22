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
import { OpenPanelComponent } from '@openpanel/nextjs'

export const viewport: Viewport = {
  themeColor: '#f9fbfc',
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
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
          <OpenPanelComponent
            clientId="2bc47e6a-df50-4e0b-93b0-7645ff33f796"
            trackScreenViews={true}
            trackAttributes={true}
            trackOutgoingLinks={true}
          />
        </body>
        <GoogleAnalytics gaId="G-5JNZYV86WB" />
      </html>
    </>
  )
}
