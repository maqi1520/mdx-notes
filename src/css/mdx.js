import mdxcss from '!!raw-loader!./mdx.css'
import katex from '!!raw-loader!katex/dist/katex.css'
import prism from '!!raw-loader!prismjs/themes/prism.css'
import tomorrow from '!!raw-loader!prismjs/themes/prism-tomorrow.css'
import twilight from '!!raw-loader!prismjs/themes/prism-twilight.css'
import solarizedlight from '!!raw-loader!prismjs/themes/prism-solarizedlight.css'
import oneLight from '!!raw-loader!prism-themes/themes/prism-one-light.css'
import vs from '!!raw-loader!prism-themes/themes/prism-vs.css'
import dark from '!!raw-loader!prism-themes/themes/prism-holi-theme.css'
import materialLight from '!!raw-loader!prism-themes/themes/prism-material-light.css'
import materialDark from '!!raw-loader!prism-themes/themes/prism-material-dark.css'
import okaidia from '!!raw-loader!./prism-okaidia.css'

export const baseCss = mdxcss + katex

export const codeThemes = {
  materialLight: {
    name: 'Material Light',
    css: materialLight,
  },
  materialDark: {
    name: 'Material Dark',
    css: materialDark,
  },
  oneLight: {
    name: 'oneLight',
    css: oneLight,
  },
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
    name: 'vs',
    css: vs,
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
