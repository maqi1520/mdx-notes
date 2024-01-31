import React from 'react'

import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getUserDetails } from '../supabase-server'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  const userDetail = await getUserDetails()
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={userDetail} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  )
}
