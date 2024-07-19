import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (!('theme' in localStorage)) {
                    localStorage.theme = window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? 'dark'
                      : 'light'
                  }
                  if (localStorage.theme === 'dark') {
                    document.querySelector('html').classList.add('dark')
                  }
                } catch (_) {}
              `
                .replace(/\s+/g, '')
                .replace("'inlocal", "' in local"),
            }}
          />
        </Head>
        <body className="w-full min-h-screen flex bg-white dark:bg-gray-900">
          <div id="print" className="hidden relative z-50 print:block" />
          <div className="print:hidden w-full">
            <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    )
  }
}
