'use client'
import React from 'react'

import dayjs from 'dayjs'
import Link from 'next/link'
import { MoreVerticalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="w-5 h-5" />
            <span className="sr-only">Open</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem asChild>
            <Link href={`/post/${item.id}`}>编辑</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
