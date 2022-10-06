import mdxcss from '!!raw-loader!./mdx.css'
import katex from '!!raw-loader!katex/dist/katex.css'
import prism from '!!raw-loader!prismjs/themes/prism.css'
import tomorrow from '!!raw-loader!prismjs/themes/prism-tomorrow.css'
import twilight from '!!raw-loader!prismjs/themes/prism-twilight.css'
import coy from '!!raw-loader!./prism-coy.css'
import dark from '!!raw-loader!prismjs/themes/prism-dark.css'
import okaidia from '!!raw-loader!./prism-okaidia.css'
import solarizedlight from '!!raw-loader!prismjs/themes/prism-solarizedlight.css'

export const baseCss = mdxcss + katex

export const codeThemes = {
  default: {
    name: 'Prism',
    css: prism,
  },
  tomorrow: {
    name: 'Tomorrow',
    css: tomorrow,
  },
  twilight: {
    name: 'Twilight',
    css: twilight,
  },
  coy: {
    name: 'Coy',
    css: coy,
  },
  dark: {
    name: 'Dark',
    css: dark,
  },
  okaidia: {
    name: 'Okaidia',
    css: okaidia,
  },
  solarizedlight: {
    name: 'Solarized Light',
    css: solarizedlight,
  },
}
