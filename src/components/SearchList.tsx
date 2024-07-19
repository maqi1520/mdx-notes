import React from 'react'

interface HighlightedTextProps {
  text: string
  searchValue: string
  maxLength?: number
}

const HighlightedText = ({
  text,
  searchValue,
  maxLength = 30,
}: HighlightedTextProps) => {
  const highlightKeyword = (text, keyword, maxLength) => {
    const caseInsensitiveRegex = new RegExp(keyword, 'gi')
    const match = caseInsensitiveRegex.exec(text)

    if (text.length <= maxLength || !match) {
      return text.replace(
        caseInsensitiveRegex,
        '<span style="background-color: rgb(249 115 22 / 0.4)">$&</span>'
      )
    } else {
      const startIndex = match.index
      let truncatedText = text

      if (startIndex > maxLength / 2) {
        truncatedText =
          '...' +
          text.slice(startIndex - maxLength / 2, startIndex + maxLength / 2) +
          '...'
      } else {
        truncatedText = text.slice(0, maxLength) + '...'
      }

      return truncatedText.replace(
        caseInsensitiveRegex,
        '<span style="background-color: rgb(249 115 22 / 0.4)">$&</span>'
      )
    }
  }

  const highlightedResult = highlightKeyword(text, searchValue, maxLength)

  return <div dangerouslySetInnerHTML={{ __html: highlightedResult }} />
}

interface SearchDataItem {
  name: string
  path: string
  match_lines: string[]
}

interface Props {
  value: SearchDataItem[]
  searchValue: string
  onSelect: (path: string) => void
  children: React.ReactNode
}

export default function SearchList({
  value = [],
  searchValue,
  onSelect,
  children,
}: Props) {
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
            <HighlightedText text={item.name} searchValue={searchValue} />
          </div>
          {item.match_lines.map((text, index) => (
            <div key={index} className="text-xs text-slate-400">
              <HighlightedText text={text} searchValue={searchValue} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
