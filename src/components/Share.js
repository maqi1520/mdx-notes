import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { getLayoutQueryString } from '../utils/getLayoutQueryString'

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

  return (
    <div className="hidden sm:flex items-center space-x-4 min-w-0">
      <button
        type="button"
        className={clsx(
          'relative flex-none rounded-md text-sm font-semibold leading-6 py-1.5 px-3',
          {
            'bg-sky-500/40 text-white dark:bg-gray-800 dark:text-white/40':
              state === 'disabled',
            'cursor-auto':
              state === 'disabled' || state === 'copied' || state === 'loading',
            'hover:bg-sky-400':
              state !== 'disabled' && state !== 'copied' && state !== 'loading',
            'bg-sky-500 text-white': state === 'idle' || state === 'loading',
            'text-sky-500 shadow-copied dark:bg-sky-500/10': state === 'copied',
            'shadow-sm': state !== 'copied',
            'dark:shadow-none': state === 'disabled',
            'dark:shadow-highlight/20':
              state !== 'copied' && state !== 'disabled',
          }
        )}
        onClick={() => {
          setState({ state: 'loading' })
        }}
        disabled={
          state === 'copied' || state === 'disabled' || state === 'loading'
        }
      >
        <span
          className={clsx('absolute inset-0 flex items-center justify-center', {
            invisible: state === 'copied' || state === 'loading',
          })}
          aria-hidden={
            state === 'copied' || state === 'loading' ? 'true' : 'false'
          }
        >
          分享
        </span>
        <span
          className={clsx('absolute inset-0 flex items-center justify-center', {
            invisible: state !== 'loading',
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
          className={clsx({ invisible: state !== 'copied' })}
          aria-hidden={state === 'copied' ? 'false' : 'true'}
        >
          Copied!
        </span>
      </button>
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
          className="flex-auto min-w-0 flex items-center space-x-2 text-sm leading-6 font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          title={`${window.location.origin}${path}`}
          onClick={() => {
            navigator.clipboard
              .writeText(window.location.origin + path)
              .then(() => {
                setState((currentState) => ({
                  ...currentState,
                  state: 'copied',
                }))
              })
          }}
        >
          <svg
            width="26"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-none text-gray-300 dark:text-gray-500"
            aria-hidden="true"
          >
            <path d="M14.652 12c1.885-1.844 1.75-4.548-.136-6.392l-1.275-1.225c-1.885-1.844-4.942-1.844-6.827 0a4.647 4.647 0 0 0 0 6.676l.29.274" />
            <path d="M11.348 10c-1.885 1.844-1.75 4.549.136 6.392l1.275 1.225c1.885 1.844 4.942 1.844 6.827 0a4.647 4.647 0 0 0 0-6.676l-.29-.274" />
          </svg>
          <span className="truncate">...{path}</span>
        </button>
      )}
    </div>
  )
}
