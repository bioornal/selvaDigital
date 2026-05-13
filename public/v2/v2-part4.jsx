/* Selva Digital v2 — Part 4: SobreMi, Contacto, Footer, V2App */

/* ─────────── SOBRE MÍ ─────────── */
window.SobreMi = function SobreMi() {
  const { accent } = window.useV2();
  const Container = window.Container;
  const SectionHeading = window.SectionHeading;
  const CTAButton = window.CTAButton;

  return (
    <section id="sobre" style={{padding:'120px 0', background: v2.bg, position:'relative'}}>
      <Container>
        <div style={{display:'grid', gridTemplateColumns:'1.2fr 0.85fr', gap:64, alignItems:'center'}}>
          {/* Left content */}
          <div>
            <SectionHeading
              kicker="08 ─── Sobre mí"
              title="Christian A. Speziali."
              accent="Developer que no terceriza."
              sub="Desarrollador web freelance basado en Córdoba, Argentina. Hace 6 años que ayudo a dueños de negocios y PyMEs a tener su web vendiendo 24/7, sin tarifas mensuales escondidas."
            />

            <div style={{margin:'34px 0',display:'flex',flexDirection:'column',gap:14}}>
              <p style={{fontFamily:v2.body,fontSize:15.5,lineHeight:1.65,color:v2.textSoft,margin:0,maxWidth:620}}>
                Trabajo solo. Eso significa que vos hablás conmigo de principio a fin —
                presupuesto, diseño, programación, deploy y soporte. Sin agencia
                intermediando, sin equipos rotando, sin mensajes que rebotan entre
                cinco personas distintas.
              </p>
              <p style={{fontFamily:v2.body,fontSize:15.5,lineHeight:1.65,color:v2.textSoft,margin:0,maxWidth:620}}>
                Pero también significa que <strong style={{color:v2.white,fontWeight:600}}>no tomo más de 3
                proyectos en simultáneo</strong>. Si te interesa trabajar conmigo,
                conversemos rápido para ver si entrás en la próxima ventana.
              </p>
            </div>

            {/* KPI row */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14, marginBottom:36}}>
              {[
                {n:'15+', k:'proyectos en producción', s:'AR/AD · LATAM'},
                {n:'6',   k:'años desarrollando', s:'full-stack'},
                {n:'100%',k:'código propio', s:'sin templates'},
              ].map((s,i)=>(
                <div key={i} style={{
                  padding:'20px 22px', background: v2.surface,
                  border:`1px solid ${v2.line}`, borderRadius:10
                }}>
                  <div style={{fontFamily:v2.sans,fontSize:38,fontWeight:600,color:v2.white,letterSpacing:-0.025,lineHeight:1}}>{s.n}</div>
                  <div style={{fontFamily:v2.body,fontSize:12.5,color:v2.textSoft,marginTop:8}}>{s.k}</div>
                  <div style={{fontFamily:v2.mono,fontSize:10,color:v2.textDim,letterSpacing:1,marginTop:4}}>{s.s.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Stack */}
            <div>
              <div style={{fontFamily:v2.mono,fontSize:10.5,letterSpacing:2,color:v2.textDim,marginBottom:14}}>STACK PRINCIPAL // 2026</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {['React','Next.js','Astro','TypeScript','Node.js','PostgreSQL','MongoDB','Firebase','Tailwind','Vercel','VPS','MercadoPago','OpenAI','Anthropic'].map(t=>(
                  <span key={t} style={{
                    fontFamily:v2.mono,fontSize:11,letterSpacing:0.5,color:v2.textSoft,
                    padding:'6px 12px', background:v2.surface,
                    border:`1px solid ${v2.line}`, borderRadius:7
                  }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{display:'flex',gap:12,marginTop:32}}>
              <CTAButton variant="primary">Conversemos</CTAButton>
              <CTAButton variant="ghost" icon={null}>Ver portfolio →</CTAButton>
            </div>
          </div>

          {/* Photo */}
          <div style={{position:'relative'}}>
            <div style={{
              position:'absolute', inset:-40,
              background:`radial-gradient(circle at 30% 35%, ${withAlpha(accent,0.22)}, transparent 65%)`,
              filter:'blur(20px)'
            }}/>
            <div style={{
              position:'relative', width:'100%', aspectRatio:'4/5', overflow:'hidden',
              borderRadius:18, background:v2.surface, border:`1px solid ${v2.lineStr}`,
              boxShadow: v2.shadow
            }}>
              <img src={ASSETS.PHOTO} alt="Christian A. Speziali"
                style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              <div style={{position:'absolute',inset:0,background:`linear-gradient(180deg, transparent 50%, ${withAlpha(v2.bg, 0.78)})`}}/>
              {/* HUD overlay */}
              <div style={{
                position:'absolute',top:18,left:18,right:18,
                display:'flex',justifyContent:'space-between',alignItems:'center'
              }}>
                <span style={{
                  fontFamily:v2.mono,fontSize:10,letterSpacing:1.5,
                  background: withAlpha(v2.bg,0.7), backdropFilter:'blur(8px)',
                  border:`1px solid ${v2.line}`, padding:'5px 9px', borderRadius:999,
                  color:accent
                }}>
                  <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:accent,marginRight:7,verticalAlign:'middle',boxShadow:`0 0 8px ${accent}`}}/>
                  ONLINE
                </span>
                <span style={{
                  fontFamily:v2.mono,fontSize:9,letterSpacing:1.5,color:v2.textDim
                }}>FOUNDER // SELVA</span>
              </div>
              {/* Badge bottom */}
              <div style={{
                position:'absolute', left:24, bottom:24, right:24,
                display:'flex', justifyContent:'space-between', alignItems:'end'
              }}>
                <div>
                  <div style={{fontFamily:v2.sans,fontSize:22,fontWeight:600,color:v2.white,letterSpacing:-0.01}}>Christian A.<br/>Speziali</div>
                  <div style={{fontFamily:v2.body,fontSize:12.5,color:v2.textSoft,marginTop:6}}>Founder & Developer · Selva Digital</div>
                  <div style={{fontFamily:v2.mono,fontSize:10,color:v2.textDim,letterSpacing:1,marginTop:4}}>CÓRDOBA, AR</div>
                </div>
                <a style={{
                  background: withAlpha(v2.bg, 0.7), backdropFilter:'blur(8px)',
                  border:`1px solid ${v2.lineStr}`, padding:'8px 12px',
                  borderRadius:999, fontFamily:v2.body, fontSize:11.5, fontWeight:500, color:v2.white
                }}>WhatsApp →</a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

/* ─────────── CONTACTO ─────────── */
window.Contacto = function Contacto() {
  const { accent } = window.useV2();
  const Container = window.Container;
  const SectionHeading = window.SectionHeading;
  const [tipo, setTipo] = React.useState('');

  return (
    <section id="contacto" style={{padding:'120px 0', background: v2.bg, position:'relative', borderTop:`1px solid ${v2.line}`}}>
      <window.DotGrid opacity={0.2}/>
      <Container style={{position:'relative',zIndex:2}}>
        <div style={{marginBottom:56}}>
          <SectionHeading
            kicker="09 ─── Contacto"
            title="Hablemos del próximo"
            accent="proyecto."
            sub="Respondo presupuestos en menos de 24 horas. Si tu proyecto entra en la próxima ventana, arrancamos en menos de 2 semanas."
            alignment="center"
          />
        </div>

        <div style={{
          display:'grid', gridTemplateColumns:'0.85fr 1.15fr', gap:24,
          maxWidth:1100, margin:'0 auto'
        }}>
          {/* Left: contact info */}
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{
              padding:'24px 22px', background:v2.surface,
              border:`1px solid ${v2.line}`, borderRadius:12
            }}>
              <div style={{fontFamily:v2.mono,fontSize:10.5,letterSpacing:2,color:v2.textDim,marginBottom:18}}>// ENDPOINTS</div>

              {[
                {icon:'✉', label:'Email',    value:'info.selvadigital@gmail.com'},
                {icon:'☎', label:'Teléfono', value:'+54 9 3548 550334'},
                {icon:'⌖', label:'Ubicación',value:'Córdoba, Argentina · UTC−3'},
                {icon:'⏱', label:'Respuesta',value:'< 24 hs en horario laboral'},
              ].map((r,i)=>(
                <div key={i} style={{
                  display:'flex',alignItems:'center',gap:14,
                  padding:'14px 0',
                  borderBottom: i<3 ? `1px solid ${v2.line}` : 'none'
                }}>
                  <span style={{
                    width:38, height:38, borderRadius:9,
                    background: withAlpha(accent, 0.12),
                    border:`1px solid ${withAlpha(accent, 0.3)}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:accent, fontSize:16
                  }}>{r.icon}</span>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontFamily:v2.mono,fontSize:10,letterSpacing:1.5,color:v2.textDim}}>{r.label.toUpperCase()}</div>
                    <div style={{fontFamily:v2.sans,fontSize:14,fontWeight:500,color:v2.white,marginTop:2,overflow:'hidden',textOverflow:'ellipsis'}}>{r.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <a style={{
              padding:'20px 22px', background: withAlpha(accent, 0.1),
              border:`1px solid ${withAlpha(accent, 0.35)}`, borderRadius:12,
              display:'flex', alignItems:'center', justifyContent:'space-between', gap:14
            }}>
              <div>
                <div style={{fontFamily:v2.sans,fontSize:15,fontWeight:600,color:v2.white,letterSpacing:-0.01}}>¿Preferís WhatsApp?</div>
                <div style={{fontFamily:v2.body,fontSize:12.5,color:v2.textSoft,marginTop:2}}>Respondo todos los días, en general en menos de 1 hora</div>
              </div>
              <span style={{
                background: accent, color:'#06140C',
                padding:'10px 14px', borderRadius:8,
                fontFamily:v2.body, fontSize:12.5, fontWeight:600
              }}>Escribir →</span>
            </a>
          </div>

          {/* Right: form */}
          <form style={{
            padding:'30px 30px', background: v2.surface,
            border:`1px solid ${v2.line}`, borderRadius:12,
            display:'flex',flexDirection:'column',gap:18
          }} onSubmit={e=>e.preventDefault()}>
            <div style={{fontFamily:v2.mono,fontSize:10.5,letterSpacing:2,color:v2.textDim,marginBottom:-4}}>// SUBMIT_REQUEST</div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
              <Field label="Nombre completo *" placeholder="Ej: Juan Pérez" accent={accent}/>
              <Field label="Email *" placeholder="tu@email.com" type="email" accent={accent}/>
            </div>

            <div>
              <label style={{fontFamily:v2.mono,fontSize:10.5,letterSpacing:1.5,color:v2.textDim,display:'block',marginBottom:8}}>TIPO DE PROYECTO *</label>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {['Landing','Sitio web','E-commerce','Sistema','Chatbot IA','Otro'].map(t=>{
                  const active = tipo===t;
                  return (
                    <button type="button" key={t} onClick={()=>setTipo(t)} style={{
                      padding:'9px 14px',
                      background: active ? withAlpha(accent,0.16) : v2.surface2,
                      color: active ? accent : v2.textSoft,
                      border:`1px solid ${active ? withAlpha(accent,0.4) : v2.line}`,
                      fontFamily:v2.body, fontSize:12.5, fontWeight:500,
                      borderRadius:999
                    }}>{t}</button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{fontFamily:v2.mono,fontSize:10.5,letterSpacing:1.5,color:v2.textDim,display:'block',marginBottom:8}}>PRESUPUESTO ESTIMADO (ARS)</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                {['< 400k','400k–800k','800k–1.5M','+1.5M'].map(p=>(
                  <button type="button" key={p} style={{
                    padding:'10px 8px',
                    background: v2.surface2, color: v2.textSoft,
                    border:`1px solid ${v2.line}`,
                    fontFamily:v2.body, fontSize:12, fontWeight:500,
                    borderRadius:8
                  }}>{p}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{fontFamily:v2.mono,fontSize:10.5,letterSpacing:1.5,color:v2.textDim,display:'block',marginBottom:8}}>MENSAJE *</label>
              <textarea rows={4} placeholder="Contame sobre tu proyecto, objetivos y cualquier duda que tengas." style={{
                width:'100%', padding:'12px 14px',
                background: v2.surface2, border:`1px solid ${v2.line}`,
                fontFamily:v2.body, fontSize:14, color:v2.white,
                borderRadius:9, resize:'vertical', outline:'none'
              }}/>
            </div>

            <button style={{
              padding:'15px 22px', background: accent, color:'#06140C',
              fontFamily:v2.body, fontSize:14.5, fontWeight:600,
              border:'none', borderRadius:10,
              display:'flex',alignItems:'center',justifyContent:'center',gap:10
            }}>
              Enviar mensaje →
            </button>

            <p style={{
              fontFamily:v2.mono,fontSize:10,letterSpacing:1,color:v2.textFaint,
              textAlign:'center',margin:0
            }}>
              AL ENVIAR, ACEPTÁS QUE TE CONTACTEMOS POR EMAIL O WHATSAPP.
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
};

function Field({ label, placeholder, type='text', accent }) {
  return (
    <div>
      <label style={{fontFamily:v2.mono,fontSize:10.5,letterSpacing:1.5,color:v2.textDim,display:'block',marginBottom:8}}>{label.toUpperCase()}</label>
      <input type={type} placeholder={placeholder} style={{
        width:'100%', padding:'12px 14px',
        background: v2.surface2, border:`1px solid ${v2.line}`,
        fontFamily:v2.body, fontSize:14, color:v2.white,
        borderRadius:9, outline:'none'
      }}/>
    </div>
  );
}

/* ─────────── FOOTER ─────────── */
window.Footer = function Footer() {
  const { accent } = window.useV2();
  const Container = window.Container;
  return (
    <footer style={{background: v2.surface, borderTop:`1px solid ${v2.line}`, paddingTop:60}}>
      <Container>
        <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr', gap:48, paddingBottom:48, borderBottom:`1px solid ${v2.line}`}}>
          <div>
            <img src={ASSETS.LOGO} alt="Selva Digital" style={{height:38,marginBottom:18}}/>
            <p style={{fontFamily:v2.body,fontSize:13.5,lineHeight:1.6,color:v2.textSoft,margin:'0 0 18px',maxWidth:340}}>
              Desarrollo web freelance para PyMEs argentinas. Sitios, e-commerce, sistemas a medida y chatbots con IA. Pago único, sin sorpresas.
            </p>
            <div style={{display:'flex',gap:10}}>
              {[
                {l:'WA', a:'#'},{l:'IG', a:'#'},{l:'Gh', a:'#'},{l:'In', a:'#'}
              ].map(s=>(
                <a key={s.l} href={s.a} style={{
                  width:36,height:36,borderRadius:9,
                  background:v2.surface2, border:`1px solid ${v2.line}`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontFamily:v2.mono,fontSize:11,fontWeight:600,color:v2.textSoft
                }}>{s.l}</a>
              ))}
            </div>
          </div>

          <FooterCol title="Servicios" items={['Sitios web','E-commerce','Sistemas a medida','Chatbots IA','SEO local']}/>
          <FooterCol title="Empresa"   items={['Sobre mí','Portfolio','Testimonios','Planes y precios','Preguntas frecuentes']}/>
          <FooterCol title="Contacto"  items={['+54 9 3548 550334','info.selvadigital@gmail.com','Córdoba, Argentina','Lun–Vie · 9–19','WhatsApp directo']}/>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'28px 0',flexWrap:'wrap',gap:14}}>
          <div style={{fontFamily:v2.mono,fontSize:11,letterSpacing:1,color:v2.textDim}}>
            © 2026 SELVA DIGITAL · CHRISTIAN A. SPEZIALI · CUIT ARGENTINA
          </div>
          <div style={{display:'flex',gap:18,fontFamily:v2.body,fontSize:12.5,color:v2.textDim}}>
            <a>Términos</a>
            <a>Privacidad</a>
            <a>Ley 25.326</a>
          </div>
        </div>
      </Container>
      {/* tape strip */}
      <div style={{
        background: accent, color:'#06140C', padding:'14px 0',
        fontFamily:v2.mono, fontSize:11.5, letterSpacing:2, fontWeight:600,
        textAlign:'center', overflow:'hidden'
      }}>
        DISPONIBLE PARA NUEVOS PROYECTOS · MAYO 2026 &nbsp;·&nbsp; AGENDÁ UNA LLAMADA GRATUITA &nbsp;→ &nbsp; +54 9 3548 550334
      </div>
    </footer>
  );
};

function FooterCol({ title, items }) {
  return (
    <div>
      <div style={{fontFamily:v2.mono,fontSize:10.5,letterSpacing:2,color:window.v2.textDim,marginBottom:16}}>{title.toUpperCase()}</div>
      <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:10}}>
        {items.map(it=>(
          <li key={it} style={{fontFamily:window.v2.body,fontSize:13,color:window.v2.textSoft}}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────── TWEAKS PANEL ─────────── */
function TweaksUI({ t, setTweak }) {
  const { TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakToggle } = window;
  return (
    <TweaksPanel title="Tweaks · Selva Digital">
      <TweakSection label="Hero · Video">
        <TweakToggle label="Mostrar video" value={t.showVideo} onChange={v=>setTweak('showVideo', v)}/>
        <TweakRadio label="Tratamiento"
          value={t.videoMode}
          options={[
            {value:'contained', label:'Contenido'},
            {value:'fullbleed', label:'Full bleed'},
          ]}
          onChange={v=>setTweak('videoMode', v)}/>
      </TweakSection>

      <TweakSection label="Color de acento">
        <TweakColor label="Acento"
          value={t.accent}
          options={['#2BB673','#5EE6B7','#6CCEFF','#FFB547','#A78BFA','#FF6B6B']}
          onChange={v=>setTweak('accent', v)}/>
      </TweakSection>
    </TweaksPanel>
  );
}
window.TweaksUI = TweaksUI;

/* ─────────── APP ─────────── */
window.V2App = function V2App() {
  const { useTweaks } = window;
  const [t, setTweak] = useTweaks(window.V2_TWEAK_DEFAULTS);

  return (
    <window.V2Ctx.Provider value={{ accent: t.accent, videoMode: t.videoMode, showVideo: t.showVideo }}>
      <div style={{background: v2.bg, color:v2.white, minHeight:'100vh'}}>
        <window.Header/>
        <window.Hero/>
        <window.ClientsStrip/>
        <window.Servicios/>
        <window.Portfolio/>
        <window.Testimonios/>
        <window.ChatbotsIA/>
        <window.AppsAMedida/>
        <window.Precios/>
        <window.FAQ/>
        <window.SobreMi/>
        <window.Contacto/>
        <window.Footer/>

        <FloatingWhatsApp accent={t.accent}/>
        <TweaksUI t={t} setTweak={setTweak}/>
      </div>
    </window.V2Ctx.Provider>
  );
};

function FloatingWhatsApp({ accent }) {
  return (
    <a href="#" style={{
      position:'fixed', right:24, bottom:24, zIndex:40,
      width:58, height:58, borderRadius:'50%',
      background: '#25D366', color:'#fff',
      display:'flex',alignItems:'center',justifyContent:'center',
      fontSize:28, boxShadow:'0 12px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
      textDecoration:'none'
    }}>
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/></svg>
    </a>
  );
}
