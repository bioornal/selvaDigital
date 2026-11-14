import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className = '', id, ...props }, ref) => {
    const defaultId = React.useId()
    const textareaId = id || defaultId

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[11px] font-semibold text-[var(--on-petrol-soft)] uppercase tracking-[0.08em] font-heading flex items-center gap-1.5 ml-0.5"
          >
            {label}
            {required && <span className="text-[var(--on-petrol-soft)] text-[10px]">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || hint ? textareaId + '-feedback' : undefined}
          className={`field w-full px-4 py-3 text-sm  min-h-[120px] resize-y placeholder:text-[var(--on-petrol-dim)] text-[var(--ice)] leading-relaxed ${
            error
              ? 'border-[#FFB4A8] focus:border-[var(--ice)]  '
              : ''
          } ${className}`}
          {...props}
        />

        {error && (
          <p id={textareaId + '-feedback'} className="text-xs text-[#FFB4A8] font-medium mt-0.5 ml-0.5 flex items-center gap-1.5 ">
            <span className="inline-block w-1 h-1 rounded-full bg-[var(--petrol-deep)]" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={textareaId + '-feedback'} className="text-xs text-[var(--on-petrol-soft)] mt-0.5 ml-0.5 leading-relaxed">{hint}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export default Textarea;
