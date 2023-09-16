import React, { useState, useEffect, useContext } from 'react'

import { compileMdx } from '../../../hooks/compileMdx'
import clsx from 'clsx'
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
    <div className={clsx('my-auto', className)}>
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </div>
  )
}
