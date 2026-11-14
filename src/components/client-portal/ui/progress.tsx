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
const colors = { brand: 'var(--lime)', success: 'var(--lime)', warning: 'var(--lime)' }
export const Progress: React.FC<ProgressProps> = ({ value, max = 100, showLabel = false, size = 'md', variant = 'brand', indeterminate = false, className = '' }) => {
 const pct = Math.min(100, Math.max(0, (value / max) * 100))
 return (
  <div className={`w-full ${className}`}>
   {showLabel && <div className="flex justify-between text-xs font-mono text-[var(--on-petrol-soft)] mb-2"><span>Progreso</span><span>{indeterminate ? 'En curso' : Math.round(pct) + '%'}</span></div>}
   <div role="progressbar" aria-label="Progreso" aria-valuemin={0} aria-valuemax={100} aria-valuenow={indeterminate ? undefined : pct} aria-valuetext={indeterminate ? 'En curso' : undefined} className={`w-full ${heights[size]} bg-[rgba(232,247,245,.14)] overflow-hidden border border-[var(--line-petrol)]`}>
    <div className="h-full" style={{ width: indeterminate ? '40%' : pct + '%', background: colors[variant] }} />
   </div>
  </div>
 )
}
export default Progress
