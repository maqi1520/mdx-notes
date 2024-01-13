import Image from 'next/image'
import React from 'react'
import { getTemplates } from '../utils/database'
import Link from 'next/link'
import { Header } from '../components/Header'

export default function Templates({ data }) {
  return (
    <>
      <Header></Header>
      <section className="w-full px-5 py-6 mx-auto space-y-5 sm:py-8 md:py-12 sm:space-y-8 md:space-y-16 max-w-7xl">
        <div className="grid grid-cols-12 pb-10 sm:px-5 gap-x-8 gap-y-16">
          {data.map((item) => (
            <div
              key={item._id}
              className="flex flex-col items-start col-span-12 space-y-3 sm:col-span-6 xl:col-span-4"
            >
              <Link className="block" href={'/' + item.docId}>
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
                <Link href={'/' + item.docId}>{item.name}</Link>
              </h2>
              <p className="text-sm text-gray-500">{item.desc}</p>
              <p className="pt-2 text-xs font-medium">
                <Link className="mr-1 underline" href={'/' + item.docId}>
                  {item.creator}
                </Link>
                <span className="mx-1">
                  {new Date(item.createTime).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export async function getServerSideProps({ params, res, query }) {
  try {
    const res = await getTemplates({
      action: 'template',
      search: query.search,
    })

    return {
      props: {
        data: res.data,
        hasmore: res.hasMore,
      },
    }
  } catch (error) {
    return {
      props: {
        errorCode: error.status || 500,
      },
    }
  }
}
