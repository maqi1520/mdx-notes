import React from 'react'
import SlideItem from '../SlideItem'
import cl from 'clsx'

export default function ImageRight({ item, style, className }) {
  return (
    <section style={style} className={cl('slide-content flex', className)}>
      <div className="slidev-layout cover flex-1">
        <SlideItem item={item} />
      </div>
      <div
        className="w-full h-full flex-1"
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
