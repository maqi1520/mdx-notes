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
      <div className="container mx-auto">
        <Hero>
          <div className="mt-12 text-center">
            <div className="mt-12 text-3xl">
              一个微信排版编辑器，使用 MDX 来排版
            </div>
            <div className="mt-12">
              <Link href="/create">
                <a className="inline-block mx-auto text-2xl rounded leading-6 py-4 px-6  bg-sky-500 hover:bg-sky-600 text-white">
                  即刻体验
                </a>
              </Link>
            </div>
          </div>
        </Hero>
      </div>
    </div>
  )
}
