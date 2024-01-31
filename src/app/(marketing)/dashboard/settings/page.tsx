import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.type'
import AccountForm from './account-form'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '个人信息',
  description: '更新您的个人信息',
}

export default async function Account() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <AccountForm user={user!} />
}
