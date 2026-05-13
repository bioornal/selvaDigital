/* Selva Digital v2 — Part 2: Servicios, Portfolio, Testimonios */

const projectsData = [
  {
    title:'MegaMuebles',
    tag:'E-commerce',
    img:'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778503357/SelvaDigital/Mega_ospdo9.png',
    desc:'Catálogo completo + SEO local para una mueblería con 20 años de trayectoria en Córdoba y Punilla.',
    kpi:'+34% leads orgánicos',
    sub:'4 meses post-launch',
    stack:['React','Cloudinary','GA4'],
    url:'megamueblessommiers.online'
  },
  {
    title:'Iguazú Falls Lodge',
    tag:'Turismo',
    img:'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&auto=format',
    desc:'Reservas directas, galería premium y formulario optimizado para conversión de huéspedes premium.',
    kpi:'67% reservas sin OTAs',
    sub:'antes era 12%',
    stack:['Next.js','Cloudinary','Ads'],
    url:'iguazufallslodge.com'
  },
  {
    title:'El Fogón Delivery',
    tag:'Gastronomía',
    img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80&auto=format',
    desc:'E-commerce gastronómico con MercadoPago, opciones sin TACC y carrito persistente entre dispositivos.',
    kpi:'×2.3 ticket promedio',
    sub:'vs. pedidos por WhatsApp',
    stack:['Next.js','Tailwind','S3'],
    url:'elfogondelivery.com'
  },
  {
    title:'Vip Traslados Iguazú',
    tag:'Landing',
    img:'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778505330/SelvaDigital/Vip_vvshcm.png',
    desc:'Landing de traslados turísticos privados con Schema.org y campañas de Google Ads optimizadas.',
    kpi:'CTR Ads ×2.1',
    sub:'$ por click bajó 40%',
    stack:['React','Vite','Schema'],
    url:'viptraslados.com'
  },
  {
    title:'Megabot Admin',
    tag:'Sistema',
    img:'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778503356/SelvaDigital/Megabot_jczmp3.png',
    desc:'Dashboard multiusuario para gestionar 3 chatbots con IA corriendo en un VPS propio, en tiempo real.',
    kpi:'3 bots, 1 panel',
    sub:'+1.200 msgs/día',
    stack:['React','IA','VPS'],
    url:'megabot-admin.cloud'
  },
  {
    title:'Impasto Pizzería',
    tag:'E-commerce',
    img:'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778503356/SelvaDigital/Impasto_o46wxm.png',
    desc:'Pizzería online con menú interactivo, combos, empanadas por caja y checkout integrado.',
    kpi:'Lanza · jun 2026',
    sub:'pre-orden activa',
    stack:['React','Netlify','SEO'],
    url:'impasto.com.ar'
  },
];
window.projectsData = projectsData;

const testimonialsData = [
  {
    quote: "Después de 20 años puerta a puerta, vender mueble en Córdoba por buscador parecía inalcanzable. Christian no nos vendió una web: nos digitalizó la mueblería. A los 4 meses ya estábamos arriba de la competencia.",
    name:'Hugo P.',
    role:'Co-fundador, MegaMuebles · 20 años de trayectoria',
    avatar:'https://i.pravatar.cc/120?img=12',
    project:'MegaMuebles',
    kpi:'+34% leads orgánicos'
  },
  {
    quote: "Pasamos de depender 100% de Booking a tomar reservas directas en menos de dos meses. La galería terminó de cerrar la decisión del huésped premium. Recomendado.",
    name:'Ana M.',
    role:'Anfitriona, Iguazú Falls Lodge',
    avatar:'https://i.pravatar.cc/120?img=47',
    project:'Iguazú Falls Lodge',
    kpi:'67% reservas directas'
  },
  {
    quote: "Le contamos cómo armamos los combos los viernes y al sábado siguiente el checkout ya los cobraba con MercadoPago. Eso es trabajar con un dev que escucha.",
    name:'Lucas S.',
    role:'Dueño, El Fogón Delivery',
    avatar:'https://i.pravatar.cc/120?img=33',
    project:'El Fogón',
    kpi:'×2.3 ticket promedio'
  },
];
window.testimonialsData = testimonialsData;

