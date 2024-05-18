import React from 'react'
import {
  PencilIcon,
  ZapIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  FlameIcon,
} from 'lucide-react'

const iconMap = {
  warning: <AlertTriangleIcon />,
  error: <ZapIcon />,
  tip: <FlameIcon />,
  note: <PencilIcon />,
  success: <CheckCircle2Icon />,
}

export default function Blockquote(props) {
  const text = props.children[1].props.children
  const calloutRegex = /\[!(\w+)\](?:\s*(.*))?\n([\s\S]*?)(?=\n\[!|\n?$)/g
  const match = calloutRegex.exec(text)
  if (match !== null) {
    const [fullMatch, type, title, content] = match
    const t = type.toLocaleLowerCase()
    return (
      <section className={`callout callout-${t}`}>
        {title && (
          <section className="callout-title">
            {iconMap[t] || <PencilIcon />} {title}
          </section>
        )}
        <section className="callout-content">{content}</section>
      </section>
    )
  }

  return <blockquote>{props.children}</blockquote>
}
