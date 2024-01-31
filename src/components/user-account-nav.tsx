'use client'
import React from 'react'
import Link from 'next/link'
import { LoginModal } from './login-modal'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreditCardIcon, LogOutIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function UserAccountNav({ user }) {
  const router = useRouter()
  const logout = async () => {
    fetch('/auth/logout', {
      method: 'POST',
    }).then((res) => {
      router.replace('/')
    })
  }
  if (!user || !user?.id) {
    return <LoginModal />
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={user.avatar_url} alt={user.name} />
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
