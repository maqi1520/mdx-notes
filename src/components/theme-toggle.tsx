'use client'

import React, { useEffect } from 'react'
import { ComputerIcon, MoonStarIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle({ variant }) {
  const { setTheme, theme } = useTheme()

  const updateThemeColor = (theme?: string) => {
    let themeColor = '#f9fbfc' // 默认浅色

    if (theme === 'system') {
      // 检测系统主题
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      themeColor = systemTheme === 'dark' ? '#0a1121' : '#f9fbfc'
    } else {
      themeColor = theme === 'dark' ? '#0a1121' : '#f9fbfc'
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', themeColor)
  }

  const handleSetTheme = (theme: string) => {
    setTheme(theme)
  }

  // 添加系统主题变化监听
  useEffect(() => {
    updateThemeColor(theme)
  }, [theme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonStarIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSetTheme('light')}>
          <SunIcon className="mr-2 h-5 w-5" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme('dark')}>
          <MoonStarIcon className="mr-2 h-5 w-5" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme('system')}>
          <ComputerIcon className="mr-2 h-5 w-5" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
