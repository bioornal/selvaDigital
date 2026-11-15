import React from 'react'
import { LOGO } from '../../../lib/cloudinary'

interface LogoProps {
 size?: 'sm' | 'md' | 'lg' | 'xl'
 showText?: boolean
 className?: string
 asIcon?: boolean
}

// Alto del logo en px según el tamaño pedido.
const heights = { sm: 40, md: 48, lg: 56, xl: 72 }

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '', asIcon = false }) => {
 const h = heights[size]
 const icon = asIcon || !showText
 return (
  <img
   src={icon ? LOGO.isotipo : LOGO.horizontal}
   alt="Selva Digital"
   height={h}
   width={Math.round(h * (icon ? 300 / 265 : 760 / 290))}
   style={{ height: h, width: 'auto' }}
   className={`block object-contain ${className}`}
   decoding="async"
  />
 )
}

export default Logo
