import { Logo } from './Logo'
import clsx from 'clsx'
import Link from 'next/link'
import { toggleTheme } from '../utils/theme'
import { t } from '@/utils/i18n'
import { type } from '@tauri-apps/api/os'
import React, { useLayoutEffect, useState } from 'react'
import { HeaderButton } from '@/components/ui/button'

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
        <Link href="/templates">
          <HeaderButton
            className="block ring-1 ring-gray-900/5 shadow-sm hover:bg-gray-50 dark:ring-0 dark:bg-gray-800 dark:hover:bg-gray-700 dark:shadow-highlight/4"
            naturalWidth={24}
            naturalHeight={24}
            width={36}
            height={36}
            label={
              <>
                <span>{t('Templates')}</span>
              </>
            }
            iconClassName="stroke-sky-500 fill-sky-100 group-hover:stroke-sky-600 dark:stroke-gray-400 dark:fill-gray-400/20 dark:group-hover:stroke-gray-300"
            ringClassName="focus-visible:ring-sky-500 dark:focus-visible:ring-2 dark:focus-visible:ring-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </HeaderButton>
        </Link>
        <HeaderButton
          className="ml-2 ring-1 ring-gray-900/5 shadow-sm hover:bg-gray-50 dark:ring-0 dark:bg-gray-800 dark:hover:bg-gray-700 dark:shadow-highlight/4"
          naturalWidth={24}
          naturalHeight={24}
          width={36}
          height={36}
          label={
            <>
              <span className="dark:hidden">{t('Switch to dark theme')}</span>
              <span className="hidden dark:inline">
                {t('Switch to light theme')}
              </span>
            </>
          }
          onClick={toggleTheme}
          iconClassName="stroke-sky-500 fill-sky-100 group-hover:stroke-sky-600 dark:stroke-gray-400 dark:fill-gray-400/20 dark:group-hover:stroke-gray-300"
          ringClassName="focus-visible:ring-sky-500 dark:focus-visible:ring-2 dark:focus-visible:ring-gray-400"
        >
          <g className="dark:opacity-0">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            <path d="M19 3v4" />
            <path d="M21 5h-4" />
          </g>
          <g className="opacity-0 dark:opacity-100">
            <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
            <path
              d="M12 3v1M18.66 5.345l-.828.828M21.005 12.005h-1M18.66 18.665l-.828-.828M12 21.01V20M5.34 18.666l.835-.836M2.995 12.005h1.01M5.34 5.344l.835.836"
              fill="none"
            />
          </g>
        </HeaderButton>
      </div>
    </div>
  )
}
