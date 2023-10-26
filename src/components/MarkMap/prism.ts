import { noop } from 'markmap-common'
import { refractor } from 'refractor'
import { toHtml } from 'hast-util-to-html'

const name = 'prism'

export const prismPlugin = {
  name,
  transform(transformHooks) {
    let enableFeature = noop
    transformHooks.parser.tap((md) => {
      md.set({
        highlight: (str: string, lang: string) => {
          enableFeature()
          try {
            const tree = refractor.highlight(str, lang)
            return toHtml(tree)
          } catch (error) {
            console.log(error)
          }

          return ''
        },
      })
    })
    transformHooks.beforeParse.tap((_, context) => {
      enableFeature = () => {
        context.features[name] = true
      }
    })
    return {
      styles: [],
    }
  },
}
