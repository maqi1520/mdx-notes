import { readTextFile, resolve } from '@/lib/bindings'
import dayjs from 'dayjs'
import { Pencil } from 'lucide-react'
import React, { useContext } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useTranslation } from 'react-i18next'
import { Context } from './Layout'

type Props = {
  openMd: (file: string, content?: string) => void
  dirPath: string
}

export default function JournalButton({ openMd, dirPath }: Props) {
  const { t } = useTranslation()
  const { toast } = useToast()

  let { config } = useContext(Context)

  const createOrOpenDailyNote = async () => {
    const fileName = dayjs().format('YYYY-MM-DD')

    const fullPath = config.journalDir
      ? config.journalDir + '/' + fileName
      : fileName
    if (config.journalTemplateDir) {
      const filePath = await resolve(dirPath, config.journalTemplateDir.trim())

      try {
        const content = await readTextFile(filePath)
        openMd(fullPath, content.replace(/{{date}}/g, fileName))
      } catch (error) {
        toast({
          title: t('Error'),
          description: t('The template file does not exist'),
        })
      }
    } else {
      openMd(fullPath)
    }
  }
  return (
    <Button onClick={createOrOpenDailyNote} size="sm">
      <Pencil className="w-4 h-4 mr-1" />
      {t('journal')}
    </Button>
  )
}
