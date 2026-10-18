import React, { useState, useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import {
  Camera, Upload, AlertTriangle, CheckCircle, RefreshCw,
  Eye, Smile, X, Info, ChevronRight, Loader2
} from 'lucide-react'
import { DisclaimerBanner, Badge, Spinner, Alert } from '../components/ui.jsx'
import { API_BASE } from '../config/api.js'

// ─── Symptom data ─────────────────────────────────────────────────────────────
const EYE_SYMPTOMS = [
  'Redness', 'Itching', 'Gritty feeling', 'Discharge', 'Tearing',
  'Loss of peripheral vision', 'Haloes around lights', 'Eye pain', 'Blurred vision',
  'Cloudy vision', 'Difficulty with night vision', 'Sensitivity to light', 'Fading colors',
  'Stinging or burning', 'Scratchiness', 'Red bump on eyelid', 'Swelling',
]
const MOUTH_SYMPTOMS = [
  'Toothache', 'Tooth sensitivity', 'Pain when eating hot/cold', 'Visible holes',
  'Swollen gums', 'Gums that bleed when brushing', 'Bad breath',
  'Small sores inside mouth', 'Painful red areas', 'Tingling sensation', 'Difficulty eating',
  'White lesions on tongue', 'Loss of taste', 'Redness under patches',
  'Thickened white patches', 'Cannot be scraped off',
]

const MAX_FILE_SIZE_MB = 10
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

// ─── Helpers ──────────────────────────────────────────────────────────────────
function renderFormattedText(text) {
  if (!text) return null
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  )
}

function confidenceBadgeType(confidence) {
  if (confidence >= 80) return 'success'
  if (confidence >= 60) return 'warning'
  return 'danger'
}

function conditionSeverityBorder(condition) {
  if (!condition) return 'var(--border)'
  const c = condition.toLowerCase()
  if (c === 'normal') return 'var(--success)'
  if (c.includes('fatigue') || c.includes('dry')) return 'var(--warning)'
  return 'var(--danger)'
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ScanTypeButton({ active, onClick, icon: Icon, label, description }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '0.5rem', padding: '1rem', borderRadius: '12px', cursor: 'pointer',
        border: `2px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
        background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
        color: active ? 'var(--primary)' : 'var(--text-muted)',
        transition: 'all 0.2s ease', textAlign: 'center',
      }}
    >
      <Icon size={22} />
      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{description}</span>
    </button>
  )
}

function UploadZone({ onFile, onWebcam, fileError }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload image — click or drag and drop"
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? 'var(--primary)' : fileError ? 'var(--danger)' : 'rgba(99,102,241,0.35)'}`,
          borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center',
          cursor: 'pointer', transition: 'all 0.2s ease',
          background: dragging ? 'rgba(99,102,241,0.06)' : 'transparent',
        }}
      >
        <Upload size={40} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
        <h3 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>Upload an image</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          JPEG, PNG, WebP · Max {MAX_FILE_SIZE_MB} MB
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          For best results: good lighting, face centred, no glasses or obstructions
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          style={{ display: 'none' }}
          onChange={e => e.target.files[0] && onFile(e.target.files[0])}
        />
      </div>

      {fileError && (
        <Alert type="danger" style={{ marginTop: '0.75rem' }}>{fileError}</Alert>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      <button
        className="btn btn-secondary"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        onClick={onWebcam}
        aria-label="Open webcam to capture image"
      >
        <Camera size={18} /> Use Webcam
      </button>
    </div>
  )
}

