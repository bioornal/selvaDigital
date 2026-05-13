/* Selva Digital v2 — Part 1: tokens, primitives, Header, Hero, ClientsStrip */

const v2 = {
  bg: '#0A0B0D',
  surface: '#121316',
  surface2: '#1A1C20',
  surface3: '#22262C',
  white: '#FAFAFA',
  textSoft: 'rgba(250,250,250,0.72)',
  textDim: 'rgba(250,250,250,0.46)',
  textFaint: 'rgba(250,250,250,0.28)',
  line: 'rgba(250,250,250,0.08)',
  lineMid: 'rgba(250,250,250,0.12)',
  lineStr: 'rgba(250,250,250,0.18)',
  sans: "'Geist', 'Inter', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
  shadow: '0 24px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
};
window.v2 = v2;

const ASSETS = {
  PHOTO: 'https://res.cloudinary.com/djtvjkcu6/image/upload/c_fill,w_900,h_1100,g_face,q_auto,f_auto/v1778507882/SelvaDigital/yo_perfil_ekrrxc.jpg',
  PHOTO_SQ: 'https://res.cloudinary.com/djtvjkcu6/image/upload/c_fill,w_400,h_400,g_face,q_auto,f_auto/v1778507882/SelvaDigital/yo_perfil_ekrrxc.jpg',
  LOGO: 'https://res.cloudinary.com/djtvjkcu6/image/upload/v1778510560/SelvaDigital/logoChico2_kg35ot.png',
  VIDEO: 'https://res.cloudinary.com/djtvjkcu6/video/upload/v1778524166/SelvaDigital/A_seamless_infinite_loop_cinematic_202605111510_zjt26u.mp4',
};
window.ASSETS = ASSETS;

/* ── React context for tweaks ── */
const V2Ctx = React.createContext({ accent: v2.bg, videoMode: 'contained', showVideo: true });
window.V2Ctx = V2Ctx;
window.useV2 = () => React.useContext(V2Ctx);

