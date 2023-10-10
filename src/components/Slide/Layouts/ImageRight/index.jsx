import React from 'react'
import SlideItem from '../SlideItem'
import cl from 'clsx'

export function ImageRight({ item, style, className }) {
  return (
    <section
      style={style}
      className={cl('slide-content grid grid-cols-2', className)}
    >
      <div className="slidev-layout">
        <SlideItem item={item} />
      </div>
      <div
        className="w-full h-full"
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundImage: item.frontmatter.image
            ? `url(${item.frontmatter.image})`
            : '',
        }}
      ></div>
    </section>
  )
}

export function ImageLeft({ item, style, className }) {
  return (
    <section
      style={style}
      className={cl('slide-content grid grid-cols-2', className)}
    >
      <div
        className="w-full h-full"
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundImage: item.frontmatter.image
            ? `url(${item.frontmatter.image})`
            : '',
        }}
      ></div>
      <div className="slidev-layout">
        <SlideItem item={item} />
      </div>
    </section>
  )
}
