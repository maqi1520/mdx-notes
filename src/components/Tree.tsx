import React, { useState } from 'react'
import clsx from 'clsx'
import FileIcon from './icons/FileIcon'
import ArrowIcon from './icons/ArrowIcon'

interface TreeItem {
  title: string
  key: string
  isLeaf: boolean
  children?: TreeItem[]
}

interface Props {
  treeData: TreeItem[]
  selectedPath: string
  expandedKeys: string[]
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
  const { title, children, isLeaf } = item
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
      {!isLeaf ? (
        <div className="pl-3">
          <div
            onContextMenu={(e) => onRightClick(e, item.key)}
            onClick={toggleExpand}
            className="flex items-center mb-2 cursor-pointer"
          >
            <ArrowIcon
              className={clsx(
                'mr-1 h-4 w-4 flex-none transition-transform text-slate-400',
                {
                  'rotate-90': isExpanded,
                }
              )}
            />
            <div className="whitespace-nowrap flex-auto text-slate-900 dark:text-slate-200">
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
      ) : (
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
          <FileIcon className="mr-1 h-4 w-4 flex-none" />
          <div className="whitespace-nowrap flex-auto">{title}</div>
        </div>
      )}
    </li>
  )
}

const Tree = ({
  treeData,
  selectedPath,
  expandedKeys,
  setExpandedKeys,
  onSelect,
  onRightClick,
}: Props) => {
  return (
    <div className="text-sm">
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
