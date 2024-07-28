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
  config: Config
  open: boolean
  setConfig: React.Dispatch<React.SetStateAction<Config>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
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
  let [config, setConfig] = useLocalStorage<Config>('config', {
    journalDir: '',
    journalTemplateDir: '',
    upload: 'none',
    command: '',
  })

  let [open, setOpen] = useState(false)

  return (
    <Context.Provider
      value={{
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
