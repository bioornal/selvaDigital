import { useState, useEffect } from 'react';

const accent = '#2BB673';
const surface = '#121316';
const surface2 = '#1A1C20';
const textSoft = 'rgba(250,250,250,0.72)';
const textDim = 'rgba(250,250,250,0.46)';
const line = 'rgba(250,250,250,0.08)';
const lineStr = 'rgba(250,250,250,0.18)';
const shadow = '0 24px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)';

function withAlpha(hex: string, a: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const messages = [
  { from: 'user', text: 'Hola, ¿tienen sommiers de 2 plazas en stock?' },
  { from: 'bot',  text: '¡Hola! Sí, tenemos 3 modelos disponibles. ¿En qué ciudad estás para confirmarte el envío?' },
  { from: 'user', text: 'Capital. Querría el más económico.' },
  { from: 'bot',  text: 'El Queen 140×190 sale $189.900 con envío incluido. ¿Te lo aseguro?' },
];

export default function ChatPreview() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % (messages.length + 1)), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{
        position: 'absolute', inset: -40,
        background: `radial-gradient(circle at 60% 50%, ${withAlpha(accent, 0.18)}, transparent 65%)`,
        filter: 'blur(20px)', pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        background: surface,
        border: `1px solid ${lineStr}`,
        borderRadius: 20,
        padding: 30,
        boxShadow: shadow,
        fontFamily: "'Inter', system-ui, sans-serif"
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: 16, borderBottom: `1px solid ${line}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: withAlpha(accent, 0.15),
              border: `1px solid ${withAlpha(accent, 0.4)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: accent, fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14, fontWeight: 600
            }}>AI</div>
            <div>
              <div style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>
                Megabot · MegaMuebles
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1, color: accent }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}` }} />
                EN LÍNEA · 24/7
              </div>
            </div>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: textDim }}>
            {messages.length} msgs
          </span>
        </div>

        {/* Messages */}
        <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 380 }}>
          {messages.slice(0, step).map((m, i) => (
            <div key={i} style={{
              alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '82%',
              background: m.from === 'user' ? surface2 : withAlpha(accent, 0.14),
              border: `1px solid ${m.from === 'user' ? line : withAlpha(accent, 0.3)}`,
              color: m.from === 'user' ? textSoft : '#FAFAFA',
              padding: '12px 16px',
              borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              fontSize: 14.5, lineHeight: 1.5
            }}>
              {m.text}
            </div>
          ))}
          {step < messages.length && messages[step].from === 'bot' && (
            <div style={{
              alignSelf: 'flex-start', color: textDim,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: 1, padding: '4px 14px'
            }}>
              megabot está escribiendo…
            </div>
          )}
        </div>

        {/* Input mock */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px', background: surface2,
          border: `1px solid ${line}`, borderRadius: 10
        }}>
          <span style={{ fontSize: 13, color: textDim, flex: 1 }}>
            Escribí un mensaje…
          </span>
          <span style={{
            background: accent, color: '#06140C',
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 16
          }}>↑</span>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          marginTop: 18, paddingTop: 18, borderTop: `1px solid ${line}`
        }}>
          {[
            { n: '1.2k', k: 'msgs/día' },
            { n: '89%',  k: 'auto-resueltas' },
            { n: '3 s',  k: 'tiempo medio' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: 'center',
              borderRight: i < 2 ? `1px solid ${line}` : 'none',
              padding: '4px 8px'
            }}>
              <div style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif", fontSize: 20, fontWeight: 600, color: '#FAFAFA', letterSpacing: -0.01 }}>
                {s.n}
              </div>
              <div style={{ fontSize: 11, color: textDim, marginTop: 2 }}>
                {s.k}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
