'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { postData } from '@/utils/helpers'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const email = form.email.value
    const password = form.password.value
    console.log({ email, password })
    setError('')
    const res = await postData({
      url: '/api/auth/login',
      data: { email, password },
    })
    if (res.token) {
      localStorage.setItem('token', res.token)
      router.replace('/dashboard/posts')
    }
    if (!res.success) {
      setError(res.message)
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-sm font-semibold">
            邮箱
          </label>
          <Input id="email" type="email" />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="text-sm font-semibold">
            密码
          </label>
          <Input id="password" type="password" />
        </div>
        <div className="flex">
          <Link className="text-primary underline" href="/register">
            还没有帐户？注册
          </Link>
          <Link
            className="text-primary underline ml-auto"
            href="/password_reset"
          >
            忘记密码？
          </Link>
        </div>

        <div className="flex">
          <Button className="w-full" type="submit">
            登录
          </Button>
        </div>
        {error && (
          <div className="w-full rounded border p-3 border-destructive text-destructive bg-destructive/10">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}
