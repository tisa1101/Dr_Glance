import React, { useState, useMemo } from 'react';
import { Search, AlertCircle, Info, Stethoscope, ChevronRight, Eye, Smile, MoveRight } from 'lucide-react';

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

const SymptomChecker = () => {
  const [activeTab, setActiveTab] = useState('eye');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="symptom-checker-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Smart Symptom Checker</h1>
        <p className="subtitle">Select your symptoms to see potential conditions and advice.</p>
      </div>

      <div className="checker-layout">
        <div className="selection-panel card">
          <div className="type-toggle">
            <button 
              className={`toggle-btn ${activeTab === 'eye' ? 'active' : ''}`}
              onClick={() => { setActiveTab('eye'); setSelectedSymptoms([]); }}
            >
              <Eye size={18} /> Eye Symptoms
            </button>
            <button 
              className={`toggle-btn ${activeTab === 'mouth' ? 'active' : ''}`}
              onClick={() => { setActiveTab('mouth'); setSelectedSymptoms([]); }}
            >
              <Smile size={18} /> Mouth Symptoms
            </button>
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
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedSymptoms([])}
              disabled={selectedSymptoms.length === 0}
            >
              Clear All
            </button>
            <span className="selection-count">
              {selectedSymptoms.length} symptoms selected
            </span>
          </div>
        </div>

        <div className="results-panel">
          {selectedSymptoms.length === 0 ? (
            <div className="empty-results card">
              <Stethoscope size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3>Identify Your Symptoms</h3>
              <p>Select one or more symptoms on the left to begin the analysis.</p>
            </div>
          ) : matchedDiseases.length === 0 ? (
            <div className="empty-results card">
              <AlertCircle size={48} color="var(--warning)" style={{ marginBottom: '1rem' }} />
              <h3>No Direct Matches Found</h3>
              <p>Try selecting more symptoms or consult a professional for a specific diagnosis.</p>
            </div>
          ) : (
            <div className="results-list">
              {matchedDiseases.map(disease => (
                <div key={disease.name} className="result-card card animate-fade-in">
                  <div className="result-header">
                    <div className="title-area">
                      <h3>{disease.name}</h3>
                      <span className={`severity-badge ${disease.severity.toLowerCase()}`}>
                        {disease.severity} Priority
                      </span>
                    </div>
                    <div className="match-meter">
                      <div className="meter-label">Match Probability</div>
                      <div className="meter-bar">
                        <div 
                          className="meter-fill" 
                          style={{ width: `${disease.matchPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="result-body">
                    <div className="info-section">
                      <h4><Info size={14} /> Symptoms</h4>
                      <p>{disease.symptoms.join(', ')}</p>
                    </div>
                    <div className="info-section">
                      <h4><AlertCircle size={14} /> Risk Factors</h4>
                      <p>{disease.risk}</p>
                    </div>
                    <div className="advice-box">
                      <strong>Medical Advice:</strong> {disease.advice}
                    </div>
                  </div>

                  <div className="result-footer">
                    <button className="btn btn-sm btn-block" onClick={() => window.location.href='#find-doctor'}>
                      Find Nearby Doctor <MoveRight size={16} />
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
