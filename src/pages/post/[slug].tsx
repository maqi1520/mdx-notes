import { useState, useEffect } from 'react'
import Error from 'next/error'
import { sizeToObject } from '@/utils/size'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { postData } from '@/utils/helpers'
const Pen = dynamic(() => import('@/components/Pen'), {
  ssr: false,
})

interface Post {
  _id: string
  css: string
  config: string
  title: string
  author_id: string
  html: string
}

export default function App() {
  const [errorCode, setErrorCode] = useState(0)
  const [initialContent, setInitialContent] = useState<Post | null>()
  const router = useRouter()
  const { query } = router
  const slug = query.slug as string

  useEffect(() => {
    if (router.isReady) {
      const fetchContent = async () => {
        const res = await postData({
          url: '/auth/post_get',
          data: {
            id: slug,
          },
        })
        if (res) {
          setInitialContent(res)
        }
      }
      fetchContent()
    }
  }, [slug, router.isReady])

  const layoutProps = {
    initialLayout: ['vertical', 'horizontal', 'preview'].includes(
      query.layout as string
    )
      ? query.layout
      : 'vertical',
    initialResponsiveSize: sizeToObject(query.size),
    initialActiveTab: ['html', 'css', 'config'].includes(query.file as string)
      ? query.file
      : 'html',
  }

  if (errorCode) {
    return (
      <Error
        withDarkMode={true}
        title={
          errorCode === 403
            ? 'You are not authorized to access this page'
            : 'An unexpected error has occurred'
        }
        statusCode={errorCode}
      />
    )
  }
  if (initialContent) {
    return <Pen {...layoutProps} id={slug} initialContent={initialContent} />
  }
  return null
}
