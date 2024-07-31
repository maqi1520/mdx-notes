import { readTextFile, resolve } from '@/lib/bindings'
import dayjs from 'dayjs'
import { Pencil } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useTranslation } from 'react-i18next'

type Props = {
  openMd: (file: string, content?: string) => void
}

export default function JournalButton({ openMd }: Props) {
  const { t } = useTranslation()
  const { toast } = useToast()

  const createOrOpenDailyNote = async () => {
    const fileName = dayjs().format('YYYY-MM-DD')
    const dirPath = JSON.parse(localStorage.getItem('dir-path') ?? '')
    const config = JSON.parse(localStorage.getItem('config') ?? '{}')

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
