import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import clsx from 'clsx'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

export function HeaderButton({
  isActive = false,
  label,
  onClick,
  width = 42,
  height = 36,
  naturalWidth = 26,
  naturalHeight = 22,
  className,
  children,
  iconClassName,
  ringClassName,
}) {
  return (
    <button
      type="button"
      className={clsx(
        className,
        'group focus:outline-none focus-visible:ring-2 rounded-md',
        ringClassName ||
          (isActive
            ? 'focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400'
            : 'focus-visible:ring-gray-400/70 dark:focus-visible:ring-gray-500')
      )}
      onClick={onClick}
    >
      <span className="sr-only">{label}</span>
      <svg
        width={width}
        height={height}
        viewBox={`${(width - naturalWidth) / -2} ${
          (height - naturalHeight) / -2
        } ${width} ${height}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={
          iconClassName ||
          (isActive
            ? 'fill-sky-100 stroke-sky-500 dark:fill-sky-400/50 dark:stroke-sky-400'
            : 'fill-gray-100 stroke-gray-400/70 hover:fill-gray-200 hover:stroke-gray-400 dark:fill-gray-400/20 dark:stroke-gray-500 dark:hover:fill-gray-400/30 dark:hover:stroke-gray-400')
        }
      >
        {children}
      </svg>
    </button>
  )
}
