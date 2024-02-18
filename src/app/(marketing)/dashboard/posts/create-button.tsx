'use client'
import React from 'react'

import { Button, ButtonProps } from '@/components/ui/button'

import { useRouter } from 'next/navigation'
import { PlusIcon } from 'lucide-react'
import { postData } from '@/utils/helpers'

export function CreateButton({ variant }: ButtonProps) {
  const router = useRouter()
  const handleCreate = async () => {
    const title = 'Untitled'
    const res = await postData({
      url: `/user/create_post`,
      data: {
        title,
        html: `---\ntitle: ${title}\n---\n\n# ${title}\n\n`,
        css: '',
        config: '',
      },
    })
    router.push(`/post/${res.id}`)
  }
  return (
    <Button variant={variant} className="ml-auto" onClick={handleCreate}>
      <PlusIcon className="w-4 h-4 mr-1" />
      写文章
    </Button>
  )
}
