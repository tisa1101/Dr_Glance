import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Using CDN for icons to avoid Vite build issues with node_modules assets
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const doctorIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function ChangeView({ center }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
}

const DoctorMap = ({ doctors, center, onSelectDoctor }) => {
  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '20px', overflow: 'hidden' }}>
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={14} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <ChangeView center={center} />

        {doctors.map(doctor => (
          <Marker 
            key={doctor.id} 
            position={[doctor.lat, doctor.lng]}
            icon={doctorIcon}
            eventHandlers={{
              click: () => onSelectDoctor(doctor),
            }}
          >
            <Popup>
              <div className="map-info-window" style={{ color: '#333' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{doctor.name}</h3>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem' }}>{doctor.specialty}</p>
                <button 
                  className="btn btn-sm" 
                  style={{ width: '100%', padding: '5px', fontSize: '0.8rem' }}
                  onClick={() => onSelectDoctor(doctor)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default React.memo(DoctorMap);
