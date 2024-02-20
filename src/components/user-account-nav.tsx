'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreditCardIcon, LogOutIcon, UserIcon } from 'lucide-react'
import { useAsyncRetry } from 'react-use'
import { Skeleton } from '@/components/ui/skeleton'
import { useGlobalValue } from '@/hooks/useGlobalValue'
import { postData } from '@/utils/helpers'

interface Props {
  user?: any
  retry?: () => void
}

export function UserAccountNav({ user, retry }: Props) {
  const logout = async () => {
    postData({ url: '/api/auth/logout' }).then((res) => {
      localStorage.removeItem('token')
      window.location.replace('/')
    })
  }

  if (!user || !user?._id) {
    return (
      <Link className={buttonVariants({ variant: 'secondary' })} href="/login">
        登录
      </Link>
    )
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage
              className="border rounded-full bg-primary/10"
              src={user.avatar_url}
              alt={user.name}
            />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>个人信息</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/posts">
              <CreditCardIcon className="mr-2 h-4 w-4" />
              <span>我的文章</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={logout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>登出</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}

export function UserInfo() {
  const [, setGlobal] = useGlobalValue()
  const { value, loading, retry } = useAsyncRetry(async () => {
    const res = await postData({
      url: '/api/user/get',
    })
    return res
  }, [])

  useEffect(() => {
    if (value?._id) {
      setGlobal({ user: value })
    }
  }, [value, setGlobal])

  if (loading) {
    return <Skeleton className="w-10 h-10 rounded-full" />
  }
  return <UserAccountNav retry={retry} user={value} />
}
