import { Metadata } from 'next'
import AuthUI from './form'

import { Logo } from '@/components/Logo'

export const metadata: Metadata = {
  title: '重置密码',
}

export default async function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col justify-between max-w-lg p-8 m-auto w-3/5 border bg-card">
        <div className="flex justify-center py-6">
          <Logo />
        </div>
        <AuthUI />
      </div>
    </div>
  )
}
