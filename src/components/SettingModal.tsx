import React, { useContext, useState } from 'react'
import i18n from '@/utils/i18n'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslation } from 'react-i18next'
import { Context } from './Layout'

const data = [
  { value: 'zh-CN', name: '简体中文' },
  { value: 'en', name: 'English' },
]

const uploadOptions = [
  { value: 'none', name: 'None' },
  { value: 'PicGo', name: 'PicGo' },
  { value: 'custom', name: 'Custom' },
  { value: 'uPic', name: 'uPic(develop)' },
  { value: 'Picsee', name: 'Picsee(develop)' },
]

export default function SettingModal() {
  const { t } = useTranslation()
  let { config, setConfig, open, setOpen } = useContext(Context)

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    setConfig({
      ...config,
      ...data,
    })

    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> {t('Setting')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div className="text-sm text-gray-500 dark:text-white flex items-center">
              <label
                className="flex-none px-2 w-28 text-right"
                htmlFor="journal"
              >
                {t('journal directory')}:
              </label>
              <Input defaultValue={config?.journalDir!} name="journalDir" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500 dark:text-white flex items-center">
              <label
                className="flex-none px-2 w-28 text-right"
                htmlFor="journal"
              >
                {t('template directory')}:
              </label>
              <Input
                defaultValue={config?.journalTemplateDir!}
                placeholder="template/日记模版.md"
                name="journalTemplateDir"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500 dark:text-white flex items-center">
              <label
                className="flex-none px-2 w-28 text-right"
                htmlFor="upload"
              >
                {t('Upload Picture')}:
              </label>
              <Select defaultValue={config?.upload!} name="upload">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {uploadOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-500 dark:text-white flex items-center">
              <label
                className="flex-none px-2 w-28 text-right"
                htmlFor="upload"
              >
                {t('Custom command')}:
              </label>
              <Input defaultValue={config?.command} name="command" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-500 dark:text-white flex items-center">
              <label
                className="flex-none px-2 w-28 text-right"
                htmlFor="language"
              >
                {t('Language')}:
              </label>
              <Select
                value={i18n.language}
                onValueChange={(language) => i18n.changeLanguage(language)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {data.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button type="submit">{t('Save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
