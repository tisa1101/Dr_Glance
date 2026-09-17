import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Camera, Upload, AlertCircle, CheckCircle } from 'lucide-react'

const EYE_SYMPTOMS = [
  "Redness", "Itching", "Gritty feeling", "Discharge", "Tearing",
  "Loss of peripheral vision", "Haloes around lights", "Eye pain", "Blurred vision",
  "Cloudy vision", "Difficulty with night vision", "Sensitivity to light", "Fading colors",
  "Stinging or burning", "Scratchiness", "Stringy mucus", "Red bump on eyelid", "Swelling"
];

const MOUTH_SYMPTOMS = [
  "Toothache", "Tooth sensitivity", "Mild to sharp pain when eating hot/cold", "Visible holes",
  "Swollen gums", "Dusky red gums", "Gums that bleed easily when brushing", "Bad breath",
  "Small sores inside mouth", "Painful red areas", "Tingling sensation", "Difficulty eating",
  "White lesions on tongue/cheeks", "Cottage cheese appearance", "Loss of taste", "Redness under patches",
  "Thickened white patches", "Cannot be scraped off", "Irregular edges", "Sometimes persistent"
];

export default function Diagnostics({ user }) {
  const [scanType, setScanType] = useState('full_face')
  const [imageSrc, setImageSrc] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [useWebcam, setUseWebcam] = useState(false)
  
  // New states for combined symptom diagnostics
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [symptomMatches, setSymptomMatches] = useState([])
  const [combinedAssessment, setCombinedAssessment] = useState('')
  
  const webcamRef = useRef(null)
  const fileInputRef = useRef(null)

  const capture = useCallback(() => {
    const image = webcamRef.current.getScreenshot()
    setImageSrc(image)
    setUseWebcam(false)
  }, [webcamRef])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImageSrc(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleScanTypeChange = (type) => {
    setScanType(type);
    setSelectedSymptoms([]);
    setSymptomMatches([]);
    setCombinedAssessment('');
    setResults(null);
  }

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const getActiveSymptoms = () => {
    if (scanType === 'eye_only') return EYE_SYMPTOMS;
    if (scanType === 'mouth_only') return MOUTH_SYMPTOMS;
    return [...EYE_SYMPTOMS, ...MOUTH_SYMPTOMS];
  }

  const renderFormattedText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const analyzeImage = async () => {
    if (!imageSrc) return
    setLoading(true)
    
    try {
      const res = await fetch(imageSrc)
      const blob = await res.blob()
      
      const formData = new FormData()
      formData.append('file', blob, 'scan.jpg')
      formData.append('scan_type', scanType)
      if (selectedSymptoms.length > 0) {
        formData.append('symptoms', selectedSymptoms.join(','))
      }
      if (user) {
        formData.append('user_id', user.user_id)
      }
      
      const response = await fetch('http://127.0.0.1:8000/api/analysis', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      setResults(data.results)
      setSymptomMatches(data.symptom_match || [])
      setCombinedAssessment(data.combined_assessment || '')
    } catch (error) {
      console.error("Error analyzing image:", error)
      // Mock fallback for frontend preview
      setTimeout(() => {
        setResults({
          eye: { condition: 'Conjunctivitis', confidence: 89.4, alerts: ['Monitor for 2 days.'] },
          mouth: { condition: 'Normal', confidence: 95.1, alerts: [] }
        })
        setCombinedAssessment("Mock fallback: Visual scan suggests Conjunctivitis, which matches reported eye irritation.")
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityClass = (condition) => {
    if (!condition) return 'normal'
    if (condition.toLowerCase() === 'normal') return 'normal'
    if (condition.toLowerCase().includes('fatigue')) return 'warning'
    return 'danger'
  }

  const handleRetake = () => {
    setImageSrc(null);
    setResults(null);
    setSelectedSymptoms([]);
    setSymptomMatches([]);
    setCombinedAssessment('');
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <h1 className="page-title">AI Diagnostics</h1>
      
      <div className="card">
        <div className="scan-type-selector">
          <button 
            className={`scan-type-btn ${scanType === 'full_face' ? 'active' : ''}`}
            onClick={() => handleScanTypeChange('full_face')}
          >
            Full Face Scan
          </button>
          <button 
            className={`scan-type-btn ${scanType === 'eye_only' ? 'active' : ''}`}
            onClick={() => handleScanTypeChange('eye_only')}
          >
            Eye Only
          </button>
          <button 
            className={`scan-type-btn ${scanType === 'mouth_only' ? 'active' : ''}`}
            onClick={() => handleScanTypeChange('mouth_only')}
          >
            Mouth Only
          </button>
        </div>

        {!imageSrc && !useWebcam && (
          <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
            <Upload size={48} color="#5b6cf9" style={{ marginBottom: '1rem' }} />
            <h3>Upload Image</h3>
            <p style={{ color: 'var(--text-muted)' }}>Drag and drop or click to browse</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileUpload}
            />
            <div style={{ marginTop: '2rem' }}>
              <span style={{ margin: '0 1rem', color: 'var(--text-muted)' }}>OR</span>
              <button 
                className="btn btn-secondary" 
                onClick={(e) => { e.stopPropagation(); setUseWebcam(true); }}
              >
                <Camera size={18} /> Use Webcam
              </button>
            </div>
          </div>
        )}

        {useWebcam && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--primary)' }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                height={480}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn" onClick={capture}>Take Photo</button>
              <button className="btn btn-secondary" onClick={() => setUseWebcam(false)}>Cancel</button>
            </div>
          </div>
        )}

        {imageSrc && (
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
              <img src={imageSrc} alt="Scan Target" className="image-preview" />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn" onClick={analyzeImage} disabled={loading}>
                  {loading ? 'Analyzing...' : 'Analyze Image'}
                </button>
                <button className="btn btn-secondary" onClick={handleRetake}>
                  Retake
                </button>
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              {loading && (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s infinite linear' }} />
                </div>
              )}
              
              {!loading && !results && (
                <div className="symptom-selection-container animate-fade-in">
                  <h3 style={{ marginBottom: '0.5rem' }}>Select Symptoms (Optional)</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Select any symptoms you are currently experiencing to receive a combined clinical assessment.
                  </p>
                  <div className="symptoms-grid" style={{ maxHeight: '250px' }}>
                    {getActiveSymptoms().map(symptom => (
                      <div 
                        key={symptom}
                        className={`symptom-chip ${selectedSymptoms.includes(symptom) ? 'selected' : ''}`}
                        onClick={() => toggleSymptom(symptom)}
                      >
                        {symptom}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!loading && results && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>Analysis Results</h3>
                  
                  {/* Combined Assessment */}
                  {combinedAssessment && (
                    <div className="result-box info" style={{ background: 'rgba(91, 108, 249, 0.1)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '1rem' }}>
                      <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '1rem' }}>AI Doctor Assessment</strong>
                      <p style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {renderFormattedText(combinedAssessment)}
                      </p>
                    </div>
                  )}
                  
                  {/* Visual Scan Results */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {results.eye && !results.eye.error && (
                      <div className={`result-box ${getSeverityClass(results.eye.condition)}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <strong>Eye Health Scan</strong>
                          <span className="badge badge-success">{results.eye.confidence}% Confidence</span>
                        </div>
                        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{results.eye.condition}</p>
                        {results.eye.alerts?.map((alert, i) => (
                          <p key={i} style={{ color: 'var(--danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <AlertCircle size={14} /> {alert}
                          </p>
                        ))}
                      </div>
                    )}

                    {results.mouth && !results.mouth.error && (
                      <div className={`result-box ${getSeverityClass(results.mouth.condition)}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <strong>Oral Health Scan</strong>
                          <span className="badge badge-success">{results.mouth.confidence}% Confidence</span>
                        </div>
                        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{results.mouth.condition}</p>
                        {results.mouth.alerts?.map((alert, i) => (
                          <p key={i} style={{ color: 'var(--danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <AlertCircle size={14} /> {alert}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Symptom Matches */}
                  {symptomMatches.length > 0 && (
                    <div className="result-box" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '1rem' }}>
                      <strong style={{ display: 'block', marginBottom: '0.75rem' }}>Related Symptom Match</strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {symptomMatches.slice(0, 3).map(match => (
                          <div key={match.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span>{match.name} ({match.severity} Priority)</span>
                              <strong>{match.matchPercentage}% Match</strong>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', background: 'var(--primary)', width: `${match.matchPercentage}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {results.eye?.error && results.mouth?.error && (
                    <div className="result-box warning">
                      <p>Could not detect face/features clearly. Please try again with better lighting.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
