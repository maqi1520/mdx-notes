import Link from 'next/link'
import { LogoIcon } from '@/components/icons'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function Logo({ className = '' }) {
  return (
    <Link className="flex items-center" href="/">
      <LogoIcon className={cn('w-8 h-8 text-primary', className)} />

      <span className="ml-2 font-medium text-2xl">{siteConfig.name}</span>
    </Link>
  )
}
