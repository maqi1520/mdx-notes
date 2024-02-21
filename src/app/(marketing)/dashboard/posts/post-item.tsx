import React from 'react'

import dayjs from 'dayjs'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { PostOperations } from './post-operations'

type Props = {
  item: any
  refresh: () => void
}

export function PostItem({ item, refresh }: Props) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          className="font-semibold hover:underline"
          href={`/post?id=${item._id}`}
        >
          {item.title || 'Untitled'}
        </Link>

        <div>
          <p className="text-sm text-muted-foreground">
            {dayjs(item.updated_at).format('YYYY-MM-DD HH:mm:ss')}
          </p>
        </div>
      </div>
      <PostOperations refresh={refresh} post={item} />
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
