import React from 'react'

import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { GridIcon } from '@/components/icons'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute -z-10 inset-0 text-slate-900/[0.09] dark:text-gray-200/[0.1] [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]">
        <GridIcon className="absolute inset-0 h-full w-full" />
      </div>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  )
}
