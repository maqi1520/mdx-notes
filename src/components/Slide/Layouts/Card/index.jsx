import React from 'react'
import SlideItem from '../SlideItem'

export default function DefaultSlideItem({ item, style }) {
  return (
    <section style={style} className="card-content">
      <SlideItem item={item} />
    </section>
  )
}
