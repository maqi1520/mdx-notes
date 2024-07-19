import React, { useLayoutEffect, useState } from 'react'
import SettingModal from './SettingModal'
import { useLocalStorage } from 'react-use'
import { type } from '@tauri-apps/plugin-os'

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
    type().then((os) => {
      setIsMacOS(os === 'macos')
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
      <SettingModal />
    </Context.Provider>
  )
}
