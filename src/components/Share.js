import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { getLayoutQueryString } from '../utils/getLayoutQueryString'
import { Button } from '@/components/ui/button'
import { ShareIcon, LinkIcon, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const HOSTNAME = 'https://mdxnotes.com'

export function Share({ resultRef, layout, responsiveSize }) {
  const { t } = useTranslation()
  const [{ state, path, errorText }, setState] = useState({
    state: 'idle',
    path: '',
    errorText: undefined,
  })

  useEffect(() => {
    let current = true
    if (state === 'loading') {
      const { markdownTheme, jsx, md, frontMatter = {} } = resultRef.current
      window
        .fetch(process.env.NEXT_PUBLIC_API_URL + '/api/share', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            title: frontMatter.title || 'Untitled',
            html: md,
            css: markdownTheme,
            config: jsx,
          }),
        })
        .then((res) => {
          if (!res.ok) throw res
          return res
        })
        .then((res) => res.json())
        .then((res) => {
          if (current) {
            const newPath = `/post?id=${res.id}${getLayoutQueryString({
              layout,
              responsiveSize,
            })}`

            clipboardWriteText(HOSTNAME + newPath)
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
        setState({ state: 'idle' })
      }, 3000)
    }
    return () => {
      current = false
    }
  }, [state, path])

  return (
    <div className="flex items-center space-x-2 min-w-0">
      <Button
        size="sm"
        variant="outline"
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
