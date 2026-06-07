import { useState, useEffect } from 'react'
import Header from './components/Header'
import Upload from './components/Upload'
import Result from './components/Result'
import Heatmap from './components/Heatmap'
import { predictFull } from './api/predict'

/* ── Responsive hook ───────────────────────────── */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])
  return isMobile
}

export default function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('dt-theme') || 'dark')
  const isMobile = useIsMobile()

  /* Apply theme to <html> */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('dt-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const handleUpload = (uploadedFile) => {
    setFile(uploadedFile)
    setResult(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await predictFull(file)
      setResult(data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Server error. Is the API running?')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  const gridCols = isMobile
    ? '1fr'
    : result ? '1fr 1fr' : '480px'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', transition: 'background 0.3s ease' }}>
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* ── Hero ── */}
      <div style={{
        textAlign: 'center',
        padding: isMobile ? '44px 20px 32px' : '72px 24px 56px',
        animation: 'fadeUp 0.6s ease',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 14px',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          background: 'var(--bg-2)',
          marginBottom: '24px',
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)' }} />
          <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-2)', letterSpacing: '0.08em' }}>
            grad-cam explainability · ensemble model · 92% accuracy
          </span>
        </div>

        <h1 style={{
          fontSize: isMobile ? 'clamp(28px, 9vw, 42px)' : 'clamp(36px, 5vw, 64px)',
          fontWeight: '800',
          letterSpacing: '-0.03em',
          lineHeight: '1.05',
          color: 'var(--text)',
          marginBottom: '16px',
        }}>
          Blood group detection<br />
          <span style={{ color: 'var(--accent)' }}>from fingerprints</span>
        </h1>

        <p style={{
          fontSize: isMobile ? '13px' : '15px',
          color: 'var(--text-2)',
          maxWidth: '460px',
          margin: '0 auto',
          lineHeight: '1.7',
          fontWeight: '400',
          padding: isMobile ? '0 8px' : '0',
        }}>
          Upload a fingerprint image. Our ensemble model predicts your blood group
          and visualizes exactly where it looked using Grad-CAM.
        </p>
      </div>

      {/* ── Main grid ── */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: isMobile ? '0 16px 60px' : '0 24px 80px',
        display: 'grid',
        gridTemplateColumns: gridCols,
        justifyContent: 'center',
        gap: isMobile ? '24px' : '32px',
        alignItems: 'start',
      }}>

        {/* ── Left column ── */}
        <div>
          <Upload onUpload={handleUpload} loading={loading} />

          {/* Analyse button */}
          {file && !result && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '14px',
                borderRadius: '10px',
                background: loading ? 'var(--bg-3)' : 'var(--accent)',
                color: loading ? 'var(--text-3)' : '#fff',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'var(--sans)',
                letterSpacing: '0.01em',
                border: 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                animation: 'popIn 0.3s ease',
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '14px', height: '14px',
                    border: '2px solid var(--text-3)',
                    borderTopColor: 'var(--text-2)',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  analysing fingerprint...
                </>
              ) : 'Analyse Fingerprint →'}
            </button>
          )}

          {/* Reset button */}
          {result && (
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-2)',
                fontSize: '13px',
                fontWeight: '500',
                fontFamily: 'var(--sans)',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
            >
              ← Analyse another
            </button>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginTop: '16px',
              padding: '14px 16px',
              borderRadius: '10px',
              background: '#f8717122',
              border: '1px solid #f8717144',
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              color: '#f87171',
              lineHeight: '1.5',
              animation: 'fadeUp 0.3s ease',
            }}>
              {error}
            </div>
          )}

          {/* Stats row */}
          {!result && !loading && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginTop: '32px',
              animation: 'fadeUp 0.6s ease 0.4s both',
            }}>
              {[
                { label: 'Accuracy', value: '92%' },
                { label: 'AUC Score', value: '0.989' },
                { label: 'Blood Groups', value: '8' },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px',
                  textAlign: 'center',
                  transition: 'background 0.3s, border-color 0.3s',
                }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', letterSpacing: '-0.02em', fontFamily: 'var(--mono)' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-3)', fontFamily: 'var(--mono)', marginTop: '4px', letterSpacing: '0.06em' }}>
                    {stat.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Result panel */}
          {result && (
            <div style={{ marginTop: '24px' }}>
              <Result data={result} />
            </div>
          )}
        </div>

        {/* ── Right column — Heatmap ── */}
        {result && (
          <div style={{ animation: isMobile ? 'fadeUp 0.5s ease' : 'slideInRight 0.5s ease' }}>
            <Heatmap heatmapImage={result.heatmap_image} bloodGroup={result.blood_group} />

            {/* Ensemble info */}
            <div style={{
              marginTop: '24px',
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
              animation: 'fadeUp 0.5s ease 0.3s both',
            }}>
              <p style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-3)', marginBottom: '12px', letterSpacing: '0.08em' }}>
                ENSEMBLE MODELS
              </p>
              {[
                { name: 'ConvNeXt Tiny', role: 'prediction + grad-cam', weight: '40%', acc: '88.43%', f1: '0.879' },
                { name: 'EfficientNet-B0', role: 'prediction', weight: '35%', acc: '85.57%', f1: '0.845' },
                { name: 'ResNet-34', role: 'prediction', weight: '25%', acc: '83.22%', f1: '0.821' },
              ].map((m, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)' }}>{m.name}</span>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-3)', marginLeft: '8px' }}>{m.role}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--accent)' }}>{m.weight}</span>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-3)' }}>{m.acc}</span>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-3)', opacity: 0.6 }}>f1 {m.f1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}