/* ── helpers ── */
function withAlpha(hex, a) {
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
window.withAlpha = withAlpha;

/* ── Primitives ── */

function Container({ children, style, ...rest }) {
  return (
    <div style={{maxWidth:1320, margin:'0 auto', padding:'0 40px', ...style}} {...rest}>{children}</div>
  );
}
window.Container = Container;

function Eyebrow({ children, color, style }) {
  const { accent } = window.useV2();
  return (
    <div style={{
      display:'inline-flex',alignItems:'center',gap:10,
      fontFamily:v2.mono,fontSize:11,letterSpacing:2.5,
      color: color || accent, textTransform:'uppercase',
      ...style
    }}>
      <span style={{width:14,height:1,background: color || accent}}/>
      {children}
    </div>
  );
}
window.Eyebrow = Eyebrow;

function SectionHeading({ kicker, title, accent, sub, alignment='left' }) {
  const { accent: ac } = window.useV2();
  return (
    <div style={{textAlign:alignment, maxWidth:alignment==='center' ? 760 : null, margin: alignment==='center' ? '0 auto' : 0}}>
      <Eyebrow style={{marginBottom:18, justifyContent: alignment==='center' ? 'center' : 'flex-start'}}>{kicker}</Eyebrow>
      <h2 style={{
        fontFamily:v2.sans, fontWeight:600, fontSize:56, lineHeight:1.02,
        letterSpacing:-0.025, margin:'0 0 18px', color:v2.white
      }}>
        {title} {accent && <span style={{color: ac}}>{accent}</span>}
      </h2>
      {sub && <p style={{fontFamily:v2.body,fontSize:17,lineHeight:1.55,color:v2.textSoft,margin:0,maxWidth: alignment==='center' ? 640 : 620}}>{sub}</p>}
    </div>
  );
}
window.SectionHeading = SectionHeading;

function CTAButton({ children, variant='primary', size='md', icon='→', style, ...rest }) {
  const { accent } = window.useV2();
  const sizes = {
    sm: { padding:'10px 16px', fontSize:13 },
    md: { padding:'14px 22px', fontSize:14 },
    lg: { padding:'17px 28px', fontSize:15 },
  };
  const variants = {
    primary: { background: accent, color:'#06140C', border:'1px solid transparent' },
    ghost:   { background: v2.surface, color: v2.white, border:`1px solid ${v2.lineStr}` },
    text:    { background: 'transparent', color: v2.white, border:'1px solid transparent', padding:0 },
  };
  return (
    <button {...rest} style={{
      ...variants[variant], ...sizes[size],
      fontFamily:v2.body, fontWeight:600, letterSpacing:0.1,
      borderRadius: variant==='text' ? 0 : 10,
      display:'inline-flex', alignItems:'center', gap:8,
      transition:'all .2s ease',
      ...style
    }}>
      {children}
      {icon && <span style={{display:'inline-block'}}>{icon}</span>}
    </button>
  );
}
window.CTAButton = CTAButton;

/* faint dot grid overlay */
function DotGrid({ opacity=0.4, style }) {
  return (
    <div style={{
      position:'absolute',inset:0,
      backgroundImage:`radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
      backgroundSize:'28px 28px',
      opacity, pointerEvents:'none', ...style
    }}/>
  );
}
window.DotGrid = DotGrid;

/* ─────────── HEADER ─────────── */
window.Header = function Header() {
  const { accent } = window.useV2();
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(()=>{
    const fn = ()=> setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive:true });
    return ()=> window.removeEventListener('scroll', fn);
  },[]);

  const links = [
    {id:'sobre', label:'Sobre mí'},
    {id:'portfolio', label:'Portfolio'},
    {id:'planes', label:'Planes'},
    {id:'faq', label:'FAQ'},
    {id:'contacto', label:'Contacto'},
  ];

  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, zIndex:50,
      background: scrolled ? withAlpha(v2.bg, 0.85) : withAlpha(v2.bg, 0.4),
      backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
      borderBottom:`1px solid ${scrolled ? v2.line : 'transparent'}`,
      transition:'all .25s ease'
    }}>
      <Container style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:74}}>
        <a href="#hero" style={{display:'flex',alignItems:'center',gap:10}}>
          <img src={ASSETS.LOGO} alt="Selva Digital" style={{height:34,width:'auto',objectFit:'contain'}}/>
        </a>
        <nav style={{display:'flex',alignItems:'center',gap:32}}>
          {links.map(l=>(
            <a key={l.id} href={`#${l.id}`} style={{color:v2.textSoft,fontFamily:v2.body,fontSize:13.5,fontWeight:400}}>{l.label}</a>
          ))}
        </nav>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <span style={{color:v2.textDim,fontFamily:v2.mono,fontSize:11,letterSpacing:0.5}}>+54 9 3548 550334</span>
          <a href="#contacto" style={{
            background: accent, color:'#06140C', padding:'9px 16px',
            fontFamily:v2.body, fontSize:13, fontWeight:600, borderRadius:8,
            display:'inline-flex', alignItems:'center', gap:6
          }}>Pedir presupuesto →</a>
        </div>
      </Container>
    </header>
  );
};

/* ─────────── HERO ─────────── */

