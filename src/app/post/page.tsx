import { Suspense } from 'react'
import App from './App'
import { Metadata } from 'next'
import Loading from '@/components/Loading'

export const metadata: Metadata = {
  title: '笔记详情',
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  )
}
