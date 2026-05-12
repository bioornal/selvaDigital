import React from 'react'
import { cn } from '../../lib/utils'

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return <input {...props} className={cn('px-2 py-1 border rounded', className)} />
}
