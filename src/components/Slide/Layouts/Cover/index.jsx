import React from 'react'
import SlideItem from '../SlideItem'
import clsx from 'clsx'

export default function DefaultSlideItem({ item, style }) {
  return (
    <section style={style} className="slide-content flex">
      <div
        style={
          item.frontmatter.background
            ? {
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.333), rgba(0, 0, 0, 0.533)), url(${item.frontmatter.background})`,
              }
            : {}
        }
        className={clsx('slidev-layout cover', item.frontmatter.class)}
      >
        <SlideItem item={item} />
      </div>
    </section>
  )
}
