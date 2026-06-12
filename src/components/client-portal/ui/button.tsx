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
  primary:
    'bg-gradient-to-br from-selva-emerald to-selva-mint text-white font-semibold shadow-[0_4px_16px_-4px_rgba(79,70,229,0.45)] hover:shadow-[0_8px_24px_-4px_rgba(79,70,229,0.55)] hover:from-selva-mid hover:to-selva-mint border border-transparent',
  secondary:
    'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300',
  outline:
    'bg-white hover:bg-selva-emerald/5 text-selva-emerald border border-slate-200 hover:border-selva-emerald/40',
  ghost:
    'bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-900',
  destructive:
    'bg-red-500 hover:bg-red-600 text-white shadow-[0_4px_16px_-4px_rgba(239,68,68,0.35)] border border-transparent',
  glass:
    'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
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
    'group relative inline-flex items-center justify-center font-medium tracking-tight rounded-[12px] transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-selva-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-white cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:shadow-none whitespace-nowrap select-none'

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
