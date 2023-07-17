import '../css/main.css'
import 'prismjs/themes/prism-okaidia.css'
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react'

const TITLE = ' MDX Editor | 一个微信排版编辑器，使用 MDX 来排版'
const DESCRIPTION =
  '微信排版编辑器，使用MDX，可自定义组件、样式、生成二维码、代码 diff 高亮，可导出 markdown 和 PDF'
const FAVICON_VERSION = 3

if (typeof window !== 'undefined') {
  require('../workers/subworkers')
}

function v(href) {
  return `${href}?v=${FAVICON_VERSION}`
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={v('/favicons/apple-touch-icon.png')}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={v('/favicons/favicon-32x32.png')}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={v('/favicons/favicon-16x16.png')}
        />
        <link rel="manifest" href={v('/favicons/site.webmanifest')} />
        <link
          rel="mask-icon"
          href={v('/favicons/safari-pinned-tab.svg')}
          color="#38bdf8"
        />
        <link rel="shortcut icon" href={v('/favicons/favicon.ico')} />
        <meta name="apple-mobile-web-app-title" content="MDX Editor" />
        <meta name="application-name" content="MDX Editor" />
        <meta name="msapplication-TileColor" content="#38bdf8" />
        <meta
          name="msapplication-config"
          content={v('/favicons/browserconfig.xml')}
        />

        <title>{TITLE}</title>
        <meta content={DESCRIPTION} name="description" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={TITLE} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta name="twitter:site" content={TITLE} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
