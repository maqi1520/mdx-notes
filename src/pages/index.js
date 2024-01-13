import React from 'react'
import Image from 'next/image'
//import Pen from '../components/Pen'
import { buttonVariants } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { getTemplates } from '../utils/database'
import { Header } from '../components/Header'
import {
  BookOpenCheckIcon,
  BrushIcon,
  CodeIcon,
  DownloadIcon,
  FileTextIcon,
  GithubIcon,
  ListIcon,
  NotepadTextIcon,
  PaletteIcon,
  PrinterIcon,
  QrCodeIcon,
  ShareIcon,
} from 'lucide-react'
import { OpenAIIcon, WechatIcon } from '../components/icons'

const Hero = dynamic(() => import('../components/hero/index'), {
  ssr: false,
})

const features = [
  {
    icon: <WechatIcon />,
    text: '支持一键复制到微信公众号',
  },
  {
    icon: <BrushIcon />,
    text: '支持自定义组件，自定义样式',
  },
  {
    icon: <PaletteIcon />,
    text: '内置10+主题和代码主题',
  },
  {
    icon: <QrCodeIcon />,
    text: '支持生成二维码',
  },
  {
    icon: <CodeIcon />,
    text: '支持代码 diff 高亮',
  },
  {
    icon: <ListIcon />,
    text: '支持生成文章目录',
  },
  {
    icon: <NotepadTextIcon />,
    text: '支持生成微信脚注',
  },
  {
    icon: <BookOpenCheckIcon />,

    text: '支持文档格式化',
  },
  {
    icon: <ShareIcon />,
    text: '支持文章分享',
  },
  {
    icon: <FileTextIcon />,
    text: '支持下载 markdown',
  },
  {
    icon: <PrinterIcon />,
    text: '支持导出 pdf',
  },
  {
    icon: <OpenAIIcon />,
    text: '对接 ChatGPT，提高写作能力',
  },
]

const users = ['JS酷', 'web技术学院', '前端充电宝', '云谦和他的朋友们']

