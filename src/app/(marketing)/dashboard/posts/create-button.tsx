'use client'
import React from 'react'

import { Button, ButtonProps } from '@/components/ui/button'

import { useRouter } from 'next/navigation'
import { PlusIcon } from 'lucide-react'

export function CreateButton({ variant }: ButtonProps) {
  const router = useRouter()
  const handleCreate = async () => {
    const title = 'Untitled'
    const res = await fetch(`/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content: {
          html: `---\ntitle: ${title}\n---\n\n# ${title}\n\n`,
        },
      }),
    })
    const data = await res.json()
    router.push(`/post/${data.data.id}`)
  }
  return (
    <Button variant={variant} className="ml-auto" onClick={handleCreate}>
      <PlusIcon className="w-4 h-4 mr-1" />
      写文章
    </Button>
  )
}
