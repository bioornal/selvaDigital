/* Direction A — Selva orgánica (cálida, editorial) */
const A = {
  bg:        '#0E1B14',
  surface:   '#15281D',
  surface2:  '#1A3325',
  cream:     '#F2EBD9',
  creamSoft: 'rgba(242,235,217,0.7)',
  creamDim:  'rgba(242,235,217,0.42)',
  creamLine: 'rgba(242,235,217,0.12)',
  sage:      '#98B59E',
  green:     '#2F7A4F',
  gold:      '#C9A961',
  serif:     "'Fraunces', Georgia, serif",
  sans:      "'Inter', system-ui, sans-serif",
  mono:      "'JetBrains Mono', monospace",
};

const PHOTO = 'https://res.cloudinary.com/djtvjkcu6/image/upload/c_fill,w_900,h_1100,g_face,q_auto,f_auto/v1778507882/SelvaDigital/yo_perfil_ekrrxc.jpg';
const LOGO  = 'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778510560/SelvaDigital/logoChico2_kg35ot.png';

const projects = [
  { title:'MegaMuebles',         tag:'E-commerce',  img:'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778503357/SelvaDigital/Mega_ospdo9.png',
    desc:'Catálogo completo + SEO local para una mueblería con 20 años de trayectoria.',
    kpi:'+18% leads orgánicos', stack:['React','Cloudinary','Analytics'] },
  { title:'Iguazú Falls Lodge',  tag:'Turismo',     img:'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&auto=format',
    desc:'Sitio de reservas directas, galería premium y formulario optimizado para conversión.',
    kpi:'Reservas sin OTAs',     stack:['Next.js','Cloudinary','Ads'] },
  { title:'El Fogón Delivery',   tag:'Gastronomía', img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80&auto=format',
    desc:'E-commerce gastronómico con carrito, MercadoPago y opciones sin TACC.',
    kpi:'Checkout en 3 pasos',   stack:['Next.js','Tailwind','S3'] },
  { title:'Vip Traslados Iguazú',tag:'Landing',     img:'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778505330/SelvaDigital/Vip_vvshcm.png',
    desc:'Landing de traslados turísticos privados con Schema.org y Google Ads.',
    kpi:'CTR Ads x2',            stack:['React','Vite','Schema.org'] },
  { title:'Megabot Admin',       tag:'Sistema',     img:'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778503356/SelvaDigital/Megabot_jczmp3.png',
    desc:'Dashboard multiusuario para gestionar 3 chatbots con IA corriendo en VPS.',
    kpi:'3 bots, 1 panel',       stack:['React','IA','VPS'] },
  { title:'Impasto Pizzería',    tag:'E-commerce',  img:'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778503356/SelvaDigital/Impasto_o46wxm.png',
    desc:'E-commerce de pizzería con combos, empanadas por caja y checkout integrado.',
    kpi:'Próximo lanzamiento',   stack:['React','Netlify','SEO'] },
];

/* ─── shared bits ─── */

function Nav() {
  const links = ['Sobre mí','Planes','Portfolio','FAQ','Contacto'];
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'28px 64px',position:'relative',zIndex:2}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <img src={LOGO} alt="Selva Digital" style={{height:44,width:'auto',objectFit:'contain'}} />
      </div>
      <nav style={{display:'flex',alignItems:'center',gap:36}}>
        {links.map(l=>(
          <a key={l} style={{color:A.creamSoft,fontFamily:A.sans,fontSize:14,fontWeight:400,textDecoration:'none',letterSpacing:0.1}}>{l}</a>
        ))}
      </nav>
      <div style={{display:'flex',alignItems:'center',gap:20}}>
        <span style={{color:A.creamDim,fontFamily:A.mono,fontSize:11,letterSpacing:1}}>+54 9 3548 550334</span>
        <a style={{
          background:A.cream, color:A.bg, padding:'12px 22px', fontFamily:A.sans,
          fontSize:13, fontWeight:500, letterSpacing:0.2, borderRadius:999,
          textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8
        }}>Pedir presupuesto <span style={{fontFamily:A.serif,fontStyle:'italic'}}>→</span></a>
      </div>
    </div>
  );
}

