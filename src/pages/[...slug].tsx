import { useState, useEffect } from 'react'
import Error from 'next/error'
import { sizeToObject } from '@/utils/size'
import { getLayoutQueryString } from '@/utils/getLayoutQueryString'
import { get } from '@/lib/database'
import { getDefaultContent } from '@/utils/getDefaultContent'

import dynamic from 'next/dynamic'
const Pen = dynamic(() => import('@/components/Pen'), {
  ssr: false,
})

type Result = {
  title: string
  content: { html: string; css: string; config: string }
  id: string
}

export default function App({ errorCode, id, ...props }) {
  const [initialContent, setContent] = useState(props.initialContent)

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(id)!)

      if (data) {
        setContent(data)
      }
    } catch (error) {}
  }, [id])
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }
  return <Pen {...props} initialContent={initialContent} />
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
    return {
      props: {
        id: 'content',
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
    const id = params.slug[0]
    const res = await get<Result>(id)

    if (res) {
      return {
        props: {
          id,
          initialContent: res.content,
          initialPath: `/${res.id}${getLayoutQueryString({
            layout: query.layout,
            responsiveSize: query.size,
            file: query.file,
          })}`,
          ...layoutProps,
        },
      }
    }
    return {
      props: {
        errorCode: 500,
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
