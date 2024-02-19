'use client'
import { SidebarNav } from '@/components/sidebar-nav'
import { useGlobalValue } from '@/hooks/useGlobalValue'
import { FileIcon, UserIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const sidebarNavItems = [
  {
    icon: <UserIcon className="w-4 h-4" />,
    title: '个人信息',
    href: '/dashboard/settings',
  },
  {
    icon: <FileIcon className="w-4 h-4" />,
    title: '我的文章',
    href: '/dashboard/posts',
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [globalValue] = useGlobalValue()
  if (!globalValue?.user) {
    return null
  }

  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 container mx-auto pt-6">
      <aside className="lg:w-1/5">
        <SidebarNav items={sidebarNavItems} />
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  )
}
