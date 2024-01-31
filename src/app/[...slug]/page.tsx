import React from 'react'
import Pen from '@/components/Pen'

import { sizeToObject } from '@/utils/size'
import { getLayoutQueryString } from '@/utils/getLayoutQueryString'
import { get } from '@/utils/database'
import { getDefaultContent } from '@/utils/getDefaultContent'

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | undefined }
}
type Result = {
  html: string
  css: string
  config: string
  _id: string
}

export default async function Page({ params, searchParams: query }: Props) {
  const layoutProps = {
    initialLayout: ['vertical', 'horizontal', 'preview'].includes(
      query.layout || ''
    )
      ? query.layout
      : 'vertical',
    initialResponsiveSize: sizeToObject(query.size),
    initialActiveTab: ['html', 'css', 'config'].includes(query.file || '')
      ? query.file
      : 'html',
  }

  let initialContent: any = {
    html: '',
    css: '',
    config: '',
  }
  let initialPath = ''
  const id = params.slug[0]

  if (!params.slug || (params.slug.length === 1 && id === 'create')) {
    initialContent = await getDefaultContent()
  } else if (id.length === 24) {
    const res = await get<Result>(params.slug[0])
    initialContent = res
    initialPath = `/${res._id}${getLayoutQueryString({
      layout: query.layout,
      responsiveSize: query.size,
      file: query.file,
    })}`
  }

  return (
    <Pen
      initialContent={initialContent}
      initialPath={initialPath}
      {...layoutProps}
    />
  )
}
