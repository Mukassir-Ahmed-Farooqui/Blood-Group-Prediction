import { useEffect, useState } from 'react'

const BLOOD_GROUP_COLORS = {
  'A+': '#c8622a', 'A-': '#b85020',
  'B+': '#2a7ac8', 'B-': '#1a5aa8',
  'AB+': '#8a2ac8', 'AB-': '#6a1aa8',
  'O+': '#2a8a5a', 'O-': '#1a6a4a',
}

/* Whole-blood compatibility (RBC transfusion) */
const COMPATIBILITY = {
  'O-': { donate: ['All blood types'], receive: ['O-'] },
  'O+': { donate: ['O+', 'A+', 'B+', 'AB+'], receive: ['O+', 'O-'] },
  'A-': { donate: ['A-', 'A+', 'AB-', 'AB+'], receive: ['A-', 'O-'] },
  'A+': { donate: ['A+', 'AB+'], receive: ['A+', 'A-', 'O+', 'O-'] },
  'B-': { donate: ['B-', 'B+', 'AB-', 'AB+'], receive: ['B-', 'O-'] },
  'B+': { donate: ['B+', 'AB+'], receive: ['B+', 'B-', 'O+', 'O-'] },
  'AB-': { donate: ['AB-', 'AB+'], receive: ['AB-', 'A-', 'B-', 'O-'] },
  'AB+': { donate: ['AB+'], receive: ['All blood types'] },
}

const SPECIAL_LABELS = {
  'O-': 'Universal Donor',
  'AB+': 'Universal Recipient',
}

/* Counts up from 0 → value over `duration` ms */
function AnimatedNumber({ value, duration = 1100 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let frame
    const start = performance.now()
    const target = parseFloat(value)

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)   // ease-out-cubic
      setDisplay(target * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return <>{display.toFixed(1)}</>
}

function Chip({ label, color }) {
  const bg = color ? `${color}14` : 'var(--bg-3)'
  const border = color ? `${color}30` : 'var(--border)'
  return (
    <span style={{
      fontSize: '10px',
      fontFamily: 'var(--mono)',
      color: color || 'var(--text-2)',
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: '4px',
      padding: '3px 7px',
      display: 'inline-block',
    }}>
      {label}
    </span>
  )
}

export default function Result({ data }) {
  if (!data) return null

  const { blood_group, confidence, top3 } = data
  const color = BLOOD_GROUP_COLORS[blood_group] || 'var(--accent)'
  const compat = COMPATIBILITY[blood_group]
  const badge = SPECIAL_LABELS[blood_group]

  return (
    <div style={{ animation: 'fadeUp 0.5s ease' }}>

      {/* ── Section label ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '20px', height: '1px', background: color }} />
        <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Result
        </span>
      </div>

      {/* ── Main prediction card ── */}
      <div style={{
        background: 'var(--bg-2)',
        border: `1.5px solid ${color}44`,
        borderRadius: '16px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '16px',
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        {/* Glow blob */}
        <div style={{
          position: 'absolute',
          top: '-50px', right: '-50px',
          width: '180px', height: '180px',
          borderRadius: '50%',
          background: `${color}10`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', gap: '12px' }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-3)', marginBottom: '8px', letterSpacing: '0.08em' }}>
              PREDICTED BLOOD GROUP
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '64px', fontWeight: '800', color, lineHeight: '1', letterSpacing: '-0.03em', animation: 'popIn 0.5s ease' }}>
                {blood_group}
              </span>
              {badge && (
                <span style={{
                  fontSize: '9px', fontFamily: 'var(--mono)',
                  color,
                  border: `1px solid ${color}44`,
                  borderRadius: '4px',
                  padding: '3px 7px',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}>
                  {badge.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Confidence ring */}
          <div style={{ position: 'relative', width: '76px', height: '76px', flexShrink: 0 }}>
            <svg width="76" height="76" viewBox="0 0 76 76">
              <circle cx="38" cy="38" r="32" fill="none" stroke="var(--border)" strokeWidth="4" />
              <circle
                cx="38" cy="38" r="32"
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - confidence / 100)}`}
                transform="rotate(-90 38 38)"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', fontFamily: 'var(--mono)' }}>
                <AnimatedNumber value={confidence} />%
              </span>
            </div>
          </div>
        </div>

        {/* Confidence bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-3)', letterSpacing: '0.08em' }}>CONFIDENCE</span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color }}>{confidence.toFixed(2)}%</span>
          </div>
          <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${confidence}%`,
              background: `linear-gradient(to right, ${color}66, ${color})`,
              borderRadius: '2px',
              transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
        </div>
      </div>

      {/* ── Top 3 predictions ── */}
      <div style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '16px',
      }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-3)', letterSpacing: '0.08em' }}>TOP PREDICTIONS</span>
        </div>
        {top3.map((item, i) => {
          const c = BLOOD_GROUP_COLORS[item.blood_group] || 'var(--text-2)'
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: i < top3.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-3)', width: '16px' }}>#{i + 1}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: i === 0 ? c : 'var(--text)' }}>
                  {item.blood_group}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '80px', height: '2px', background: 'var(--border)', borderRadius: '1px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${item.confidence}%`,
                    background: i === 0 ? c : 'var(--border-2)',
                    transition: 'width 1.1s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                </div>
                <span style={{
                  fontSize: '11px', fontFamily: 'var(--mono)',
                  color: i === 0 ? c : 'var(--text-2)',
                  minWidth: '42px', textAlign: 'right',
                }}>
                  {item.confidence.toFixed(1)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Blood type compatibility ── */}
      {compat && (
        <div style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '12px',
          animation: 'fadeUp 0.5s ease 0.25s both',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-3)', letterSpacing: '0.08em' }}>
              BLOOD TYPE COMPATIBILITY
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {/* Can donate to */}
            <div style={{ padding: '14px 14px', borderRight: '1px solid var(--border)' }}>
              <p style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: '10px' }}>
                CAN DONATE TO
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {compat.donate.map((bg, i) => (
                  <Chip key={i} label={bg} color={BLOOD_GROUP_COLORS[bg]} />
                ))}
              </div>
            </div>
            {/* Can receive from */}
            <div style={{ padding: '14px 14px' }}>
              <p style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: '10px' }}>
                CAN RECEIVE FROM
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {compat.receive.map((bg, i) => (
                  <Chip key={i} label={bg} color={BLOOD_GROUP_COLORS[bg]} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p style={{
        fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-3)',
        lineHeight: '1.6', padding: '0 4px',
      }}>
        ⚠ proof-of-concept · not for clinical use · 92% ensemble accuracy
      </p>
    </div>
  )
}