/* ─────────── SERVICIOS ─────────── */
window.Servicios = function Servicios() {
  const { accent } = window.useV2();
  const Eyebrow = window.Eyebrow; const Container = window.Container;
  const SectionHeading = window.SectionHeading;

  const services = [
    {
      n:'01', t:'Sitios web',
      d:'Landing pages y sitios institucionales que convierten visitantes en consultas. Diseño propio, sin templates.',
      bullets:['Diseño 100% personalizado','Carga rápida + Core Web Vitals','SEO técnico de base'],
      cta:'Desde $250.000'
    },
    {
      n:'02', t:'E‑commerce',
      d:'Tiendas online con MercadoPago, gestión de stock, cupones y catálogo ilimitado. Pago único.',
      bullets:['Carrito + checkout integrado','Panel de productos','Dominio + hosting 1er año'],
      cta:'Desde $700.000', featured:true
    },
    {
      n:'03', t:'Sistemas a medida',
      d:'Dashboards, CRMs y herramientas internas pensadas para tu operativa. Backend propio.',
      bullets:['Login + roles de usuario','API + base de datos dedicada','Reportes y métricas'],
      cta:'Desde $900.000'
    },
    {
      n:'04', t:'Chatbots con IA',
      d:'Asistentes que entienden tu negocio, cierran ventas y atienden 24/7 — no son bots de plantilla.',
      bullets:['Base de conocimiento propia','Dashboard de conversaciones','Multi-bot multiusuario'],
      cta:'Desde $1.000.000'
    },
    {
      n:'05', t:'SEO local',
      d:'Para que te encuentren en Córdoba, Punilla o donde sea que estés. Schema.org, Google Business, contenido.',
      bullets:['Auditoría técnica','Schema + datos estructurados','Estrategia de keywords'],
      cta:'Incluido en planes'
    },
  ];

  return (
    <section id="servicios" style={{padding:'120px 0 100px', background: v2.bg, position:'relative'}}>
      <window.DotGrid opacity={0.25}/>
      <Container style={{position:'relative', zIndex:2}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'end', marginBottom:64}}>
          <SectionHeading
            kicker="01 ─── Servicios"
            title="Todo lo que necesita"
            accent="tu negocio digital."
            sub="Desde una landing simple hasta sistemas a medida con backend propio. Cinco verticales, una misma persona detrás."
          />
          <div style={{textAlign:'right'}}>
            <span style={{fontFamily:v2.mono,fontSize:11,letterSpacing:2,color:v2.textDim}}>
              ┌── ALCANCE ─────────────────┐<br/>
              │ Argentina · Andorra · LATAM │<br/>
              └────────────────────────────┘
            </span>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:0, border:`1px solid ${v2.line}`, borderRadius:14, overflow:'hidden'}}>
          {services.map((s,i)=>(
            <div key={i} style={{
              padding:'32px 28px',
              background: s.featured ? withAlpha(accent, 0.06) : v2.surface,
              borderRight: i<4 ? `1px solid ${v2.line}` : 'none',
              display:'flex', flexDirection:'column', minHeight:380,
              position:'relative'
            }}>
              {s.featured && (
                <span style={{
                  position:'absolute',top:14,right:14,
                  fontFamily:v2.mono,fontSize:9,letterSpacing:1.5,
                  color:accent, background: withAlpha(accent,0.14),
                  border:`1px solid ${withAlpha(accent,0.5)}`,
                  padding:'4px 8px', borderRadius:999
                }}>★ POPULAR</span>
              )}
              <div style={{fontFamily:v2.mono,fontSize:11,letterSpacing:2,color: s.featured ? accent : v2.textDim,marginBottom:18}}>{s.n}</div>
              <h3 style={{fontFamily:v2.sans,fontSize:22,fontWeight:600,margin:'0 0 12px',color:v2.white,letterSpacing:-0.01}}>{s.t}</h3>
              <p style={{fontFamily:v2.body,fontSize:13.5,lineHeight:1.55,color:v2.textSoft,margin:'0 0 22px'}}>{s.d}</p>

              <ul style={{listStyle:'none',padding:0,margin:'0 0 28px',display:'flex',flexDirection:'column',gap:8}}>
                {s.bullets.map(b=>(
                  <li key={b} style={{fontFamily:v2.body,fontSize:12.5,color:v2.textSoft,display:'flex',alignItems:'flex-start',gap:8,lineHeight:1.4}}>
                    <span style={{color:accent,marginTop:2}}>▸</span>
                    {b}
                  </li>
                ))}
              </ul>

              <div style={{marginTop:'auto',paddingTop:18,borderTop:`1px solid ${v2.line}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontFamily:v2.body,fontSize:12,fontWeight:600,color:v2.white}}>{s.cta}</span>
                <span style={{fontFamily:v2.mono,fontSize:10,color: s.featured ? accent : v2.textDim}}>→</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/* ─────────── PORTFOLIO ─────────── */
window.Portfolio = function Portfolio() {
  const { accent } = window.useV2();
  const Container = window.Container;
  const SectionHeading = window.SectionHeading;
  const [filter, setFilter] = React.useState('Todos');
  const filters = ['Todos','E‑commerce','Turismo','Gastronomía','Sistema','Landing'];

  const filtered = filter==='Todos' ? projectsData : projectsData.filter(p=>p.tag===filter);

  return (
    <section id="portfolio" style={{padding:'120px 0', background: v2.bg, position:'relative'}}>
      <Container>
        <div style={{display:'flex',alignItems:'end',justifyContent:'space-between',marginBottom:48,gap:32,flexWrap:'wrap'}}>
          <SectionHeading
            kicker="02 ─── Portfolio"
            title="Proyectos en producción."
            accent="Sin mockups, sin filtros."
            sub="Cada uno con cliente real, métricas reales y sitio que podés visitar ahora mismo."
          />
          <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
            {filters.map(f=>{
              const active = f===filter;
              return (
                <button key={f} onClick={()=>setFilter(f)} style={{
                  padding:'8px 14px',
                  background: active ? v2.surface2 : 'transparent',
                  border:`1px solid ${active ? v2.lineStr : v2.line}`,
                  fontFamily:v2.body, fontSize:12.5, fontWeight:500,
                  color: active ? v2.white : v2.textDim,
                  borderRadius:999
                }}>{f}</button>
              );
            })}
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20}}>
          {filtered.map((p,i)=>(
            <article key={p.title} style={{
              background:v2.surface, borderRadius:14, overflow:'hidden',
              border:`1px solid ${v2.line}`, display:'flex', flexDirection:'column'
            }}>
              <div style={{aspectRatio:'16/10',background:'#000',overflow:'hidden',position:'relative'}}>
                <img src={p.img} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{
                  position:'absolute',top:14,left:14,
                  fontFamily:v2.mono,fontSize:9,letterSpacing:2,
                  background: withAlpha(v2.bg, 0.85), backdropFilter:'blur(8px)',
                  padding:'5px 10px', color:v2.white,
                  borderRadius:999, border:`1px solid ${v2.line}`
                }}>{p.tag.toUpperCase()}</div>
                <div style={{
                  position:'absolute',top:14,right:14,
                  fontFamily:v2.body, fontSize:11, fontWeight:600,
                  background: withAlpha(accent, 0.16), color: accent,
                  border:`1px solid ${withAlpha(accent, 0.4)}`,
                  padding:'5px 10px', borderRadius:999, backdropFilter:'blur(8px)'
                }}>● {p.kpi}</div>
              </div>
              <div style={{padding:'22px 22px',display:'flex',flexDirection:'column',flex:1}}>
                <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:8,gap:10}}>
                  <h3 style={{fontFamily:v2.sans,fontSize:22,fontWeight:600,margin:0,color:v2.white,letterSpacing:-0.02}}>{p.title}</h3>
                  <span style={{fontFamily:v2.mono,fontSize:10,color:v2.textDim,letterSpacing:0.5}}>{p.sub}</span>
                </div>
                <p style={{fontFamily:v2.body,fontSize:13.5,lineHeight:1.55,color:v2.textSoft,margin:'0 0 18px',flex:1}}>{p.desc}</p>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:18}}>
                  {p.stack.map(t=>(
                    <span key={t} style={{
                      fontFamily:v2.mono,fontSize:10,letterSpacing:1,color:v2.textSoft,
                      padding:'4px 9px',background:v2.surface2,border:`1px solid ${v2.line}`,
                      borderRadius:6
                    }}>{t}</span>
                  ))}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:`1px solid ${v2.line}`,paddingTop:14,gap:10,flexWrap:'wrap'}}>
                  <span style={{fontFamily:v2.body,fontSize:13,fontWeight:500,color:v2.white,display:'inline-flex',alignItems:'center',gap:6,whiteSpace:'nowrap'}}>
                    Ver sitio
                    <span style={{color:accent}}>→</span>
                  </span>
                  <span style={{fontFamily:v2.mono,fontSize:10,letterSpacing:0.5,color:v2.textDim,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:180}}>↗ {p.url}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

/* ─────────── TESTIMONIOS ─────────── */
window.Testimonios = function Testimonios() {
  const { accent } = window.useV2();
  const Container = window.Container;
  const SectionHeading = window.SectionHeading;

  return (
    <section id="testimonios" style={{padding:'110px 0 110px', background: v2.bg, position:'relative', borderTop:`1px solid ${v2.line}`, borderBottom:`1px solid ${v2.line}`}}>
      {/* Faint accent line at top */}
      <div style={{position:'absolute',top:-1,left:'15%',right:'15%',height:1,background:`linear-gradient(90deg, transparent, ${accent}, transparent)`}}/>

      <Container>
        <div style={{marginBottom:60}}>
          <SectionHeading
            kicker="03 ─── Lo que dicen"
            title="No hace falta que vos confíes en mí."
            accent="Confiá en ellos."
            sub="Tres dueños que vivieron el proceso de cerca y vieron el resultado en sus propios números."
            alignment="center"
          />
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20}}>
          {testimonialsData.map((t,i)=>(
            <figure key={i} style={{
              margin:0, padding:'32px 28px',
              background: v2.surface, border:`1px solid ${v2.line}`,
              borderRadius:14, display:'flex', flexDirection:'column',
              position:'relative'
            }}>
              {/* corner quote */}
              <svg width="38" height="32" viewBox="0 0 38 32" style={{marginBottom:14,opacity:0.85}}>
                <path d="M14 0 L14 16 L8 16 C8 24 12 28 18 30 L18 32 L16 32 C6 32 0 26 0 14 L0 0 Z M34 0 L34 16 L28 16 C28 24 32 28 38 30 L38 32 L36 32 C26 32 20 26 20 14 L20 0 Z" fill={accent}/>
              </svg>

              <blockquote style={{
                margin:'0 0 24px',
                fontFamily:v2.body, fontSize:15.5, lineHeight:1.65,
                color:v2.white, fontWeight:400, flex:1
              }}>
                {t.quote}
              </blockquote>

              <figcaption style={{
                display:'flex',alignItems:'center',gap:14,
                paddingTop:20, borderTop:`1px solid ${v2.line}`
              }}>
                <img src={t.avatar} alt={t.name} style={{
                  width:46, height:46, borderRadius:'50%',
                  border:`2px solid ${withAlpha(accent,0.35)}`,
                  objectFit:'cover'
                }}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:v2.sans,fontSize:14,fontWeight:600,color:v2.white,letterSpacing:-0.01}}>{t.name}</div>
                  <div style={{fontFamily:v2.body,fontSize:11.5,color:v2.textDim,lineHeight:1.3,marginTop:2}}>{t.role}</div>
                </div>
                <span style={{
                  fontFamily:v2.mono,fontSize:10,letterSpacing:1,
                  color:accent, background: withAlpha(accent,0.1),
                  border:`1px solid ${withAlpha(accent,0.3)}`,
                  padding:'5px 8px', borderRadius:6, whiteSpace:'nowrap'
                }}>{t.kpi}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* small trust strip */}
        <div style={{
          marginTop:48, display:'flex', justifyContent:'center', alignItems:'center', gap:30, flexWrap:'wrap',
          fontFamily:v2.mono, fontSize:11, letterSpacing:1.5, color: v2.textDim
        }}>
          <span>⟨ 100% PROYECTOS ENTREGADOS ⟩</span>
          <span style={{color:v2.line}}>·</span>
          <span>⟨ CONTRATO Y FACTURA EMITIDA ⟩</span>
          <span style={{color:v2.line}}>·</span>
          <span>⟨ SOPORTE POST-LANZAMIENTO ⟩</span>
        </div>
      </Container>
    </section>
  );
};
