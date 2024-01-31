import Link from 'next/link'

import { siteConfig } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="bg-background mt-16">
      <div className="border-t container mx-auto py-4 flex justify-between">
        <div>
          Made with ❤️ by
          <a
            href="https://maqib.cn"
            target="_blank"
            rel="noreferrer"
            className="font-bold underline-offset-2 transition hover:text-primary hover:underline"
          >
            &nbsp;maqibin
          </a>
          &nbsp;on&nbsp;
          <a
            href="https://github.com/maqi1520/mdx-editor"
            target="_blank"
            rel="noreferrer"
            className="font-bold underline-offset-2 transition hover:text-primary hover:underline"
          >
            GitHub
          </a>
        </div>
        <span>© 2024</span>
      </div>
    </footer>
  )
}
