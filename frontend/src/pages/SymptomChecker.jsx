import React, { useState, useMemo } from 'react';
import { Search, AlertCircle, Info, Stethoscope, ChevronRight, Eye, Smile, MoveRight, Sparkles } from 'lucide-react';

const DISEASE_DATASET = {
  eye: [
    {
      name: "Conjunctivitis (Pink Eye)",
      symptoms: ["Redness", "Itching", "Gritty feeling", "Discharge", "Tearing"],
      severity: "Moderate",
      advice: "Avoid touching eyes, wash hands frequently. Consult for antibiotic drops if bacterial.",
      risk: "Highly contagious"
    },
    {
      name: "Glaucoma",
      symptoms: ["Loss of peripheral vision", "Haloes around lights", "Eye pain", "Blurred vision"],
      severity: "High",
      advice: "Requires immediate medical attention to prevent permanent vision loss.",
      risk: "Age, Family history, High eye pressure"
    },
    {
      name: "Cataracts",
      symptoms: ["Cloudy vision", "Difficulty with night vision", "Sensitivity to light", "Fading colors"],
      severity: "Moderate",
      advice: "Surgery is the effective treatment when vision interferes with daily life.",
      risk: "Age, Diabetes, UV exposure"
    },
    {
      name: "Dry Eye Syndrome",
      symptoms: ["Stinging or burning", "Scratchiness", "Stringy mucus", "Light sensitivity"],
      severity: "Low",
      advice: "Use artificial tears, stay hydrated, and take screen breaks.",
      risk: "Extended screen use, Aging, Environment"
    },
    {
      name: "Stye",
      symptoms: ["Red bump on eyelid", "Eyelid pain", "Swelling", "Tearing"],
      severity: "Low",
      advice: "Apply warm compresses 4 times a day. Do not squeeze.",
      risk: "Poor eyelid hygiene"
    }
  ],
  mouth: [
    {
      name: "Dental Caries (Cavities)",
      symptoms: ["Toothache", "Tooth sensitivity", "Mild to sharp pain when eating hot/cold", "Visible holes"],
      severity: "Moderate",
      advice: "Visit a dentist for fillings. Maintain better brushing and flossing habits.",
      risk: "High sugar diet, Poor hygiene"
    },
    {
      name: "Gingivitis",
      symptoms: ["Swollen gums", "Dusky red gums", "Gums that bleed easily when brushing", "Bad breath"],
      severity: "Moderate",
      advice: "Professional cleaning and improved home oral care can reverse it.",
      risk: "Plaque buildup, Smoking"
    },
    {
      name: "Mouth Ulcers (Canker Sores)",
      symptoms: ["Small sores inside mouth", "Painful red areas", "Tingling sensation", "Difficulty eating"],
      severity: "Low",
      advice: "Usually heal on their own. Avoid spicy foods. Use salt water rinses.",
      risk: "Stress, Minor injury, Vitamin deficiency"
    },
    {
      name: "Oral Thrush",
      symptoms: ["White lesions on tongue/cheeks", "Cottage cheese appearance", "Loss of taste", "Redness under patches"],
      severity: "Moderate",
      advice: "Antifungal medications are typically used. Maintain good oral hygiene.",
      risk: "Weakened immune system, Diabetes, Antibiotics"
    },
    {
      name: "Leukoplakia",
      symptoms: ["Thickened white patches", "Cannot be scraped off", "Irregular edges", "Sometimes persistent"],
      severity: "High",
      advice: "Must be examined by a dentist/doctor as it can be precancerous.",
      risk: "Tobacco use, Chronic irritation"
    }
  ]
};

