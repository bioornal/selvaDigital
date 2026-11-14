import React from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand' | 'outline'
type BadgeSize = 'sm' | 'md'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  pulse?: boolean
  iconLeft?: React.ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--petrol-raised)] text-[var(--ice)] border-[rgba(232,247,245,.32)]',
  success: 'bg-[var(--petrol-deep)] text-[var(--lime)] border-[var(--lime)]',
  warning: 'bg-[var(--petrol-deep)] text-[#F5C76B] border-[#F5C76B]',
  error: 'bg-[var(--petrol-deep)] text-[#FFB4A8] border-[#FFB4A8]',
  info: 'bg-[var(--petrol-deep)] text-[var(--ice)] border-[rgba(232,247,245,.32)]',
  brand: 'bg-[var(--petrol-raised)] text-[var(--ice)] border-[rgba(232,247,245,.32)]',
  outline: 'bg-transparent text-[var(--ice)] border-[rgba(232,247,245,.32)]'
}

const dotColors: Record<BadgeVariant, string> = {
 default: 'bg-[var(--on-petrol-dim)]', success: 'bg-[var(--lime)]',
 warning: 'bg-[#F5C76B]', error: 'bg-[#FFB4A8]', info: 'bg-[var(--ice)]',
 brand: 'bg-[var(--on-petrol-soft)]', outline: 'bg-[var(--on-petrol-dim)]'
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5'
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  pulse = false,
  iconLeft,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center font-mono font-medium uppercase tracking-[0.08em] rounded-full border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span className={`absolute inline-flex h-full w-full rounded-full ${dotColors[variant]} opacity-75 `} />
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors[variant]}`} />
        </span>
      )}
      {children}
    </span>
  )
}

export default Badge;
