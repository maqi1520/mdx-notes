/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

//import cn from 'classnames'
import React from 'react'

const Heading = function Heading({
  as: Comp = 'div',
  className,
  children,
  id,
  ...props
}) {
  return (
    <Comp {...props} className={className}>
      {children}
    </Comp>
  )
}

Heading.displayName = 'Heading'

export const H1 = ({ className, ...props }) => <Heading as="h1" {...props} />

export const H2 = ({ className, ...props }) => <Heading as="h2" {...props} />
export const H3 = ({ className, ...props }) => <Heading as="h3" {...props} />

export const H4 = ({ className, ...props }) => <Heading as="h4" {...props} />
