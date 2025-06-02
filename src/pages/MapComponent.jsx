import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Optional: Fix missing marker icons in some builds
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const locations = [
    {
      name: 'Delhi',
      lat: 28.6139,
      lng: 77.2090,
      likes: '4.1k',
      address: '1/4, Connaught Place',
      capacity: '123,421',
    },
    {
      name: 'Mumbai',
      lat: 19.0760,
      lng: 72.8777,
      likes: '3.8k',
      address: '12/B, Marine Drive',
      capacity: '95,230',
    },
    {
      name: 'Bangalore',
      lat: 12.9716,
      lng: 77.5946,
      likes: '5.2k',
      address: '44, Indiranagar',
      capacity: '110,054',
    },
  ];
const MapComponent = () => {
  return (
    <MapContainer
      center={[39.8283, -98.5795]} // Center of USA
      zoom={4}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {locations.map((loc, idx) => (
        <Marker key={idx} position={[loc.lat, loc.lng]}>
        <Popup>
            <strong>{loc.name}</strong><br />
            👍 Likes: {loc.likes}<br />
            📍 Address: {loc.address}<br />
            🧍 Capacity: {loc.capacity}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;