import React, { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'

interface Item {
  value: string
  name: string
}

interface Props {
  data: Item[]
  onChange: (val: string) => void
  value: string
}

export default function Selector({ data, onChange, value }: Props) {
  const current = data.find((item) => item.value === value)
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative flex-auto">
        <Listbox.Button className="relative w-full rounded cursor-pointer py-2 pl-3 pr-10 text-left focus:outline-none border-gray-200 border dark:border-gray-700">
          <span className="block truncate">{current?.name || value}</span>
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
            {data.map((item) => (
              <Listbox.Option
                key={item.value}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'text-sky-900 bg-sky-500/10 dark:text-sky-50' : ''
                  }`
                }
                value={item.value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {item.name}
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
