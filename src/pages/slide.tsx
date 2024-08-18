import React, { useEffect, useState } from 'react'
import Preview from '../components/Slide/Preview'
import { getItem } from '@/utils/storage'

export default function Slide() {
  const [initialContent, setContent] = useState<{
    html?: string
    config?: string
    css?: string
  }>({})
  useEffect(() => {
    try {
      const data = getItem('slide')

      if (data) {
        setContent(data)
      }
    } catch (error) {}
  }, [])
  return (
    <Preview
      md={initialContent.html}
      js={initialContent.config}
      css={initialContent.css}
    />
  )
}
