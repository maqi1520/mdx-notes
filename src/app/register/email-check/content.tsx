'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { postData } from '@/utils/helpers'

type Props = {}

export default function Page(props: Props) {
  const params = useSearchParams()
  const router = useRouter()
  const code = params?.get('code')

  const [error, setError] = useState('')

  useEffect(() => {
    if (!code) {
      setError('未获得code参数，请从邮件点击链接')
      return
    }
    postData({
      url: '/api/auth/email_check',
      data: { code },
    }).then((res) => {
      console.log(res)
      if (res.success) {
        localStorage.setItem('token', res.token)
        router.replace('/dashboard/posts')
      } else {
        setError(res.message)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return (
      <div className="w-3/5 mx-auto my-10 rounded border p-3 border-destructive text-destructive bg-destructive/10">
        {error}
      </div>
    )
  }

  return (
    <div className="w-3/5 mx-auto my-10 rounded border p-3 bg-secondary">
      正在验证...
    </div>
  )
}
