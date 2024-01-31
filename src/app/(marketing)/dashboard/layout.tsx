import { SidebarNav } from '@/components/sidebar-nav'

const sidebarNavItems = [
  {
    title: '个人信息',
    href: '/dashboard/settings',
  },
  {
    title: '我的文章',
    href: '/dashboard/posts',
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 container mx-auto pt-6">
      <aside className="lg:w-1/5">
        <SidebarNav items={sidebarNavItems} />
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  )
}
