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
  success: { border: 'border-l-emerald-500', icon: 'text-emerald-600', bg: 'bg-emerald-50' },
  error: { border: 'border-l-red-500', icon: 'text-red-600', bg: 'bg-red-50' },
  warning: { border: 'border-l-amber-500', icon: 'text-amber-600', bg: 'bg-amber-50' },
  info: { border: 'border-l-sky-500', icon: 'text-sky-600', bg: 'bg-sky-50' }
}

const ToastItem: React.FC<{ toast: Toast; onClose: (id: string) => void }> = ({ toast, onClose }) => {
  const s = styles[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  return (
    <div
      className={`pointer-events-auto bg-white rounded-xl border border-slate-200 border-l-2 ${s.border} px-4 py-3.5 min-w-[300px] max-w-[420px] flex items-start gap-3 animate-fade-in-up shadow-lg shadow-slate-200/60`}
      role="status"
    >
      <div className={`shrink-0 mt-0.5 ${s.icon}`}>{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 leading-tight">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors p-0.5 -m-0.5 rounded"
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
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider;
