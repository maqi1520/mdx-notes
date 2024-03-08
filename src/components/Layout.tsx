import React, { useEffect, useState } from 'react'
import i18n, { t } from '@/utils/i18n'
import Update from './Update'
import useLocalStorage from 'react-use/lib/useLocalStorage'
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = {
  children: React.ReactNode
}

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

interface Config {
  journalDir: string
  journalTemplateDir: string
  upload: string
  command: string
}

export default function Layout({ children }: Props) {
  let [language, setLanguage] = useState('en')
  let [config, setConfig] = useLocalStorage<Config>('config', {
    journalDir: '',
    journalTemplateDir: '',
    upload: 'none',
    command: '',
  })

  let [isOpen, setIsOpen] = useState(false)

  function handleSave() {
    localStorage.setItem('language', language)

    i18n.changeLanguage(language)
    setIsOpen(false)
    window.location.reload()
  }

  useEffect(() => {
    setLanguage(localStorage.getItem('language') || 'en')
    ;(window as any).openSetting = () => setIsOpen(true)
  }, [])

  return (
    <>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle> {t('Setting')}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="text-sm text-gray-500 dark:text-white flex items-center">
              <label
                className="flex-none px-2 w-28 text-right"
                htmlFor="journal"
              >
                {t('journal directory')}:
              </label>
              <Input
                value={config?.journalDir!}
                onChange={(e) =>
                  setConfig((prev: Config) => ({
                    ...prev,
                    journalDir: e.target.value,
                  }))
                }
              />
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
                value={config?.journalTemplateDir!}
                onChange={(e) =>
                  setConfig((prev: Config) => ({
                    ...prev,
                    journalTemplateDir: e.target.value,
                  }))
                }
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
              <Select
                value={config?.upload!}
                onValueChange={(value) =>
                  setConfig((prev: Config) => ({
                    ...prev,
                    upload: value,
                  }))
                }
              >
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

          {config?.upload === 'custom' && (
            <div className="mt-4">
              <div className="text-sm text-gray-500 dark:text-white flex items-center">
                <label
                  className="flex-none px-2 w-28 text-right"
                  htmlFor="upload"
                >
                  {t('Command')}:
                </label>
                <Input
                  value={config?.command}
                  onChange={(e) =>
                    setConfig((prev: Config) => ({
                      ...prev,
                      command: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="text-sm text-gray-500 dark:text-white flex items-center">
              <label
                className="flex-none px-2 w-28 text-right"
                htmlFor="language"
              >
                {t('Language')}:
              </label>
              <Select value={language} onValueChange={setLanguage}>
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

          <DialogFooter>
            <Button onClick={handleSave}>{t('Save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Update />
    </>
  )
}
