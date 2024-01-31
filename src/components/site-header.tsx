import { siteConfig } from '@/config/site'
import { MainNav } from '@/components/main-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserAccountNav } from '@/components/user-account-nav'

export async function SiteHeader({ user }) {
  return (
    <header className="sticky top-0 bg-white supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75 backdrop-blur px-4 sm:px-6 md:px-8 border-b">
      <div className="flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle variant="ghost" />
            <UserAccountNav user={user} />
          </nav>
        </div>
      </div>
    </header>
  )
}
