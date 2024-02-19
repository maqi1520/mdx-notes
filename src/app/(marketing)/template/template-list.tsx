'use client'
import React from 'react'
import Loading from './loading'

import Image from 'next/image'
import Link from 'next/link'
import { useTemplates } from '@/hooks/useTemplates'

export default function TemplateList() {
  const { value: data, loading } = useTemplates(10)

  if (loading) return <Loading />

  return (
    <ul className="grid max-w-[26rem] sm:max-w-[52.5rem] mt-16 sm:mt-20 md:mt-32 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-6 lg:gap-y-8 xl:gap-x-8 lg:max-w-7xl px-4 sm:px-6 lg:px-8">
      {data!.map((item) => (
        <li
          key={item.id}
          className="group rounded-3xl bg-slate-50 p-6 dark:bg-slate-800/80 dark:highlight-white/5 hover:bg-slate-100 dark:hover:bg-slate-700/50"
        >
          <div className="aspect-[672/460] rounded-md overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.08)] bg-slate-200 dark:bg-slate-700">
            <Link href={'/post?id=' + item.docId}>
              <Image
                width={672}
                height={460}
                alt=""
                className="block transition-transform hover:scale-110"
                src={item.img}
              />
            </Link>
          </div>
          <div className="flex flex-wrap items-center mt-6">
            <h2 className="text-sm leading-6 text-slate-900 dark:text-white font-semibold group-hover:text-sky-500 dark:group-hover:text-sky-400">
              <Link href={'/post?id=' + item.docId}>{item.name}</Link>
            </h2>

            <div className="w-full flex-none text-xs leading-6 text-slate-500 dark:text-slate-400">
              {item.description}
              {item.tags &&
                item.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-purple-500 ml-2 px-3 py-1.5 leading-none rounded-full text-xs font-medium uppercase text-white inline-block"
                  >
                    <span>{tag}</span>
                  </div>
                ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
