import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastContextValue {
  toast: (options: Omit<Toast, 'id'>) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4" />,
  error: <XCircle className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />
}

const styles: Record<ToastType, { border: string; icon: string; bg: string }> = {
  success: { border: 'border-l-[var(--lime)]', icon: 'text-[var(--lime)]', bg: 'bg-[var(--petrol-deep)]' },
  error: { border: 'border-l-[#FFB4A8]', icon: 'text-[#FFB4A8]', bg: 'bg-[var(--petrol-deep)]' },
  warning: { border: 'border-l-[#F5C76B]', icon: 'text-[#F5C76B]', bg: 'bg-[var(--petrol-deep)]' },
  info: { border: 'border-l-[var(--line-petrol-strong)]', icon: 'text-[var(--on-petrol-soft)]', bg: 'bg-[var(--petrol-raised)]' }
}

const ToastItem: React.FC<{ toast: Toast; onClose: (id: string) => void }> = ({ toast, onClose }) => {
  const s = styles[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  return (
    <div
      className={`pointer-events-auto bg-[var(--petrol-deep)] rounded-none border border-[var(--line-petrol)] ${s.border} px-4 py-3.5 min-w-0 w-full max-w-[420px] flex items-start gap-3`}
      role="status"
    >
      <div className={`shrink-0 mt-0.5 ${s.icon}`}>{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--ice)] leading-tight">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-[var(--on-petrol-soft)] mt-1 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 text-[var(--on-petrol-dim)] hover:text-[var(--ice)] transition-colors p-0.5 -m-0.5 rounded"
        aria-label="Cerrar notificación"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counterRef = useRef(0)

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((options: Omit<Toast, 'id'>) => {
    counterRef.current += 1
    const id = `toast-${counterRef.current}`
    setToasts((prev) => [...prev, { ...options, id }])
  }, [])

  const value: ToastContextValue = {
    toast,
    success: (title, description) => toast({ type: 'success', title, description }),
    error: (title, description) => toast({ type: 'error', title, description }),
    warning: (title, description) => toast({ type: 'warning', title, description }),
    info: (title, description) => toast({ type: 'info', title, description })
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider;
