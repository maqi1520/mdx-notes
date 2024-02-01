import '@/css/main.css'
import { Metadata } from 'next'

import { siteConfig } from '@/config/site'
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import SupabaseProvider from '@/app/supabase-provider'
import type { Viewport } from 'next'
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicons/favicon.ico',
    shortcut: '/favicons/favicon-32x32.png',
    apple: '/favicons/apple-touch-icon.png',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
        >
          <div className="absolute -z-10 inset-0 text-slate-900/[0.09] dark:text-gray-200/[0.1] [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]">
            <svg
              className="absolute inset-0 h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="grid-bg"
                  width="32"
                  height="32"
                  patternUnits="userSpaceOnUse"
                  x="100%"
                  patternTransform="translate(0 -1)"
                >
                  <path
                    d="M0 32V.5H32"
                    fill="none"
                    stroke="currentColor"
                  ></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-bg)"></rect>
            </svg>
          </div>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SupabaseProvider>
              {children}
              <Toaster />
            </SupabaseProvider>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
