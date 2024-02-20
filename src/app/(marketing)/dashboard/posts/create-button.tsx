'use client'
import React from 'react'

import { Button, ButtonProps } from '@/components/ui/button'

import { useRouter } from 'next/navigation'
import { PlusIcon } from 'lucide-react'
import { postData } from '@/utils/helpers'
import { toast } from '@/components/ui/use-toast'

export function CreateButton({ variant }: ButtonProps) {
  const router = useRouter()
  const handleCreate = async () => {
    const title = 'Untitled'
    const res = await postData({
      url: `/api/user/create_post`,
      data: {
        title,
        html: `---\ntitle: ${title}\n---\n\n# ${title}\n\n`,
        css: '',
        config: '',
      },
    })
    if (res.id) {
      router.push(`/post?id=${res.id}`)
    } else {
      toast({
        title: 'Something went wrong.',
        description: 'Your post was not created. Please try again.',
        variant: 'destructive',
      })
    }
  }
  return (
    <Button variant={variant} className="ml-auto" onClick={handleCreate}>
      <PlusIcon className="w-4 h-4 mr-1" />
      写文章
    </Button>
  )
}