function ResultCard({ title, result, icon: Icon }) {
  if (!result || result.error) return (
    <div style={{
      padding: '1rem', borderRadius: '12px',
      background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
        {Icon && <Icon size={16} />}
        <strong style={{ fontSize: '0.9rem' }}>{title}</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        {result?.error || 'Region not detected in this image.'}
      </p>
    </div>
  )

  const borderColor = conditionSeverityBorder(result.condition)

  return (
    <div style={{
      padding: '1.25rem', borderRadius: '12px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border)',
      borderLeft: `4px solid ${borderColor}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {Icon && <Icon size={16} color={borderColor} />}
          <strong style={{ fontSize: '0.9rem' }}>{title}</strong>
        </div>
        <Badge type={confidenceBadgeType(result.confidence)}>
          {result.confidence}% model confidence
        </Badge>
      </div>
      <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem', color: borderColor }}>
        {result.condition}
      </p>
      {result.alerts?.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {result.alerts.map((alert, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <ChevronRight size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
              {alert}
            </li>
          ))}
        </ul>
      )}
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontStyle: 'italic' }}>
        Model confidence ≠ clinical certainty. Professional evaluation required.
      </p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Diagnostics({ user }) {
  const [scanType, setScanType] = useState('full_face')
  const [imageSrc, setImageSrc] = useState(null)   // base64 preview
  const [imageFile, setImageFile] = useState(null)  // actual File object
  const [fileError, setFileError] = useState('')
  const [results, setResults] = useState(null)
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [useWebcam, setUseWebcam] = useState(false)
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [symptomMatches, setSymptomMatches] = useState([])
  const [combinedAssessment, setCombinedAssessment] = useState('')

  const webcamRef = useRef(null)
  const analyzeButtonRef = useRef(null)

  const resetAll = () => {
    setImageSrc(null)
    setImageFile(null)
    setFileError('')
    setResults(null)
    setApiError('')
    setSelectedSymptoms([])
    setSymptomMatches([])
    setCombinedAssessment('')
  }

  const handleScanTypeChange = (type) => {
    setScanType(type)
    setSelectedSymptoms([])
    setResults(null)
    setApiError('')
  }

  const validateAndSetFile = (file) => {
    setFileError('')
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError('Unsupported file type. Please upload JPEG, PNG, or WebP.')
      return
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`)
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImageSrc(reader.result)
    reader.readAsDataURL(file)
  }

  const captureWebcam = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot()
    if (!screenshot) return
    setImageSrc(screenshot)
    setUseWebcam(false)
    // Convert base64 to File
    fetch(screenshot)
      .then(r => r.blob())
      .then(blob => setImageFile(new File([blob], 'webcam.jpg', { type: 'image/jpeg' })))
  }, [])

  const analyzeImage = async () => {
    if (!imageFile && !imageSrc) return
    setLoading(true)
    setResults(null)
    setApiError('')

    try {
      let fileToSend = imageFile
      if (!fileToSend && imageSrc) {
        // Convert base64 if needed
        const r = await fetch(imageSrc)
        const blob = await r.blob()
        fileToSend = new File([blob], 'scan.jpg', { type: 'image/jpeg' })
      }

      const formData = new FormData()
      formData.append('file', fileToSend, fileToSend.name)
      formData.append('scan_type', scanType)
      if (selectedSymptoms.length > 0) formData.append('symptoms', selectedSymptoms.join(','))
      if (user) formData.append('user_id', user.user_id)

      const response = await fetch(`${API_BASE}/api/analysis/`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.detail || `Server error (${response.status})`)
      }

      const data = await response.json()
      setResults(data.results)
      setSymptomMatches(data.symptom_match || [])
      setCombinedAssessment(data.combined_assessment || '')
    } catch (err) {
      if (err.name === 'TimeoutError') {
        setApiError('Analysis timed out. The server may be busy. Please try again.')
      } else {
        setApiError(err.message || 'Could not reach the analysis service. Make sure the backend is running.')
      }
    } finally {
      setLoading(false)
    }
  }

  const activeSymptoms = scanType === 'eye_only'
    ? EYE_SYMPTOMS
    : scanType === 'mouth_only'
      ? MOUTH_SYMPTOMS
      : [...EYE_SYMPTOMS, ...MOUTH_SYMPTOMS]

  const toggleSymptom = (s) =>
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <h1 className="page-title">AI Wellness Check-in</h1>

      <DisclaimerBanner text="This tool uses a computer-vision model to screen for visual patterns associated with certain conditions. It is a prototype and is not a medical device. Results are not clinical diagnoses. Model confidence is not the same as medical certainty. Always consult a qualified healthcare professional for any health concern." />

      {/* Scan type selector */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          Select check-in type
        </h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
          <ScanTypeButton
            active={scanType === 'eye_only'} icon={Eye}
            label="Eye Wellness" description="Pupil, iris &amp; eyelid region"
            onClick={() => handleScanTypeChange('eye_only')}
          />
          <ScanTypeButton
            active={scanType === 'mouth_only'} icon={Smile}
            label="Oral Wellness" description="Teeth, gums &amp; mouth region"
            onClick={() => handleScanTypeChange('mouth_only')}
          />
          <ScanTypeButton
            active={scanType === 'full_face'} icon={Camera}
            label="Full Face" description="Both eye and oral regions"
            onClick={() => handleScanTypeChange('full_face')}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Left: image capture ── */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Image
          </h3>

          {!imageSrc && !useWebcam && (
            <UploadZone
              onFile={validateAndSetFile}
              onWebcam={() => setUseWebcam(true)}
              fileError={fileError}
            />
          )}

          {useWebcam && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--primary)', width: '100%' }}>
                <Webcam
                  audio={false} ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                <button className="btn" style={{ flex: 1 }} onClick={captureWebcam} aria-label="Capture photo">
                  <Camera size={16} /> Capture
                </button>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setUseWebcam(false)} aria-label="Cancel webcam">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          )}

          {imageSrc && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img
                  src={imageSrc}
                  alt="Selected image for analysis"
                  style={{ width: '100%', display: 'block', maxHeight: '280px', objectFit: 'cover' }}
                />
                <button
                  aria-label="Remove image"
                  onClick={resetAll}
                  style={{
                    position: 'absolute', top: '0.5rem', right: '0.5rem',
                    background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: 'white',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {!results && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Symptoms (optional)
                    <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', textTransform: 'none', letterSpacing: 0 }}>
                      — select any you are experiencing
                    </span>
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
                    {activeSymptoms.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSymptom(s)}
                        aria-pressed={selectedSymptoms.includes(s)}
                        style={{
                          padding: '4px 10px', borderRadius: '99px', fontSize: '0.78rem',
                          cursor: 'pointer', border: `1px solid ${selectedSymptoms.includes(s) ? 'var(--primary)' : 'var(--border)'}`,
                          background: selectedSymptoms.includes(s) ? 'rgba(99,102,241,0.15)' : 'transparent',
                          color: selectedSymptoms.includes(s) ? 'var(--primary)' : 'var(--text-muted)',
                          transition: 'all 0.15s',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {selectedSymptoms.length > 0 && (
                    <button
                      onClick={() => setSelectedSymptoms([])}
                      style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Clear {selectedSymptoms.length} selected
                    </button>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  ref={analyzeButtonRef}
                  className="btn"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={analyzeImage}
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Analysing…</> : 'Analyse Image'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={resetAll}
                  disabled={loading}
                  aria-label="Remove image and start over"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: results ── */}
        <div className="card" style={{ minHeight: '300px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Results
          </h3>

          {!imageSrc && !loading && !results && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Info size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.9rem' }}>Upload or capture an image to begin.</p>
            </div>
          )}

          {imageSrc && !loading && !results && !apiError && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Camera size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.9rem' }}>Image ready. Click <strong style={{ color: 'var(--primary)' }}>Analyse Image</strong> to continue.</p>
            </div>
          )}

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '1.5rem' }}>
              <Loader2 size={36} color="var(--primary)" style={{ animation: 'spin 0.8s linear infinite' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Analysing image…</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>The AI model is processing your image. This may take a moment.</p>
              </div>
            </div>
          )}

          {apiError && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Alert type="danger">{apiError}</Alert>
              <button className="btn btn-secondary" onClick={analyzeImage} style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          {results && !loading && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* DRGLANCE assessment */}
              {combinedAssessment && (
                <div style={{
                  padding: '1rem', borderRadius: '12px',
                  background: 'rgba(99,102,241,0.07)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}>
                  <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                    DRGLANCE Screening Summary
                  </p>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                    {renderFormattedText(combinedAssessment)}
                  </p>
                </div>
              )}

              {/* Per-region results */}
              {results.eye && (
                <ResultCard title="Eye Region" result={results.eye} icon={Eye} />
              )}
              {results.mouth && (
                <ResultCard title="Oral Region" result={results.mouth} icon={Smile} />
              )}

              {/* Symptom matches */}
              {symptomMatches.length > 0 && (
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Symptom Correlation
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {symptomMatches.slice(0, 3).map(match => (
                      <div key={match.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                          <span>{match.name}</span>
                          <Badge type={match.severity === 'High' ? 'danger' : match.severity === 'Moderate' ? 'warning' : 'success'} size="sm">
                            {match.matchPercentage?.toFixed(0)}% match
                          </Badge>
                        </div>
                        <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: 'var(--primary)', width: `${match.matchPercentage}%`, transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New scan button */}
              <button
                className="btn btn-secondary"
                onClick={resetAll}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <RefreshCw size={16} /> Start New Check-in
              </button>

              {/* Disclaimer note at bottom of results */}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                ⚠️ AI screening results are not a substitute for professional medical advice, diagnosis, or treatment.
                If you have a health concern, please consult a qualified clinician.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .diagnostics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
