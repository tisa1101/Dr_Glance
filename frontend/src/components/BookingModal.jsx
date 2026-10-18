import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, User, CheckCircle, AlertCircle, MapPin, Phone, Building2 } from 'lucide-react';
import { API_BASE } from '../config/api';

const BookingModal = ({ doctor, isOpen, onClose, user }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    type: 'physical'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const modalRef = useRef(null);

  // Today's date in YYYY-MM-DD for min date attribute
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsSuccess(false);
      setErrorMessage('');
      setFormData({
        date: '',
        time: '',
        reason: '',
        type: 'physical'
      });
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      setErrorMessage("Please describe the medical concern or symptoms you'd like examined.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`${API_BASE}/api/appointments/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.user_id || null,
          user_email: user?.email || 'patient@drglance.internal',
          user_name: user?.name || 'Verified Patient',
          doctor_name: doctor?.doctor_in_charge || doctor?.name,
          doctor_specialty: doctor?.specialty,
          facility_name: doctor?.name,
          facility_address: doctor?.address,
          facility_phone: doctor?.phone,
          date: formData.date,
          time: formData.time,
          appointment_type: formData.type,
          reason: formData.reason
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setBookingConfirmation(data.booking);
        setIsSuccess(true);
      } else {
        setErrorMessage(data.detail || "Unable to confirm booking. Please review your details and try again.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setErrorMessage("Network error: Could not contact clinical appointment service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStepFromStep2 = () => {
    if (!formData.date || !formData.time) {
      setErrorMessage("Please choose both an appointment date and a time slot.");
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content animate-fade-in" ref={modalRef} style={{ maxWidth: '520px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {!isSuccess ? (
          <>
            <div className="modal-header">
              <h2 id="modal-title" style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>Schedule Clinical Consultation</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.9rem' }}>
                <Building2 size={16} />
                <span>{doctor?.name}</span>
              </div>
              {doctor?.doctor_in_charge && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                  Attending Consultant: <strong>{doctor.doctor_in_charge}</strong> ({doctor.specialty})
                </p>
              )}
            </div>

            <div className="booking-steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>

            {errorMessage && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#fca5a5',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="step-content">
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Choose Consultation Format</h3>
                  <div className="appointment-types">
                    <div 
                      className={`type-card ${formData.type === 'physical' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, type: 'physical'})}
                    >
                      <User size={30} />
                      <span>In-Clinic Visit</span>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>At {doctor?.address?.split(',')[0] || 'Hospital'}</small>
                    </div>
                    <div 
                      className={`type-card ${formData.type === 'online' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, type: 'online'})}
                    >
                      <Calendar size={30} />
                      <span>Tele-Health Video</span>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secure HD Teleconsultation</small>
                    </div>
                  </div>
                  <button type="button" className="btn btn-block" onClick={() => { setErrorMessage(''); setStep(2); }}>
                    Continue to Date &amp; Time
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="step-content">
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Select Clinical Slot</h3>
                  <div className="input-group">
                    <label><Calendar size={15} /> Consultation Date</label>
                    <input 
                      type="date" 
                      min={todayStr}
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label><Clock size={15} /> Available Slot</label>
                    <select 
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    >
                      <option value="">Select an available slot</option>
                      <option value="09:30 AM">09:30 AM (Morning OPD)</option>
                      <option value="11:00 AM">11:00 AM (Specialist Review)</option>
                      <option value="02:30 PM">02:30 PM (Afternoon Clinical Slot)</option>
                      <option value="04:15 PM">04:15 PM (Evening OPD)</option>
                      <option value="05:45 PM">05:45 PM (Late Consultation)</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => { setErrorMessage(''); setStep(1); }}>Back</button>
                    <button type="button" className="btn" onClick={handleNextStepFromStep2}>Proceed to Confirmation</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="step-content">
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Patient Concern &amp; Confirmation</h3>
                  <div className="input-group">
                    <label>Chief Symptoms or Reason for Visit</label>
                    <textarea 
                      placeholder="e.g., Persistent eye redness, pain while chewing, seeking cataract evaluation..."
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      rows={3}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="summary-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
                      <div><span style={{ color: 'var(--text-muted)' }}>Hospital/Clinic:</span> <strong style={{ color: 'var(--text-main)', display: 'block' }}>{doctor?.name}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Specialist:</span> <strong style={{ color: 'var(--text-main)', display: 'block' }}>{doctor?.doctor_in_charge || doctor?.name}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Mode:</span> <strong style={{ color: 'var(--accent)', display: 'block' }}>{formData.type === 'online' ? 'Online Tele-Health' : 'In-Person Hospital Visit'}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Slot:</span> <strong style={{ color: 'var(--success)', display: 'block' }}>{formData.date} at {formData.time}</strong></div>
                    </div>
                  </div>

                  <div className="modal-actions" style={{ marginTop: '1.25rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => { setErrorMessage(''); setStep(2); }}>Back</button>
                    <button type="submit" className="btn" disabled={isSubmitting} style={{ minWidth: '160px' }}>
                      {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="success-content text-center animate-fade-in" style={{ padding: '1.5rem 0' }}>
            <div className="success-icon" style={{ margin: '0 auto 1.25rem' }}>
              <CheckCircle size={56} color="var(--success)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#f0f4ff' }}>Appointment Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Your consultation has been booked with <strong>{doctor?.doctor_in_charge || doctor?.name}</strong> at <strong>{doctor?.name}</strong>.
            </p>

            <div style={{
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'left',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Calendar size={15} color="var(--success)" />
                <span><strong>Date &amp; Time:</strong> {formData.date} · {formData.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <MapPin size={15} color="var(--success)" />
                <span><strong>Location:</strong> {doctor?.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="var(--success)" />
                <span><strong>Direct Hospital Desk:</strong> {doctor?.phone}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              A confirmation email has been dispatched to <strong>{user?.email || 'your registered email'}</strong>.
            </p>
            <button className="btn btn-block" onClick={onClose} style={{ marginTop: '1.5rem' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
