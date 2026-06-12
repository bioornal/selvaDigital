import React, { useState } from 'react'
import { Plus, Trash2, ArrowRight, Building2, Phone, Share2, Compass } from 'lucide-react'
import { supabaseDb } from '../../lib/supabase'
import type { ClientBrandInfo } from '../../types/admin'
import Input from './ui/input'
import Textarea from './ui/textarea'
import Button from './ui/button'
import { useToast } from './ui/toast'

interface BusinessInfoFormProps {
  clientId: string
  initialData: ClientBrandInfo | null
  onSaveSuccess: (data: ClientBrandInfo) => void
  onNext: () => void
}

const sectionIcons = {
  brand: <Building2 className="w-4 h-4" />,
  contact: <Phone className="w-4 h-4" />,
  social: <Share2 className="w-4 h-4" />,
  refs: <Compass className="w-4 h-4" />
}

export default function BusinessInfoForm({
  clientId,
  initialData,
  onSaveSuccess,
  onNext
}: BusinessInfoFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  const [brandName, setBrandName] = useState(initialData?.brand_name || '')
  const [tagline, setTagline] = useState(initialData?.tagline || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [contactEmail, setContactEmail] = useState(initialData?.contact_email || '')
  const [contactPhone, setContactPhone] = useState(initialData?.contact_phone || '')

  const [socialLinks, setSocialLinks] = useState({
    instagram: initialData?.social_links?.instagram || '',
    facebook: initialData?.social_links?.facebook || '',
    linkedin: initialData?.social_links?.linkedin || '',
    twitter: initialData?.social_links?.twitter || ''
  })

  const [referenceSites, setReferenceSites] = useState<string[]>(
    initialData?.reference_sites || ['']
  )

  const handleAddRefSite = () => setReferenceSites([...referenceSites, ''])

  const handleRemoveRefSite = (index: number) => {
    const updated = referenceSites.filter((_, i) => i !== index)
    setReferenceSites(updated.length === 0 ? [''] : updated)
  }

  const handleRefSiteChange = (index: number, value: string) => {
    const updated = [...referenceSites]
    updated[index] = value
    setReferenceSites(updated)
  }

  const validateEmail = (email: string) => {
    if (!email) return ''
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Correo inválido'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brandName.trim()) {
      setError('El nombre de la marca es obligatorio.')
      return
    }
    const emailError = validateEmail(contactEmail)
    if (emailError) { setError(emailError); return }

    setLoading(true)
    setError('')

    try {
      const cleanRefSites = referenceSites.filter((site) => site.trim() !== '')
      const savedInfo = await supabaseDb.saveClientBrandInfo(clientId, {
        brand_name: brandName,
        tagline,
        description,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        social_links: socialLinks,
        reference_sites: cleanRefSites
      })
      onSaveSuccess(savedInfo)
      toast.success('Información guardada', 'Tus datos comerciales se han registrado correctamente.')
      setTimeout(() => { onNext() }, 700)
    } catch (err) {
      console.error(err)
      const msg = (err as Error).message || 'Error al guardar la información.'
      setError(msg)
      toast.error('Error al guardar', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 stagger-children">
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
          <p className="text-xs text-red-700 leading-relaxed">{error}</p>
        </div>
      )}

      {/* Section 1: Brand */}
      <section className="space-y-5">
        <header className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-selva-emerald">
            {sectionIcons.brand}
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight font-heading">Perfil de la Marca</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">Cuéntanos sobre tu empresa y a qué se dedica</p>
          </div>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Nombre de la Marca" required value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Ej: Selva Café" disabled={loading} />
          <Input label="Slogan o Frase" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Ej: El sabor más puro de la naturaleza" disabled={loading} hint="Una frase corta que identifique tu marca (opcional)" />
        </div>

        <Textarea label="Descripción Comercial" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe brevemente tus productos, servicios y público objetivo. Esta información nos ayuda a redactar los textos de tu sitio." disabled={loading} rows={4} />
      </section>

      {/* Section 2: Contact */}
      <section className="space-y-5">
        <header className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-selva-emerald">
            {sectionIcons.contact}
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight font-heading">Información de Contacto</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">Estos datos aparecerán en tu sitio y formularios</p>
          </div>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Correo Electrónico" type="email" value={contactEmail} onChange={(e) => { setContactEmail(e.target.value); if (error) setError('') }} placeholder="contacto@tuempresa.com" disabled={loading} />
          <Input label="Teléfono o WhatsApp" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+56 9 1234 5678" disabled={loading} />
        </div>
      </section>

      {/* Section 3: Social */}
      <section className="space-y-5">
        <header className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-selva-emerald">
            {sectionIcons.social}
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight font-heading">Redes Sociales</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">Enlaces completos a tus perfiles (opcional)</p>
          </div>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Instagram" value={socialLinks.instagram} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} placeholder="https://instagram.com/tu_usuario" disabled={loading} />
          <Input label="Facebook" value={socialLinks.facebook} onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} placeholder="https://facebook.com/tu_pagina" disabled={loading} />
          <Input label="LinkedIn" value={socialLinks.linkedin} onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} placeholder="https://linkedin.com/company/tu_empresa" disabled={loading} />
          <Input label="Twitter / X" value={socialLinks.twitter} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })} placeholder="https://x.com/tu_usuario" disabled={loading} />
        </div>
      </section>

      {/* Section 4: Reference Sites */}
      <section className="space-y-5">
        <header className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-selva-emerald">
            {sectionIcons.refs}
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight font-heading">Sitios de Referencia</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">Webs que te gusten por su estética o funcionalidades</p>
          </div>
        </header>

        <div className="space-y-3">
          {referenceSites.map((site, index) => (
            <div key={index} className="flex gap-2.5 items-stretch">
              <Input value={site} onChange={(e) => handleRefSiteChange(index, e.target.value)} placeholder="https://sitio-ejemplo.com" disabled={loading} className="flex-1" />
              <button
                type="button"
                onClick={() => handleRemoveRefSite(index)}
                className="px-3.5 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all text-slate-400 shrink-0 cursor-pointer disabled:opacity-40"
                title="Eliminar sitio"
                disabled={loading}
                aria-label="Eliminar sitio de referencia"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <Button type="button" variant="glass" size="sm" onClick={handleAddRefSite} iconLeft={<Plus className="w-3.5 h-3.5" />} disabled={loading}>
            Agregar otro sitio
          </Button>
        </div>
      </section>

      {/* Submit */}
      <div className="flex justify-end pt-6 border-t border-slate-200">
        <Button type="submit" variant="primary" size="lg" loading={loading} iconRight={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}>
          {loading ? 'Guardando...' : 'Guardar y Continuar'}
        </Button>
      </div>
    </form>
  )
}
