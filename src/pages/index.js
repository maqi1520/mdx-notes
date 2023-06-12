import React from 'react'

//import Pen from '../components/Pen'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { Header } from '../components/Header'

const Hero = dynamic(() => import('../components/Hero'), {
  ssr: false,
})

export default function page() {
  return (
    <div className="relative min-h-full">
      <div className="absolute inset-0  bg-no-repeat bg-slate-50 dark:bg-[#0B1120] index_beams">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04]  dark:bg-grid-slate-400/[0.05]  dark:border-slate-100/5"></div>
      </div>
      <Header />
      <div className="container mx-auto p-5">
        <Hero>
          <div className="mt-12 text-center">
            <div className="mt-12 text-3xl">
              一个微信排版编辑器，使用 MDX 来排版
            </div>
            <div className="mt-12 flex justify-center space-x-4">
              <Link href="/create">
                <a className="inline-block text-xl rounded leading-6 py-4 px-6 border-sky-500 border ml-2 ring-1 ring-gray-900/5 shadow-sm hover:bg-gray-50 dark:ring-0 dark:bg-gray-800 dark:hover:bg-gray-700 dark:shadow-highlight/4  focus:outline-none focus-visible:ring-2  focus-visible:ring-sky-500 dark:focus-visible:ring-2 dark:focus-visible:ring-gray-400">
                  Web 版
                </a>
              </Link>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/maqi1520/mdx-editor/releases"
                className="flex text-xl  rounded leading-6 py-4 px-6  bg-sky-500 hover:bg-sky-600 text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                <span>下载桌面版</span>
              </a>
            </div>
          </div>
        </Hero>
      </div>
    </div>
  )
}
