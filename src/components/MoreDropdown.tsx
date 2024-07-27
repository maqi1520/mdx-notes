import React, { useContext, useState } from 'react'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CircleEllipsis } from 'lucide-react'
import { Context } from './Layout'
import { openLink } from '@/lib/bindings'
import { useTranslation } from 'react-i18next'
import { makeDoc, makePrintDoc } from './utils/index'
import { downloadFile } from '@/lib/bindings'
import CheckUpdate from './CheckUpdate'

type Props = {
  resultRef: any
}

export default function MoreDropdown({ resultRef }: Props) {
  const { setOpen } = useContext(Context)
  const [visible, onOpenChange] = useState(false)

  const { t } = useTranslation()

  const handleClear = () => {
    localStorage.clear()
    window.location.reload()
  }

  const handleExportPDF = () => {
    const { html, css, frontMatter = {} } = resultRef.current

    const doc = makePrintDoc(html, css)
    const print = document.querySelector('#print')
    print!.innerHTML = doc
    window.print()
  }

  const handleExportHtml = async () => {
    const { html, css, frontMatter = {} } = resultRef.current

    const title = frontMatter.title || 'MDX Editor'
    if (html) {
      const doc = makeDoc(title, html, css)

      downloadFile(title + '.html', doc)
    }
  }
  const handleExport = async () => {
    const { frontMatter = {}, md } = resultRef.current
    if (md) {
      const title = frontMatter.title || 'MDX Editor'
      downloadFile(title + '.md', md)
    }
  }
  return (
    <DropdownMenu open={visible} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <CircleEllipsis
            className={clsx('w-5 h-5', {
              'stroke-primary fill-sky-100 dark:fill-sky-400/50': visible,
            })}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="print:hidden">
        <DropdownMenuItem
          onClick={() => openLink('https://editor.runjs.cool/template')}
        >
          {t('Templates')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportHtml}>
          {t('Export HTML')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          {t('Export PDF')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExport}>
          {t('Save as')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleClear}>
          {t('Clear storage')}
        </DropdownMenuItem>
        <CheckUpdate />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpen(true)}>
          {t('Setting')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
