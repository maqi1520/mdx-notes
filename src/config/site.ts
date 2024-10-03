export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'MDX Notes',
  description:
    '微信排版编辑器，使用MDX，可自定义组件、样式、生成二维码、代码 diff 高亮，可导出 markdown 和 PDF',
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
