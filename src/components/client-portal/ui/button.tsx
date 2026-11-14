import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glass'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
 primary: 'btn-lime', secondary: 'btn-ghost', outline: 'btn-ghost',
 ghost: 'btn-ghost', destructive: 'btn-ghost btn-danger', glass: 'btn-ghost'
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-xs gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-[0.95rem] gap-2.5'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'btn group relative disabled:opacity-50 disabled:cursor-not-allowed select-none'

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      aria-busy={loading}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" role="status" aria-label="Cargando" />
          {children && <span>{children}</span>}
        </span>
      ) : (
        <>
          {iconLeft && <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">{iconLeft}</span>}
          <span>{children}</span>
          {iconRight && <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">{iconRight}</span>}
        </>
      )}
    </button>
  )
}

export default Button;
