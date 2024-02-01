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
  author_id: string
}

interface Props {
  errorCode?: number
  initialContent: { html: string; css: string; config: string }
  id: string
  author_id: string
  initialLayout: string
  initialPath: string
  initialResponsiveSize: { width: number; height: number }
  initialActiveTab: string
}
export default function App({ errorCode, ...props }: Props) {
  if (errorCode) {
    return (
      <Error
        withDarkMode
        title={
          errorCode === 403
            ? 'You are not authorized to access this page'
            : 'An unexpected error has occurred'
        }
        statusCode={errorCode}
      />
    )
  }
  return <Pen {...props} />
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

  if (params.slug === 'demo') {
    return {
      props: {
        initialContent: await getDefaultContent(),
        ...layoutProps,
      },
    }
  }

  try {
    const id = params.slug
    const res = await get<Result>(id)

    if (res) {
      return {
        props: {
          id,
          initialContent: res.content,
          author_id: res.author_id,
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
        errorCode: 403,
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
