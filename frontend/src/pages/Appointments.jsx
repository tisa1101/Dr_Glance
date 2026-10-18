import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Calendar, Phone, Filter, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import DoctorMap from '../components/DoctorMap';
import BookingModal from '../components/BookingModal';
import { API_BASE } from '../config/api';

const Appointments = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: New Delhi (AIIMS / Maulana Azad / Dr. Shroff's vicinity)

  // Try to get user's real browser location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log("Using default verified medical centre coordinates")
      );
    }
  }, []);

  // Fetch verified authentic hospitals, eye institutes & dental surgeons from backend
  useEffect(() => {
    const fetchVerifiedFacilities = async () => {
      setLoading(true);
      try {
        const url = `${API_BASE}/api/facilities/facilities?lat=${center.lat}&lng=${center.lng}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.facilities && data.facilities.length > 0) {
          setDoctors(data.facilities);
        }
      } catch (error) {
        console.warn("Error fetching verified facilities from API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedFacilities();
  }, [center]);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.doctor_in_charge && doc.doctor_in_charge.toLowerCase().includes(searchTerm.toLowerCase())) ||
    doc.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = (doctor) => {
    setActiveDoctor(doctor);
    setIsBookingOpen(true);
  };

  return (
    <div className="appointments-page animate-fade-in">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>Verified Medical Centres & Specialists</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="var(--success)" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Authentic hospitals, certified ophthalmologists and licensed dental surgeons
          </p>
        </div>
        <div className="search-bar-container">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search verified hospital, doctor, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="filter-btn" aria-label="Filter">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="appointments-grid">
        <div className="doctors-list-panel">
          <div className="results-count" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{loading ? "Searching nearby facilities..." : `${filteredDoctors.length} verified healthcare centres`}</span>
            <span style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 600 }}>● 100% Genuine Clinical Partners</span>
          </div>
          
          <div className="doctors-scroll-area">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loader2 className="animate-spin" size={32} color="var(--primary)" />
              </div>
            ) : filteredDoctors.map(doctor => (
              <div 
                key={doctor.id} 
                className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="doctor-info-top">
                  <img src={doctor.image} alt={doctor.name} className="doctor-avatar" />
                  <div className="doctor-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <h3 style={{ margin: 0 }}>{doctor.name}</h3>
                      {doctor.verified && (
                        <CheckCircle2 size={16} color="var(--success)" title="Verified Genuine Facility" />
                      )}
                    </div>
                    {doctor.doctor_in_charge && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600, marginTop: '2px' }}>
                        {doctor.doctor_in_charge}
                      </div>
                    )}
                    <span className="specialty">{doctor.specialty}</span>
                    <div className="rating">
                      <Star size={14} fill="var(--warning)" color="var(--warning)" />
                      <span>{doctor.rating} ({doctor.reviews} patient reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="doctor-info-details">
                  <div className="detail-item">
                    <MapPin size={14} style={{ flexShrink: 0 }} />
                    <span>{doctor.address}</span>
                  </div>
                  <div className="detail-item">
                    <Phone size={14} style={{ flexShrink: 0 }} />
                    <span style={{ color: 'var(--accent)' }}>{doctor.phone}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={14} style={{ flexShrink: 0 }} />
                    <span className="availability">{doctor.availability}</span>
                  </div>
                </div>

                <div className="doctor-card-actions">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDoctor(doctor);
                      if (doctor.lat && doctor.lng) {
                        setCenter({ lat: doctor.lat, lng: doctor.lng });
                      }
                    }}
                  >
                    View on Map
                  </button>
                  <button className="btn btn-sm" onClick={(e) => {
                    e.stopPropagation();
                    handleBook(doctor);
                  }}>
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="map-panel">
          <div className="map-wrapper card" style={{ position: 'relative', zIndex: 1 }}>
            <DoctorMap 
              doctors={filteredDoctors} 
              center={center}
              selectedDoctor={selectedDoctor}
              onSelectDoctor={setSelectedDoctor}
              onBookDoctor={handleBook}
            />
          </div>
        </div>
      </div>

      <BookingModal 
        doctor={activeDoctor} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        user={user}
      />
    </div>
  );
};

export default Appointments;
