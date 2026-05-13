/* Selva Digital v2 — Part 3: ChatbotsIA, AppsAMedida, Precios, FAQ */

/* ─────────── CHATBOTS IA ─────────── */
window.ChatbotsIA = function ChatbotsIA() {
  const { accent } = window.useV2();
  const Container = window.Container;
  const SectionHeading = window.SectionHeading;
  const CTAButton = window.CTAButton;

  const features = [
    {t:'Chatbots agénticos',   d:'Bots que razonan y actúan por sí mismos. No siguen un árbol de decisión, deciden.'},
    {t:'Chatbots que venden',  d:'Cierran ventas mientras dormís. Toman pedidos, confirman, derivan al humano.'},
    {t:'Base de conocimiento', d:'Aprenden de tu negocio. Cargás tu catálogo, FAQ y políticas — y listo.'},
    {t:'Respuestas 24/7',      d:'Atienden consultas sin esperas. WhatsApp, web, Instagram — todo en un sitio.'},
    {t:'Dashboard en vivo',    d:'Métricas en tiempo real. Conversaciones, leads calientes, fuga de clientes.'},
    {t:'Multi-bot multiusuario',d:'Gestioná varios bots y varios equipos desde un único panel.'},
  ];

  // Chat simulation
  const [step, setStep] = React.useState(0);
  const messages = [
    {from:'user', text:'Hola, ¿tienen sommiers de 2 plazas en stock?'},
    {from:'bot',  text:'¡Hola! Sí, tenemos 3 modelos disponibles. ¿Para Córdoba capital o Punilla?'},
    {from:'user', text:'Capital. Querría el más económico.'},
    {from:'bot',  text:'El Queen 140×190 sale $189.900 con envío incluido. ¿Te lo aseguro?'},
  ];
  React.useEffect(()=>{
    const id = setInterval(()=> setStep(s => (s+1) % (messages.length+1)), 2400);
    return ()=> clearInterval(id);
  },[]);

  return (
    <section id="chatbots" style={{padding:'120px 0', background: v2.bg, position:'relative'}}>
      <Container>
        <div style={{display:'grid', gridTemplateColumns:'1.05fr 1fr', gap:80, alignItems:'center'}}>
          {/* Left: copy + features */}
          <div>
            <SectionHeading
              kicker="04 ─── Inteligencia artificial"
              title="Chatbots con IA que"
              accent="trabajan por vos."
              sub="No son bots de plantilla con respuestas guionadas. Desarrollo asistentes agénticos que entienden tu negocio, cierran ventas y aprenden con el tiempo."
            />

            <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginTop:42}}>
              {features.map((f,i)=>(
                <div key={i} style={{
                  padding:'18px 18px', background: v2.surface,
                  border:`1px solid ${v2.line}`, borderRadius:10,
                  display:'flex', flexDirection:'column', gap:6
                }}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{
                      width:6, height:6, borderRadius:'50%',
                      background: accent, boxShadow:`0 0 8px ${accent}`
                    }}/>
                    <span style={{fontFamily:v2.sans,fontSize:14,fontWeight:600,color:v2.white,letterSpacing:-0.01}}>{f.t}</span>
                  </div>
                  <p style={{fontFamily:v2.body,fontSize:12.5,lineHeight:1.5,color:v2.textSoft,margin:0}}>{f.d}</p>
                </div>
              ))}
            </div>

            <div style={{display:'flex',gap:12,marginTop:36}}>
              <CTAButton variant="primary">Pedir demo gratis</CTAButton>
              <CTAButton variant="ghost" icon={null}>Ver Megabot en vivo →</CTAButton>
            </div>
          </div>

          {/* Right: chat preview */}
          <div style={{position:'relative'}}>
            <div style={{
              position:'absolute', inset:-40,
              background:`radial-gradient(circle at 60% 50%, ${withAlpha(accent,0.18)}, transparent 65%)`,
              filter:'blur(20px)'
            }}/>
            <div style={{
              position:'relative',
              background: v2.surface, border:`1px solid ${v2.lineStr}`,
              borderRadius:18, padding:24, boxShadow: v2.shadow,
              fontFamily:v2.body
            }}>
              {/* chat header */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:16,borderBottom:`1px solid ${v2.line}`}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{
                    width:40,height:40,borderRadius:10,background:withAlpha(accent,0.15),
                    border:`1px solid ${withAlpha(accent,0.4)}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:accent, fontFamily:v2.mono, fontSize:14, fontWeight:600
                  }}>AI</div>
                  <div>
                    <div style={{fontFamily:v2.sans,fontSize:14,fontWeight:600,color:v2.white}}>Megabot · MegaMuebles</div>
                    <div style={{fontFamily:v2.mono,fontSize:10,letterSpacing:1,color:accent}}>
                      <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:accent,marginRight:6,verticalAlign:'middle',boxShadow:`0 0 6px ${accent}`}}/>
                      EN LÍNEA · 24/7
                    </div>
                  </div>
                </div>
                <span style={{fontFamily:v2.mono,fontSize:10,color:v2.textDim}}>{messages.length} msgs</span>
              </div>

              {/* messages */}
              <div style={{padding:'20px 0', display:'flex',flexDirection:'column',gap:12, minHeight:260}}>
                {messages.slice(0, step).map((m,i)=>(
                  <div key={i} style={{
                    alignSelf: m.from==='user' ? 'flex-end' : 'flex-start',
                    maxWidth:'82%',
                    background: m.from==='user' ? v2.surface2 : withAlpha(accent, 0.14),
                    border:`1px solid ${m.from==='user' ? v2.line : withAlpha(accent,0.3)}`,
                    color: m.from==='user' ? v2.textSoft : v2.white,
                    padding:'10px 14px',
                    borderRadius: m.from==='user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    fontSize:13.5, lineHeight:1.5, fontFamily:v2.body
                  }}>{m.text}</div>
                ))}
                {step <= messages.length && step < messages.length && (
                  <div style={{
                    alignSelf: messages[step].from==='user' ? 'flex-end' : 'flex-start',
                    color:v2.textDim, fontFamily:v2.mono, fontSize:11, letterSpacing:1,
                    padding:'4px 14px'
                  }}>{messages[step].from==='bot' ? 'megabot está escribiendo…' : ''}</div>
                )}
              </div>

              {/* footer */}
              <div style={{
                display:'flex',alignItems:'center',gap:10,
                padding:'14px 16px', background:v2.surface2,
                border:`1px solid ${v2.line}`, borderRadius:10
              }}>
                <span style={{fontFamily:v2.body,fontSize:13,color:v2.textDim,flex:1}}>Escribí un mensaje…</span>
                <span style={{
                  background: accent, color:'#06140C',
                  width:32, height:32, borderRadius:8,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontWeight:700
                }}>↑</span>
              </div>

              {/* stats below */}
              <div style={{
                display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:0,
                marginTop:18, paddingTop:18, borderTop:`1px solid ${v2.line}`
              }}>
                {[
                  {n:'1.2k', k:'msgs/día'},
                  {n:'89%',  k:'auto-resueltas'},
                  {n:'3 s',  k:'tiempo medio'},
                ].map((s,i)=>(
                  <div key={i} style={{textAlign:'center',borderRight: i<2 ? `1px solid ${v2.line}` : 'none',padding:'4px 8px'}}>
                    <div style={{fontFamily:v2.sans,fontSize:20,fontWeight:600,color:v2.white,letterSpacing:-0.01}}>{s.n}</div>
                    <div style={{fontFamily:v2.body,fontSize:11,color:v2.textDim,marginTop:2}}>{s.k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

/* ─────────── APPS A MEDIDA ─────────── */
window.AppsAMedida = function AppsAMedida() {
  const { accent } = window.useV2();
  const Container = window.Container;
  const SectionHeading = window.SectionHeading;
  const CTAButton = window.CTAButton;

  const bullets = [
    {t:'Backend propio',          d:'API y base de datos dedicadas'},
    {t:'Autenticación segura',    d:'Roles y permisos personalizados'},
    {t:'Notificaciones push',     d:'Alertas en tiempo real'},
    {t:'Apps web y móviles',      d:'Funcionan en cualquier dispositivo'},
  ];

  return (
    <section id="apps" style={{padding:'120px 0', background: v2.bg, position:'relative'}}>
      <Container>
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:64, alignItems:'center',
          padding:'56px 48px',
          background: `linear-gradient(180deg, ${v2.surface} 0%, ${v2.bg} 100%)`,
          border:`1px solid ${v2.line}`, borderRadius:24,
          position:'relative', overflow:'hidden'
        }}>
          {/* accent corner */}
          <div style={{
            position:'absolute', top:-150, left:-150, width:400, height:400,
            background:`radial-gradient(closest-side, ${withAlpha(accent,0.18)}, transparent 70%)`,
            filter:'blur(10px)'
          }}/>

          {/* Mock UI */}
          <div style={{position:'relative'}}>
            <div style={{
              position:'absolute',top:18,left:18,width:'100%',height:'100%',
              border:`1px solid ${v2.lineMid}`, borderRadius:14
            }}/>
            <div style={{
              position:'relative', background: v2.surface2,
              border:`1px solid ${v2.lineStr}`, borderRadius:14,
              padding:18, fontFamily:v2.mono, fontSize:11,
              boxShadow: v2.shadow
            }}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:14,paddingBottom:12,borderBottom:`1px solid ${v2.line}`}}>
                <span style={{width:10,height:10,borderRadius:'50%',background:'#ff5f57'}}/>
                <span style={{width:10,height:10,borderRadius:'50%',background:'#febc2e'}}/>
                <span style={{width:10,height:10,borderRadius:'50%',background:'#28c840'}}/>
                <span style={{marginLeft:10,color:v2.textDim,fontSize:11}}>app.elfogondelivery.com</span>
              </div>
              {/* dashboard mock */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                {[
                  {l:'Pedidos hoy',  v:'47',   d:'+12 vs ayer', c:accent},
                  {l:'Ticket prom.', v:'$12.4k',d:'+18% mes',   c:'#9CA3AF'},
                ].map((c,i)=>(
                  <div key={i} style={{padding:'14px 16px',background:v2.bg,border:`1px solid ${v2.line}`,borderRadius:8}}>
                    <div style={{fontSize:10,letterSpacing:1.5,color:v2.textDim,marginBottom:6}}>{c.l.toUpperCase()}</div>
                    <div style={{fontFamily:v2.sans,fontSize:26,fontWeight:600,color:v2.white,letterSpacing:-0.02}}>{c.v}</div>
                    <div style={{fontSize:10,color:c.c,marginTop:4}}>↑ {c.d}</div>
                  </div>
                ))}
              </div>
              {/* recent orders */}
              <div style={{padding:'14px 16px',background:v2.bg,border:`1px solid ${v2.line}`,borderRadius:8}}>
                <div style={{fontSize:10,letterSpacing:1.5,color:v2.textDim,marginBottom:10}}>ÚLTIMOS PEDIDOS</div>
                {[
                  {n:'#1204',c:'M. Gimenez',  s:'$ 8.450', st:'pagado'},
                  {n:'#1203',c:'L. Acosta',   s:'$12.800', st:'en cocina'},
                  {n:'#1202',c:'F. Bertola',  s:'$ 5.200', st:'enviado'},
                ].map((r,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom: i<2 ? `1px solid ${v2.line}` : 'none',fontSize:11,color:v2.textSoft}}>
                    <span style={{color:v2.white}}>{r.n}</span>
                    <span>{r.c}</span>
                    <span style={{color:v2.white}}>{r.s}</span>
                    <span style={{color: r.st==='pagado' ? accent : v2.textDim}}>{r.st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              kicker="05 ─── Apps a medida"
              title="¿Necesitás algo más"
              accent="que una web?"
              sub="Aplicaciones completas con backend propio, panel de administración y base de datos dedicada. Desde un sistema interno hasta una app para tus clientes."
            />

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,margin:'34px 0 30px'}}>
              {bullets.map((b,i)=>(
                <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                  <span style={{
                    width:32, height:32, borderRadius:8,
                    background: withAlpha(accent,0.14), border:`1px solid ${withAlpha(accent,0.3)}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:accent, fontWeight:700, fontSize:14, flexShrink:0
                  }}>{i+1}</span>
                  <div>
                    <div style={{fontFamily:v2.sans,fontSize:14,fontWeight:600,color:v2.white,letterSpacing:-0.01}}>{b.t}</div>
                    <div style={{fontFamily:v2.body,fontSize:12.5,color:v2.textDim,lineHeight:1.4,marginTop:2}}>{b.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <CTAButton variant="primary">Contame tu idea</CTAButton>
          </div>
        </div>
      </Container>
    </section>
  );
};

