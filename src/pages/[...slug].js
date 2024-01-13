import { useState, useEffect } from 'react'
import Error from 'next/error'
import { sizeToObject } from '../utils/size'
import { getLayoutQueryString } from '../utils/getLayoutQueryString'
import { get } from '../utils/database'
import { getDefaultContent } from '../utils/getDefaultContent'
import Head from 'next/head'

//import Pen from '../components/Pen'
import dynamic from 'next/dynamic'
const Pen = dynamic(() => import('../components/Pen'), {
  ssr: false,
})

export default function App({ errorCode, ...props }) {
  const [initialContent, setContent] = useState(props.initialContent)
  const id = props.initialContent?.ID || 'content'

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(id))

      if (data) {
        setContent(data)
      }
    } catch (error) {}
  }, [id])
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }
  return (
    <>
      <Head>
        <meta
          property="og:url"
          content={`https://editor.runjs.cool${
            initialContent.ID ? `/${initialContent.ID}` : ''
          }`}
        />
        <meta
          name="twitter:card"
          content={initialContent.ID ? 'summary' : 'summary_large_image'}
        />
        <meta
          name="twitter:image"
          content={
            initialContent.ID
              ? 'https://editor.runjs.cool/social-square.png'
              : 'https://editor.runjs.cool/social-card.jpg'
          }
        />
        {!initialContent.ID && (
          <meta
            property="og:image"
            content="https://editor.runjs.cool/social-card.jpg"
          />
        )}
      </Head>
      <Pen {...props} initialContent={initialContent} />
    </>
  )
}

export async function getServerSideProps({ params, res, query }) {
  const layoutProps = {
    initialLayout: ['vertical', 'horizontal', 'preview'].includes(query.layout)
      ? query.layout
      : 'vertical',
    initialResponsiveSize: sizeToObject(query.size),
    initialActiveTab: ['html', 'css', 'config'].includes(query.file)
      ? query.file
      : 'html',
  }

  if (
    !params.slug ||
    (params.slug.length === 1 && params.slug[0] === 'create')
  ) {
    res.setHeader(
      'cache-control',
      'public, max-age=0, must-revalidate, s-maxage=31536000'
    )
    return {
      props: {
        initialContent: await getDefaultContent(),
        ...layoutProps,
      },
    }
  }

  if (params.slug.length !== 1) {
    return {
      props: {
        errorCode: 404,
      },
    }
  }

  try {
    const { Item: initialContent } = await get({
      ID: params.slug[0],
    })

    res.setHeader(
      'cache-control',
      'public, max-age=0, must-revalidate, s-maxage=31536000'
    )

    return {
      props: {
        initialContent,
        initialPath: `/${initialContent.ID}${getLayoutQueryString({
          layout: query.layout,
          responsiveSize: query.size,
          file: query.file,
        })}`,
        ...layoutProps,
      },
    }
  } catch (error) {
    return {
      props: {
        errorCode: error.status || 500,
      },
    }
  }
}
