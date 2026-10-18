import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon paths via CDN
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored pin with glowing drop shadow
const makeDoctorIcon = (color = '#6366f1', isSelected = false) =>
  new L.DivIcon({
    className: '',
    html: `<div style="
      width: ${isSelected ? '44px' : '36px'};
      height: ${isSelected ? '44px' : '36px'};
      background: ${color};
      border: 3px solid #ffffff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 18px ${isSelected ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'};
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: #ffffff;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>`,
    iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
    iconAnchor: [isSelected ? 22 : 18, isSelected ? 44 : 36],
    popupAnchor: [0, isSelected ? -44 : -36],
  });

// User location icon
const myLocationIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width: 20px; height: 20px;
    background: #06b6d4;
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 0 6px rgba(6,182,212,0.35);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Auto-pan and auto-zoom when a doctor is selected via "View on Map"
function MapController({ center, selectedDoctor }) {
  const map = useMap();

  useEffect(() => {
    if (selectedDoctor && selectedDoctor.lat && selectedDoctor.lng) {
      map.flyTo([selectedDoctor.lat, selectedDoctor.lng], 16, {
        animate: true,
        duration: 1.2
      });
    } else if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], 14);
    }
  }, [center, selectedDoctor, map]);

  return null;
}

const specialtyColors = {
  'Eye': '#06b6d4',
  'Ophthalmology': '#06b6d4',
  'Dental': '#f59e0b',
  'Dentist': '#f59e0b',
  'Hospital': '#ef4444',
  'Clinic': '#10b981',
  'default': '#8b5cf6',
};

const getColor = (specialty = '') => {
  const lower = specialty.toLowerCase();
  if (lower.includes('eye') || lower.includes('ophthal')) return specialtyColors.Eye;
  if (lower.includes('dent') || lower.includes('periodon') || lower.includes('oral')) return specialtyColors.Dental;
  if (lower.includes('hospital')) return specialtyColors.Hospital;
  if (lower.includes('clinic')) return specialtyColors.Clinic;
  return specialtyColors.default;
};

const DoctorMap = ({ doctors, center, selectedDoctor, onSelectDoctor, onBookDoctor }) => {
  const markerRefs = useRef({});

  // Automatically open the popup of the selected doctor
  useEffect(() => {
    if (selectedDoctor && markerRefs.current[selectedDoctor.id]) {
      markerRefs.current[selectedDoctor.id].openPopup();
    }
  }, [selectedDoctor]);

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
      {/* Legend Badge */}
      <div style={{
        position: 'absolute', top: '14px', left: '14px', zIndex: 999,
        background: 'rgba(8, 13, 26, 0.92)', backdropFilter: 'blur(12px)',
        borderRadius: '10px', padding: '0.6rem 0.85rem',
        border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.75rem',
        color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '5px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
          Clinical Specializations
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: specialtyColors.Eye }} />
          <span>Eye &amp; Retina Care</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: specialtyColors.Dental }} />
          <span>Dental &amp; Oral Surgery</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: specialtyColors.Hospital }} />
          <span>Multi-Specialty Hospital</span>
        </div>
      </div>

      <MapContainer
        center={[center.lat, center.lng]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-dark-tiles"
        />

        <MapController center={center} selectedDoctor={selectedDoctor} />

        {/* User location marker + radius circle */}
        <Marker position={[center.lat, center.lng]} icon={myLocationIcon}>
          <Popup>
            <div className="custom-map-popup" style={{ textAlign: 'center', padding: '4px' }}>
              <strong style={{ color: '#06b6d4', fontSize: '0.9rem' }}>📍 Current Location Radius</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#cbd5e1' }}>5 km Diagnostic Care Radius</p>
            </div>
          </Popup>
        </Marker>

        <Circle
          center={[center.lat, center.lng]}
          radius={5000}
          pathOptions={{ color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.04, weight: 1, dashArray: '6' }}
        />

        {/* Real doctor & hospital pins */}
        {doctors.map(doctor => {
          const isSelected = selectedDoctor?.id === doctor.id;
          const color = getColor(doctor.specialty);

          return (
            <Marker
              key={doctor.id}
              ref={(ref) => { if (ref) markerRefs.current[doctor.id] = ref; }}
              position={[doctor.lat, doctor.lng]}
              icon={makeDoctorIcon(color, isSelected)}
              eventHandlers={{
                click: () => onSelectDoctor(doctor),
              }}
            >
              <Popup maxWidth={260} className="doctor-leaflet-popup">
                <div className="custom-map-popup" style={{ padding: '6px 4px' }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#ffffff',
                    marginBottom: '2px',
                    lineHeight: '1.3'
                  }}>
                    {doctor.name}
                  </div>

                  {doctor.doctor_in_charge && (
                    <div style={{
                      fontSize: '0.82rem',
                      color: color,
                      fontWeight: 600,
                      marginBottom: '4px'
                    }}>
                      👨‍⚕️ {doctor.doctor_in_charge}
                    </div>
                  )}

                  <div style={{
                    fontSize: '0.78rem',
                    color: '#94a3b8',
                    marginBottom: '6px'
                  }}>
                    {doctor.specialty}
                  </div>

                  <div style={{
                    fontSize: '0.76rem',
                    color: '#cbd5e1',
                    marginBottom: '6px',
                    lineHeight: '1.4'
                  }}>
                    📍 {doctor.address}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <span style={{ fontSize: '0.76rem', color: '#f59e0b', fontWeight: 600 }}>
                      ⭐ {doctor.rating} ({doctor.reviews})
                    </span>
                    <span style={{
                      background: 'rgba(16,185,129,0.2)',
                      color: '#6ee7b7',
                      padding: '2px 8px',
                      borderRadius: '99px',
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}>
                      {doctor.availability || 'Available Today'}
                    </span>
                  </div>

                  {onBookDoctor && (
                    <button
                      className="btn btn-sm btn-block"
                      style={{
                        padding: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                      onClick={() => onBookDoctor(doctor)}
                    >
                      Book Consultation
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default React.memo(DoctorMap);
