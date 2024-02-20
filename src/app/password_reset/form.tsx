'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { postData } from '@/utils/helpers'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { Undo2Icon } from 'lucide-react'

export default function Form() {
  const router = useRouter()

  const [disabled, setDisabled] = useState(true)
  const ref = useRef<HTMLInputElement>(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const email = e.target.value
    // 简单的邮箱格式验证
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    setDisabled(!emailRegex.test(email))
  }
  const handleSendCode = async () => {
    const email = ref.current?.value
    setSuccess('')
    setError('')
    const res = await postData({
      url: '/api/auth/send_code',
      data: { email },
    })
    if (!res.success) {
      setError(res.message)
    } else {
      setSuccess('验证码已经发送邮箱')
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = form.email.value
    const code = form.code.value
    const password = form.password.value
    setSuccess('')
    setError('')
    const res = await postData({
      url: '/api/auth/reset_password',
      data: { email, code, password },
    })
    if (!res.success) {
      setError(res.message)
    } else {
      setSuccess('重置成功，请重新登录')
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
          <Input
            ref={ref}
            onChange={handleEmailChange}
            id="email"
            type="email"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-sm font-semibold">
            验证码
          </label>
          <div className="flex space-x-3">
            <Input className="flex-1" placeholder="邮箱验证码" id="code" />
            <Button onClick={handleSendCode} disabled={disabled} type="button">
              发送验证码
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="text-sm font-semibold">
            重置密码
          </label>
          <Input
            placeholder="请输入新密码"
            minLength={6}
            maxLength={18}
            id="password"
            type="password"
          />
        </div>

        <div className="flex">
          <Button className="w-full" type="submit">
            重置密码
          </Button>
        </div>
        <div>
          <Link
            className="text-primary underline flex justify-center items-center"
            href="/login"
          >
            <Undo2Icon className="w-5 h-5 mr-1" /> 返回登录
          </Link>
        </div>
        {error && (
          <div className="w-full rounded border p-3 border-destructive text-destructive bg-destructive/10">
            {error}
          </div>
        )}

        {success && (
          <div className="w-full rounded border p-3 border-green-500 text-green-500 bg-green-500/10">
            {success}
          </div>
        )}
      </form>
    </div>
  )
}
