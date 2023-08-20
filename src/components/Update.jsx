import React, { useEffect } from 'react'
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import { confirm, message, open } from '@tauri-apps/api/dialog'

export default function Update() {
  useEffect(() => {
    window.checkUpdate = async () => {
      try {
        const { shouldUpdate, manifest } = await checkUpdate()

        if (shouldUpdate) {
          // You could show a dialog asking the user if they want to install the update here.
          console.log(
            `Installing update ${manifest?.version}, ${manifest?.date}, ${manifest?.body}`
          )

          // Install the update. This will also restart the app on Windows!
          await installUpdate()

          // On macOS and Linux you will need to restart the app manually.
          // You could use this step to display another confirmation dialog.
          await relaunch()
        } else {
          message('已经是最新版本', { title: '提示', type: 'info' })
        }
      } catch (error) {
        message(error, { title: '提示', type: 'info' })
        console.error(error)
      }
    }
  }, [])

  return null
}
