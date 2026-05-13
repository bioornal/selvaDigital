/* Direction B — Tech refinada (dark, disciplinada, monocromo + un verde) */
const B = {
  bg:        '#0A0B0D',
  surface:   '#121316',
  surface2:  '#1A1C20',
  white:     '#FAFAFA',
  textSoft:  'rgba(250,250,250,0.7)',
  textDim:   'rgba(250,250,250,0.42)',
  line:      'rgba(250,250,250,0.08)',
  lineStr:   'rgba(250,250,250,0.16)',
  green:     '#2BB673',
  greenDeep: '#1F8856',
  greenSoft: 'rgba(43,182,115,0.14)',
  sans:      "'Geist', 'Inter', system-ui, sans-serif",
  body:      "'Inter', system-ui, sans-serif",
  mono:      "'JetBrains Mono', monospace",
};

const PHOTO_B = 'https://res.cloudinary.com/djtvjkcu6/image/upload/c_fill,w_900,h_1100,g_face,q_auto,f_auto/v1778507882/SelvaDigital/yo_perfil_ekrrxc.jpg';
const LOGO_B  = 'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778510560/SelvaDigital/logoChico2_kg35ot.png';

const projectsB = [
  { title:'MegaMuebles',          tag:'E-commerce',  img:'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778503357/SelvaDigital/Mega_ospdo9.png',
    desc:'Catálogo + SEO local para mueblería con 20 años de trayectoria.',  kpi:'+18% leads',   stack:['React','Cloudinary','GA4'] },
  { title:'Iguazú Falls Lodge',   tag:'Turismo',     img:'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&auto=format',
    desc:'Reservas directas, galería premium y formulario optimizado.',      kpi:'Sin OTAs',     stack:['Next.js','Cloudinary','Ads'] },
  { title:'El Fogón Delivery',    tag:'Gastronomía', img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80&auto=format',
    desc:'E-commerce gastronómico con MercadoPago y opciones sin TACC.',     kpi:'Checkout 3 pasos', stack:['Next.js','Tailwind','S3'] },
  { title:'Vip Traslados Iguazú', tag:'Landing',     img:'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778505330/SelvaDigital/Vip_vvshcm.png',
    desc:'Landing de traslados con Schema.org y campañas de Google Ads.',    kpi:'CTR Ads ×2',   stack:['React','Vite','Schema'] },
  { title:'Megabot Admin',        tag:'Sistema',     img:'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778503356/SelvaDigital/Megabot_jczmp3.png',
    desc:'Dashboard multiusuario para 3 chatbots con IA en VPS propio.',     kpi:'3 bots · 1 panel', stack:['React','IA','VPS'] },
  { title:'Impasto Pizzería',     tag:'E-commerce',  img:'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778503356/SelvaDigital/Impasto_o46wxm.png',
    desc:'Pizzería online con combos, empanadas por caja y checkout integrado.', kpi:'En lanzamiento', stack:['React','Netlify','SEO'] },
];

/* ── shared nav for B ── */
function NavB() {
  const links = ['Sobre mí','Planes','Portfolio','FAQ','Contacto'];
  return (
    <div style={{
      display:'flex',alignItems:'center',justifyContent:'space-between',
      padding:'22px 56px',position:'relative',zIndex:2,
      borderBottom:`1px solid ${B.line}`
    }}>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <img src={LOGO_B} alt="Selva Digital" style={{height:38,width:'auto',objectFit:'contain'}}/>
      </div>
      <nav style={{display:'flex',alignItems:'center',gap:32}}>
        {links.map(l=>(
          <a key={l} style={{color:B.textSoft,fontFamily:B.body,fontSize:13.5,fontWeight:400,textDecoration:'none'}}>{l}</a>
        ))}
      </nav>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <span style={{color:B.textDim,fontFamily:B.mono,fontSize:11}}>+54 9 3548 550334</span>
        <a style={{
          background:B.green, color:'#06140C', padding:'10px 18px',
          fontFamily:B.body, fontSize:13, fontWeight:600, borderRadius:8,
          textDecoration:'none', display:'inline-flex',alignItems:'center',gap:8
        }}>Pedir presupuesto →</a>
      </div>
    </div>
  );
}

/* ── faint dot grid overlay ── */
function DotGrid({opacity=0.4}) {
  return (
    <div style={{
      position:'absolute',inset:0,
      backgroundImage:`radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)`,
      backgroundSize:'28px 28px',
      opacity, pointerEvents:'none'
    }}/>
  );
}

