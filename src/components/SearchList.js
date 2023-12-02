import React from 'react'

function HeightLightTitle({ text = '', searchValue = '' }) {
  const index = text.trim().toLowerCase().indexOf(searchValue.toLowerCase())
  const beforeStr = text.substring(0, index)
  const afterStr = text.slice(index + searchValue.length)
  let title =
    index > -1 ? (
      <span>
        {beforeStr}
        <span className="text-red-500">{searchValue}</span>
        {afterStr}
      </span>
    ) : (
      <span>{text}</span>
    )
  return title
}

function HeightLight({ text = '', searchValue = '' }) {
  const index = text.trim().toLowerCase().indexOf(searchValue.toLowerCase())
  const beforeStr = text.substring(0, index).slice(-12)
  const afterStr = text.slice(
    index + searchValue.length,
    index + searchValue.length + 12
  )
  let title =
    index > -1 ? (
      <span>
        {text.substring(0, index).length > 12 && '...'}
        {beforeStr}
        <span className="text-red-500">{searchValue}</span>
        {afterStr}
        {text.slice(index + searchValue.length).length > 12 && '...'}
      </span>
    ) : (
      <span>{text}</span>
    )
  return title
}

export default function SearchList({
  value = [],
  searchValue,
  onSelect,
  children,
}) {
  if (searchValue.trim() === '') {
    return children
  }
  return (
    <div>
      {value.map((item) => (
        <div
          onClick={() => onSelect(item.path)}
          className="border-b border-slate-100 dark:border-slate-800 px-3 py-2 space-y-1 cursor-pointer hover:bg-gray-400/10 dark:hover:bg-gray-700/20"
          key={item.path}
        >
          <div className="font-medium text-xs text-slate-900 dark:text-slate-200">
            <HeightLightTitle text={item.name} searchValue={searchValue} />
          </div>
          {item.content.slice(0, 3).map((text) => (
            <div className="text-xs text-slate-400">
              <HeightLight text={text} searchValue={searchValue} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
