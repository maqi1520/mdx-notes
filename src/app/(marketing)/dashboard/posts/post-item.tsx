import React from 'react'

import dayjs from 'dayjs'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { PostOperations } from './post-operations'

type Props = {
  item: any
}

export function PostItem({ item }: Props) {
  return (
    <div key={item.id} className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          className="font-semibold hover:underline"
          href={`/post/${item.id}`}
        >
          {item.title}
        </Link>

        <div>
          <p className="text-sm text-muted-foreground">
            {dayjs(item.updated_at).format('YYYY-MM-DD HH:mm:ss')}
          </p>
        </div>
      </div>
      <PostOperations post={item} />
    </div>
  )
}

PostItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
