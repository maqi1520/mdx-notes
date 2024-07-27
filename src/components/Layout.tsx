import React, { useLayoutEffect, useState } from 'react'
import SettingModal from './SettingModal'
import { useLocalStorage } from 'react-use'
import { getMacOS } from '@/lib/bindings'
import { Toaster } from '@/components/ui/toaster'
import { Confirm } from './ui/confirm'

type Props = {
  children: React.ReactNode
}

interface Config {
  journalDir: string
  journalTemplateDir: string
  upload: string
  command: string
}

export const Context = React.createContext<{
  isMacOS: boolean
  config: Config
  open: boolean
  setConfig: React.Dispatch<React.SetStateAction<Config>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isMacOS: false,
  config: {
    journalDir: '',
    journalTemplateDir: '',
    upload: 'none',
    command: '',
  },
  open: false,
  setConfig: () => {},
  setOpen: () => {},
})

export default function Layout({ children }: Props) {
  const [isMacOS, setIsMacOS] = useState(false)
  let [config, setConfig] = useLocalStorage<Config>('config', {
    journalDir: '',
    journalTemplateDir: '',
    upload: 'none',
    command: '',
  })

  let [open, setOpen] = useState(false)
  useLayoutEffect(() => {
    getMacOS().then((res: boolean) => {
      setIsMacOS(res)
    })
  }, [])

  return (
    <Context.Provider
      value={{
        isMacOS,
        config: config!,
        setConfig,
        open,
        setOpen,
      }}
    >
      {children}
      <Toaster />
      <Confirm />
      <SettingModal />
    </Context.Provider>
  )
}
