'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { postData } from '@/utils/helpers'

export default function LoginForm() {
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = form.email.value
    const password = form.password.value
    console.log({ email, password })
    const res = await postData({
      url: '/auth/login',
      data: { email, password },
    })
    if (res.token) {
      localStorage.setItem('token', res.token)
      router.replace('/dashboard/posts')
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <Input id="email" type="email" />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>
          <Input id="password" type="password" />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Sign in</Button>
        </div>
      </form>
    </div>
  )
}
