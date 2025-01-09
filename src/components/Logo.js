import Link from 'next/link'
import { LogoIcon } from '@/components/icons'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function Logo({ className = '' }) {
  return (
    <Link className={cn('items-center flex', className)} href="/">
      <LogoIcon className="w-8 h-8 text-primary flex-none" />
      <span className="ml-2 font-medium text-sm md:text-2xl">
        {siteConfig.name}
      </span>
    </Link>
  )
}
