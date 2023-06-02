import React from 'react'

import { appWindow } from '@tauri-apps/api/window'

export default function HeaderElement({ className, style, children }) {
  return (
    <div
      onMouseDown={() => {
        requestAnimationFrame(() => {
          appWindow.startDragging()
        })
      }}
      onDoubleClick={async () => {
        const isFullscreen = await appWindow.isFullscreen()
        await appWindow.setFullscreen(!isFullscreen)
      }}
      className={className}
      style={style}
    >
      {children}
    </div>
  )
}
