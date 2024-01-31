import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GithubIcon, Loader2Icon } from 'lucide-react'
import Link from 'next/link'

interface Props {
  reload: () => void
}

export function LoginModal({ reload }: Props) {
  const [open, onOpenChange] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const formProps = Object.fromEntries(formData)
    console.log(formProps)

    setIsLoading(true)
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formProps),
      }).then((res) => res.json())

      console.log(res)
      if (res.token) {
        reload()
        onOpenChange(false)
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">登录</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>登录</DialogTitle>
          <DialogDescription>欢迎回来！</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input id="password" name="password" />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              登录
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                其他登录方式
              </span>
            </div>
          </div>
          <Link href="/auth/github_login">
            <Button
              className="w-full"
              size="lg"
              variant="outline"
              type="button"
            >
              <GithubIcon className="mr-2 h-4 w-4" /> GitHub
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
