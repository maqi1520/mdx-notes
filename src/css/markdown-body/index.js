import tailwind from '!!raw-loader!./tailwind-blue.css'
import juejin from '!!raw-loader!./juejin.css'
import vgreen from '!!raw-loader!./v-green.css'
import vuepress from '!!raw-loader!./vuepress.css'
import smartblue from '!!raw-loader!./smart-blue.css'
import chineseRed from '!!raw-loader!./chinese-red.css'
import channingCyan from '!!raw-loader!./channing-cyan.css'
import condensedNightPurple from '!!raw-loader!./condensed-night-purple.css'
import jzman from '!!raw-loader!./jzman.css'
import devuiBlue from '!!raw-loader!./devui-blue.css'
import geekBlack from '!!raw-loader!./geek-black.css'

export const themes = {
  default: {
    name: '天空蓝',
    css: tailwind,
  },
  juejin: {
    name: '掘金',
    css: juejin,
  },
  smartblue: {
    name: '灵动蓝',
    css: smartblue,
  },
  vgreen: {
    name: '微绿',
    css: vgreen,
  },
  vuepress: {
    name: 'vuepress',
    css: vuepress,
  },
  chineseRed: {
    name: '中国红',
    css: chineseRed,
  },
  channingCyan: {
    name: '柠青',
    css: channingCyan,
  },
  condensedNightPurple: {
    name: '凝夜紫',
    css: condensedNightPurple,
  },
  jzman: {
    name: 'jzman',
    css: jzman,
  },
  devuiBlue: {
    name: '科技蓝',
    css: devuiBlue,
  },
  geekBlack: {
    name: '极客黑',
    css: geekBlack,
  },
}
