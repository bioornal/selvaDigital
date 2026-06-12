import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'elevated'
  hoverEffect?: boolean
  gradientBorder?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variantClasses = {
  default: 'glass-panel',
  strong: 'glass-panel-strong',
  elevated: 'glass-panel-elevated'
}

const paddingClasses = {
  none: '',
  sm: 'p-4 sm:p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-8 sm:p-10'
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  gradientBorder = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`${variantClasses[variant]} rounded-[20px] ${
        padding !== 'none' ? paddingClasses[padding] : ''
      } ${hoverEffect ? 'glass-panel-hover' : ''} ${
        gradientBorder ? 'gradient-border' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card;