/* Video frame component (contained mode) */
function VideoFrame({ accent }) {
  return (
    <div style={{position:'relative',width:'100%',aspectRatio:'4/5',maxHeight:600}}>
      {/* halo */}
      <div style={{
        position:'absolute',inset:-40,
        background:`radial-gradient(circle at 40% 50%, ${withAlpha(accent,0.20)}, transparent 65%)`,
        filter:'blur(20px)', pointerEvents:'none'
      }}/>
      {/* frame */}
      <div style={{
        position:'absolute',inset:0,
        background: v2.surface,
        border:`1px solid ${v2.lineStr}`,
        borderRadius:18,
        boxShadow: v2.shadow,
        overflow:'hidden'
      }}>
        {/* top chrome */}
        <div style={{
          position:'absolute',top:0,left:0,right:0,zIndex:3,
          padding:'14px 18px', display:'flex',alignItems:'center',justifyContent:'space-between',
          background:`linear-gradient(180deg, rgba(10,11,13,0.85), transparent)`
        }}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:accent,boxShadow:`0 0 10px ${accent}`}}/>
            <span style={{fontFamily:v2.mono,fontSize:10,letterSpacing:2,color:v2.white}}>SELVA · LIVE LOOP</span>
          </div>
          <span style={{fontFamily:v2.mono,fontSize:10,letterSpacing:1.5,color:v2.textDim}}>00:24 ·  24fps</span>
        </div>
        <video src={ASSETS.VIDEO} autoPlay muted loop playsInline
          style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        {/* bottom hud */}
        <div style={{
          position:'absolute',bottom:0,left:0,right:0,zIndex:3,
          padding:'18px 18px', display:'flex',alignItems:'end',justifyContent:'space-between',gap:14,
          background:`linear-gradient(0deg, rgba(10,11,13,0.92), transparent)`
        }}>
          <div>
            <div style={{fontFamily:v2.mono,fontSize:10,letterSpacing:2,color:v2.textDim,marginBottom:6}}>// SISTEMA NERVIOSO</div>
            <div style={{fontFamily:v2.sans,fontSize:18,fontWeight:600,color:v2.white,letterSpacing:-0.01,lineHeight:1.2,maxWidth:280}}>
              Cada sitio que entrego es una red viva conectada a tu negocio.
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'end'}}>
            <span style={{fontFamily:v2.mono,fontSize:9,letterSpacing:1.5,color:accent}}>● ONLINE</span>
            <span style={{fontFamily:v2.mono,fontSize:9,letterSpacing:1.5,color:v2.textFaint}}>SELVA · DIGITAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Hero = function Hero() {
  const { accent, videoMode, showVideo } = window.useV2();
  const fullBleed = showVideo && videoMode === 'fullbleed';

  return (
    <section id="hero" style={{
      position:'relative', minHeight:'100vh', overflow:'hidden',
      paddingTop: 74, background: v2.bg
    }}>
      {/* Background video (full-bleed mode) */}
      {fullBleed && (
        <>
          <video src={ASSETS.VIDEO} autoPlay muted loop playsInline
            style={{
              position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',
              opacity:0.55, filter:'saturate(0.85)'
            }}/>
          <div style={{
            position:'absolute',inset:0,
            background:`linear-gradient(180deg, ${withAlpha(v2.bg,0.6)} 0%, ${withAlpha(v2.bg,0.4)} 40%, ${withAlpha(v2.bg,0.92)} 100%), radial-gradient(ellipse at 75% 50%, transparent, ${withAlpha(v2.bg,0.5)} 70%)`
          }}/>
        </>
      )}
      {!fullBleed && <DotGrid opacity={0.5}/>}
      {/* accent glow */}
      <div style={{
        position:'absolute', top:-200, right: fullBleed ? -400 : -100,
        width:800, height:800, pointerEvents:'none',
        background:`radial-gradient(closest-side, ${withAlpha(accent, 0.18)}, transparent 70%)`,
        filter:'blur(10px)'
      }}/>

      <Container style={{position:'relative',zIndex:2,paddingTop:80,paddingBottom:80}}>
        <div style={{
          display:'grid',
          gridTemplateColumns: (!showVideo || fullBleed) ? '1fr' : '1.18fr 0.82fr',
          gap: 64, alignItems:'center', minHeight: 'calc(100vh - 234px)'
        }}>
          {/* Left: copy */}
          <div style={{maxWidth: (!showVideo || fullBleed) ? 920 : '100%'}}>
            <div style={{
              display:'inline-flex',alignItems:'center',gap:10,padding:'7px 14px',
              border:`1px solid ${v2.line}`, background: withAlpha(v2.surface, 0.7),
              borderRadius:999, marginBottom:32, backdropFilter:'blur(8px)'
            }}>
              <span style={{width:6,height:6,borderRadius:'50%',background:accent,boxShadow:`0 0 12px ${accent}`}}/>
              <span style={{fontFamily:v2.mono,fontSize:11,letterSpacing:2,color:v2.textSoft}}>
                DISPONIBLE PARA NUEVOS PROYECTOS · MAYO 2026
              </span>
            </div>

            <h1 style={{
              fontFamily:v2.sans, fontWeight:600,
              fontSize: (!showVideo || fullBleed) ? 116 : 92,
              lineHeight: 0.96, letterSpacing:-0.035,
              margin:'0 0 26px', color:v2.white,
              textShadow: fullBleed ? '0 2px 20px rgba(0,0,0,0.5)' : 'none'
            }}>
              Tecnología que hace <span style={{color: accent}}>crecer</span> tu&nbsp;negocio.
            </h1>

            <p style={{
              fontFamily:v2.body, fontSize:19, lineHeight:1.55, color:v2.textSoft,
              maxWidth:600, margin:'0 0 40px',
              textShadow: fullBleed ? '0 1px 8px rgba(0,0,0,0.5)' : 'none'
            }}>
              Sitios web, e‑commerce y sistemas a medida para PyMEs argentinas.
              Pago único — el primer año incluye dominio y hosting. Hablás
              directo conmigo de principio a fin.
            </p>

            <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:56,flexWrap:'wrap'}}>
              <CTAButton variant="primary" size="lg">Pedir presupuesto</CTAButton>
              <CTAButton variant="ghost" size="lg" icon={null}>Ver portfolio →</CTAButton>
              <span style={{fontFamily:v2.mono,fontSize:11,letterSpacing:1.5,color:v2.textDim,marginLeft:8}}>
                O WHATSAPP +54 9 3548 550334
              </span>
            </div>

            {/* Stat row */}
            <div style={{
              display:'grid', gridTemplateColumns:'repeat(4,1fr)',
              borderTop:`1px solid ${v2.line}`, borderBottom:`1px solid ${v2.line}`,
              background: fullBleed ? withAlpha(v2.bg, 0.55) : withAlpha(v2.surface, 0.5),
              backdropFilter: fullBleed ? 'blur(12px)' : 'none',
              borderRadius:0
            }}>
              {[
                {n:'15+',   k:'proyectos en producción'},
                {n:'<24h',  k:'respondo tu pedido inicial'},
                {n:'AR/AD', k:'países donde trabajo'},
                {n:'100%',  k:'código propio, sin templates'},
              ].map((s,i)=>(
                <div key={i} style={{
                  padding:'20px 22px',
                  borderRight: i<3 ? `1px solid ${v2.line}` : 'none',
                  display:'flex',flexDirection:'column',gap:6
                }}>
                  <span style={{fontFamily:v2.sans,fontSize:38,fontWeight:500,color:v2.white,letterSpacing:-0.02,lineHeight:1}}>{s.n}</span>
                  <span style={{fontFamily:v2.body,fontSize:12.5,color:v2.textDim,lineHeight:1.35}}>{s.k}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: contained video */}
          {showVideo && videoMode==='contained' && (
            <div>
              <VideoFrame accent={accent}/>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

/* ─────────── CLIENT LOGOS STRIP ─────────── */
window.ClientsStrip = function ClientsStrip() {
  const clients = ['MegaMuebles','El Fogón Delivery','Iguazú Falls Lodge','Vip Traslados','Impasto Pizzería','Megabot Admin','Recetario Napolitano'];
  return (
    <section style={{
      borderTop:`1px solid ${v2.line}`,
      borderBottom:`1px solid ${v2.line}`,
      background: v2.surface, position:'relative', overflow:'hidden'
    }}>
      <Container style={{display:'flex',alignItems:'center',gap:42,padding:'24px 40px',flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontFamily:v2.mono,fontSize:11,letterSpacing:2.5,color:v2.textDim}}>CLIENTES //</span>
        </div>
        {clients.map((c,i)=>(
          <span key={c} style={{
            fontFamily:v2.sans,fontSize:15,fontWeight:500,color:v2.textSoft,letterSpacing:-0.01,
            opacity: 0.85
          }}>{c}</span>
        ))}
      </Container>
    </section>
  );
};
