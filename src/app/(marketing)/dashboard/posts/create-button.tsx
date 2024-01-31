'use client'
import React from 'react'

import { Button } from '@/components/ui/button'

import { useRouter } from 'next/navigation'
import { PlusIcon } from 'lucide-react'

type Props = {}

export function CreateButton({}: Props) {
  const router = useRouter()
  const handleCreate = async () => {
    const title = 'Untitled'.split('\n')[0].replace('# ', '').slice(0, 50)
    const res = await fetch(`/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content: {},
      }),
    })
    const data = await res.json()
    router.push(`/post/${data.data.id}`)
  }
  return (
    <Button className="ml-auto" onClick={handleCreate}>
      <PlusIcon className="w-4 h-4 mr-1" />
      New Post
    </Button>
  )
}
