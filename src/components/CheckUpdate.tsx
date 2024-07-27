import React, { useState } from 'react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Loader2Icon } from 'lucide-react'
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { message } from '@tauri-apps/plugin-dialog'
import { useTranslation } from 'react-i18next'

type Props = {}

export default function CheckUpdate({}: Props) {
  const { t } = useTranslation()
  const [isDownloading, setIsDownloading] = useState(false)
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
  return (
    <DropdownMenuItem onClick={handleCheckUpdate}>
      {isDownloading ? (
        <div className="flex items-center">
          <Loader2Icon className="w-4 h-4 mr-1" /> {t('Downloading')}
        </div>
      ) : (
        t('Check update')
      )}
    </DropdownMenuItem>
  )
}
