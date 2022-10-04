import clsx from 'clsx'

export function TabBar({
  errorMessage,
  wordCount,
  activeTab,
  width,
  isLoading,
  showPreviewTab,
  onChange,
}) {
  return (
    <div
      className="flex items-center flex-none pl-5 pr-4 sm:pl-6 absolute z-10 top-0 left-0 -mb-px antialiased"
      style={{
        width,
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      }}
    >
      <div className="flex space-x-5">
        <TabButton
          isActive={activeTab === 'html'}
          onClick={() => onChange('html')}
        >
          MDX
        </TabButton>
        <TabButton
          isActive={activeTab === 'css'}
          onClick={() => onChange('css')}
        >
          CSS
        </TabButton>
        <TabButton
          isActive={activeTab === 'config'}
          onClick={() => onChange('config')}
        >
          Config
        </TabButton>
        {showPreviewTab && (
          <TabButton
            isActive={activeTab === 'preview'}
            onClick={() => onChange('preview')}
          >
            Preview
          </TabButton>
        )}
      </div>
      {isLoading ? (
        <p className="ml-auto">
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
        <span className="ml-auto text-gray-700  dark:text-gray-300">
          字数: <strong className="ml-1">{wordCount}</strong>
        </span>
      )}
      {errorMessage}
    </div>
  )
}

function TabButton({ isActive, onClick, children }) {
  return (
    <button
      type="button"
      className={clsx(
        'relative flex py-3 text-sm leading-6 font-semibold focus:outline-none',
        {
          'text-sky-500': isActive,
          'text-gray-700 hover:text-gray-900 focus:text-gray-900 dark:text-gray-300 dark:hover:text-white':
            !isActive,
        }
      )}
      onClick={onClick}
    >
      <span
        className={clsx(
          'absolute bottom-0 inset-x-0 bg-sky-500 h-0.5 rounded-full transition-opacity duration-150',
          { 'opacity-0': !isActive }
        )}
      />
      {children}
    </button>
  )
}
