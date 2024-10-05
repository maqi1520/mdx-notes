'use client'

import { useState, useEffect } from 'react'
import Error from 'next/error'
import { sizeToObject } from '@/utils/size'
import { useSearchParams } from 'next/navigation'
import { postData } from '@/utils/helpers'
import dynamic from 'next/dynamic'
import Loading from '@/components/Loading'
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
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const layout = searchParams.get('layout')
  const size = searchParams.get('size')
  const file = searchParams.get('file')

  useEffect(() => {
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
  }, [id])

  const layoutProps = {
    initialLayout: ['vertical', 'horizontal', 'preview'].includes(
      layout as string
    )
      ? layout
      : 'vertical',
    initialResponsiveSize: sizeToObject(size),
    initialActiveTab: ['html', 'css', 'config'].includes(file as string)
      ? file
      : 'html',
  }

  if (!id || errorCode) {
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
  return <Loading />
}
