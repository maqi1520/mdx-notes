import React from 'react'
import {
  PencilIcon,
  ZapIcon,
  AlertTriangleIcon,
  XIcon,
  BugIcon,
  HelpCircleIcon,
  CheckIcon,
  FlameIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  InfoIcon,
  ListIcon,
  QuoteIcon,
} from 'lucide-react'

const iconMap = {
  note: <PencilIcon />,
  abstract: <ClipboardListIcon />,
  summary: <ClipboardListIcon />,
  info: <InfoIcon />,
  todo: <CheckCircleIcon />,
  tip: <FlameIcon />,
  hint: <FlameIcon />,
  important: <FlameIcon />,
  success: <CheckIcon />,
  check: <CheckIcon />,
  done: <CheckIcon />,
  question: <HelpCircleIcon />,
  help: <HelpCircleIcon />,
  faq: <HelpCircleIcon />,
  warning: <AlertTriangleIcon />,
  attention: <AlertTriangleIcon />,
  caution: <AlertTriangleIcon />,
  failure: <XIcon />,
  missing: <XIcon />,
  fail: <XIcon />,
  danger: <ZapIcon />,
  error: <ZapIcon />,
  bug: <BugIcon />,
  example: <ListIcon />,
  quote: <QuoteIcon />,
  cite: <QuoteIcon />,
}

const classMap = {
  tip: ['tip', 'hint', 'important'],
  error: ['error', 'failure', 'missing', 'fail', 'bug'],
  warning: ['warning', 'attention', 'caution'],
  success: ['success', 'done', 'summary', 'abstract'],
}

export default function Blockquote({ children, ...other }) {
  let blockChildren = children[1]?.props.children || ''
  let text = ''
  let blockChildrenOther
  if (Array.isArray(blockChildren) && typeof blockChildren[0] === 'string') {
    text = blockChildren[0]
    blockChildrenOther = blockChildren.slice(1)
  } else if (typeof blockChildren === 'string') {
    text = blockChildren
  }

  const calloutRegex = /\[!(\w+)\](?:[ \t]*(.*))?(\n([\s\S]*?)(?=\n\[!|\n?$))?/
  const match = calloutRegex.exec(text)
  if (match !== null) {
    const [fullMatch, type, title = '', nextLine = '', content = ''] = match
    const calloutType = type.toLocaleLowerCase()
    if (calloutType) {
      let className = 'info'

      for (const key in classMap) {
        if (classMap[key].includes(calloutType)) {
          className = key
          break
        }
      }
      return (
        <section {...other} className={`callout callout-${className}`}>
          <section className="callout-title">
            {iconMap[calloutType] || <PencilIcon />}
            {title || calloutType}
          </section>

          <section className="callout-content">
            <p>
              {content}
              {blockChildrenOther}
            </p>
            {children.slice(2)}
          </section>
        </section>
      )
    }
  }

  return <blockquote {...other}>{children}</blockquote>
}
