'use client'
import { useCallback, useEffect, useState } from 'react'
import { Database } from '@/types/database.type'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  User,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'

export default function AccountForm({ user }: { user: User }) {
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(true)
  const [full_name, setFullName] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullName(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    website,
    full_name,
    avatar_url,
  }: {
    username: string | null
    full_name: string | null
    website: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      })
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          个人信息
        </h1>
        <p className="mt-2 text-muted-foreground">更新您的个人信息</p>
      </div>
      <div className="border rounded p-8 space-y-8">
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <Input id="email" type="text" value={user?.email} disabled />
        </div>
        <div className="space-y-2">
          <label htmlFor="fullName">Full Name</label>
          <Input
            id="fullName"
            type="text"
            value={full_name || ''}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="username">Username</label>
          <Input
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="website">Website</label>
          <Input
            id="website"
            type="url"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div>
          <Button
            onClick={() =>
              updateProfile({ full_name, username, website, avatar_url })
            }
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </Button>
        </div>
      </div>
    </div>
  )
}
