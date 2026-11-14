import React, { useEffect, useState, useId } from 'react'
import {
  ArrowLeft, User, Briefcase, Upload, Eye, CheckCircle2,
  LogOut, FileText, Palette, ArrowRight, Send, Sparkles, Lock, ShieldCheck, Zap
} from 'lucide-react'
import { supabaseDb, setClientCodeHeader } from '../../lib/supabase'
import type { Client, ClientBrandInfo, UploadedFile } from '../../types/admin'
import Button from './ui/button'
import Card from './ui/card'
import Input from './ui/input'
import Badge from './ui/badge'
import Logo from './ui/logo'
import { useToast, ToastProvider } from './ui/toast'
import BusinessInfoForm from './business-info-form'
import FileUploaderCard from './file-uploader-card'

function PortalFlowContent() {
  const formId = useId()
  const toast = useToast()

  // State
  const [accessCodeInput, setAccessCodeInput] = useState('')
  const [activeCode, setActiveCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [client, setClient] = useState<Client | null>(null)
  const [brandInfo, setBrandInfo] = useState<ClientBrandInfo | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  
  const [activeStep, setActiveStep] = useState(1)
  const [brandColors, setBrandColors] = useState('')
  const [savingColors, setSavingColors] = useState(false)
  const [submittingPortal, setSubmittingPortal] = useState(false)

  // 1. Check for access code on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const codeParam = params.get('code')
    if (codeParam) {
      const code = codeParam.trim().toUpperCase()
      setActiveCode(code)
      validateCode(code)
    } else {
      setLoading(false)
    }
  }, [])

  // 2. Validate access code
  const validateCode = async (code: string) => {
    setLoading(true)
    setError('')
    try {
      const data = await supabaseDb.getClientByCode(code)
      if (data) {
        setClient(data)
        // Load brand info and files
        const info = await supabaseDb.getClientBrandInfo(data.id)
        setBrandInfo(info)
        setBrandColors(info?.brand_colors || '')
        const files = await supabaseDb.getUploadedFiles(data.id)
        setUploadedFiles(files)
      } else {
        setError('Código no encontrado. Revisalo y volvé a intentar.')
        setActiveCode('')
        // Clear query param
        window.history.replaceState({}, '', window.location.pathname)
      }
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error al verificar tu código.')
      setActiveCode('')
      window.history.replaceState({}, '', window.location.pathname)
    } finally {
      setLoading(false)
    }
  }

  // 3. Handle manual login/access submit
  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessCodeInput.trim()) {
      setError('Ingresá tu código de acceso.')
      return
    }
    const code = accessCodeInput.trim().toUpperCase()
    setActiveCode(code)
    // Update URL query param without reloading
    window.history.replaceState({}, '', `${window.location.pathname}?code=${code}`)
    validateCode(code)
  }

  // 4. Reset / Exit Portal
  const handleExit = () => {
    setClient(null)
    setBrandInfo(null)
    setUploadedFiles([])
    setActiveCode('')
    setAccessCodeInput('')
    setError('')
    setActiveStep(1)
    setClientCodeHeader('')
    window.history.replaceState({}, '', window.location.pathname)
  }

  const handleSaveColors = async () => {
    if (!client) return
    setSavingColors(true)
    try {
      await supabaseDb.saveBrandColors(client.id, brandColors)
      toast.success('Colores guardados', 'Tu paleta de colores de marca se ha registrado.')
    } catch (e) {
      console.error(e)
      toast.error('Error al guardar los colores')
    } finally {
      setSavingColors(false)
    }
  }

  const handleUploadSuccess = (file: UploadedFile) => {
    setUploadedFiles((prev) => [file, ...prev])
    toast.success('Archivo subido', `${file.file_name} se cargó correctamente.`)
  }

  const handleDeleteSuccess = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
    toast.info('Archivo eliminado')
  }

  const handleCompletePortal = async () => {
    if (!client) return
    setSubmittingPortal(true)
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: client.id,
          projectName: client.name,
          accessCode: client.access_code,
          serviceType: client.project_type
        })
      })

      if (!res.ok) {
        throw new Error('Error al enviar la notificación al servidor.')
      }

      setClient({ ...client, status: 'deploy' })

      toast.success('¡Portal enviado!', 'Ya me llegó el aviso: reviso todo y te escribo.')
    } catch (e) {
      console.error(e)
      toast.error('Error al enviar el portal', (e as Error).message || 'Inténtalo de nuevo.')
    } finally {
      setSubmittingPortal(false)
    }
  }

  const parseColors = (inputString: string) => {
    if (!inputString) return []
    const hexRegex = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/g
    const matches = inputString.match(hexRegex)
    return matches || []
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--line-petrol-strong)]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--line-petrol-strong)] animate-spin" role="status" aria-label="Cargando" />
          <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-t-[var(--line-petrol-strong)] animate-spin-slow" />
        </div>
        <p className="text-sm text-[var(--on-petrol-soft)] font-medium ">Cargando tu portal...</p>
      </div>
    )
  }

  // --- 1. LOGIN SCREEN (Enter Access Code) ---
  if (!client) {
    const features = [
      { icon: <Upload className="w-4 h-4" />, title: 'Subí sin límites', desc: 'Imágenes, videos y documentos' },
      { icon: <ShieldCheck className="w-4 h-4" />, title: 'Privado y seguro', desc: 'Encriptación de extremo a extremo' },
      { icon: <Zap className="w-4 h-4" />, title: 'Rápido y directo', desc: 'Sin cuentas, sin contraseñas' }
    ]

    const steps = [
      { num: '01', title: 'Ingresá tu código', desc: 'Usá el código que te pasé por WhatsApp o email' },
      { num: '02', title: 'Completá tu perfil', desc: 'Compartí los datos clave de tu marca y negocio' },
      { num: '03', title: 'Cargá tus archivos', desc: 'Logo, imágenes, videos y documentos en un solo lugar' },
      { num: '04', title: 'Enviá y listo', desc: 'Me llega el aviso y arranco a construir' }
    ]

    return (
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="px-6 sm:px-8 py-5 flex justify-between items-center max-w-7xl w-full mx-auto">
          <Logo size="sm" />
          <a
            href="/admin"
            className="text-xs font-semibold text-[var(--on-petrol-soft)] hover:text-[var(--on-petrol-soft)] transition-colors flex items-center gap-1.5 group"
          >
            <Lock className="w-3.5 h-3.5" />
            Acceso Administrativo
            <ArrowRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </a>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* LEFT */}
            <div className="space-y-8 ">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-[var(--ice)] leading-[1.05]">
                  Cargá los archivos
                  <br />
                  <span className="">para tu próximo</span>
                  <br />
                  proyecto digital.
                </h1>
                <p className="text-base text-[var(--on-petrol-soft)] mt-5 max-w-md leading-relaxed">
                  Subí de forma simple y segura todo el material que necesito para
                  construir tu sitio web, tienda online o chatbot.
                </p>
              </div>

              <div className="space-y-2.5 max-w-md">
                <p className="text-[11px] font-bold text-[var(--on-petrol-dim)] uppercase tracking-widest mb-3">
                  Cómo funciona
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {features.map((f, i) => (
                    <Card key={i} variant="default" padding="sm" className="hover:border-[var(--line-petrol)] transition-colors">
                      <div className="w-8 h-8 rounded-none bg-[var(--petrol-raised)] border border-[var(--line-petrol-strong)] text-[var(--on-petrol-soft)] flex items-center justify-center mb-2.5">
                        {f.icon}
                      </div>
                      <h4 className="text-xs font-bold text-[var(--ice)] font-heading">{f.title}</h4>
                      <p className="text-[10px] text-[var(--on-petrol-soft)] mt-1 leading-normal">{f.desc}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT (Login Form) */}
            <div className="w-full max-w-md mx-auto lg:mx-0 ">
              <Card variant="elevated" padding="lg">
                <div className="text-center mb-7">
                  <h3 className="text-xl font-bold text-[var(--ice)] font-heading">Ingresá al portal</h3>
                  <p className="text-xs text-[var(--on-petrol-soft)] mt-1.5 leading-relaxed">
                    Escribí el código de acceso que te mandé para cargar tu contenido.
                  </p>
                </div>

                {error && (
                  <div id={`${formId}-access-error`} role="alert" className="mb-5 flex items-start gap-2.5 p-3.5 rounded-none bg-[var(--petrol-deep)] border border-[#FFB4A8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--petrol-deep)] mt-1.5 shrink-0" />
                    <p className="text-xs text-[#FFB4A8] leading-relaxed">{error}</p>
                  </div>
                )}

                <form onSubmit={handleAccessSubmit} className="space-y-5">
                  <Input
                    label="Código de Acceso"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${formId}-access-error` : undefined}
                    required
                    value={accessCodeInput}
                    onChange={(e) => {
                      const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 12)
                      setAccessCodeInput(formatted)
                      if (error) setError('')
                    }}
                    placeholder="SELVA-XXXX"
                    className="text-center text-lg font-mono tracking-wider font-bold !py-3.5 uppercase"
                    autoFocus
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    iconRight={<ArrowRight className="w-4 h-4" />}
                  >
                    Ingresar al portal
                  </Button>
                </form>
              </Card>

              {/* Step checklist */}
              <div className="mt-8 p-5 rounded-none bg-[var(--petrol-deep)] border border-[var(--line-petrol)] space-y-3.5">
                <h4 className="text-xs font-bold text-[var(--ice)] uppercase tracking-wider font-heading">Proceso de carga:</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {steps.map((s, i) => (
                    <div key={i} className="flex gap-2.5">
                      <span className="text-xs font-bold text-[var(--on-petrol-soft)] font-heading mt-0.5">{s.num}</span>
                      <div>
                        <h5 className="text-[11px] font-bold text-[var(--ice)] leading-tight">{s.title}</h5>
                        <p className="text-[10px] text-[var(--on-petrol-soft)] mt-0.5 leading-normal">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // --- 2. MAIN PORTAL FLOW SCREEN ---
  const stepsList = [
    { number: 1, label: 'Perfil del Negocio', icon: User, short: 'Perfil' },
    { number: 2, label: 'Identidad Visual', icon: Briefcase, short: 'Marca' },
    { number: 3, label: 'Multimedia y Archivos', icon: Upload, short: 'Archivos' },
    { number: 4, label: 'Resumen y Envío', icon: Eye, short: 'Envío' }
  ]

  const stepProgress = ((activeStep - 1) / (stepsList.length - 1)) * 100

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-[var(--petrol-deep)]  border-b border-[var(--line-petrol)] px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Logo size="sm" />
            <div className="hidden sm:block h-6 w-px bg-[var(--petrol-raised)]" />
            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-bold text-[var(--ice)] truncate font-heading tracking-tight">{client.name}</p>
              <p className="text-[10px] text-[var(--on-petrol-soft)] font-semibold uppercase tracking-wider mt-0.5">
                {client.project_type} · <span className="text-[var(--on-petrol-soft)]">Portal Cliente</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Badge
              variant={client.status === 'deploy' || client.status === 'finalizado' ? 'success' : 'default'}
              size="sm"
              dot
              pulse={!['deploy', 'finalizado'].includes(client.status)}
            >
              {['deploy', 'finalizado'].includes(client.status) ? 'Completado' : 'En Progreso'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              iconLeft={<LogOut className="w-3.5 h-3.5" />}
            >
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto px-4 mt-8 sm:mt-10 flex-1 flex flex-col gap-6">
        {/* Stepper */}
        <Card variant="default" padding="sm" className="overflow-hidden">
          <div className="px-2 sm:px-4 py-2 sm:py-3">
            <div role="group" aria-labelledby={`${formId}-steps-label`} className="flex justify-between items-center relative">
              <span id={`${formId}-steps-label`} className="sr-only">Pasos de carga del portal</span>
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[rgba(232,247,245,.14)] -translate-y-1/2 z-0 hidden sm:block" />
              <div
                className="absolute top-1/2 left-0 h-[2px] bg-[var(--lime)] -translate-y-1/2 z-0 hidden sm:block transition-all duration-500"
                style={{ width: `${stepProgress}%`, boxShadow: 'none' }}
              />

              {stepsList.map((step) => {
                const StepIcon = step.icon
                const isCompleted = activeStep > step.number
                const isActive = activeStep === step.number
                return (
                  <button
                    key={step.number}
                    onClick={() => setActiveStep(step.number)}
                    className="btn btn-ghost flex flex-col items-center gap-2 z-10  cursor-pointer group px-1"
                    aria-label={`Ir a paso ${step.number}: ${step.label}`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-none flex items-center justify-center transition-all duration-300 border ${
                      isCompleted
                        ? 'bg-[var(--petrol-raised)] border-[var(--line-petrol-strong)] text-[var(--lime)]'
                        : isActive
                          ? 'bg-[var(--lime)] border-transparent text-[var(--petrol)]'
                          : 'bg-[var(--petrol-deep)] border-[var(--line-petrol)] text-[var(--on-petrol-dim)] group-hover:border-[var(--line-petrol)]'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} /> : <StepIcon className="w-4 h-4" strokeWidth={2.2} />}
                      
                    </div>
                    <span className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider font-heading hidden sm:block ${
                      isActive ? 'text-[var(--on-petrol-soft)]' : isCompleted ? 'text-[var(--ice)]' : 'text-[var(--on-petrol-dim)]'
                    }`}>
                      {step.short}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Step Content */}
        <Card variant="strong" padding="lg" className="min-h-[480px]">
          {/* STEP 1 */}
          {activeStep === 1 && (
            <div className="space-y-7 ">
              <div>
                <Badge variant="brand" size="sm" iconLeft={<User className="w-3 h-3" />}>
                  Paso 1 de 4
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ice)] tracking-tight font-heading mt-3">
                  Contame sobre tu negocio
                </h2>
                <p className="text-sm text-[var(--on-petrol-soft)] mt-2 leading-relaxed max-w-2xl">
                  Esta información será la base de tu sitio web. Puedes guardar y volver cuando lo necesites.
                </p>
              </div>

              <BusinessInfoForm
                clientId={client.id}
                initialData={brandInfo}
                onSaveSuccess={(data) => setBrandInfo(data)}
                onNext={() => setActiveStep(2)}
              />
            </div>
          )}

          {/* STEP 2 */}
          {activeStep === 2 && (
            <div className="space-y-8 ">
              <div>
                <Badge variant="brand" size="sm" iconLeft={<Briefcase className="w-3 h-3" />}>
                  Paso 2 de 4
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ice)] tracking-tight font-heading mt-3">
                  Identidad Visual
                </h2>
                <p className="text-sm text-[var(--on-petrol-soft)] mt-2 leading-relaxed max-w-2xl">
                  Compartí tu logotipo y la paleta de colores que representa tu marca.
                </p>
              </div>

              <FileUploaderCard
                clientId={client.id}
                category="logo"
                title="Logotipo Oficial"
                description="Subí tu logotipo en formato SVG, PNG (con fondo transparente) o JPG. Se recomiendan versiones clara y oscura."
                allowedTypes={['image/png', 'image/jpeg', 'image/svg+xml']}
                allowedExtensionsLabel="PNG, JPG, SVG · hasta 10MB por archivo"
                maxSizeMb={10}
                existingFiles={uploadedFiles}
                onUploadSuccess={handleUploadSuccess}
                onDeleteSuccess={handleDeleteSuccess}
              />

              <div className="space-y-4 pt-6 border-t border-[var(--line-petrol)]">
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-[var(--on-petrol-soft)]" />
                  <h3 id={`${formId}-colors-label`} className="text-[15px] font-bold text-[var(--ice)] tracking-tight font-heading">Colores de la Marca</h3>
                  <Badge variant="outline" size="sm">Opcional</Badge>
                </div>
                <p className="text-[13px] text-[var(--on-petrol-soft)] leading-relaxed max-w-2xl">
                  Indica los códigos hexadecimales de tu paleta (ej: <span className="font-mono text-[var(--on-petrol-soft)]">#102D35</span>, <span className="font-mono text-[var(--on-petrol-soft)]">#E8F7F5</span>) o descripciones de colores.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Input
                    aria-labelledby={`${formId}-colors-label`}
                    value={brandColors}
                    onChange={(e) => setBrandColors(e.target.value)}
                    placeholder="Ej: Petróleo principal #102D35, detalles hielo #E8F7F5"
                    disabled={savingColors}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSaveColors}
                    variant="secondary"
                    loading={savingColors}
                    disabled={savingColors}
                    className="sm:w-44"
                  >
                    {savingColors ? 'Guardando...' : 'Guardar Colores'}
                  </Button>
                </div>

                {parseColors(brandColors).length > 0 && (
                  <div role="group" aria-labelledby={`${formId}-colors-preview-label`} className="flex flex-wrap gap-2 items-center p-3.5 rounded-none bg-[var(--petrol-raised)] border border-[var(--line-petrol)] ">
                    <span id={`${formId}-colors-preview-label`} className="text-[10px] text-[var(--on-petrol-soft)] font-bold uppercase tracking-widest mr-1">Vista Previa:</span>
                    {parseColors(brandColors).map((color, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--petrol-deep)] border border-[var(--line-petrol)] rounded-full">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-[var(--line-petrol)]"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[10px] font-mono text-[var(--ice)] font-semibold">{color.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-6 border-t border-[var(--line-petrol)]">
                <Button variant="ghost" onClick={() => setActiveStep(1)} iconLeft={<ArrowLeft className="w-4 h-4" />}>
                  Atrás
                </Button>
                <Button variant="primary" onClick={() => setActiveStep(3)} iconRight={<ArrowRight className="w-4 h-4" />}>
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {activeStep === 3 && (
            <div className="space-y-8 ">
              <div>
                <Badge variant="brand" size="sm" iconLeft={<Upload className="w-3 h-3" />}>
                  Paso 3 de 4
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ice)] tracking-tight font-heading mt-3">
                  Multimedia y Documentos
                </h2>
                <p className="text-sm text-[var(--on-petrol-soft)] mt-2 leading-relaxed max-w-2xl">
                  Cargá todas las imágenes, videos y documentos necesarios para tu proyecto.
                </p>
              </div>

              <div className="space-y-8">
                <FileUploaderCard
                  clientId={client.id}
                  category="hero_banner"
                  title="Imagen de Portada / Hero"
                  description="Imagen principal para la cabecera de tu web. Se recomienda alta resolución horizontal (1920x1080)."
                  allowedTypes={['image/*']}
                  allowedExtensionsLabel="PNG, JPG, WEBP · hasta 20MB por archivo"
                  maxSizeMb={20}
                  existingFiles={uploadedFiles}
                  onUploadSuccess={handleUploadSuccess}
                  onDeleteSuccess={handleDeleteSuccess}
                />

                <div className="border-t border-[var(--line-petrol)] pt-8">
                  <FileUploaderCard
                    clientId={client.id}
                    category="product_gallery"
                    title="Galería de Productos / Trabajos"
                    description="Imágenes de tus productos, locales, oficinas o capturas de trabajos anteriores."
                    allowedTypes={['image/*']}
                    allowedExtensionsLabel="PNG, JPG, WEBP · hasta 10MB por archivo"
                    maxSizeMb={10}
                    existingFiles={uploadedFiles}
                    onUploadSuccess={handleUploadSuccess}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </div>

                <div className="border-t border-[var(--line-petrol)] pt-8">
                  <FileUploaderCard
                    clientId={client.id}
                    category="general_asset"
                    title="Otros Archivos y Recursos"
                    description="Catálogos PDF, archivos Word con textos comerciales, bases de datos o videos promocionales."
                    allowedTypes={['image/*', 'video/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']}
                    allowedExtensionsLabel="PDF, DOCX, TXT, MP4 · hasta 50MB por archivo"
                    maxSizeMb={50}
                    existingFiles={uploadedFiles}
                    onUploadSuccess={handleUploadSuccess}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-[var(--line-petrol)]">
                <Button variant="ghost" onClick={() => setActiveStep(2)} iconLeft={<ArrowLeft className="w-4 h-4" />}>
                  Atrás
                </Button>
                <Button variant="primary" onClick={() => setActiveStep(4)} iconRight={<ArrowRight className="w-4 h-4" />}>
                  Revisar Resumen
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {activeStep === 4 && (
            <div className="space-y-8 ">
              <div>
                <Badge variant="brand" size="sm" iconLeft={<Eye className="w-3 h-3" />}>
                  Paso 4 de 4
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ice)] tracking-tight font-heading mt-3">
                  Resumen y Envío Final
                </h2>
                <p className="text-sm text-[var(--on-petrol-soft)] mt-2 leading-relaxed max-w-2xl">
                  Revisá los datos cargados antes de enviar. Cuando envíes, me llega un aviso automático.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <Card variant="default" padding="md">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-[var(--on-petrol-soft)]" />
                    <h3 className="text-sm font-bold text-[var(--ice)] uppercase tracking-wider font-heading">Perfil Comercial</h3>
                  </div>
                  {brandInfo ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-[var(--on-petrol-dim)] font-semibold uppercase tracking-wider">Nombre de Marca</p>
                        <p className="text-sm font-bold text-[var(--ice)] mt-1">{brandInfo.brand_name}</p>
                      </div>
                      {brandInfo.tagline && (
                        <div>
                          <p className="text-[10px] text-[var(--on-petrol-dim)] font-semibold uppercase tracking-wider">Slogan</p>
                          <p className="text-xs text-[var(--on-petrol-soft)] mt-1">{brandInfo.tagline}</p>
                        </div>
                      )}
                      {brandInfo.contact_email && (
                        <div>
                          <p className="text-[10px] text-[var(--on-petrol-dim)] font-semibold uppercase tracking-wider">Email</p>
                          <p className="text-xs text-[var(--ice)] mt-1 font-mono">{brandInfo.contact_email}</p>
                        </div>
                      )}
                      {brandInfo.contact_phone && (
                        <div>
                          <p className="text-[10px] text-[var(--on-petrol-dim)] font-semibold uppercase tracking-wider">Teléfono</p>
                          <p className="text-xs text-[var(--ice)] mt-1 font-mono">{brandInfo.contact_phone}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-xs text-[#F5C76B] leading-relaxed">No completaste el perfil comercial</p>
                    </div>
                  )}
                </Card>

                <Card variant="default" padding="md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[var(--on-petrol-soft)]" />
                      <h3 className="text-sm font-bold text-[var(--ice)] uppercase tracking-wider font-heading">Archivos</h3>
                    </div>
                    <Badge variant="brand" size="sm">{uploadedFiles.length}</Badge>
                  </div>
                  {uploadedFiles.length > 0 ? (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 -mr-1">
                      {uploadedFiles.slice(0, 8).map((file) => (
                        <div key={file.id} className="flex items-center gap-2 text-xs py-1.5">
                          <FileText className="w-3.5 h-3.5 text-[var(--on-petrol-soft)] shrink-0" />
                          <span className="text-[var(--ice)] truncate flex-1">{file.file_name}</span>
                          <span className="text-[10px] text-[var(--on-petrol-dim)] font-mono shrink-0">
                            {(file.file_size / 1024).toFixed(0)}KB
                          </span>
                        </div>
                      ))}
                      {uploadedFiles.length > 8 && (
                        <p className="text-[10px] text-[var(--on-petrol-soft)] pt-1">
                          +{uploadedFiles.length - 8} archivo{uploadedFiles.length - 8 === 1 ? '' : 's'} más
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-xs text-[#F5C76B] leading-relaxed">No has subido archivos aún</p>
                    </div>
                  )}
                </Card>
              </div>

              <div className="pt-6 border-t border-[var(--line-petrol)]">
                {client.status === 'deploy' || client.status === 'finalizado' ? (
                  <Card variant="default" padding="lg" className="  to-white border-[var(--lime)] text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[var(--petrol-deep)] border border-[var(--lime)] flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-7 h-7 text-[var(--lime)]" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--ice)] font-heading tracking-tight">¡Material enviado con éxito!</h3>
                    <p className="text-sm text-[var(--on-petrol-soft)] mt-2 max-w-md mx-auto leading-relaxed">
                      El project manager a cargo ha recibido el material. Comenzaremos a estructurar tu sitio y nos comunicaremos contigo pronto.
                    </p>
                  </Card>
                ) : (
                  <Card variant="elevated" padding="lg" className="text-center">
                    <Logo asIcon size="lg" className="mx-auto mb-3 !w-12 !h-12" />
                    <h3 className="text-lg font-bold text-[var(--ice)] font-heading tracking-tight">¿Listo para finalizar el envío?</h3>
                    <p className="text-sm text-[var(--on-petrol-soft)] mt-2 max-w-md mx-auto leading-relaxed">
                      Al tocar el botón, tu portal queda marcado como completo y me llega el aviso automáticamente.
                    </p>
                    <Button
                      onClick={handleCompletePortal}
                      variant="primary"
                      size="lg"
                      loading={submittingPortal}
                      disabled={submittingPortal}
                      iconLeft={<Send className="w-4 h-4" />}
                      className="mt-5"
                    >
                      Enviar y Finalizar Carga
                    </Button>
                  </Card>
                )}
              </div>

              <div className="flex justify-start pt-2">
                <Button variant="ghost" onClick={() => setActiveStep(3)} iconLeft={<ArrowLeft className="w-4 h-4" />}>
                  Atrás
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}

export default function PortalFlow() {
  return (
    <ToastProvider>
      <PortalFlowContent />
    </ToastProvider>
  )
}
