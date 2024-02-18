'use client'
import { useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { useAsyncRetry } from 'react-use'
import { postData } from '@/utils/helpers'

export default function AccountForm() {
  const {
    value: user,
    retry,
    loading: isFetching,
  } = useAsyncRetry(async () => {
    return postData({ url: '/user/get' })
  }, [])
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const username = form.username.value
    const full_name = form.full_name.value
    const website = form.website.value
    const avatar_url = form.full_name.value

    try {
      setLoading(true)
      const res = await postData({
        url: '/user/update',
        data: { username, full_name, website, avatar_url },
      })
      if (res.updated) {
        toast({
          title: 'Success!',
          description: 'Your profile has been updated.',
        })
        retry()
      }
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="h-10 w-24" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-3/5 space-y-8">
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <Input name="email" type="text" defaultValue={user?.email} disabled />
        </div>
        <div className="space-y-2">
          <label htmlFor="fullName">Full Name</label>
          <Input
            name="full_name"
            type="text"
            defaultValue={user?.full_name || ''}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="username">Username</label>
          <Input
            name="username"
            type="text"
            defaultValue={user?.username || ''}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="website">avatar</label>
          <Input
            name="avatar_url"
            type="url"
            defaultValue={user?.avatar_url || ''}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="website">Website</label>
          <Input name="website" type="url" defaultValue={user?.website || ''} />
        </div>

        <div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading ...' : 'Update'}
          </Button>
        </div>
      </div>
    </form>
  )
}
