import { Logo } from './Logo'
import Link from 'next/link'

import { ThemeToggle } from '@/components/theme-toggle'
import { LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserInfo } from '@/components/user-account-nav'
import { cn } from '@/lib/utils'

interface Props {
  children?: React.ReactNode
  rightBtn?: React.ReactNode
}

export function Header({ children, rightBtn }: Props) {
  return (
    <header
      className="relative z-20 flex-none py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center space-x-4 antialiased"
      style={{ fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }}
    >
      <div className="flex-auto sm:flex items-center min-w-0">
        <Logo className={cn(children && 'hidden md:flex mr-3')} />
        {children}
      </div>
      <div className="flex items-center space-x-2">
        {rightBtn}

        {rightBtn && (
          <div className="block mx-2 lg:mx-2 w-px h-6 bg-gray-200 dark:bg-gray-700" />
        )}
        <Link href="/template">
          <Button size="icon" variant="secondary">
            <LayoutTemplate className="w-5 h-5" />
          </Button>
        </Link>
        <ThemeToggle variant="secondary" />
        <UserInfo />
      </div>
    </header>
  )
}
