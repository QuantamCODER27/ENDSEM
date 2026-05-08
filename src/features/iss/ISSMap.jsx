import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useData } from '../../context/DataContext';

// Custom ISS Icon
const issIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Component to handle auto-panning
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const ISSMap = () => {
  const { issData } = useData();
  const { location, history } = issData;

  if (!location) return <div className="flex-center h-full">Loading Map...</div>;

  const trajectory = history.slice(-15).map(pos => [pos.lat, pos.lng]);
  const center = [location.lat, location.lng];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={center} 
        zoom={3} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ChangeView center={center} />

        {/* Trajectory Path */}
        <Polyline positions={trajectory} color="#6366f1" weight={3} opacity={0.6} dashArray="5, 10" />

        {/* Current ISS Position */}
        <Marker position={center} icon={issIcon}>
          <Popup>
            <div className="map-popup">
              <strong>ISS Current Location</strong><br />
              Lat: {location.lat.toFixed(4)}<br />
              Lng: {location.lng.toFixed(4)}
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      <style jsx>{`
        .map-popup {
          font-family: var(--font-main);
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default ISSMap;
