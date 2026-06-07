import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

function formatBytes(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Upload({ onUpload, loading }) {
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [fileSize, setFileSize] = useState(null)
  const [hoverPreview, setHoverPreview] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    setFileName(file.name)
    setFileSize(file.size)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(file)
    onUpload(file)
  }, [onUpload])

  const handleRemove = (e) => {
    e.stopPropagation()
    setPreview(null)
    setFileName(null)
    setFileSize(null)
    onUpload(null)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.bmp'] },
    multiple: false,
    disabled: loading,
  })

  return (
    <div style={{ animation: 'fadeUp 0.6s ease 0.2s both' }}>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '20px', height: '1px', background: 'var(--accent)' }} />
        <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Input
        </span>
      </div>

      {/* ── Dropzone ── */}
      <div
        {...getRootProps()}
        style={{
          border: `1.5px dashed ${isDragActive ? 'var(--accent)' : 'var(--border-2)'}`,
          borderRadius: '16px',
          padding: preview ? '20px' : '48px 32px',
          textAlign: 'center',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: isDragActive ? 'var(--accent-dim)' : 'var(--bg-2)',
          transition: 'all 0.25s ease',
          position: 'relative',
          overflow: 'hidden',
          animation: isDragActive ? 'pulse-ring 1s ease infinite' : 'none',
        }}
      >
        <input {...getInputProps()} />

        {/* Corner marks */}
        {[
          { top: 12, left: 12, borderTop: '1px solid var(--border-2)', borderLeft: '1px solid var(--border-2)' },
          { top: 12, right: 12, borderTop: '1px solid var(--border-2)', borderRight: '1px solid var(--border-2)' },
          { bottom: 12, left: 12, borderBottom: '1px solid var(--border-2)', borderLeft: '1px solid var(--border-2)' },
          { bottom: 12, right: 12, borderBottom: '1px solid var(--border-2)', borderRight: '1px solid var(--border-2)' },
        ].map((style, i) => (
          <div key={i} style={{ position: 'absolute', width: '12px', height: '12px', ...style }} />
        ))}

        {/* Drag-active overlay */}
        {isDragActive && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'var(--accent-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '14px',
            zIndex: 2,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px', animation: 'fadeUp 0.3s ease' }}>↓</span>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent)', fontFamily: 'var(--sans)' }}>
                Drop to upload
              </p>
            </div>
          </div>
        )}

        {/* ── File preview state ── */}
        {preview ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>

            {/* Thumbnail */}
            <div
              style={{ position: 'relative', flexShrink: 0 }}
              onMouseEnter={() => !loading && setHoverPreview(true)}
              onMouseLeave={() => setHoverPreview(false)}
            >
              <img
                src={preview}
                alt="fingerprint preview"
                style={{
                  width: '80px', height: '80px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  filter: 'grayscale(100%)',
                  display: 'block',
                  transition: 'filter 0.2s',
                }}
              />
              {hoverPreview && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.55)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'fadeIn 0.15s ease',
                }}>
                  <span style={{ fontSize: '10px', color: '#fff', fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>
                    change
                  </span>
                </div>
              )}
            </div>

            {/* File info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '13px', fontWeight: '600', color: 'var(--text)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                marginBottom: '4px',
              }}>{fileName}</p>
              <p style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text-3)', marginBottom: '8px' }}>
                {formatBytes(fileSize)}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
                <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: '#4ade80' }}>ready to analyse</span>
              </div>
            </div>

            {/* Remove × button */}
            <button
              onClick={handleRemove}
              disabled={loading}
              title="Remove file"
              style={{
                flexShrink: 0,
                width: '28px', height: '28px',
                borderRadius: '50%',
                border: '1px solid var(--border)',
                background: 'var(--bg-3)',
                color: 'var(--text-3)',
                fontSize: '16px',
                lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f8717122'
                e.currentTarget.style.color = '#f87171'
                e.currentTarget.style.borderColor = '#f8717144'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--bg-3)'
                e.currentTarget.style.color = 'var(--text-3)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              ×
            </button>
          </div>

        ) : (
          /* ── Empty state ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="26" cy="26" r="4" stroke="var(--text-3)" strokeWidth="1.5" />
              <path d="M26 18c-4.4 0-8 3.6-8 8s3.6 8 8 8" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M26 14c-6.6 0-12 5.4-12 12s5.4 12 12 12" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M26 10c-8.8 0-16 7.2-16 16s7.2 16 16 16" stroke="var(--border-2)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M34 26c0-4.4-3.6-8-8-8" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M38 26c0-6.6-5.4-12-12-12" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div>
              <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>
                {isDragActive ? 'Drop fingerprint here' : 'Upload fingerprint image'}
              </p>
              <p style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text-3)' }}>
                drag & drop or click to browse · JPG, PNG, BMP
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sub-caption */}
      {preview && (
        <p style={{
          marginTop: '10px',
          fontSize: '11px',
          fontFamily: 'var(--mono)',
          color: 'var(--text-3)',
          textAlign: 'center',
          animation: 'fadeUp 0.3s ease',
        }}>
          ensemble · convnext-tiny + efficientnet-b0 + resnet-34 · grad-cam
        </p>
      )}
    </div>
  )
}