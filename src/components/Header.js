import { Logo } from './Logo'
import clsx from 'clsx'
import { toggleTheme } from '../utils/theme'
import React, { useContext } from 'react'
import { Sun, MoonStar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Context } from './Layout'

export default function Header({ children, logo }) {
  const { isMacOS } = useContext(Context)
  return (
    <div
      data-tauri-drag-region
      className={clsx(
        'sticky top-0 z-20 flex-none pb-3 px-5 flex items-center justify-between antialiased select-none border-b dark:shadow-lg',
        isMacOS ? 'pt-6' : 'pt-4'
      )}
      style={{ fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }}
    >
      <div className="flex items-center min-w-0 space-x-2">
        {logo || <Logo className="flex-none text-black dark:text-white" />}
      </div>
      <div className="flex items-center space-x-2">
        {children}
        <div className="block mx-2 w-px h-6 bg-gray-200 dark:bg-gray-700" />
        <Button size="icon" onClick={toggleTheme} variant="outline">
          <Sun className="w-5 h-5 stroke-primary fill-sky-100 dark:fill-sky-400/50 hidden dark:block" />
          <MoonStar className="w-5 h-5 stroke-primary fill-sky-100 dark:fill-sky-400/50 dark:hidden" />
        </Button>
      </div>
    </div>
  )
}
