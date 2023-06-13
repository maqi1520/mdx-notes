import React from 'react'
import { getTemplates } from '../utils/database'
import Link from 'next/link'
import Error from 'next/error'
import { useAsync } from 'react-use'
import Header from '../components/Header'

export default function Templates() {
  const { error, value } = useAsync(() =>
    getTemplates({
      action: 'template',
      search: '',
    })
  )
  if (error) {
    return <Error statusCode={500} />
  }

  return (
    <>
      <Header></Header>
      <section className="w-full px-5 py-6 mx-auto space-y-5 sm:py-8 md:py-12 sm:space-y-8 md:space-y-16 max-w-7xl">
        <div className="grid grid-cols-12 pb-10 sm:px-5 gap-x-8 gap-y-16">
          {value?.data.map((item) => (
            <div
              key={item._id}
              className="flex flex-col items-start col-span-12 space-y-3 sm:col-span-6 md:col-span-4"
            >
              <Link href={'/?id=' + item.docId}>
                <a className="block">
                  <img
                    alt={item.name}
                    className="object-cover w-full mb-2 overflow-hidden rounded-lg shadow-sm max-h-56"
                    src={item.img}
                  />
                </a>
              </Link>
              {item.tags &&
                item.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-purple-500 px-3 py-1.5 leading-none rounded-full text-xs font-medium uppercase text-white inline-block"
                  >
                    <span>{tag}</span>
                  </div>
                ))}
              <h2 className="text-lg font-bold md:text-xl">
                <Link href={'/?id=' + item.docId}>
                  <a>{item.name}</a>
                </Link>
              </h2>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
