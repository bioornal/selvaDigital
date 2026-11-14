import React from 'react'
interface LogoProps {
 size?: 'sm' | 'md' | 'lg' | 'xl'
 showText?: boolean
 className?: string
 asIcon?: boolean
}
const sizes = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl', xl: 'text-3xl' }
export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '', asIcon = false }) => (
 <span className={`inline-flex items-center gap-2 logo-mark ${sizes[size]} ${className}`} aria-label="selva digital">
  {showText && !asIcon && <span>selva digital</span>}
  <span className="status-dot" aria-hidden="true" />
 </span>
)
export default Logo
