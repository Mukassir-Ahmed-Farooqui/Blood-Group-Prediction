import { useState } from 'react'

const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const InfoIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

export default function Heatmap({ heatmapImage, bloodGroup }) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (!heatmapImage) return null

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = heatmapImage
    a.download = `gradcam_${bloodGroup}_${Date.now()}.png`
    a.click()
  }

  return (
    <div style={{ animation: 'fadeUp 0.5s ease 0.1s both' }}>

      {/* ── Section header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '20px', height: '1px', background: '#e8c87a' }} />
          <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: '#e8c87a', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Grad-CAM Explainability
          </span>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          title="Download heatmap image"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--bg-2)',
            color: 'var(--text-2)',
            fontSize: '11px',
            fontFamily: 'var(--mono)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#e8c87a66'
            e.currentTarget.style.color = '#e8c87a'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-2)'
          }}
        >
          <DownloadIcon /> save
        </button>
      </div>

      {/* ── Heatmap card ── */}
      <div style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '16px',
      }}>
        {/* Image area */}
        <div style={{
          position: 'relative',
          background: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
        }}>
          <img
            src={heatmapImage}
            alt="Grad-CAM heatmap"
            style={{ maxWidth: '100%', borderRadius: '8px', display: 'block' }}
          />
          {/* Corner brackets */}
          {[
            { top: 12, left: 12, borderTop: '1.5px solid #e8c87a55', borderLeft: '1.5px solid #e8c87a55' },
            { top: 12, right: 12, borderTop: '1.5px solid #e8c87a55', borderRight: '1.5px solid #e8c87a55' },
            { bottom: 12, left: 12, borderBottom: '1.5px solid #e8c87a55', borderLeft: '1.5px solid #e8c87a55' },
            { bottom: 12, right: 12, borderBottom: '1.5px solid #e8c87a55', borderRight: '1.5px solid #e8c87a55' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', width: '16px', height: '16px', ...s }} />
          ))}
        </div>

        {/* Color scale legend */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-3)', marginBottom: '8px' }}>
            activation intensity
          </p>
          <div style={{
            width: '100%', height: '8px',
            borderRadius: '4px',
            background: 'linear-gradient(to right, #00008b, #0000ff, #00ffff, #00ff00, #ffff00, #ff8c00, #ff0000)',
            marginBottom: '5px',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {['none', 'low', 'medium', 'high', 'critical'].map((l, i) => (
              <span key={i} style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--text-3)' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Explanation card ── */}
      <div style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <p style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-3)', letterSpacing: '0.08em' }}>
            WHAT THE MODEL SEES
          </p>

          {/* Info tooltip */}
          <div style={{ position: 'relative' }}>
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              style={{
                width: '20px', height: '20px',
                borderRadius: '50%',
                border: '1px solid var(--border)',
                background: 'var(--bg-3)',
                color: 'var(--text-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'default',
                transition: 'all 0.2s',
              }}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
            >
              <InfoIcon />
            </button>

            {showTooltip && (
              <div style={{
                position: 'absolute', right: 0, bottom: '26px',
                background: 'var(--bg-3)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 12px',
                width: '230px',
                fontSize: '11px',
                fontFamily: 'var(--mono)',
                color: 'var(--text-2)',
                lineHeight: '1.65',
                zIndex: 20,
                animation: 'fadeUp 0.2s ease',
                boxShadow: 'var(--shadow)',
              }}>
                Gradient-weighted Class Activation Mapping (Grad-CAM) highlights which regions of your fingerprint most influenced the model's prediction.
              </div>
            )}
          </div>
        </div>

        {/* Zone legend chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {[
            { emoji: '🔴', label: 'Red', desc: 'high importance' },
            { emoji: '🟡', label: 'Yellow', desc: 'moderate importance' },
            { emoji: '🔵', label: 'Blue', desc: 'ignored by model' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              fontSize: '11px',
              fontFamily: 'var(--mono)',
              color: 'var(--text-2)',
            }}>
              <span>{item.emoji} {item.label}</span>
              <span style={{ color: 'var(--text-3)', marginLeft: '4px' }}>· {item.desc}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text-3)', lineHeight: '1.6' }}>
          model: convnext-tiny · layer: last conv · method: grad-cam
        </p>
      </div>
    </div>
  )
}