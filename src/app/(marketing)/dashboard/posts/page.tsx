import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.type'
import { PostItem } from './post-item'

type Props = {}
export default async function Page({}: Props) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const query = supabase.from('posts').select()

  const { data, error } = await query
  if (error) throw error

  return (
    <div>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          我的文章
        </h1>
        <p className="mt-2 text-muted-foreground">查看您的全部文章</p>
      </div>
      <div className="divide-y divide-border rounded-md border mt-8">
        {data.map((item) => (
          <PostItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
