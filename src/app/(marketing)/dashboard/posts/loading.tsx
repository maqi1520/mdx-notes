import React from 'react'
import { PostItem } from './post-item'
import { CreateButton } from './create-button'

export default async function Page() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex">
          我的文章
          <CreateButton />
        </h1>
        <p className="mt-2 text-muted-foreground">创建或管理文章</p>
      </div>
      <div className="divide-y divide-border rounded-md border mt-8">
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
      </div>
    </div>
  )
}