const SymptomChecker = ({ setActiveTab }) => {
  const [activeTab, setActiveTabMode] = useState('eye');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const allSymptoms = useMemo(() => {
    const symptoms = new Set();
    DISEASE_DATASET[activeTab].forEach(d => d.symptoms.forEach(s => symptoms.add(s)));
    return Array.from(symptoms);
  }, [activeTab]);

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const getMatchedDiseases = () => {
    if (selectedSymptoms.length === 0) return [];
    
    return DISEASE_DATASET[activeTab]
      .map(disease => {
        const matches = disease.symptoms.filter(s => selectedSymptoms.includes(s)).length;
        const matchPercentage = (matches / disease.symptoms.length) * 100;
        return { ...disease, matchPercentage, matches };
      })
      .filter(d => d.matches > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  const matchedDiseases = getMatchedDiseases();

  return (
    <div className="symptom-checker-page animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <span className="oura-category-tag" style={{ color: 'var(--oura-cyan, #38bdf8)', marginBottom: '0.5rem' }}>
          <Sparkles size={13} /> CLINICAL RADAR
        </span>
        <h1 className="page-title" style={{ fontFamily: "var(--font-serif, 'Newsreader', serif)", fontSize: '2.5rem', fontWeight: 400, color: '#ffffff' }}>
          Smart Symptom Radar
        </h1>
        <p className="subtitle" style={{ color: 'var(--text-2, #9ca3af)', fontSize: '0.95rem' }}>
          Correlate specific ocular and oral discomfort indicators with validated pathological patterns.
        </p>
      </div>

      <div className="checker-layout">
        {/* ── Left Selection Panel ── */}
        <div className="selection-panel card" style={{ padding: '1.5rem', background: 'var(--card, rgba(19, 21, 29, 0.86))' }}>
          {/* High-Contrast Luxury Pill Switcher */}
          <div className="type-toggle">
            <button 
              type="button"
              className={`toggle-btn ${activeTab === 'eye' ? 'active' : ''}`}
              onClick={() => { setActiveTabMode('eye'); setSelectedSymptoms([]); }}
              style={{
                background: activeTab === 'eye' ? '#ffffff' : 'transparent',
                color: activeTab === 'eye' ? '#090a0f' : 'var(--text-2, #9ca3af)',
              }}
            >
              <Eye size={18} /> Eye Symptoms
            </button>
            <button 
              type="button"
              className={`toggle-btn ${activeTab === 'mouth' ? 'active' : ''}`}
              onClick={() => { setActiveTabMode('mouth'); setSelectedSymptoms([]); }}
              style={{
                background: activeTab === 'mouth' ? '#ffffff' : 'transparent',
                color: activeTab === 'mouth' ? '#090a0f' : 'var(--text-2, #9ca3af)',
              }}
            >
              <Smile size={18} /> Mouth Symptoms
            </button>
          </div>

          <div style={{ marginBottom: '0.85rem', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', fontWeight: 700 }}>
            SELECT OBSERVED SYMPTOMS
          </div>

          <div className="symptoms-grid">
            {allSymptoms.map(symptom => (
              <div 
                key={symptom}
                className={`symptom-chip ${selectedSymptoms.includes(symptom) ? 'selected' : ''}`}
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom}
              </div>
            ))}
          </div>

          <div className="selection-footer">
            <button 
              className="oura-btn oura-btn-outline"
              style={{ padding: '0.4rem 0.95rem', fontSize: '0.78rem' }}
              onClick={() => setSelectedSymptoms([])}
              disabled={selectedSymptoms.length === 0}
            >
              Clear All
            </button>
            <span className="selection-count">
              <strong style={{ color: selectedSymptoms.length > 0 ? 'var(--oura-cyan)' : 'inherit' }}>
                {selectedSymptoms.length}
              </strong> symptoms active
            </span>
          </div>
        </div>

        {/* ── Right Results Panel ── */}
        <div className="results-panel">
          {selectedSymptoms.length === 0 ? (
            <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <Stethoscope size={44} color="var(--oura-cyan, #38bdf8)" style={{ margin: '0 auto 1.25rem', opacity: 0.8 }} />
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: '1.5rem', color: '#fff', marginBottom: '0.4rem', fontWeight: 400 }}>
                Identify Diagnostic Biomarkers
              </h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', maxWidth: '360px', margin: '0 auto' }}>
                Select one or more symptoms on the left to calculate statistical correlation with known clinical conditions.
              </p>
            </div>
          ) : matchedDiseases.length === 0 ? (
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <AlertCircle size={44} color="var(--oura-amber, #f59e0b)" style={{ margin: '0 auto 1.25rem' }} />
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: '1.45rem', color: '#fff', marginBottom: '0.4rem', fontWeight: 400 }}>
                No Direct Matches Found
              </h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto' }}>
                The selected symptoms do not form a recognizable clinical cluster. Consider scheduling a verified professional screening.
              </p>
            </div>
          ) : (
            <div className="results-list">
              {matchedDiseases.map(disease => (
                <div key={disease.name} className="card animate-fade-in" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
                        {disease.name}
                      </h3>
                      <span className={`oura-capsule-badge ${disease.severity === 'High' ? 'coral' : disease.severity === 'Moderate' ? 'terracotta' : 'sage'}`}>
                        {disease.severity} Clinical Priority
                      </span>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '130px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Symptom Correlation
                      </div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--oura-cyan)', marginTop: '0.15rem' }}>
                        {disease.matchPercentage.toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                    <div 
                      style={{
                        width: `${disease.matchPercentage}%`, height: '100%',
                        background: disease.matchPercentage > 60 ? 'linear-gradient(90deg, #38bdf8, #10b981)' : '#f59e0b',
                        borderRadius: '3px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem' }}>
                    <div style={{ color: 'var(--text-2)' }}>
                      <strong style={{ color: '#ffffff' }}>Matched Symptoms: </strong> {disease.symptoms.join(', ')}
                    </div>
                    <div style={{ color: 'var(--text-2)' }}>
                      <strong style={{ color: '#ffffff' }}>Known Risk Cohorts: </strong> {disease.risk}
                    </div>
                    <div className="advice-box">
                      <strong style={{ color: '#ffffff' }}>Clinical Recommendation: </strong> {disease.advice}
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button 
                      className="oura-btn" 
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem' }}
                      onClick={() => setActiveTab ? setActiveTab('appointments') : (window.location.hash = 'appointments')}
                    >
                      Find Nearby Verified Clinic <MoveRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
