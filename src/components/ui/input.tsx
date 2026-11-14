import React from 'react'
import { cn } from '../../lib/utils'

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return <input {...props} className={cn('px-3 py-2 border border-[var(--line-petrol-strong)] rounded-none bg-[var(--petrol-deep)] text-[var(--ice)] placeholder:text-[var(--on-petrol-dim)] focus:border-[var(--ice)] disabled:opacity-50 disabled:cursor-not-allowed', className)} />
}
