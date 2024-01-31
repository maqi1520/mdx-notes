import React from 'react'
import Image from 'next/image'
import { getTemplates } from '@/lib/database'
import Link from 'next/link'
import { Result } from '@/types/template'

export default async function Page() {
  const data = (await getTemplates<Result>()) ?? []

  return (
    <section className="w-full px-5 py-6 mx-auto space-y-5 sm:py-8 md:py-12 sm:space-y-8 md:space-y-16 max-w-7xl">
      <div className="grid grid-cols-12 pb-10 sm:px-5 gap-x-8 gap-y-16">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-start col-span-12 space-y-3 sm:col-span-6 xl:col-span-4"
          >
            <Link className="block" href={'/' + item.doc_id}>
              <Image
                width={711}
                height={500}
                alt=""
                className="transition-transform hover:scale-110"
                src={item.img}
              />
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
            <h2 className="text-lg font-bold sm:text-xl md:text-2xl">
              <Link href={'/post/' + item.doc_id}>{item.name}</Link>
            </h2>
            <p className="text-sm text-gray-500">{item.desc}</p>
            <p className="pt-2 text-xs font-medium">
              <Link className="mr-1 underline" href={'/' + item.doc_id}>
                {item.creator}
              </Link>
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
