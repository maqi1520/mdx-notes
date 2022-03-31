import { Logo } from './Logo'
import clsx from 'clsx'
import { toggleTheme } from '../utils/theme'

export function Header({
  layout,
  onChangeLayout,
  responsiveDesignMode,
  onToggleResponsiveDesignMode,
  children,
  rightbtn,
}) {
  return (
    <header
      className="relative z-20 flex-none py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center space-x-4 antialiased"
      style={{ fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }}
    >
      <div className="flex-auto flex items-center min-w-0 space-x-6">
        <Logo className="flex-none text-black dark:text-white" />
        {children}
      </div>
      <div className="flex items-center">
        {rightbtn}
        <div className="hidden lg:flex items-center ml-6 rounded-md ring-1 ring-gray-900/5 shadow-sm dark:ring-0 dark:bg-gray-800 dark:shadow-highlight/4">
          <HeaderButton
            isActive={layout === 'vertical'}
            label="Switch to vertical split layout"
            onClick={() => onChangeLayout('vertical')}
          >
            <path d="M12 3h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-9" fill="none" />
            <path d="M3 17V5a2 2 0 0 1 2-2h7a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2Z" />
          </HeaderButton>
          <HeaderButton
            isActive={layout === 'horizontal'}
            label="Switch to horizontal split layout"
            onClick={() => onChangeLayout('horizontal')}
          >
            <path d="M23 11V3H3v8h20Z" strokeWidth="0" />
            <path
              d="M23 17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2ZM22 11H4"
              fill="none"
            />
          </HeaderButton>
          <HeaderButton
            isActive={layout === 'preview'}
            label="Switch to preview-only layout"
            onClick={() => onChangeLayout('preview')}
          >
            <path
              d="M23 17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"
              fill="none"
            />
          </HeaderButton>
          <HeaderButton
            isActive={responsiveDesignMode}
            label="Toggle responsive design mode"
            onClick={onToggleResponsiveDesignMode}
            className="hidden md:block"
          >
            <path
              d="M15 19h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a1 1 0 0 0-1 1"
              fill="none"
            />
            <path d="M12 17V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2Z" />
          </HeaderButton>
        </div>
        <div className="hidden sm:block mx-6 lg:mx-4 w-px h-6 bg-gray-200 dark:bg-gray-700" />
        <HeaderButton
          className="ml-4 sm:ml-0 ring-1 ring-gray-900/5 shadow-sm hover:bg-gray-50 dark:ring-0 dark:bg-gray-800 dark:hover:bg-gray-700 dark:shadow-highlight/4"
          naturalWidth={24}
          naturalHeight={24}
          width={36}
          height={36}
          label={
            <>
              <span className="dark:hidden">切换到黑色皮肤</span>
              <span className="hidden dark:inline">切换到白色皮肤</span>
            </>
          }
          onClick={toggleTheme}
          iconClassName="stroke-sky-500 fill-sky-100 group-hover:stroke-sky-600 dark:stroke-gray-400 dark:fill-gray-400/20 dark:group-hover:stroke-gray-300"
          ringClassName="focus-visible:ring-sky-500 dark:focus-visible:ring-2 dark:focus-visible:ring-gray-400"
        >
          <g className="dark:opacity-0">
            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path
              d="M12 4v.01M17.66 6.345l-.007.007M20.005 12.005h-.01M17.66 17.665l-.007-.007M12 20.01V20M6.34 17.665l.007-.007M3.995 12.005h.01M6.34 6.344l.007.007"
              fill="none"
            />
          </g>
          <g className="opacity-0 dark:opacity-100">
            <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
            <path
              d="M12 3v1M18.66 5.345l-.828.828M21.005 12.005h-1M18.66 18.665l-.828-.828M12 21.01V20M5.34 18.666l.835-.836M2.995 12.005h1.01M5.34 5.344l.835.836"
              fill="none"
            />
          </g>
        </HeaderButton>
        <a
          href="https://github.com/maqi1520/mdx-editor"
          target="_blank"
          className="ml-4"
          rel="noreferrer"
        >
          <HeaderButton
            className="block ring-1 ring-gray-900/5 shadow-sm hover:bg-gray-50 dark:ring-0 dark:bg-gray-800 dark:hover:bg-gray-700 dark:shadow-highlight/4"
            naturalWidth={16}
            naturalHeight={16}
            width={36}
            height={36}
            label={
              <>
                <span>源码</span>
              </>
            }
            iconClassName="stroke-sky-500 fill-sky-100 group-hover:stroke-sky-600 dark:stroke-gray-400 dark:fill-gray-400/20 dark:group-hover:stroke-gray-300"
            ringClassName="focus-visible:ring-sky-500 dark:focus-visible:ring-2 dark:focus-visible:ring-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7.975 16a9.39 9.39 0 003.169-.509c-.473.076-.652-.229-.652-.486l.004-.572c.003-.521.01-1.3.01-2.197 0-.944-.316-1.549-.68-1.863 2.24-.252 4.594-1.108 4.594-4.973 0-1.108-.39-2.002-1.032-2.707.1-.251.453-1.284-.1-2.668 0 0-.844-.277-2.77 1.032A9.345 9.345 0 008 .717c-.856 0-1.712.113-2.518.34C3.556-.24 2.712.025 2.712.025c-.553 1.384-.2 2.417-.1 2.668-.642.705-1.033 1.612-1.033 2.707 0 3.852 2.342 4.72 4.583 4.973-.29.252-.554.692-.642 1.347-.58.264-2.027.692-2.933-.831-.19-.302-.756-1.045-1.549-1.032-.843.012-.34.478.013.667.428.239.919 1.133 1.032 1.422.201.567.856 1.65 3.386 1.184 0 .55.006 1.079.01 1.447l.003.428c0 .265-.189.567-.692.479 1.007.34 1.926.516 3.185.516z"
            />
          </HeaderButton>
        </a>
      </div>
    </header>
  )
}

function HeaderButton({
  isActive = false,
  label,
  onClick,
  width = 42,
  height = 36,
  naturalWidth = 26,
  naturalHeight = 22,
  className,
  children,
  iconClassName,
  ringClassName,
}) {
  return (
    <button
      type="button"
      className={clsx(
        className,
        'group focus:outline-none focus-visible:ring-2 rounded-md',
        ringClassName ||
          (isActive
            ? 'focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400'
            : 'focus-visible:ring-gray-400/70 dark:focus-visible:ring-gray-500')
      )}
      onClick={onClick}
    >
      <span className="sr-only">{label}</span>
      <svg
        width={width}
        height={height}
        viewBox={`${(width - naturalWidth) / -2} ${
          (height - naturalHeight) / -2
        } ${width} ${height}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={
          iconClassName ||
          (isActive
            ? 'fill-sky-100 stroke-sky-500 dark:fill-sky-400/50 dark:stroke-sky-400'
            : 'fill-gray-100 stroke-gray-400/70 hover:fill-gray-200 hover:stroke-gray-400 dark:fill-gray-400/20 dark:stroke-gray-500 dark:hover:fill-gray-400/30 dark:hover:stroke-gray-400')
        }
      >
        {children}
      </svg>
    </button>
  )
}
