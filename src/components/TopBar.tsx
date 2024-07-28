import React from 'react'
import { getCurrent } from '@tauri-apps/api/window'
import type { SVGProps } from 'react'

import { isMacOS } from './utils/file-tree-util'

export function MdiWindowMinimize(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" d="M20 14H4v-4h16"></path>
    </svg>
  )
}

export function MdiWindowMaximize(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" d="M4 4h16v16H4zm2 4v10h12V8z"></path>
    </svg>
  )
}

export function MdiClose(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 22 22"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="m7 7l10 10M7 17L17 7"
      ></path>
    </svg>
  )
}
export default function TitleBar() {
  if (isMacOS) {
    return <div data-tauri-drag-region className="h-6" />
  }
  return (
    <div
      data-tauri-drag-region
      className="h-[30px] flex justify-end select-none"
    >
      <div
        onClick={() => getCurrent().minimize()}
        className="w-[30px] h-[30px] inline-flex justify-center items-center cursor-pointer"
      >
        <MdiWindowMinimize />
      </div>
      <div
        onClick={() => getCurrent().maximize()}
        className="w-[30px] h-[30px] inline-flex justify-center items-center cursor-pointer"
      >
        <MdiWindowMaximize />
      </div>
      <div
        onClick={() => getCurrent().close()}
        className="w-[30px] h-[30px] inline-flex justify-center items-center cursor-pointer"
      >
        <MdiClose />
      </div>
    </div>
  )
}
