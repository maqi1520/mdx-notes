import { useState, useEffect } from 'react'
import Error from 'next/error'
import { get } from '../utils/database'
import { useRouter } from 'next/router'
import { sizeToObject } from '../utils/size'
import { getDefaultContent } from '../utils/getDefaultContent'
import Head from 'next/head'

//import Pen from '../components/Pen'
import dynamic from 'next/dynamic'
const Pen = dynamic(() => import('../components/Pen'), {
  ssr: false,
})

export default function App() {
  const router = useRouter()
  const query = router.query
  const [errorCode, setErrorCode] = useState()
  const [initialContent, setContent] = useState({})
  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (query.id) {
      try {
        get(query.id).then((res) => {
          setContent(res)
        })
      } catch (error) {
        setErrorCode(500)
      }
      return
    }
    try {
      const data = JSON.parse(localStorage.getItem('content'))
      if (data) {
        setContent(data)
      } else {
        getDefaultContent().then((res) => {
          setContent(res)
        })
      }
    } catch (error) {}
  }, [query])

  const layoutProps = {
    initialLayout: ['vertical', 'horizontal', 'preview'].includes(query.layout)
      ? query.layout
      : 'vertical',
    initialResponsiveSize: sizeToObject(query.size),
    initialActiveTab: ['html', 'css', 'config'].includes(query.file)
      ? query.file
      : 'html',
  }
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }
  return (
    <>
      <Head>
        <meta
          property="og:url"
          content={`https://editor.runjs.cool${
            initialContent._id ? `/${initialContent._id}` : ''
          }`}
        />
        <meta
          name="twitter:card"
          content={initialContent._id ? 'summary' : 'summary_large_image'}
        />
        <meta
          name="twitter:image"
          content={
            initialContent._id
              ? 'https://editor.runjs.cool/social-square.png'
              : 'https://editor.runjs.cool/social-card.jpg'
          }
        />
        {!initialContent._id && (
          <meta
            property="og:image"
            content="https://editor.runjs.cool/social-card.jpg"
          />
        )}
      </Head>
      <Pen {...layoutProps} initialContent={initialContent} />
    </>
  )
}
