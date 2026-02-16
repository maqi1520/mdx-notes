import Link from 'next/link'

import { siteConfig } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="bg-background mt-16">
      <div className="container mx-auto">
        <div className="border-t py-4 flex justify-between">
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
              href="https://github.com/maqi1520/mdx-notes"
              target="_blank"
              rel="noreferrer"
              className="font-bold underline-offset-2 transition hover:text-primary hover:underline"
            >
              GitHub
            </a>
          </div>
          <span>© 2024</span>
        </div>
        <div className="border-t py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">友情链接：</span>
            <a
              href="https://md2card.cn?utm_source=mdxnotes&utm_medium=referral"
              target="_blank"
              rel="noreferrer"
              className="text-sm hover:text-primary hover:underline"
            >
              md2card 国内版
            </a>
            <a
              href="https://md2card.com?utm_source=mdxnotes&utm_medium=referral"
              target="_blank"
              rel="noreferrer"
              className="text-sm hover:text-primary hover:underline"
            >
              md2card
            </a>
            <a
              href="https://vibe2design.com?utm_source=mdxnotes&utm_medium=referral"
              target="_blank"
              rel="noreferrer"
              className="text-sm hover:text-primary hover:underline"
            >
              vibe design
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
