import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import Select from './Select'
import i18n, { t } from '@/utils/i18n'
import Update from './Update'

type Props = {
  children: React.ReactNode
}

const data = [
  { value: 'zh-CN', name: '简体中文' },
  { value: 'en', name: 'English' },
]

export default function Layout({ children }: Props) {
  let [language, setLanguage] = useState('en')
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800"
                  >
                    {t('Setting')}
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="text-sm text-gray-500 dark:text-white flex items-center">
                      <label className="flex-none px-2" htmlFor="language">
                        {t('Language')}:
                      </label>
                      <Select
                        data={data}
                        value={language}
                        onChange={setLanguage}
                      />
                    </div>
                  </div>

                  <div className="mt-10">
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
