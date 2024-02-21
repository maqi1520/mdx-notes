'use client'
import React, { useState } from 'react'
import { useAsyncRetry } from 'react-use'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { Input } from '@/components/ui/input'
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
  const [title, setTitle] = useState('')
  const {
    value: posts,
    loading,
    retry,
  } = useAsyncRetry(async () => {
    return postData({
      url: '/api/user/posts',
      data: {
        title,
      },
    })
  }, [title])

  const handleKeydown = (e: any) => {
    if (e.keyCode === 13) {
      setTitle(e.target?.value)
    }
    if (e.target?.value == '') {
      setTitle('')
    }
  }

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
        <div className="flex justify-center items-center">
          <span className="font-semibold flex-none mr-2">标题</span>{' '}
          <Input placeholder="根据标题搜索" onKeyDown={handleKeydown} />
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
