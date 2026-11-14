import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'elevated'
  hoverEffect?: boolean
  gradientBorder?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variantClasses = {
  default: 'panel-deep',
  strong: 'panel-deep',
  elevated: 'panel-raised'
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
      className={`${variantClasses[variant]} rounded-none ${
        padding !== 'none' ? paddingClasses[padding] : ''
      } ${hoverEffect ? 'panel-hover' : ''} ${
        gradientBorder ? 'panel-rule' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card;
