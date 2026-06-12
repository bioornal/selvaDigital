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
            className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] font-heading flex items-center gap-1.5 ml-0.5"
          >
            {label}
            {required && <span className="text-selva-mint text-[10px]">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={`glass-input w-full px-4 py-3 text-sm focus:outline-none min-h-[120px] resize-y placeholder:text-slate-400 text-slate-900 leading-relaxed ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
              : ''
          } ${className}`}
          {...props}
        />

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
Textarea.displayName = 'Textarea'

export default Textarea;