export default function Page({ data = [] }) {
  return (
    <div className="relative min-h-full">
      <div className="absolute inset-0 h-screen  bg-no-repeat bg-slate-50 dark:bg-[#0B1120] index_beams">
        <div className="absolute inset-0 h-screen bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5"></div>
      </div>
      <Header />
      <div className="container mx-auto p-5">
        <Hero>
          <div className="mt-12 text-center">
            <div className="mt-12 text-3xl sm:text-5xl">
              一个微信排版编辑器，使用 MDX
            </div>
            <div className="mt-12 flex justify-center space-x-4">
              <Link
                className={buttonVariants({
                  variant: 'outline',
                  size: 'lg',
                })}
                href="/create"
              >
                Web 版
              </Link>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/maqi1520/mdx-editor/releases"
                className={buttonVariants({ size: 'lg' })}
              >
                <DownloadIcon className="w-5 h-5" />
                <span>下载桌面版</span>
              </a>
            </div>
          </div>
        </Hero>
        <div className="relative">
          <section className="mt-20 px-8 text-center sm:mt-32 md:mt-40">
            <h2 className="text-3xl tracking-tight sm:text-5xl">
              更是一个跨平台 Markdown 笔记软件
            </h2>
            <p className="mx-auto mt-6 max-w-5xl text-lg">
              使用
              <a
                target="_blank"
                rel="noreferrer"
                href="https://tauri.app/"
                className="mx-1 font-semibold text-primary hover:text-primary/90"
              >
                tauri
              </a>
              开发了一个桌面App，支持
              MacOS、Windows、Linux，整个应用非常轻量，安装程序小于 10 MB
            </p>

            <div className="mt-6 flex justify-center">
              <video
                controls
                loop
                className="rounded-xl"
                width="1200"
                height="780"
              >
                <source src="/demo.mp4" type="video/mp4" />
              </video>
            </div>
          </section>
          <section className=" mt-20 px-8 sm:mt-32 md:mt-40">
            <h2 className="text-center text-3xl tracking-tight sm:text-5xl">
              MDX Editor 的能力
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2 xl:grid-cols-4 xl:gap-y-10">
              {features.map((f, index) => (
                <li
                  key={index}
                  className="border group hover:border-primary hover:bg-primary/20  cursor-pointer rounded-md p-3  shadow-sm flex justify-center"
                >
                  <div>
                    <div className="p-4 flex justify-center">{f.icon}</div>
                    <div>{f.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section className="mt-20 px-8 text-center sm:mt-32 md:mt-40">
            <h2 className="text-3xl tracking-tight sm:text-5xl">丰富模板</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg">
              MDX 结合了 Markdown 和 JSX 的优点，它让你可以在 Markdown
              文档中直接使用 React 组件，构建复杂的交互式文档。如果你熟悉
              React，你可以在 Config
              标签页中自定义你的组件；如果你不是一个程序员，不会使用JSX，那么你也可以基于现有模板进行创作。
            </p>
            <div className="mt-10 grid grid-cols-2 gap-10">
              {data.map((item) => (
                <div key={item.docId}>
                  <div className="overflow-hidden rounded">
                    <Link href={'/' + item.docId}>
                      <Image
                        width={711}
                        height={500}
                        alt=""
                        className="transition-transform hover:scale-110"
                        src={item.img}
                      />
                    </Link>
                  </div>
                  <div className="mt-4">
                    <Link href={'/' + item.docId} className="underline">
                      {item.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="mt-20 px-8 text-center sm:mt-32 md:mt-40">
            <h2 className="text-3xl tracking-tight sm:text-5xl">项目灵感</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg">
              Markdown 是广大程序员酷爱的写作方式，但满足不了微信排版的需求，MDX
              正好弥补了 Markdown 的缺陷。我的博客正好也是使用 MDX
              来书写的，如何做到一次书写，排版统一？ 当我看到
              <a
                className="mx-1 font-semibold text-primary"
                target="_blank"
                rel="noreferrer"
                href="https://mdxjs.com/playground/"
              >
                mdxjs playground
              </a>
              的时候，我就在思考，能否实现类似的方案？
            </p>
          </section>
          <section className="mt-20 px-8 text-center sm:mt-32 md:mt-40">
            <h2 className="text-3xl tracking-tight sm:text-5xl">他们都在用</h2>
            <div>
              <ul className="mt-10 grid grid-cols-2 gap-x-16 gap-y-8 md:grid-cols-4 xl:gap-y-10">
                {users.map((user) => (
                  <li
                    key={user}
                    className="border group hover:border-primary hover:bg-primary/20  cursor-pointer rounded-md p-3  shadow-sm flex justify-center"
                  >
                    {user}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="mt-20 px-8 text-center sm:mt-32 md:mt-40">
            <h2 className="text-3xl tracking-tight sm:text-5xl">觉得不错？</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg">
              将 MDX Editor 分享给你的朋友{' '}
              <a
                target="_blank"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  '推荐一个微信排版编辑器，使用MDX，可自定义组件、样式、生成二维码、代码 diff 高亮，可导出 markdown 和 PDF，也是一款跨平台 Markdown 笔记软件'
                )}&url=https://editor.runjs.cool`}
                className={buttonVariants()}
              >
                一键分享到 Twitter
              </a>
            </p>
          </section>
          <div className="mt-16 pt-10 border-t flex justify-between">
            <div>
              Made with ❤️ by
              <a
                href="https://maqib.cn"
                target="_blank"
                rel="noreferrer"
                className="font-bold underline-offset-2 transition hover:text-primary hover:underline"
              >
                &nbsp;maqibin
              </a>
              &nbsp;on&nbsp;
              <a
                href="https://github.com/maqi1520/mdx-editor"
                target="_blank"
                rel="noreferrer"
                className="font-bold underline-offset-2 transition hover:text-primary hover:underline"
              >
                GitHub
              </a>
            </div>
            <span>© 2024</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ params, res, query }) {
  try {
    const res = await getTemplates({
      action: 'template',
      search: query.search,
      pageSize: 6,
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
