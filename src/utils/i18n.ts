import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import LanguageDetector from 'i18next-browser-languagedetector'
import ENtranslation from './locales/en/translation.json'
import zhCNtranslation from './locales/zh-CN/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    resources: {
      en: {
        translation: ENtranslation,
      },
      'zh-CN': {
        translation: zhCNtranslation,
      },
    },

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  })

export const t = i18n.t

export default i18n
