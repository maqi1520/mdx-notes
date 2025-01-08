import dynamic from 'next/dynamic'
import isMobile from 'is-mobile'

const EditorDesktop = dynamic(() => import('./EditorDesktop'), { ssr: false })
const EditorMobile = dynamic(() => import('./EditorMobile'), {
  ssr: false,
})

export const Editor = isMobile() ? EditorMobile : EditorDesktop
