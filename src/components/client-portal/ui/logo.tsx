import React from 'react'

const SELVA_LOGO_URL =
  'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778600745/SelvaDigital/favicon_mamfqa.webp'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
  asIcon?: boolean
}

const sizes = {
  sm: { box: 'w-8 h-8', img: 32, text: 'text-base' },
  md: { box: 'w-10 h-10', img: 40, text: 'text-lg' },
  lg: { box: 'w-14 h-14', img: 56, text: 'text-2xl' },
  xl: { box: 'w-20 h-20', img: 80, text: 'text-3xl' }
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  asIcon = false
}) => {
  const s = sizes[size]

  if (asIcon) {
    return (
      <div className={`${s.box} relative inline-flex items-center justify-center ${className}`}>
        <img
          src={SELVA_LOGO_URL}
          alt="Selva Digital"
          width={s.img}
          height={s.img}
          className="object-contain w-full h-full"
        />
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`${s.box} relative flex items-center justify-center`}>
        <img
          src={SELVA_LOGO_URL}
          alt="Selva Digital"
          width={s.img}
          height={s.img}
          className="object-contain w-full h-full"
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${s.text} font-bold font-heading tracking-tight text-slate-900`}>
            Selva<span className="text-gradient">Uploader</span>
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo;
