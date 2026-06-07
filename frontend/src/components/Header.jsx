import { useState, useEffect } from 'react'
import { healthCheck } from '../api/predict'

function useIsMobile(bp = 640) {
  const [m, setM] = useState(() => window.innerWidth < bp)
  useEffect(() => {
    const handler = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [bp])
  return m
}

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export default function Header({ theme, toggleTheme }) {
  const [online, setOnline] = useState(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    healthCheck().then(() => setOnline(true)).catch(() => setOnline(false))
  }, [])

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '14px 20px' : '22px 48px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      transition: 'background 0.3s ease, border-color 0.3s ease',
      animation: 'fadeIn 0.5s ease',
    }}>

      {/* ── Logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '30px', height: '30px',
          border: '2px solid var(--accent)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
          transition: 'border-color 0.3s',
        }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1.5px solid var(--accent)' }} />
          <div style={{ position: 'absolute', inset: '-5px', borderRadius: '50%', border: '1px solid var(--accent)', opacity: 0.3 }} />
        </div>
        <span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text)', transition: 'color 0.3s' }}>
          Derma<span style={{ color: 'var(--accent)' }}>Type</span>
        </span>
      </div>

      {/* ── Right side ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '20px' }}>

        {/* Nav — hidden on mobile */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {['Detect', 'How It Works', 'About'].map((item) => (
              <a key={item} href="#" style={{
                fontSize: '13px', fontWeight: '500',
                color: 'var(--text-2)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--text)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-2)'}
              >
                {item}
              </a>
            ))}
          </nav>
        )}

        {/* API status pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: isMobile ? '5px 8px' : '5px 12px',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          background: 'var(--bg-2)',
          fontSize: '11px',
          fontFamily: 'var(--mono)',
          color: 'var(--text-2)',
          transition: 'all 0.3s',
          flexShrink: 0,
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: online === true ? '#4ade80' : online === false ? '#f87171' : 'var(--text-3)',
            boxShadow: online === true ? '0 0 6px #4ade80' : 'none',
            flexShrink: 0,
          }} />
          {/* Text label hidden on mobile to save space */}
          {!isMobile && (online === null ? 'connecting...' : online ? 'API online' : 'API offline')}
        </div>

        {/* ── Theme toggle ── */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            width: '34px', height: '34px',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--bg-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-2)',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--border-2)'
            e.currentTarget.style.color = 'var(--text)'
            e.currentTarget.style.background = 'var(--bg-3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-2)'
            e.currentTarget.style.background = 'var(--bg-2)'
          }}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  )
}