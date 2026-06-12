import React from 'react'

interface ProgressProps {
  value: number
  max?: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'brand' | 'success' | 'warning'
  indeterminate?: boolean
  className?: string
}

const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-2.5' }

const variantColors = {
  brand: 'from-selva-emerald via-selva-mint to-selva-neon',
  success: 'from-emerald-500 to-emerald-400',
  warning: 'from-amber-500 to-amber-400'
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  variant = 'brand',
  indeterminate = false,
  className = ''
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-2">
          <span className="uppercase tracking-wider">Progreso</span>
          <span className="text-selva-emerald font-mono">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-slate-100 rounded-full overflow-hidden border border-slate-200`}>
        {indeterminate ? (
          <div
            className="h-full rounded-full"
            style={{
              width: '40%',
              animation: 'shimmer 1.6s linear infinite',
              background: 'linear-gradient(90deg, transparent 0%, rgba(79,70,229,0.6) 50%, transparent 100%)',
              backgroundSize: '200% 100%'
            }}
          />
        ) : (
          <div
            className={`h-full bg-gradient-to-r ${variantColors[variant]} rounded-full transition-all duration-300 ease-out relative overflow-hidden`}
            style={{ width: `${pct}%`, boxShadow: '0 0 8px rgba(79,70,229,0.3)' }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite'
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Progress;
