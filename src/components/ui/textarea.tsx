import React from 'react'
import { cn } from '../../lib/utils'

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => {
  return <textarea {...props} className={cn('px-2 py-1 border rounded', className)} />
}
