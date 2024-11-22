import React from 'react'

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  return <textarea {...props} className={`px-2 py-1 border rounded ${props.className || ''}`} />
}