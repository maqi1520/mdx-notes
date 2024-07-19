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
import { CircleEllipsis, Loader2Icon } from 'lucide-react'
import { Context } from './Layout'
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { message } from '@tauri-apps/plugin-dialog'
import { open } from '@tauri-apps/plugin-shell'
import { useTranslation } from 'react-i18next'
import { makeDoc, makePrintDoc } from './utils/index'
import { save } from '@tauri-apps/plugin-dialog'
import { writeTextFile } from '@tauri-apps/plugin-fs'

type Props = {
  resultRef: any
}

export default function MoreDropdown({ resultRef }: Props) {
  const { setOpen } = useContext(Context)
  const [visible, onOpenChange] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const { t } = useTranslation()

  const handleCheckUpdate = async () => {
    if (isDownloading) {
      return
    }
    setIsDownloading(true)
    try {
      const update = await check()

      if (update?.available) {
        // You could show a dialog asking the user if they want to install the update here.
        console.log(`Installing update ${update?.version}`)

        // Install the update. This will also restart the app on Windows!
        await update.downloadAndInstall()

        // On macOS and Linux you will need to restart the app manually.
        // You could use this step to display another confirmation dialog.
        await relaunch()
      } else {
        message(t('Already the latest version'), {
          title: t('Prompt'),
          kind: 'info',
        })
      }
    } catch (error) {
      message(error, { title: t('Prompt'), kind: 'info' })
      console.error(error)
    } finally {
      setIsDownloading(false)
    }
  }
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
      const filePath = await save({
        title: t('Save'),
        filters: [
          {
            name: title,
            extensions: ['html'],
          },
        ],
      })

      //download(title + '.mdx', md)
      if (filePath) {
        await writeTextFile(filePath, doc)
      }
    }
  }
  const handleExport = async () => {
    const { frontMatter = {}, md } = resultRef.current
    if (md) {
      const title = frontMatter.title || 'MDX Editor'
      const filePath = await save({
        title: t('Save'),
        filters: [
          {
            name: title,
            extensions: ['md', 'mdx'],
          },
        ],
      })

      //download(title + '.mdx', md)
      if (filePath) {
        await writeTextFile(filePath, md)
      }
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
          onClick={() => open('https://editor.runjs.cool/template')}
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
        <DropdownMenuItem onClick={handleCheckUpdate}>
          {isDownloading ? (
            <div className="flex items-center">
              <Loader2Icon className="w-4 h-4 mr-1" /> {t('Downloading')}
            </div>
          ) : (
            t('Check update')
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpen(true)}>
          {t('Setting')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
