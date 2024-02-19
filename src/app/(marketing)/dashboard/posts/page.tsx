import React from 'react'
import { PostList } from './post-list'
import { CreateButton } from './create-button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '我的文章',
  description: '创建或管理文章',
}

type Props = {}
export default function Page({}: Props) {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex">
          我的文章
          <CreateButton />
        </h1>
        <p className="mt-2 text-muted-foreground">创建或管理文章</p>
      </div>
      <PostList />
    </div>
  )
}
