import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { getLayoutQueryString } from '../utils/getLayoutQueryString'
import { t } from '@/utils/i18n'
import { Button } from '@/components/ui/button'
import { ShareIcon, LinkIcon, Loader2 } from 'lucide-react'

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
      current.state === 'idle' || current.state === 'disabled'
        ? { state: 'disabled', path: initialPath }
        : current
    )
  }, [initialPath])

  useEffect(() => {
    let current = true
    if (state === 'loading') {
      if (onShareStart) onShareStart()
      window
        .fetch('/api/share', {
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
            const newPath = `/${res.id}${getLayoutQueryString({
              layout,
              responsiveSize,
              file: activeTab,
            })}`
            if (onShareComplete) onShareComplete(newPath)
            navigator.clipboard
              .writeText(window.location.origin + newPath)
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
        setState(({ state, path: currentPath }) =>
          state === 'copied' && currentPath === path
            ? { state: 'disabled', path: currentPath }
            : { state, path: currentPath }
        )
      }, 1500)
    }
    return () => {
      current = false
    }
  }, [state, path, editorRef, onShareStart, onShareComplete])

  useEffect(() => {
    if (dirty) {
      setState({ state: 'idle' })
    }
  }, [dirty])
  const HOSTNAME = window.location.origin

  return (
    <div className="flex items-center space-x-2 min-w-0">
      <Button
        size="sm"
        onClick={() => setState({ state: 'loading' })}
        disabled={
          state === 'copied' || state === 'disabled' || state === 'loading'
        }
      >
        {state !== 'loading' ? (
          <ShareIcon className="w-4 h-4 mr-1" />
        ) : (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        )}
        <span
          className={clsx({
            hidden: state === 'copied',
          })}
        >
          {t('Share')}
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
