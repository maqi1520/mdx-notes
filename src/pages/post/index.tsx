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
  const id = query.id as string

  useEffect(() => {
    if (router.isReady) {
      const fetchContent = async () => {
        const content = localStorage.getItem('content')
        if (id == 'demo' && content) {
          setInitialContent(JSON.parse(content))
          return
        }
        try {
          const res = await postData({
            url: '/api/auth/post_get',
            data: {
              id,
            },
          })
          if (res) {
            setInitialContent(res)
          }
        } catch (error) {
          console.log(error)
          setErrorCode(404)
        }
      }
      fetchContent()
    }
  }, [id, router.isReady])

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

  if (router.isReady && (!id || errorCode)) {
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
    return <Pen {...layoutProps} id={id} initialContent={initialContent} />
  }
  return null
}
