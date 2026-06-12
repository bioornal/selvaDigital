import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  required?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, iconLeft, iconRight, required, className = '', id, ...props }, ref) => {
    const defaultId = React.useId()
    const inputId = id || defaultId

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] font-heading flex items-center gap-1.5 ml-0.5"
          >
            {label}
            {required && <span className="text-selva-mint text-[10px]">*</span>}
          </label>
        )}

        <div className="relative group">
          {iconLeft && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-selva-emerald transition-colors duration-200">
              <span className="w-4 h-4">{iconLeft}</span>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`glass-input w-full px-4 py-3 text-sm focus:outline-none placeholder:text-slate-400 text-slate-900 ${
              iconLeft ? 'pl-11' : ''
            } ${iconRight ? 'pr-11' : ''} ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
                : ''
            } ${className}`}
            {...props}
          />

          {iconRight && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <span className="w-4 h-4">{iconRight}</span>
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-medium mt-0.5 ml-0.5 flex items-center gap-1.5 animate-fade-in">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-slate-500 mt-0.5 ml-0.5 leading-relaxed">{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export default Input;