/* Decorative leaf veins SVG (subtle) */
function LeafBg({opacity=0.08}) {
  return (
    <svg viewBox="0 0 800 800" style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="lg" cx="70%" cy="40%" r="70%">
          <stop offset="0%" stopColor={A.sage} stopOpacity="0.9"/>
          <stop offset="100%" stopColor={A.sage} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="600" cy="320" r="420" fill="url(#lg)"/>
      {/* Hand-traced leaf veins */}
      <g stroke={A.sage} strokeWidth="0.6" fill="none" opacity="0.55">
        <path d="M560 80 Q 580 260 600 460 T 640 760"/>
        <path d="M600 460 Q 480 360 360 320"/>
        <path d="M600 460 Q 720 360 800 340"/>
        <path d="M580 260 Q 460 200 340 220"/>
        <path d="M580 260 Q 700 200 800 220"/>
        <path d="M620 600 Q 480 540 360 540"/>
        <path d="M620 600 Q 740 540 800 540"/>
      </g>
    </svg>
  );
}

/* ─────────── HERO A ─────────── */
window.HeroA = function HeroA() {
  return (
    <div style={{width:1440,height:900,background:A.bg,position:'relative',overflow:'hidden',color:A.cream,fontFamily:A.sans}}>
      <LeafBg opacity={0.12} />
      {/* Soft warm light from top-left */}
      <div style={{position:'absolute',top:-300,left:-200,width:900,height:900,background:`radial-gradient(closest-side, ${A.green}55, transparent 70%)`,filter:'blur(20px)'}}/>

      <Nav />

      <div style={{position:'relative',zIndex:2,padding:'80px 64px 0',display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:60,alignItems:'center',height:'calc(100% - 100px)'}}>
        {/* Left column */}
        <div>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,padding:'8px 14px',border:`1px solid ${A.creamLine}`,borderRadius:999,marginBottom:32}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:A.sage,boxShadow:`0 0 10px ${A.sage}`}}/>
            <span style={{fontFamily:A.mono,fontSize:11,letterSpacing:2,color:A.creamSoft}}>DEV WEB FREELANCE · CÓRDOBA, AR</span>
          </div>

          <h1 style={{
            fontFamily:A.serif, fontWeight:300, fontSize:108, lineHeight:0.98,
            letterSpacing:-0.02, margin:'0 0 36px', color:A.cream,
            fontVariationSettings:'"opsz" 144'
          }}>
            Tecnología<br/>que hace <em style={{fontStyle:'italic',fontWeight:400,color:A.gold}}>crecer</em><br/>tu negocio.
          </h1>

          <p style={{
            fontFamily:A.sans, fontSize:19, lineHeight:1.55, color:A.creamSoft,
            maxWidth:520, margin:'0 0 44px', fontWeight:300
          }}>
            Sitios web, e‑commerce y sistemas a medida para PyMEs argentinas.
            Pago único — el primer año, dominio y hosting van incluidos.
          </p>

          <div style={{display:'flex',gap:16,alignItems:'center'}}>
            <a style={{
              background:A.cream, color:A.bg, padding:'18px 32px', borderRadius:999,
              fontFamily:A.sans, fontSize:15, fontWeight:500, textDecoration:'none',
              display:'inline-flex',alignItems:'center',gap:10
            }}>
              Pedir presupuesto
              <span style={{fontFamily:A.serif,fontStyle:'italic',fontWeight:300}}>→</span>
            </a>
            <a style={{
              background:'transparent', color:A.cream, padding:'18px 28px',
              border:`1px solid ${A.creamLine}`, borderRadius:999,
              fontFamily:A.sans, fontSize:15, fontWeight:400, textDecoration:'none'
            }}>Ver portfolio</a>
          </div>
        </div>

        {/* Right column — vertical stat strip */}
        <div style={{display:'flex',flexDirection:'column',gap:0,borderTop:`1px solid ${A.creamLine}`,borderBottom:`1px solid ${A.creamLine}`}}>
          {[
            {n:'15+',  k:'proyectos en producción'},
            {n:'24h',  k:'respuesta al pedido inicial'},
            {n:'2',    k:'países (AR · Andorra)'},
            {n:'1',    k:'persona, todo el stack'},
          ].map((s,i)=>(
            <div key={i} style={{
              display:'flex',alignItems:'baseline',justifyContent:'space-between',
              padding:'22px 4px', borderBottom: i<3 ? `1px solid ${A.creamLine}` : 'none'
            }}>
              <span style={{fontFamily:A.serif,fontSize:64,fontWeight:300,color:A.cream,lineHeight:1}}>{s.n}</span>
              <span style={{fontFamily:A.sans,fontSize:13,color:A.creamDim,maxWidth:180,textAlign:'right'}}>{s.k}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom strip — what I build */}
      <div style={{
        position:'absolute',bottom:0,left:0,right:0,
        padding:'18px 64px', display:'flex', justifyContent:'space-between', alignItems:'center',
        borderTop:`1px solid ${A.creamLine}`, background:'rgba(14,27,20,0.6)', backdropFilter:'blur(8px)'
      }}>
        <span style={{fontFamily:A.mono,fontSize:11,letterSpacing:2,color:A.creamDim}}>SERVICIOS</span>
        <div style={{display:'flex',gap:36,alignItems:'center'}}>
          {['Sitios web','E‑commerce','Sistemas a medida','Chatbots con IA','SEO local'].map(s=>(
            <span key={s} style={{fontFamily:A.sans,fontSize:13,color:A.creamSoft}}>{s}</span>
          ))}
        </div>
        <span style={{fontFamily:A.mono,fontSize:11,letterSpacing:2,color:A.gold}}>↓ SCROLL</span>
      </div>
    </div>
  );
};

