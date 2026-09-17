import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Star, Calendar, Phone, Filter, Loader2 } from 'lucide-react';
import DoctorMap from '../components/DoctorMap';
import BookingModal from '../components/BookingModal';

const Appointments = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: New Delhi, India

  // Try to get user's real location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log("Geolocation denied, using default India location")
      );
    }
  }, []);

  // Fetch real medical facilities from OpenStreetMap (Overpass API)
  useEffect(() => {
    const fetchRealDoctors = async () => {
      setLoading(true);
      try {
        // Query Overpass API for doctors, hospitals, and clinics near the center
        const query = `
          [out:json];
          (
            node["amenity"~"doctors|hospital|clinic"](around:5000, ${center.lat}, ${center.lng});
            way["amenity"~"doctors|hospital|clinic"](around:5000, ${center.lat}, ${center.lng});
          );
          out center;
        `;
        
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query
        });
        
        const data = await response.json();
        
        const realDoctors = data.elements.map((el, index) => ({
          id: el.id,
          name: el.tags.name || `Medical Center ${index + 1}`,
          specialty: el.tags.amenity === 'hospital' ? 'General Hospital' : 
                     el.tags['healthcare:specialty'] || el.tags.amenity.charAt(0).toUpperCase() + el.tags.amenity.slice(1),
          rating: (4 + Math.random()).toFixed(1),
          reviews: Math.floor(Math.random() * 200) + 10,
          address: el.tags['addr:street'] ? `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street']}` : "Nearby location",
          phone: el.tags.phone || el.tags['contact:phone'] || "+1 (555) 000-0000",
          lat: el.lat || el.center.lat,
          lng: el.lon || el.center.lon,
          image: `https://images.unsplash.com/photo-${['1559839734-2b71f1536783', '1612349317150-e413f6a5b16d', '1594824476967-48c8b964273f', '1622253692010-333f2da6031d'][index % 4]}?auto=format&fit=crop&q=80&w=200&h=200`,
          availability: Math.random() > 0.5 ? "Available Today" : "Next: Tomorrow"
        }));

        setDoctors(realDoctors);
      } catch (error) {
        console.error("Error fetching data from Overpass:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealDoctors();
  }, [center]);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = (doctor) => {
    setActiveDoctor(doctor);
    setIsBookingOpen(true);
  };

  return (
    <div className="appointments-page animate-fade-in">
      <div className="page-header-flex">
        <h1 className="page-title">Find Real Facilities (Free Map)</h1>
        <div className="search-bar-container">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search real nearby medical centers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="filter-btn">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="appointments-grid">
        <div className="doctors-list-panel">
          <div className="results-count">
            {loading ? "Searching for nearby doctors..." : `${filteredDoctors.length} real locations found near you`}
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
                    <h3>{doctor.name}</h3>
                    <span className="specialty">{doctor.specialty}</span>
                    <div className="rating">
                      <Star size={14} fill="var(--warning)" color="var(--warning)" />
                      <span>{doctor.rating} ({doctor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="doctor-info-details">
                  <div className="detail-item">
                    <MapPin size={14} />
                    <span>{doctor.address}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={14} />
                    <span className="availability">{doctor.availability}</span>
                  </div>
                </div>

                <div className="doctor-card-actions">
                  <button className="btn btn-secondary btn-sm">Profile</button>
                  <button className="btn btn-sm" onClick={(e) => {
                    e.stopPropagation();
                    handleBook(doctor);
                  }}>
                    Book Now
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
