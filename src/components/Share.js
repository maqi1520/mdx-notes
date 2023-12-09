import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { getLayoutQueryString } from '../utils/getLayoutQueryString'
import { writeText } from '@tauri-apps/api/clipboard'
import { t } from '@/utils/i18n'
import { Button } from '@/components/ui/button'
import { ShareIcon, LinkIcon } from 'lucide-react'

const HOSTNAME = 'https://editor.runjs.cool'

export function Share({
  initialPath,
  editorRef,
  dirty,
  layout,
  responsiveSize,
  activeTab,
  onShareStart,
  onShareComplete,
}) {
  const [{ state, path, errorText }, setState] = useState({
    state: 'disabled',
    path: initialPath,
    errorText: undefined,
  })

  useEffect(() => {
    setState((current) =>
      (current.state === 'idle' || current.state === 'disabled') && initialPath
        ? { state: 'disabled', path: initialPath }
        : { state: 'idle' }
    )
  }, [initialPath])

  useEffect(() => {
    let current = true
    if (state === 'loading') {
      if (onShareStart) onShareStart()
      window
        .fetch(process.env.NEXT_PUBLIC_API_URL + '/api/share', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            html: editorRef.current.getValue('html'),
            css: editorRef.current.getValue('css'),
            config: editorRef.current.getValue('config'),
          }),
        })
        .then((res) => {
          if (!res.ok) throw res
          return res
        })
        .then((res) => res.json())
        .then((res) => {
          if (current) {
            const localPath = `/${getLayoutQueryString({
              id: res.id,
              layout,
              responsiveSize,
              file: activeTab,
            })}`

            const newPath = `/${res.id}${getLayoutQueryString({
              layout,
              responsiveSize,
              file: activeTab,
            })}`

            writeText(HOSTNAME + newPath)
              .then(() => {
                if (current) {
                  setState({ state: 'copied', path: newPath })
                }
              })
              .catch(() => {
                if (current) {
                  setState({ state: 'disabled', path: newPath })
                }
              })
            if (onShareComplete) onShareComplete(localPath)
          }
        })
        .catch((error) => {
          if (!current) return

          const defaultErrorText = 'Whoops! Something went wrong.'

          if (error instanceof window.Response) {
            error.json().then((response) => {
              if (!current) return
              if (
                typeof response.errors === 'object' &&
                response.errors !== null &&
                !Array.isArray(response.errors)
              ) {
                setState({
                  state: 'error',
                  errorText:
                    response.errors[Object.keys(response.errors)[0]][0] ||
                    defaultErrorText,
                })
              } else {
                setState({
                  state: 'error',
                  errorText: defaultErrorText,
                })
              }
            })
          } else {
            setState({
              state: 'error',
              errorText: defaultErrorText,
            })
          }
        })
    } else if (state === 'copied') {
      window.setTimeout(() => {
        // setState(({ state, path: currentPath }) =>
        //   state === 'copied' && currentPath === path
        //     ? { state: 'disabled', path: currentPath }
        //     : { state, path: currentPath }
        // )
        setState({ state: 'idle' })
      }, 3000)
    }
    return () => {
      current = false
    }
  }, [state, path, editorRef, onShareStart, onShareComplete])

  return (
    <div className="flex items-center space-x-2 min-w-0">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setState({ state: 'loading' })}
        loading={state === 'loading'}
        disabled={
          state === 'copied' || state === 'disabled' || state === 'loading'
        }
      >
        <span
          className={clsx('flex items-center', {
            hidden: state === 'copied' || state === 'loading',
          })}
          aria-hidden={
            state === 'copied' || state === 'loading' ? 'true' : 'false'
          }
        >
          <ShareIcon className="w-4 h-4 mr-1" />
          {t('Share')}
        </span>
        <span
          className={clsx({
            hidden: state !== 'loading',
          })}
          aria-hidden={state !== 'loading' ? 'true' : 'false'}
        >
          <span className="sr-only">Loading</span>
          <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4 animate-spin">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
        <span
          className={clsx({ hidden: state !== 'copied' })}
          aria-hidden={state === 'copied' ? 'false' : 'true'}
        >
          Copied!
        </span>
      </Button>
      {state === 'error' && (
        <p
          className="text-sm leading-5 font-medium text-gray-500 dark:text-gray-400 truncate"
          title={errorText}
        >
          <span className="sr-only">Error: </span>
          {errorText}
        </p>
      )}
      {(state === 'copied' || state === 'disabled') && path && (
        <button
          type="button"
          className="max-w-[270px] flex-auto min-w-0 flex items-center space-x-2 text-sm leading-6 font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          title={`${HOSTNAME}${path}`}
          onClick={() => {
            writeText(HOSTNAME + path).then(() => {
              setState((currentState) => ({
                ...currentState,
                state: 'copied',
              }))
            })
          }}
        >
          <LinkIcon className="flex-none w-5 h-5" />
          <span className="truncate">...{path}</span>
        </button>
      )}
    </div>
  )
}
