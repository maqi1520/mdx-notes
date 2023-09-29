import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import Select from './Select'
import i18n, { t } from '@/utils/i18n'
import Update from './Update'
import useLocalStorage from 'react-use/lib/useLocalStorage'

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
  { value: 'uPic', name: 'uPic(develop)' },
  { value: 'Picsee', name: 'Picsee(develop)' },
]

interface Config {
  upload: string
  command: string
}

export default function Layout({ children }: Props) {
  let [language, setLanguage] = useState('en')
  let [config, setConfig] = useLocalStorage<Config>('config', {
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
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[100]"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full h-[320px] max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800"
                  >
                    {t('Setting')}
                  </Dialog.Title>

                  <div className="mt-4">
                    <div className="text-sm text-gray-500 dark:text-white flex items-center">
                      <label
                        className="flex-none px-2 w-28 text-right"
                        htmlFor="upload"
                      >
                        {t('Upload Picture')}:
                      </label>
                      <Select
                        data={uploadOptions}
                        value={config?.upload!}
                        onChange={(value) =>
                          setConfig((prev: Config) => ({
                            ...prev,
                            upload: value,
                          }))
                        }
                      />
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
                        <input
                          className="w-full rounded py-2 pl-3 pr-10 text-left focus:outline-none border-gray-200 border dark:border-gray-700 text-gray-500 dark:text-white bg-transparent"
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
                      <Select
                        data={data}
                        value={language}
                        onChange={setLanguage}
                      />
                    </div>
                  </div>
                  <div className="mt-10 text-center">
                    <button
                      type="button"
                      className="rounded-md text-sm font-semibold leading-6 py-1.5 px-5  hover:bg-sky-400 bg-sky-500 text-white shadow-sm dark:shadow-highlight/20"
                      onClick={handleSave}
                    >
                      {t('Save')}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Update />
    </>
  )
}
