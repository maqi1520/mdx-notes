import React from 'react'
import Link from 'next/link'
import { useAsyncRetry } from 'react-use'
import { LoginModal } from './login-modal'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreditCardIcon, LogOutIcon, UserIcon } from 'lucide-react'

type Props = {}

export function User({}: Props) {
  const { value, retry } = useAsyncRetry(async () => {
    return fetch('/user/get').then((res) => res.json())
  }, [])

  const handleLogout = async () => {
    const res = await fetch('/auth/logout', {
      method: 'POST',
    }).then((res) => res.json())
    if (res.success) {
      retry()
    }
  }

  if (!value || !value?._id) {
    return <LoginModal reload={retry} />
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={value.avatar_url} alt={value.name} />
            <AvatarFallback>{value.name}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32">
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

          <DropdownMenuItem onClick={handleLogout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>登出</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
