import { Popover, Transition, Listbox, Switch } from '@headlessui/react'
import React, { Fragment } from 'react'
import clsx from 'clsx'

export default function ThemeDropdown({ themes, codeThemes, onChange, value }) {
  return (
    <>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={clsx(
                'group inline-flex px-3 py-3 justify-center text-gray-600 dark:text-gray-200  content-center ml-4 sm:ml-0 ring-1 ring-gray-900/5 shadow-sm hover:bg-gray-50 dark:ring-0 dark:bg-gray-800 dark:hover:bg-gray-700 dark:shadow-highlight/4 group focus:outline-none focus-visible:ring-2 rounded-md focus-visible:ring-sky-500 dark:focus-visible:ring-2 dark:focus-visible:ring-gray-400  focus-visible:ring-opacity-75',
                {
                  'text-opacity-90': open,
                }
              )}
            >
              <span>设置</span>
              <svg
                className={clsx(
                  'ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-opacity-80',
                  {
                    'text-opacity-70': open,
                  }
                )}
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute top-full right-0 mt-2 rounded-lg shadow-lg">
                <div className="p-3 w-64 space-y-2 rounded-lg bg-white ring-1 ring-gray-900/10 text-sm leading-6 font-semibold text-gray-700 dark:bg-gray-800 dark:ring-0 dark:text-gray-300 dark:shadow-highlight/4">
                  <div className="flex items-center">
                    <label className="flex-none">主题：</label>
                    <ThemeSelector
                      themes={themes}
                      onChange={(markdownTheme) =>
                        onChange({ ...value, markdownTheme })
                      }
                      value={value.markdownTheme}
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex-none">代码：</label>
                    <ThemeSelector
                      themes={codeThemes}
                      onChange={(codeTheme) =>
                        onChange({ ...value, codeTheme })
                      }
                      value={value.codeTheme}
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex-none">Mac 风格：</label>
                    <Switch
                      checked={value.isMac}
                      onChange={(isMac) => onChange({ ...value, isMac })}
                      className={`${
                        value.isMac ? 'bg-sky-500' : 'bg-sky-500/40'
                      }  inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span
                        className={`${
                          value.isMac ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  )
}

function ThemeSelector({ themes, onChange, value }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative mt-1 flex-auto">
        <Listbox.Button className="relative w-full rounded cursor-pointer py-2 pl-3 pr-10 text-left focus:outline-none border-gray-200 border dark:border-gray-700">
          <span className="block truncate">{themes[value].name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-900">
            {Object.keys(themes).map((key) => (
              <Listbox.Option
                key={key}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'text-sky-900 bg-sky-500/10 dark:text-sky-50' : ''
                  }`
                }
                value={key}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {themes[key].name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-500">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
