import React, { useState, useEffect, useContext } from 'react'

import { compileMdx } from '../../../hooks/compileMdx'
import { Context } from './Context'

export default function SlideItem({ item, className }) {
  const { js } = useContext(Context)
  const [html, setHtml] = useState('')

  useEffect(() => {
    if (item.content) {
      compileMdx(js, item.content, false).then((res) => {
        setHtml(res.html)
      })
    }
  }, [item.content, js])

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    ></div>
  )
}
