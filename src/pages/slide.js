import React, { useEffect, useState } from 'react'
import Preview from '../components/Slide/Preview'

export default function Slide() {
  const [initialContent, setContent] = useState({})
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('slide'))

      if (data) {
        console.log(data)
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
