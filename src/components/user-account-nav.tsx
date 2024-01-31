'use client'
import React, { useEffect } from 'react'
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

import { User } from '@supabase/auth-helpers-nextjs'
import { useSupabase } from '@/app/supabase-provider'

export function UserAccountNav() {
  const router = useRouter()
  const [user, setUser] = React.useState<User | null>(null)
  const { supabase } = useSupabase()
  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      if (res.data?.user) {
        setUser(res.data.user)
      }
    })
  }, [])

  const handleLogout = async () => {
    const res = await fetch('/auth/logout', {
      method: 'POST',
    }).then((res) => res.json())
    router.replace('/')
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