/* ─────────── PRECIOS ─────────── */
window.Precios = function Precios() {
  const { accent } = window.useV2();
  const Container = window.Container;
  const SectionHeading = window.SectionHeading;

  const [tab, setTab] = React.useState('web');

  const planesWeb = [
    {t:'Landing Page', price:'$250.000', sub:'PAGO ÚNICO',
     features:['Página única con scroll','Diseño web responsive','Formulario de contacto','Dominio .com gratis 1 año','Hosting en la nube incluido','Integración con redes','Optimización para móviles']},
    {t:'Sitio Web', price:'$400.000', sub:'PAGO ÚNICO',
     features:['3 a 5 secciones personalizadas','Diseño responsive premium','Formulario avanzado','Dominio + Hosting incluido','Galería de imágenes','Mapa de ubicación','Animaciones suaves']},
    {t:'E‑commerce', price:'$700.000', sub:'PAGO ÚNICO', featured:true,
     features:['Catálogo de productos ilimitado','Carrito + MercadoPago','Sistema de login','Panel de administración','Gestión de stock automática','Descuentos y promos','SEO + GA4 integrados']},
    {t:'A Medida', price:'$550.000', sub:'PAGO ÚNICO',
     features:['+5 secciones personalizadas','Diseño premium único','Formularios avanzados','Galería multimedia','Integraciones a medida','Optimización SEO completa','Soporte post-lanzamiento']},
  ];

  const planesSistemas = [
    {t:'Sistema a medida', price:'$900.000+', sub:'SEGÚN ALCANCE', code:'SYSTEM: CUSTOM',
     features:['Dashboard de administración','Login y roles de usuario','Gestión de datos (CRUD)','Reportes y métricas','Base de datos dedicada','API personalizada','Deploy en la nube']},
    {t:'Chatbot con IA', price:'$1.000.000+', sub:'SEGÚN ALCANCE', code:'BOT: AGENTIC', featured:true,
     features:['Bot inteligente con IA','Chats que venden','Dashboard de mensajes','Multi-bot multiusuario','Respuestas 24/7','Base de conocimiento','Desplegado en VPS propio']},
    {t:'App a medida', price:'$1.000.000+', sub:'SEGÚN ALCANCE', code:'APP: NATIVE',
     features:['App web o mobile','Backend personalizado','Base de datos dedicada','Autenticación de usuarios','Notificaciones push','Panel de administración','Soporte post-lanzamiento']},
  ];

  const plans = tab==='web' ? planesWeb : planesSistemas;

  return (
    <section id="planes" style={{padding:'120px 0', background: v2.bg, position:'relative'}}>
      <Container>
        <div style={{marginBottom:48}}>
          <SectionHeading
            kicker="06 ─── Planes y precios"
            title="Pago único, sin sorpresas."
            accent="El primer año va incluido."
            sub="Dominio .com y hosting en la nube cubiertos por 12 meses. Después, sólo se renueva el hosting — vos pagás directamente al proveedor."
            alignment="center"
          />
        </div>

        {/* Tabs */}
        <div style={{display:'flex',justifyContent:'center',marginBottom:40}}>
          <div style={{
            display:'inline-flex', padding:4, background:v2.surface,
            border:`1px solid ${v2.line}`, borderRadius:12, gap:2
          }}>
            {[
              {id:'web', label:'Webs y tiendas'},
              {id:'sistemas', label:'Sistemas a medida'}
            ].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                padding:'10px 22px',
                background: tab===t.id ? accent : 'transparent',
                color: tab===t.id ? '#06140C' : v2.textSoft,
                border:'none', fontFamily:v2.body, fontSize:13.5, fontWeight:600,
                borderRadius:9
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Plan grid */}
        <div style={{
          display:'grid',
          gridTemplateColumns: tab==='web' ? 'repeat(4,1fr)' : 'repeat(3,1fr)',
          gap:16
        }}>
          {plans.map((p,i)=>(
            <div key={p.t} style={{
              position:'relative',
              padding:'30px 24px',
              background: p.featured ? `linear-gradient(180deg, ${withAlpha(accent,0.08)}, ${v2.surface})` : v2.surface,
              border:`1px solid ${p.featured ? withAlpha(accent, 0.55) : v2.line}`,
              borderRadius:14, display:'flex', flexDirection:'column',
              boxShadow: p.featured ? `0 0 60px -10px ${withAlpha(accent,0.18)}` : 'none'
            }}>
              {p.featured && (
                <div style={{
                  position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)',
                  background: accent, color:'#06140C',
                  fontFamily:v2.body, fontSize:10.5, fontWeight:700, letterSpacing:1.5,
                  padding:'4px 12px', borderRadius:999
                }}>★ MÁS ELEGIDO</div>
              )}
              {p.code && (
                <div style={{
                  fontFamily:v2.mono, fontSize:9.5, letterSpacing:2,
                  color: p.featured ? accent : v2.textDim,
                  marginBottom:14
                }}>{p.code}</div>
              )}
              <h3 style={{fontFamily:v2.sans,fontSize:22,fontWeight:600,margin:'0 0 16px',color:v2.white,letterSpacing:-0.01}}>{p.t}</h3>

              <div style={{marginBottom:22, paddingBottom:18, borderBottom:`1px solid ${v2.line}`}}>
                <div style={{fontFamily:v2.sans,fontSize:36,fontWeight:600,color:v2.white,letterSpacing:-0.025,lineHeight:1}}>{p.price}</div>
                <div style={{fontFamily:v2.mono,fontSize:10,letterSpacing:2,color: p.featured ? accent : v2.textDim,marginTop:8}}>{p.sub}</div>
              </div>

              <ul style={{listStyle:'none',padding:0,margin:'0 0 28px',display:'flex',flexDirection:'column',gap:10,flex:1}}>
                {p.features.map(f=>(
                  <li key={f} style={{fontFamily:v2.body,fontSize:12.5,color:v2.textSoft,display:'flex',alignItems:'flex-start',gap:8,lineHeight:1.45}}>
                    <span style={{color:accent,marginTop:1,flexShrink:0}}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button style={{
                width:'100%', padding:'12px 16px',
                background: p.featured ? accent : 'transparent',
                color: p.featured ? '#06140C' : v2.white,
                border: p.featured ? 'none' : `1px solid ${v2.lineStr}`,
                fontFamily:v2.body, fontSize:13, fontWeight:600, letterSpacing:0.2,
                borderRadius:10
              }}>{p.featured ? 'Iniciar pedido →' : 'Solicitar presupuesto'}</button>
            </div>
          ))}
        </div>

        <p style={{
          textAlign:'center', marginTop:36,
          fontFamily:v2.body, fontSize:13, color:v2.textDim, maxWidth:760, marginLeft:'auto', marginRight:'auto'
        }}>
          Todos los precios en pesos argentinos (ARS). Dominio incluido el primer año, después se renueva con el proveedor.
          Los planes "desde" se ajustan al alcance final del proyecto, evaluado en una llamada gratuita.
        </p>
      </Container>
    </section>
  );
};

/* ─────────── FAQ ─────────── */
window.FAQ = function FAQ() {
  const { accent } = window.useV2();
  const Container = window.Container;
  const SectionHeading = window.SectionHeading;
  const [open, setOpen] = React.useState(0);

  const qs = [
    {q:'¿Cuánto tarda un proyecto web?',
     a:'Una landing page: 5 a 7 días hábiles. Un sitio completo: 2 a 3 semanas. Un e-commerce o sistema a medida: 4 a 8 semanas según alcance. Antes de arrancar te paso un cronograma por escrito con fechas tentativas semana a semana.'},
    {q:'¿El precio es único o hay mensualidades?',
     a:'Pago único. El primer año va incluido el dominio .com y el hosting en la nube. Pasado ese año, vos pagás directamente al proveedor de hosting (~USD 10–15 al mes según el plan). No hay tarifas mensuales mías escondidas.'},
    {q:'¿El código queda mío?',
     a:'Sí. Cuando se entrega el proyecto, te paso el repositorio, las claves de los servicios contratados (dominio, hosting, MercadoPago) y la documentación. Si mañana quisieras que otra persona lo mantenga, puede.'},
    {q:'¿Hago el diseño yo o lo hacés vos?',
     a:'Lo hago yo. Diseño y programo cada proyecto desde cero — no son plantillas. Antes de programar te muestro una propuesta visual; sobre eso iteramos hasta que esté.'},
    {q:'¿Trabajás solo o tenés equipo?',
     a:'Trabajo solo. Vos hablás directo conmigo de principio a fin: presupuesto, diseño, programación, deploy, soporte. Eso es más rápido y más barato que una agencia — pero significa que no tomo más de 3 proyectos en simultáneo.'},
    {q:'¿Aceptás trabajos fuera de Argentina?',
     a:'Sí, ya tengo clientes en Andorra y atiendo consultas de toda LATAM y España. El pago se puede hacer en ARS, USD o EUR según convenga.'},
  ];

  return (
    <section id="faq" style={{padding:'120px 0', background: v2.bg, position:'relative'}}>
      <Container style={{maxWidth:1080}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:80, alignItems:'start'}}>
          <div style={{position:'sticky',top:120}}>
            <SectionHeading
              kicker="07 ─── FAQ"
              title="Preguntas"
              accent="frecuentes."
              sub="Lo que más me preguntan antes de arrancar un proyecto. Si tu duda no está, escribime y la respondo el mismo día."
            />
            <div style={{marginTop:32,display:'flex',gap:10,alignItems:'center'}}>
              <window.CTAButton variant="primary" size="md">Hacer una consulta</window.CTAButton>
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {qs.map((item,i)=>(
              <div key={i} style={{
                background: open===i ? v2.surface : v2.bg,
                border:`1px solid ${open===i ? withAlpha(accent,0.35) : v2.line}`,
                borderRadius:12, overflow:'hidden', transition:'all .2s'
              }}>
                <button
                  onClick={()=>setOpen(open===i ? -1 : i)}
                  style={{
                    width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'20px 22px', background:'transparent', border:'none',
                    fontFamily:v2.sans, fontSize:15.5, fontWeight:500, color:v2.white,
                    letterSpacing:-0.01, textAlign:'left', gap:14
                  }}>
                  <span style={{display:'flex',alignItems:'center',gap:14}}>
                    <span style={{
                      fontFamily:v2.mono,fontSize:11,color: open===i ? accent : v2.textDim,letterSpacing:1
                    }}>0{i+1}</span>
                    {item.q}
                  </span>
                  <span style={{
                    color: open===i ? accent : v2.textDim, fontSize:22, fontWeight:300,
                    transform: open===i ? 'rotate(45deg)' : 'rotate(0)',
                    transition:'transform .2s'
                  }}>+</span>
                </button>
                {open===i && (
                  <div style={{padding:'0 22px 22px 56px', fontFamily:v2.body, fontSize:14, lineHeight:1.65, color:v2.textSoft}}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
