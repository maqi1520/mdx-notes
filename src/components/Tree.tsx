import React from 'react'
import clsx from 'clsx'
import { isImageFile } from './utils/file-tree-util'

import { FileText, ChevronRight, ImageIcon } from 'lucide-react'

interface TreeItem {
  title: string
  key: string
  is_file: boolean
  is_directory: boolean
  children?: TreeItem[]
}

interface Props {
  treeData: TreeItem[]
  selectedPath: string
  expandedKeys?: string[]
  setExpandedKeys: (keys: string[]) => void
  onSelect: (key: string) => void
  onRightClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    key: string
  ) => void
}

interface TreeNodeProps {
  item: TreeItem
  selectedPath: string
  expandedKeys: string[]
  setExpandedKeys: (keys: string[]) => void
  onSelect: (key: string) => void
  onRightClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    key: string
  ) => void
}

const TreeNode = ({
  item,
  selectedPath,
  expandedKeys,
  setExpandedKeys,
  onSelect,
  onRightClick,
}: TreeNodeProps) => {
  const { title, children, is_file, is_directory } = item
  const isExpanded = expandedKeys.includes(item.key)
  const toggleExpand = () => {
    if (isExpanded) {
      setExpandedKeys(expandedKeys.filter((key) => key !== item.key))
    } else {
      setExpandedKeys([...expandedKeys, item.key])
    }
  }

  return (
    <li>
      {is_directory ? (
        <div className="pl-3">
          <div
            onContextMenu={(e) => onRightClick(e, item.key)}
            onClick={toggleExpand}
            className="flex items-center mb-2 cursor-pointer"
          >
            <ChevronRight
              className={clsx(
                'mr-1 h-4 w-4 flex-none transition-transform text-slate-400',
                {
                  'rotate-90': isExpanded,
                }
              )}
            />
            <div className="whitespace-nowrap flex-auto text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300">
              {title}
            </div>
          </div>
          {isExpanded && (
            <ul className="border-l border-slate-100 dark:border-slate-800 ml-2 space-y-2">
              {children &&
                children.map((child, index) => (
                  <TreeNode
                    onRightClick={onRightClick}
                    onSelect={onSelect}
                    expandedKeys={expandedKeys}
                    setExpandedKeys={setExpandedKeys}
                    selectedPath={selectedPath}
                    key={index}
                    item={child}
                  />
                ))}
            </ul>
          )}
        </div>
      ) : null}
      {is_file && (
        <div
          className={clsx(
            'cursor-pointer border-l flex items-center pl-3 -ml-px',
            selectedPath === item.key
              ? 'text-sky-500 border-current'
              : 'border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
          )}
          onContextMenu={(e) => onRightClick(e, item.key)}
          onClick={() => onSelect(item.key)}
        >
          {isImageFile(item.key) ? (
            <ImageIcon className="mr-1 h-4 w-4 flex-none" />
          ) : (
            <FileText className="mr-1 h-4 w-4 flex-none" />
          )}
          <div className="whitespace-nowrap flex-auto">{title}</div>
        </div>
      )}
    </li>
  )
}

const Tree = ({
  treeData,
  selectedPath,
  expandedKeys = [],
  setExpandedKeys,
  onSelect,
  onRightClick,
}: Props) => {
  return (
    <div className="text-sm pb-16">
      <ul className="space-y-2">
        {treeData.map((item, index) => (
          <TreeNode
            onRightClick={onRightClick}
            onSelect={onSelect}
            expandedKeys={expandedKeys}
            setExpandedKeys={setExpandedKeys}
            selectedPath={selectedPath}
            key={index}
            item={item}
          />
        ))}
      </ul>
    </div>
  )
}

export default Tree
