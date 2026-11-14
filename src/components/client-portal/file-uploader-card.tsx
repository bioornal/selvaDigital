import React, { useState, useRef, useId } from 'react'
import { UploadCloud, File, Image as ImageIcon, Trash2, X, FileText, FileVideo, FileArchive, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'
import { supabaseDb } from '../../lib/supabase'
import type { UploadedFile } from '../../types/admin'
import Progress from './ui/progress'
import Badge from './ui/badge'

interface FileUploaderCardProps {
  clientId: string
  category: UploadedFile['category']
  title: string
  description: string
  allowedTypes: string[]
  allowedExtensionsLabel: string
  maxSizeMb?: number
  existingFiles: UploadedFile[]
  onUploadSuccess: (file: UploadedFile) => void
  onDeleteSuccess: (fileId: string) => void
}

interface UploadingFile {
  id: string
  name: string
  size: number
  progress: number
  error?: string
  success?: boolean
}

export default function FileUploaderCard({
  clientId,
  category,
  title,
  description,
  allowedTypes,
  allowedExtensionsLabel,
  maxSizeMb = 50,
  existingFiles,
  onUploadSuccess,
  onDeleteSuccess
}: FileUploaderCardProps) {
  const fieldId = useId()
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const errorIds = [
    ...(error ? [`${fieldId}-error`] : []),
    ...uploading.filter((u) => u.error).map((u) => `${fieldId}-${u.id}-error`)
  ].join(' ') || undefined

  const categoryFiles = existingFiles.filter((f) => f.category === category)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): string | null => {
    const sizeInMb = file.size / (1024 * 1024)
    if (sizeInMb > maxSizeMb) {
      return `El archivo "${file.name}" pesa más de ${maxSizeMb}MB.`
    }

    const isAllowed = allowedTypes.some((type) => {
      if (type.endsWith('/*')) {
        const prefix = type.split('/')[0]
        return file.type.startsWith(prefix)
      }
      return file.type === type
    })

    if (!isAllowed && allowedTypes.length > 0) {
      return `"${file.name}" tiene un formato no permitido.`
    }
    return null
  }

  const processFiles = async (files: FileList | File[]) => {
    setError('')
    const fileArray = Array.from(files)

    // Validate all
    const validations = fileArray.map((f) => ({ file: f, error: validateFile(f) }))
    const invalid = validations.filter((v) => v.error)

    if (invalid.length > 0) {
      setError(invalid.map((v) => v.error).join(' '))
    }

    const valid = validations.filter((v) => !v.error).map((v) => v.file)
    if (valid.length === 0) return

    for (const file of valid) {
      const tempId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      setUploading((prev) => [...prev, { id: tempId, name: file.name, size: file.size, progress: 0 }])

      try {
        const uploaded = await supabaseDb.uploadFile(
          clientId,
          file,
          category
        )
        setUploading((prev) =>
          prev.map((u) => (u.id === tempId ? { ...u, progress: 100, success: true } : u))
        )
        onUploadSuccess(uploaded)
        setTimeout(() => {
          setUploading((prev) => prev.filter((u) => u.id !== tempId))
        }, 1200)
      } catch (err) {
        const errorMsg = (err as Error).message || 'Error al subir'
        setUploading((prev) =>
          prev.map((u) => (u.id === tempId ? { ...u, error: errorMsg } : u))
        )
        setTimeout(() => {
          setUploading((prev) => prev.filter((u) => u.id !== tempId))
        }, 3000)
      }
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm('¿Estás seguro de eliminar este archivo?')) return
    try {
      await supabaseDb.deleteFile(fileId)
      onDeleteSuccess(fileId)
    } catch (err) {
      console.error(err)
      alert((err as Error).message || 'Error al eliminar el archivo.')
    }
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-[var(--ice)]" />
    if (type.startsWith('video/')) return <FileVideo className="w-4 h-4 text-[var(--on-petrol-soft)]" />
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-[var(--ice)]" />
    if (type.includes('zip') || type.includes('rar')) return <FileArchive className="w-4 h-4 text-[var(--ice)]" />
    return <File className="w-4 h-4 text-[var(--on-petrol-soft)]" />
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 id={`${fieldId}-label`} className="text-[15px] font-bold text-[var(--ice)] tracking-tight font-heading">{title}</h3>
          <p className="text-[13px] text-[var(--on-petrol-soft)] mt-1.5 leading-relaxed">{description}</p>
        </div>
        <Badge variant="brand" size="sm">
          {categoryFiles.length} archivos
        </Badge>
      </div>

      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative group rounded-none p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 overflow-hidden ${
          dragActive
            ? 'border-2 border-solid border-[var(--line-petrol-strong)] bg-[var(--petrol-raised)]  '
            : 'border-2 border-dashed border-[var(--line-petrol)] hover:border-[var(--line-petrol-strong)] hover:bg-[var(--petrol-raised)]'
        }`}
        role="button"
        aria-labelledby={`${fieldId}-label`}
        aria-invalid={errorIds ? true : undefined}
        aria-describedby={errorIds}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            triggerFileInput()
          }
        }}
      >

        <input
          ref={fileInputRef}
          id={fieldId}
          aria-labelledby={`${fieldId}-label`}
          aria-invalid={errorIds ? true : undefined}
          aria-describedby={errorIds}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={allowedTypes.join(',')}
          multiple
        />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-none flex items-center justify-center transition-all duration-300 ${
            dragActive
              ? 'bg-[var(--petrol-raised)] border border-[var(--line-petrol-strong)] '
              : 'bg-[var(--petrol-raised)] border border-[var(--line-petrol-strong)] group-hover:border-[var(--line-petrol-strong)] group-hover:bg-[var(--petrol-raised)] '
          }`}>
            <UploadCloud className={`w-7 h-7 transition-colors ${
              dragActive ? 'text-[var(--on-petrol-soft)]' : 'text-[var(--on-petrol-soft)] group-hover:text-[var(--on-petrol-soft)]'
            }`} strokeWidth={2} />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm text-[var(--ice)]">
              {dragActive ? (
                <span className="font-bold text-[var(--on-petrol-soft)]">Suelta para subir</span>
              ) : (
                <>
                  <span className="font-bold text-[var(--on-petrol-soft)] hover:underline">Hacé clic para buscar</span>
                  <span className="text-[var(--on-petrol-soft)]"> o arrastra tus archivos aquí</span>
                </>
              )}
            </p>
            <p className="text-[11px] text-[var(--on-petrol-soft)] font-medium">{allowedExtensionsLabel}</p>
          </div>
        </div>
      </div>

      {/* Upload progress (multiple) */}
      {uploading.length > 0 && (
        <div className="space-y-2.5 ">
          {uploading.map((u) => (
            <div
              key={u.id}
              className={`p-3.5 rounded-none border ${
                u.error
                  ? 'bg-[var(--petrol-deep)] border-[#FFB4A8]'
                  : u.success
                    ? 'bg-[var(--petrol-deep)] border-[var(--lime)]'
                    : 'bg-[var(--petrol-raised)] border-[var(--line-petrol)]'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {u.error ? (
                    <X className="w-4 h-4 text-[#FFB4A8] shrink-0" />
                  ) : u.success ? (
                    <CheckCircle2 className="w-4 h-4 text-[var(--lime)] shrink-0" />
                  ) : (
                    <UploadCloud className="w-4 h-4 text-[var(--on-petrol-soft)] shrink-0 " />
                  )}
                  <span className="text-xs font-medium text-[var(--ice)] truncate">{u.name}</span>
                </div>
                <span className="text-[11px] font-mono text-[var(--on-petrol-soft)] shrink-0">
                  {u.error ? 'Error' : `${u.progress}%`}
                </span>
              </div>
              {!u.error && !u.success && <Progress value={u.progress} size="sm" />}
              {u.error && <p id={`${fieldId}-${u.id}-error`} role="alert" className="text-[11px] text-[#FFB4A8] mt-1">{u.error}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div id={`${fieldId}-error`} role="alert" className="flex items-start gap-2.5 p-3.5 rounded-none bg-[var(--petrol-deep)] border border-[#FFB4A8] ">
          <AlertCircle className="w-4 h-4 text-[#FFB4A8] shrink-0 mt-0.5" />
          <p className="text-xs text-[#FFB4A8] leading-relaxed">{error}</p>
        </div>
      )}

      {/* Files list */}
      {categoryFiles.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-[var(--on-petrol-soft)] uppercase tracking-widest font-heading">
            Archivos subidos
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {categoryFiles.map((file) => (
              <div
                key={file.id}
                className="group/file flex items-center gap-3 p-3 rounded-none bg-[var(--petrol-deep)] border border-[var(--line-petrol)] hover:border-[var(--line-petrol)]  transition-all"
              >
                {file.file_type.startsWith('image/') ? (
                  <div className="w-12 h-12 rounded-none overflow-hidden bg-[var(--petrol-raised)] border border-[var(--line-petrol)] shrink-0 relative">
                    <img
                      src={file.file_url}
                      alt={file.file_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-none bg-[var(--petrol-raised)] border border-[var(--line-petrol)] flex items-center justify-center shrink-0">
                    {getFileIcon(file.file_type)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--ice)] truncate leading-tight">
                    {file.file_name}
                  </p>
                  <p className="text-[11px] text-[var(--on-petrol-soft)] mt-0.5 font-mono">
                    {formatBytes(file.file_size)}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover/file:opacity-100 transition-opacity">
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-none text-[var(--on-petrol-soft)] hover:text-[var(--ice)] hover:bg-[var(--petrol-raised)] transition-all"
                    title="Ver archivo"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="btn btn-ghost p-1.5 rounded-none text-[var(--on-petrol-soft)] hover:text-[var(--ice)] hover:bg-[var(--petrol-deep)] transition-all"
                    title="Eliminar archivo"
                    aria-label="Eliminar archivo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
