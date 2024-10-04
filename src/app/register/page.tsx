import { GridIcon } from '@/components/icons'
import AuthUI from './form'

import { Logo } from '@/components/Logo'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '注册',
}

export default async function Page() {
  return (
    <>
      <div className="absolute -z-10 inset-0 text-slate-900/[0.09] dark:text-gray-200/[0.1] [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]">
        <GridIcon className="absolute inset-0 h-full w-full" />
      </div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col justify-between max-w-lg p-8 m-auto w-3/5 border bg-card">
          <div className="flex justify-center py-6">
            <Logo />
          </div>
          <AuthUI />
        </div>
      </div>
    </>
  )
}
