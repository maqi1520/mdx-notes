/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { convertImageFileSrc } from '@/lib/bindings'

type Props = {
  path: string
}

export default function ImagePreview({ path }: Props) {
  return (
    <div className="h-full flex overflow-auto">
      <div className="p-8 flex justify-center items-center m-auto">
        <img
          alt=""
          style={{ maxWidth: '100%' }}
          src={convertImageFileSrc(path)}
        />
      </div>
    </div>
  )
}
