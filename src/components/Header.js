import { Logo } from './Logo'
import clsx from 'clsx'
import { toggleTheme } from '../utils/theme'
import { open } from '@tauri-apps/api/shell'
import { type } from '@tauri-apps/api/os'
import React, { useLayoutEffect, useState } from 'react'
import { LayoutTemplate, Sun, MoonStar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header({ children, logo, rightbtn }) {
  const [isMac, setIsMac] = useState(false)
  useLayoutEffect(() => {
    async function init() {
      const osType = await type()
      setIsMac(osType === 'Darwin')
    }
    init()
  }, [])
  return (
    <div
      data-tauri-drag-region
      className={clsx(
        'relative z-20 flex-none pb-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center justify-between antialiased select-none',
        isMac ? 'pt-6' : 'pt-3'
      )}
      style={{ fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }}
    >
      <div className="flex items-center min-w-0 space-x-2">
        {logo || <Logo className="flex-none text-black dark:text-white" />}
        {children}
      </div>
      <div className="flex items-center">
        {rightbtn}

        {rightbtn && (
          <div className="block mx-2 lg:mx-2 w-px h-6 bg-gray-200 dark:bg-gray-700" />
        )}

        <Button
          onClick={() => open('https://editor.runjs.cool/template')}
          size="icon"
          variant="outline"
        >
          <LayoutTemplate className="w-5 h-5" />
        </Button>

        <Button
          className="ml-2"
          size="icon"
          onClick={toggleTheme}
          variant="outline"
        >
          <Sun className="w-5 h-5 stroke-primary fill-sky-100 dark:fill-sky-400/50 hidden dark:block" />
          <MoonStar className="w-5 h-5 stroke-primary fill-sky-100 dark:fill-sky-400/50 dark:hidden" />
        </Button>
      </div>
    </div>
  )
}
