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

export default function Blockquote({ children, ...other }) {
  const text = children[1]?.props.children || ''
  const calloutRegex = /\[!(\w+)\](?:\s*(.*))?(\n([\s\S]*?)(?=\n\[!|\n?$))?/
  const match = calloutRegex.exec(text)
  if (match !== null) {
    const [fullMatch, type, title, nextLine = '', content = ''] = match
    const t = type.toLocaleLowerCase()
    const texts = content.split('\n')

    return (
      <section {...other} className={`callout callout-${t}`}>
        {title && (
          <section className="callout-title">
            {iconMap[t] || <PencilIcon />} {title}
          </section>
        )}
        {content && (
          <section className="callout-content">
            {texts.map((p, index) => (
              <section key={index}>{p}</section>
            ))}
          </section>
        )}
      </section>
    )
  }
  const texts = text.split('\n')

  return (
    <blockquote {...other}>
      {text === '' ? (
        <p style={{ overflow: 'hidden' }}></p>
      ) : (
        texts.map((p, index) => <p key={index}>{p}</p>)
      )}
    </blockquote>
  )
}
