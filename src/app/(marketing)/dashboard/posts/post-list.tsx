'use client'
import React from 'react'
import { useAsyncRetry } from 'react-use'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { PostItem } from './post-item'
import { CreateButton } from './create-button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AnnoyedIcon, HelpCircleIcon } from 'lucide-react'
import { postData } from '@/utils/helpers'

export function PostList() {
  const {
    value: posts,
    loading,
    retry,
  } = useAsyncRetry(async () => {
    return postData({
      url: '/api/user/posts',
    })
  }, [])

  if (!posts && loading) {
    return (
      <div className="divide-y divide-border rounded-md border mt-8">
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
      </div>
    )
  }

  return (
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
            <PostItem refresh={retry} key={post._id} item={post} />
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
  )
}
