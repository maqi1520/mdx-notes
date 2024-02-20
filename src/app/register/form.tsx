'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { postData } from '@/utils/helpers'
import Link from 'next/link'
import { useState } from 'react'

export default function Form() {
  const router = useRouter()

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = form.email.value
    const password = form.password.value
    setSuccess('')
    setError('')
    const res = await postData({
      url: '/api/auth/register',
      data: { email, password },
    })
    if (!res.success) {
      setError(res.message)
    } else {
      setSuccess('注册邮件已发送，请到通过邮箱链接登录')
      form.password.value = ''
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
            创建密码
          </label>
          <Input minLength={6} maxLength={18} id="password" type="password" />
        </div>
        <div>
          <Link className="text-primary underline" href="/login">
            已经有帐户？登录
          </Link>
        </div>

        <div className="flex">
          <Button className="w-full" type="submit">
            注册
          </Button>
        </div>
        {error && (
          <div className="w-full rounded border p-3 border-destructive text-destructive bg-destructive/10">
            {error}
          </div>
        )}

        {success && (
          <div className="w-full rounded border p-3 border-primary text-primary bg-primary/10">
            {success}
          </div>
        )}
      </form>
    </div>
  )
}
