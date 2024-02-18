'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'
import { Switch } from '@/components/ui/switch'

import { MoreVerticalIcon, Loader2Icon, Trash2Icon } from 'lucide-react'
import { postData } from '@/utils/helpers'

async function deletePost(postId: string) {
  const response = await postData({
    url: `/user/delete_post`,
    data: {
      id: postId,
    },
  })

  if (!response?.ok) {
    toast({
      title: 'Something went wrong.',
      description: 'Your post was not deleted. Please try again.',
      variant: 'destructive',
    })
  }

  return true
}

interface Post {
  _id: string
  title: string
  published: boolean
}

interface PostOperationsProps {
  post: Post
  refresh: () => void
}

export function PostOperations({ post, refresh }: PostOperationsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  const togglePublish = async (checked: boolean) => {
    const response = await postData({
      url: `/user/update_post`,
      data: {
        id: post._id,
        published: checked,
      },
    })

    refresh()
  }

  return (
    <div className="w-32 flex justify-between items-center">
      <Switch onCheckedChange={togglePublish} defaultChecked={post.published} />

      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <MoreVerticalIcon className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={`/post/${post._id}`} className="flex w-full">
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteAlert(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault()
                setIsDeleteLoading(true)

                const deleted = await deletePost(post._id)

                if (deleted) {
                  setIsDeleteLoading(false)
                  setShowDeleteAlert(false)
                  refresh()
                }
              }}
              className="bg-destructive focus:ring-destructive"
            >
              {isDeleteLoading ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2Icon className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
