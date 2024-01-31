import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.type'
import { PostItem } from './post-item'
import { CreateButton } from './create-button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '我的文章',
  description: '创建或管理文章',
}

type Props = {}
export default async function Page({}: Props) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: res } = await supabase.auth.getSession()

  const query = supabase
    .from('posts')
    .select()
    .eq('author_id', res.session!.user.id)

  const { data, error } = await query
  if (error) throw error

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
        {data.map((item) => (
          <PostItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
