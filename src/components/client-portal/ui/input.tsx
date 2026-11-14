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
            className="text-[11px] font-semibold text-[var(--on-petrol-soft)] uppercase tracking-[0.08em] font-heading flex items-center gap-1.5 ml-0.5"
          >
            {label}
            {required && <span className="text-[var(--on-petrol-soft)] text-[10px]">*</span>}
          </label>
        )}

        <div className="relative group">
          {iconLeft && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--on-petrol-dim)] group-focus-within:text-[var(--on-petrol-soft)] transition-colors duration-200">
              <span className="w-4 h-4">{iconLeft}</span>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || hint ? inputId + '-feedback' : undefined}
            className={`field w-full px-4 py-3 text-sm  placeholder:text-[var(--on-petrol-dim)] text-[var(--ice)] ${
              iconLeft ? 'pl-11' : ''
            } ${iconRight ? 'pr-11' : ''} ${
              error
                ? 'border-[#FFB4A8] focus:border-[var(--ice)]  '
                : ''
            } ${className}`}
            {...props}
          />

          {iconRight && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[var(--on-petrol-dim)]">
              <span className="w-4 h-4">{iconRight}</span>
            </div>
          )}
        </div>

        {error && (
          <p id={inputId + '-feedback'} className="text-xs text-[#FFB4A8] font-medium mt-0.5 ml-0.5 flex items-center gap-1.5 ">
            <span className="inline-block w-1 h-1 rounded-full bg-[var(--petrol-deep)]" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={inputId + '-feedback'} className="text-xs text-[var(--on-petrol-soft)] mt-0.5 ml-0.5 leading-relaxed">{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export default Input;
