import { Logo } from './Logo'
import Link from 'next/link'

import { ThemeToggle } from '@/components/theme-toggle'
import { LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header({ children, rightbtn }) {
  return (
    <header
      className="relative z-20 flex-none py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center space-x-4 antialiased"
      style={{ fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }}
    >
      <div className="flex-auto flex items-center min-w-0 space-x-6">
        <Logo className="flex-none text-black dark:text-white" />
        {children}
      </div>
      <div className="flex items-center space-x-2">
        {rightbtn}

        {rightbtn && (
          <div className="block mx-2 lg:mx-2 w-px h-6 bg-gray-200 dark:bg-gray-700" />
        )}
        <Link href="/template">
          <Button size="icon" variant="secondary">
            <LayoutTemplate className="w-5 h-5" />
          </Button>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
