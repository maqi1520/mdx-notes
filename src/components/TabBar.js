import clsx from 'clsx'
import { t } from '@/utils/i18n'

export function TabBar({ errorMessage, wordCount, width, isLoading, dirty }) {
  return (
    <div
      className="flex items-center absolute z-10 bottom-0 left-0  antialiased  group px-6 py-[10px]  leading-6 bg-white font-semibold focus:outline-none text-gray-700 hover:text-gray-900 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-white justify-between border-t border-b-gray-900/10 dark:bg-gradient-to-b dark:from-[#242F41] dark:to-gray-800 dark:shadow-highlight/4  dark:border-white/[0.06]"
      style={{
        width,
      }}
    >
      {isLoading ? (
        <p className="mr-auto">
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
        </p>
      ) : (
        <span className="mr-auto text-xs text-gray-700 flex items-center dark:text-gray-300">
          <span>{t('Words')}:</span>
          <strong className="ml-1">{wordCount}</strong>
          <span
            className={clsx(
              'w-2 h-2 block bg-green-500 rounded ml-2',
              !dirty && 'opacity-0'
            )}
          ></span>
        </span>
      )}
      {errorMessage}
    </div>
  )
}
