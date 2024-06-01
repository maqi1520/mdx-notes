import AccountForm from './account-form'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '个人信息',
  description: '更新您的个人信息',
}

export default async function Account() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          个人信息
        </h1>
        <p className="mt-2 text-muted-foreground">更新您的个人信息</p>
      </div>
      <div className="border rounded p-8 bg-background">
        <AccountForm />
      </div>
    </div>
  )
}