import React, { useState } from 'react';
import { X, Calendar, Clock, User, CheckCircle } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: user?.email || 'guest@example.com',
          user_name: user?.name || 'Guest User',
          doctor_name: doctor?.name,
          doctor_specialty: doctor?.specialty,
          date: formData.date,
          time: formData.time,
          appointment_type: formData.type,
          reason: formData.reason
        })
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("Failed to book appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Connection error. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {!isSuccess ? (
          <>
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <p>With {doctor?.name}</p>
            </div>

            <div className="booking-steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="step-content">
                  <h3>Select Appointment Type</h3>
                  <div className="appointment-types">
                    <div 
                      className={`type-card ${formData.type === 'physical' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, type: 'physical'})}
                    >
                      <User size={32} />
                      <span>In-Person</span>
                    </div>
                    <div 
                      className={`type-card ${formData.type === 'online' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, type: 'online'})}
                    >
                      <Calendar size={32} />
                      <span>Online Video</span>
                    </div>
                  </div>
                  <button type="button" className="btn btn-block" onClick={nextStep} style={{ marginTop: '2rem' }}>
                    Continue
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="step-content">
                  <h3>Select Date & Time</h3>
                  <div className="input-group">
                    <label><Calendar size={16} /> Date</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label><Clock size={16} /> Time Slot</label>
                    <select 
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    >
                      <option value="">Select a time</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={prevStep}>Back</button>
                    <button type="button" className="btn" onClick={nextStep}>Continue</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="step-content">
                  <h3>Finalize Booking</h3>
                  <div className="input-group">
                    <label>Reason for Visit</label>
                    <textarea 
                      placeholder="Briefly describe your symptoms..."
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <div className="summary-card">
                    <p><strong>Doctor:</strong> {doctor?.name}</p>
                    <p><strong>Type:</strong> {formData.type === 'online' ? 'Online Appointment' : 'In-Person Visit'}</p>
                    <p><strong>Date:</strong> {formData.date}</p>
                    <p><strong>Time:</strong> {formData.time}</p>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={prevStep}>Back</button>
                    <button type="submit" className="btn" disabled={isSubmitting}>
                      {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="success-content text-center">
            <div className="success-icon">
              <CheckCircle size={64} color="var(--success)" />
            </div>
            <h2>Booking Confirmed!</h2>
            <p>Your appointment with {doctor?.name} has been scheduled successfully.</p>
            <p className="text-muted">A confirmation email has been sent to your inbox.</p>
            <button className="btn btn-block" onClick={onClose} style={{ marginTop: '2rem' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
