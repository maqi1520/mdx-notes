import React, { Suspense } from 'react'
import Content from './content'

type Props = {}

export default function Page({}: Props) {
  return (
    <Suspense>
      <Content />
    </Suspense>
  )
}
