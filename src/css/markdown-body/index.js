import defaultSkin from '!!raw-loader!./default.css'
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
import { t } from '@/utils/i18n'

export const themes = {
  default: {
    name: t('default'),
    css: defaultSkin,
  },
  juejin: {
    name: t('JueJin'),
    css: juejin,
  },
  smartblue: {
    name: t('SmartBlue'),
    css: smartblue,
  },
  vgreen: {
    name: t('VGreen'),
    css: vgreen,
  },
  vuepress: {
    name: 'vuepress',
    css: vuepress,
  },
  chineseRed: {
    name: t('ChineseRed'),
    css: chineseRed,
  },
  channingCyan: {
    name: t('Cyan'),
    css: channingCyan,
  },
  condensedNightPurple: {
    name: t('CondensedPurple'),
    css: condensedNightPurple,
  },
  jzman: {
    name: 'jzman',
    css: jzman,
  },
  devuiBlue: {
    name: t('DevuiBlue'),
    css: devuiBlue,
  },
  geekBlack: {
    name: t('GeekBlack'),
    css: geekBlack,
  },
}
