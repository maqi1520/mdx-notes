import React from 'react'

type Props = {}

export default function Loading({}: Props) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-primary rounded-full animate-spin border-t-transparent" />
    </div>
  )
}