/* ─────────── HERO B ─────────── */
window.HeroB = function HeroB() {
  return (
    <div style={{width:1440,height:900,background:B.bg,position:'relative',overflow:'hidden',color:B.white,fontFamily:B.sans}}>
      <DotGrid />
      {/* radial green glow far right */}
      <div style={{position:'absolute',top:-200,right:-200,width:900,height:900,background:`radial-gradient(closest-side, ${B.greenSoft}, transparent 70%)`,filter:'blur(20px)'}}/>

      <NavB />

      <div style={{padding:'80px 56px 0',position:'relative',zIndex:2}}>
        {/* Eyebrow */}
        <div style={{display:'inline-flex',alignItems:'center',gap:12,padding:'7px 14px',border:`1px solid ${B.line}`,background:B.surface,borderRadius:999,marginBottom:36}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:B.green,boxShadow:`0 0 12px ${B.green}`}}/>
          <span style={{fontFamily:B.mono,fontSize:11,letterSpacing:2,color:B.textSoft}}>DISPONIBLE PARA NUEVOS PROYECTOS · MAY 2026</span>
        </div>

        <h1 style={{
          fontFamily:B.sans, fontWeight:600, fontSize:112, lineHeight:0.95,
          letterSpacing:-0.04, margin:'0 0 32px', maxWidth:1180, color:B.white,
        }}>
          Tecnología que hace <span style={{color:B.green}}>crecer</span> tu&nbsp;negocio.
        </h1>

        <p style={{
          fontFamily:B.body, fontSize:20, lineHeight:1.5, color:B.textSoft,
          maxWidth:620, margin:'0 0 44px', fontWeight:400
        }}>
          Sitios web, e‑commerce y sistemas a medida para PyMEs argentinas.
          Pago único, sin tarifas mensuales sorpresa. Hablás directo conmigo.
        </p>

        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:64}}>
          <a style={{
            background:B.green, color:'#06140C', padding:'16px 26px', borderRadius:10,
            fontFamily:B.body, fontSize:15, fontWeight:600, textDecoration:'none',
            display:'inline-flex',alignItems:'center',gap:8
          }}>Pedir presupuesto →</a>
          <a style={{
            background:B.surface, color:B.white, padding:'16px 24px',
            border:`1px solid ${B.lineStr}`, borderRadius:10,
            fontFamily:B.body, fontSize:15, fontWeight:500, textDecoration:'none'
          }}>Ver portfolio</a>
          <span style={{fontFamily:B.mono,fontSize:11,letterSpacing:1.5,color:B.textDim,marginLeft:14}}>O ESCRIBÍME AL WHATSAPP →</span>
        </div>

        {/* Stat row */}
        <div style={{
          display:'grid',gridTemplateColumns:'repeat(4,1fr)',
          borderTop:`1px solid ${B.line}`, borderBottom:`1px solid ${B.line}`,
          background:`linear-gradient(180deg, ${B.surface}66, transparent)`
        }}>
          {[
            {n:'15+',  k:'proyectos en producción'},
            {n:'<24h', k:'respondo presupuestos'},
            {n:'AR · AD', k:'países donde trabajo'},
            {n:'100%', k:'código propio, sin templates'},
          ].map((s,i)=>(
            <div key={i} style={{
              padding:'24px 28px',
              borderRight: i<3 ? `1px solid ${B.line}` : 'none',
              display:'flex',flexDirection:'column',gap:6
            }}>
              <span style={{fontFamily:B.sans,fontSize:42,fontWeight:500,color:B.white,letterSpacing:-0.02,lineHeight:1}}>{s.n}</span>
              <span style={{fontFamily:B.body,fontSize:13,color:B.textDim}}>{s.k}</span>
            </div>
          ))}
        </div>

        {/* Trusted by (clients, not stack) */}
        <div style={{marginTop:44,display:'flex',alignItems:'center',gap:32,flexWrap:'wrap'}}>
          <span style={{fontFamily:B.mono,fontSize:11,letterSpacing:2,color:B.textDim}}>CLIENTES &nbsp;//</span>
          {['MegaMuebles','El Fogón','Iguazú Falls','Vip Traslados','Impasto'].map(c=>(
            <span key={c} style={{fontFamily:B.sans,fontSize:16,fontWeight:500,color:B.textSoft,letterSpacing:-0.01}}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────── SOBRE MÍ B ─────────── */
window.SobreMiB = function SobreMiB() {
  return (
    <div style={{width:1440,height:900,background:B.bg,position:'relative',overflow:'hidden',color:B.white,fontFamily:B.sans}}>
      <DotGrid opacity={0.25}/>
      <NavB />

      <div style={{padding:'56px 56px 0',display:'grid',gridTemplateColumns:'1.25fr 0.95fr',gap:60,position:'relative',zIndex:2}}>
        {/* Left content */}
        <div>
          <div style={{fontFamily:B.mono,fontSize:11,letterSpacing:3,color:B.green,marginBottom:24}}>01 ─── SOBRE MÍ</div>

          <h2 style={{
            fontFamily:B.sans,fontWeight:600,fontSize:64,lineHeight:1,margin:'0 0 28px',
            letterSpacing:-0.03, color:B.white
          }}>
            El developer freelance<br/>que <span style={{color:B.green}}>no terceriza</span> tu proyecto.
          </h2>

          <p style={{fontFamily:B.body,fontSize:17,lineHeight:1.65,color:B.textSoft,margin:'0 0 18px',maxWidth:620}}>
            Trabajo solo. Diseño, programo, despliego y te entrego todo en
            tus manos. Sin agencia intermediando, sin equipos rotando, sin
            mensajes que rebotan entre 5 personas distintas.
          </p>
          <p style={{fontFamily:B.body,fontSize:17,lineHeight:1.65,color:B.textSoft,margin:'0 0 40px',maxWidth:620}}>
            Hace 6 años que ayudo a <strong style={{color:B.white,fontWeight:600}}>dueños de negocios y PyMEs</strong> a
            tener su web vendiendo 24/7 — pago único, hosting el primer
            año incluido, código que después es tuyo.
          </p>

          {/* KPI row */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:48}}>
            {[
              {n:'15+',k:'proyectos en producción'},
              {n:'6',  k:'años de experiencia'},
              {n:'1',  k:'persona — todo el stack'},
            ].map((s,i)=>(
              <div key={i} style={{
                padding:'18px 20px',background:B.surface,border:`1px solid ${B.line}`,borderRadius:10
              }}>
                <div style={{fontFamily:B.sans,fontSize:36,fontWeight:600,color:B.white,letterSpacing:-0.02,lineHeight:1}}>{s.n}</div>
                <div style={{fontFamily:B.body,fontSize:12,color:B.textDim,marginTop:8}}>{s.k}</div>
              </div>
            ))}
          </div>

          {/* Process */}
          <div>
            <div style={{fontFamily:B.mono,fontSize:11,letterSpacing:2,color:B.textDim,marginBottom:16}}>CÓMO TRABAJAMOS</div>
            <div style={{display:'flex',flexDirection:'column',gap:0,border:`1px solid ${B.line}`,borderRadius:10,overflow:'hidden'}}>
              {[
                {n:'01',t:'Hablamos', d:'Te llamo, entiendo tu negocio y tus objetivos.'},
                {n:'02',t:'Plan',     d:'Te paso costos, tiempos y alcance — por escrito.'},
                {n:'03',t:'Avances',  d:'Te muestro la web creciendo cada semana.'},
                {n:'04',t:'Listo',    d:'Lanzamos. Te capacito y el código queda tuyo.'},
              ].map((s,i)=>(
                <div key={i} style={{
                  display:'grid',gridTemplateColumns:'80px 1fr 1.6fr',gap:24,alignItems:'center',
                  padding:'14px 22px', background:B.surface,
                  borderBottom: i<3 ? `1px solid ${B.line}` : 'none'
                }}>
                  <span style={{fontFamily:B.mono,fontSize:12,color:B.green,letterSpacing:1}}>{s.n}</span>
                  <span style={{fontFamily:B.sans,fontSize:16,fontWeight:600,color:B.white}}>{s.t}</span>
                  <span style={{fontFamily:B.body,fontSize:13.5,color:B.textSoft}}>{s.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Photo */}
        <div style={{position:'relative'}}>
          {/* green halo */}
          <div style={{
            position:'absolute',top:-30,left:-30,right:30,bottom:30,
            background:`radial-gradient(circle at 30% 40%, ${B.greenSoft}, transparent 65%)`,
            filter:'blur(8px)'
          }}/>
          <div style={{
            position:'relative', width:'100%', aspectRatio:'4/5', overflow:'hidden',
            borderRadius:14, background:B.surface, border:`1px solid ${B.lineStr}`
          }}>
            <img src={PHOTO_B} alt="Founder" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            {/* subtle dark bottom */}
            <div style={{position:'absolute',inset:0,background:`linear-gradient(180deg, transparent 55%, rgba(10,11,13,0.75))`}}/>
            {/* badge bottom-left */}
            <div style={{
              position:'absolute',left:18,bottom:18,right:18,
              display:'flex',justifyContent:'space-between',alignItems:'end'
            }}>
              <div>
                <div style={{fontFamily:B.mono,fontSize:10,letterSpacing:2,color:B.green,marginBottom:6}}>
                  <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:B.green,marginRight:8,boxShadow:`0 0 8px ${B.green}`,verticalAlign:'middle'}}/>
                  ONLINE
                </div>
                <div style={{fontFamily:B.sans,fontSize:20,fontWeight:600,color:B.white,letterSpacing:-0.01}}>Tu nombre</div>
                <div style={{fontFamily:B.body,fontSize:12,color:B.textSoft,marginTop:2}}>Founder · Selva Digital</div>
              </div>
              <a style={{
                background:'rgba(10,11,13,0.8)',backdropFilter:'blur(8px)',
                border:`1px solid ${B.lineStr}`,
                padding:'8px 14px', borderRadius:999,
                fontFamily:B.body,fontSize:12,fontWeight:500,color:B.white,
                textDecoration:'none'
              }}>WhatsApp →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────── PORTFOLIO B ─────────── */
window.PortfolioB = function PortfolioB() {
  return (
    <div style={{width:1440,minHeight:1180,background:B.bg,position:'relative',overflow:'hidden',color:B.white,fontFamily:B.sans}}>
      <DotGrid opacity={0.2}/>
      <NavB />

      <div style={{padding:'56px 56px 80px',position:'relative',zIndex:2}}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'end',justifyContent:'space-between',marginBottom:48,gap:32}}>
          <div>
            <div style={{fontFamily:B.mono,fontSize:11,letterSpacing:3,color:B.green,marginBottom:18}}>02 ─── PORTFOLIO</div>
            <h2 style={{fontFamily:B.sans,fontWeight:600,fontSize:64,lineHeight:1,margin:0,color:B.white,letterSpacing:-0.03}}>
              Proyectos en producción.<br/>
              <span style={{color:B.textDim,fontWeight:500}}>Sin mockups, sin filtros.</span>
            </h2>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            {['Todos','Web','E‑commerce','Sistemas','Chatbots'].map((f,i)=>(
              <span key={f} style={{
                padding:'8px 14px',
                background: i===0 ? B.surface2 : 'transparent',
                border:`1px solid ${i===0 ? B.lineStr : B.line}`,
                fontFamily:B.body,fontSize:12.5,fontWeight:500,
                color: i===0 ? B.white : B.textDim,
                borderRadius:999, cursor:'pointer'
              }}>{f}</span>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
          {projectsB.map((p,i)=>(
            <article key={i} style={{
              background:B.surface, borderRadius:14, overflow:'hidden',
              border:`1px solid ${B.line}`, display:'flex',flexDirection:'column',
              transition:'all .3s'
            }}>
              <div style={{aspectRatio:'16/10',background:'#000',overflow:'hidden',position:'relative'}}>
                <img src={p.img} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                {/* category top-left */}
                <div style={{
                  position:'absolute',top:14,left:14,
                  fontFamily:B.mono,fontSize:9,letterSpacing:2,
                  background:'rgba(10,11,13,0.8)',backdropFilter:'blur(8px)',
                  padding:'5px 10px',color:B.white,
                  borderRadius:999, border:`1px solid ${B.line}`
                }}>{p.tag.toUpperCase()}</div>
                {/* kpi top-right */}
                <div style={{
                  position:'absolute',top:14,right:14,
                  fontFamily:B.body,fontSize:11,fontWeight:600,
                  background:B.greenSoft, color:B.green,
                  border:`1px solid ${B.green}55`,
                  padding:'5px 10px', borderRadius:999, backdropFilter:'blur(8px)'
                }}>● {p.kpi}</div>
              </div>
              <div style={{padding:'22px 22px 22px',display:'flex',flexDirection:'column',flex:1}}>
                <h3 style={{fontFamily:B.sans,fontSize:22,fontWeight:600,margin:'0 0 8px',color:B.white,letterSpacing:-0.02}}>{p.title}</h3>
                <p style={{fontFamily:B.body,fontSize:13.5,lineHeight:1.55,color:B.textSoft,margin:'0 0 18px',flex:1}}>{p.desc}</p>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:18}}>
                  {p.stack.map(t=>(
                    <span key={t} style={{
                      fontFamily:B.mono,fontSize:10,letterSpacing:1,color:B.textSoft,
                      padding:'4px 9px',background:B.surface2,border:`1px solid ${B.line}`,
                      borderRadius:6
                    }}>{t}</span>
                  ))}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:`1px solid ${B.line}`,paddingTop:14}}>
                  <a style={{
                    fontFamily:B.body,fontSize:13,fontWeight:500,color:B.white,
                    textDecoration:'none'
                  }}>Ver sitio en vivo →</a>
                  <span style={{fontFamily:B.mono,fontSize:10,letterSpacing:1,color:B.textDim}}>↗ LIVE</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
