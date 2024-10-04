export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'MDX Notes',
  title: 'MDX Notes - 跨平台笔记软件，公众号排版编辑器，使用 MDX 来排版',
  description:
    'MDX Notes 是一个跨平台笔记软件，也是一个微信公众号排版编辑器，使用MDX，可自定义组件、样式、生成二维码、代码 diff 高亮，可导出 markdown 和 PDF',
  mainNav: [
    {
      title: '首页',
      href: '/',
    },
    {
      title: '模版',
      href: '/template',
    },
  ],
  links: {
    twitter: 'https://twitter.com/maqi1520',
    github: 'https://github.com/maqi1520/mdx-notes',
  },
}
