import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { Database } from '@/types/database.type'
import { PostItem } from './post-item'
import { CreateButton } from './create-button'
import { Metadata } from 'next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AnnoyedIcon, HelpCircleIcon } from 'lucide-react'

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
    .order('created_at', { ascending: false })

  const { data: posts, error } = await query
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
      <div className="divide-y divide-border rounded-md border mt-8 bg-background">
        <div className="flex items-center justify-between p-4 text-muted-foreground">
          <div className="grid gap-1">
            <span className="font-semibold">标题</span>
          </div>
          <div className="space-x-3 w-32 flex justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-semibold flex items-center">
                    状态
                    <HelpCircleIcon className="w-5 h-5 ml-1" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>发布后可公开方法</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="font-semibold">操作</span>
          </div>
        </div>

        {posts?.length ? (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <PostItem key={post.id} item={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <AnnoyedIcon />

            <EmptyPlaceholder.Title>暂无内容</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              你还没有任何文章,开始创建内容。
            </EmptyPlaceholder.Description>
            <div className="text-center">
              <CreateButton variant="outline" />
            </div>
          </EmptyPlaceholder>
        )}
      </div>
    </div>
  )
}
