import { cn } from '@/lib/utils'
import React from 'react'

export default function TocList({
  toc = [],
  children,
  showToc,
  scrollLine,
  onScroll,
}) {
  if (!showToc) {
    return children
  }
  return (
    <div className="p-3 text-sm space-y-1">
      {toc.map((item, index) => (
        <div
          onClick={() => onScroll(item.line)}
          style={{ paddingLeft: 12 * item.depth - 1 }}
          className={cn(
            'text-slate-700 cursor-pointer hover:underline hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-900/10 dark:hover:bg-gray-50/10 leading-6',
            {
              'text-slate-900 dark:text-slate-300 bg-slate-900/10 dark:bg-gray-50/10':
                (index < toc.length - 1 &&
                  item.line <= scrollLine &&
                  scrollLine < toc[index + 1].line) ||
                (index === toc.length - 1 && item.line <= scrollLine),
            }
          )}
          key={index}
        >
          {item.value}
        </div>
      ))}
    </div>
  )
}
