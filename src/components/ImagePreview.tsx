import React from 'react'
import { convertFileSrc } from '@tauri-apps/api/tauri'

type Props = {
  path: string
}

export default function ImagePreview({ path }: Props) {
  return (
    <div className="h-full flex">
      <div className="p-8 flex justify-center items-center m-auto">
        <img style={{ maxWidth: '100%' }} src={convertFileSrc('') + path} />
      </div>
    </div>
  )
}