/* ─────────── SOBRE MÍ A ─────────── */
window.SobreMiA = function SobreMiA() {
  return (
    <div style={{width:1440,height:900,background:A.bg,position:'relative',overflow:'hidden',color:A.cream,fontFamily:A.sans}}>
      <LeafBg opacity={0.06}/>
      <Nav />

      <div style={{padding:'40px 64px 0',display:'grid',gridTemplateColumns:'1fr 1.2fr',gap:72,position:'relative',zIndex:2}}>
        {/* Photo block */}
        <div style={{position:'relative'}}>
          <div style={{
            position:'absolute',top:18,left:18,width:'100%',height:'100%',
            border:`1px solid ${A.gold}`, borderRadius:4
          }}/>
          <div style={{
            position:'relative', width:'100%', aspectRatio:'4/5', overflow:'hidden',
            borderRadius:4, background:A.surface
          }}>
            <img src={PHOTO} alt="Founder" style={{width:'100%',height:'100%',objectFit:'cover',filter:'contrast(1.02) saturate(0.92)'}}/>
            {/* warm overlay */}
            <div style={{position:'absolute',inset:0,background:`linear-gradient(180deg, transparent 50%, rgba(14,27,20,0.45))`}}/>
            {/* caption */}
            <div style={{position:'absolute',left:20,bottom:18,fontFamily:A.mono,fontSize:10,letterSpacing:2,color:A.cream}}>
              <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:'#48d68b',marginRight:8,boxShadow:'0 0 8px #48d68b'}}/>
              ONLINE · RESPONDE EN ~24H
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <div style={{fontFamily:A.mono,fontSize:11,letterSpacing:3,color:A.gold,marginBottom:24}}>01 — SOBRE MÍ</div>

          <h2 style={{
            fontFamily:A.serif,fontWeight:300,fontSize:64,lineHeight:1.02,margin:'0 0 28px',
            letterSpacing:-0.01, color:A.cream
          }}>
            El developer que <em style={{fontStyle:'italic',color:A.gold,fontWeight:400}}>no te&nbsp;habla</em><br/>con palabras raras.
          </h2>

          <p style={{fontSize:17,lineHeight:1.65,color:A.creamSoft,margin:'0 0 18px',maxWidth:560,fontWeight:300}}>
            Soy desarrollador web freelance. Ayudo a <strong style={{color:A.cream,fontWeight:500}}>dueños
            de negocios y PyMEs</strong> a vender más con páginas que trabajan
            por ellos las 24 horas — sin tarifas mensuales sorpresa y sin
            empresas tercerizando tu proyecto.
          </p>
          <p style={{fontSize:17,lineHeight:1.65,color:A.creamSoft,margin:'0 0 36px',maxWidth:560,fontWeight:300}}>
            Trabajo solo, así que vos hablás conmigo de principio a fin.
            Diseño, programo, despliego y te dejo todo en tus manos.
          </p>

          {/* Stats row */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24,marginBottom:44,paddingTop:24,borderTop:`1px solid ${A.creamLine}`}}>
            {[
              {n:'15+',k:'proyectos entregados'},
              {n:'6',  k:'años desarrollando'},
              {n:'100%',k:'código propio, sin templates'},
            ].map((s,i)=>(
              <div key={i}>
                <div style={{fontFamily:A.serif,fontSize:44,fontWeight:300,color:A.cream,lineHeight:1}}>{s.n}</div>
                <div style={{fontFamily:A.sans,fontSize:12,color:A.creamDim,marginTop:6}}>{s.k}</div>
              </div>
            ))}
          </div>

          {/* Process timeline */}
          <div>
            <div style={{fontFamily:A.mono,fontSize:11,letterSpacing:2,color:A.creamDim,marginBottom:18}}>CÓMO TRABAJAMOS</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0,position:'relative'}}>
              <div style={{position:'absolute',top:18,left:'12%',right:'12%',height:1,background:A.creamLine}}/>
              {[
                {n:'01',t:'Hablamos',d:'Entiendo tu negocio.'},
                {n:'02',t:'Plan',    d:'Costos y tiempos claros.'},
                {n:'03',t:'Avances', d:'Te muestro cada semana.'},
                {n:'04',t:'Listo',   d:'Tu web lista para vender.'},
              ].map((s,i)=>(
                <div key={i} style={{textAlign:'left',position:'relative',paddingTop:0}}>
                  <div style={{
                    width:36,height:36,borderRadius:'50%',background:A.bg,border:`1px solid ${A.gold}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:A.serif,fontSize:14,color:A.gold,marginBottom:14,position:'relative',zIndex:2
                  }}>{s.n}</div>
                  <div style={{fontFamily:A.sans,fontSize:14,fontWeight:500,color:A.cream,marginBottom:4}}>{s.t}</div>
                  <div style={{fontFamily:A.sans,fontSize:12,color:A.creamDim,lineHeight:1.45}}>{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────── PORTFOLIO A ─────────── */
window.PortfolioA = function PortfolioA() {
  return (
    <div style={{width:1440,minHeight:1180,background:A.bg,position:'relative',overflow:'hidden',color:A.cream,fontFamily:A.sans}}>
      <LeafBg opacity={0.05}/>
      <Nav />

      <div style={{padding:'40px 64px 80px',position:'relative',zIndex:2}}>
        <div style={{display:'flex',alignItems:'end',justifyContent:'space-between',marginBottom:56}}>
          <div>
            <div style={{fontFamily:A.mono,fontSize:11,letterSpacing:3,color:A.gold,marginBottom:18}}>02 — PORTFOLIO</div>
            <h2 style={{fontFamily:A.serif,fontWeight:300,fontSize:72,lineHeight:1,margin:0,color:A.cream,letterSpacing:-0.01}}>
              Proyectos que <em style={{fontStyle:'italic',color:A.gold,fontWeight:400}}>ya viven</em><br/>en internet.
            </h2>
          </div>
          <div style={{textAlign:'right',maxWidth:340}}>
            <p style={{fontFamily:A.sans,fontSize:14,color:A.creamSoft,lineHeight:1.55,margin:'0 0 16px'}}>
              No son mockups ni capturas de design system. Son sitios y sistemas
              entregados, en producción, atendiendo clientes reales.
            </p>
            <a style={{fontFamily:A.mono,fontSize:11,letterSpacing:2,color:A.cream,textDecoration:'underline',textUnderlineOffset:4}}>VER TODOS &nbsp;→</a>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:24}}>
          {projects.map((p,i)=>(
            <article key={i} style={{
              background:A.surface, borderRadius:8, overflow:'hidden',
              border:`1px solid ${A.creamLine}`, display:'flex', flexDirection:'column'
            }}>
              <div style={{aspectRatio:'16/10',background:'#000',overflow:'hidden',position:'relative'}}>
                <img src={p.img} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{
                  position:'absolute',top:14,left:14,
                  fontFamily:A.mono,fontSize:9,letterSpacing:2,
                  background:'rgba(14,27,20,0.85)',padding:'5px 9px',color:A.cream,
                  borderRadius:999
                }}>{p.tag.toUpperCase()}</div>
                <div style={{
                  position:'absolute',top:14,right:14,
                  fontFamily:A.sans,fontSize:11,fontWeight:500,
                  background:A.gold,padding:'5px 10px',color:A.bg,
                  borderRadius:999
                }}>{p.kpi}</div>
              </div>
              <div style={{padding:'22px 22px 24px',display:'flex',flexDirection:'column',flex:1}}>
                <h3 style={{fontFamily:A.serif,fontSize:24,fontWeight:400,margin:'0 0 8px',color:A.cream,letterSpacing:-0.01}}>{p.title}</h3>
                <p style={{fontFamily:A.sans,fontSize:13.5,lineHeight:1.55,color:A.creamSoft,margin:'0 0 18px',flex:1}}>{p.desc}</p>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
                  {p.stack.map(t=>(
                    <span key={t} style={{
                      fontFamily:A.mono,fontSize:10,letterSpacing:1,color:A.creamSoft,
                      padding:'4px 9px',border:`1px solid ${A.creamLine}`,borderRadius:999
                    }}>{t}</span>
                  ))}
                </div>
                <a style={{
                  fontFamily:A.sans,fontSize:13,fontWeight:500,color:A.cream,
                  textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,
                  borderTop:`1px solid ${A.creamLine}`,paddingTop:14
                }}>
                  Ver sitio en vivo
                  <span style={{fontFamily:A.serif,fontStyle:'italic',fontWeight:300,color:A.gold}}>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
