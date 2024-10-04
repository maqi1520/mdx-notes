import React, { Suspense } from 'react'
import Content from './content'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '邮箱验证',
}

type Props = {}

export default function Page({}: Props) {
  return (
    <Suspense>
      <Content />
    </Suspense>
  )
}
