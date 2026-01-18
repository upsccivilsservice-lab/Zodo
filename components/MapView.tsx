
import React, { useEffect, useRef } from 'react';
import { User, Location } from '../types';
import L from 'leaflet';

interface MapViewProps {
  currentUser: User;
  nearbyUsers: User[];
  onSelectUser: (user: User) => void;
}

const MapView: React.FC<MapViewProps> = ({ currentUser, nearbyUsers, onSelectUser }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([currentUser.location.lat, currentUser.location.lng], 15);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView([currentUser.location.lat, currentUser.location.lng]);
    }

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add 1km range circle
    L.circle([currentUser.location.lat, currentUser.location.lng], {
      radius: 1000,
      color: '#f43f5e',
      fillColor: '#f43f5e',
      fillOpacity: 0.05,
      weight: 1,
      dashArray: '5, 5'
    }).addTo(mapRef.current);

    // Add User Marker (Me)
    const userIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="w-8 h-8 rounded-full ${currentUser.isGhostMode ? 'bg-slate-400' : 'bg-rose-500'} border-4 border-white shadow-lg flex items-center justify-center text-white">
               ${!currentUser.isGhostMode ? '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>' : ''}
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    L.marker([currentUser.location.lat, currentUser.location.lng], { icon: userIcon }).addTo(mapRef.current);

    // Add Nearby Users
    nearbyUsers.forEach((user) => {
      if (user.isGhostMode) return;
      const nearbyIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="relative w-10 h-10 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer">
                <img src="${user.avatar}" class="w-full h-full object-cover" />
              </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      L.marker([user.location.lat, user.location.lng], { icon: nearbyIcon })
        .addTo(mapRef.current!)
        .on('click', () => onSelectUser(user));
    });

  }, [currentUser, nearbyUsers, onSelectUser]);

  return (
    <div className="flex-1 w-full h-full p-4 relative overflow-hidden">
      <div ref={containerRef} className="w-full h-full shadow-inner bg-rose-50" />
      <div className="absolute top-8 left-8 z-[1000] glass px-4 py-2 rounded-2xl flex items-center gap-2 pointer-events-none">
        <div className={`w-3 h-3 ${currentUser.isGhostMode ? 'bg-slate-400' : 'bg-rose-500 animate-pulse'} rounded-full`} />
        <span className="text-sm font-bold text-rose-900">
          {currentUser.isGhostMode ? 'Ghost Mode Active' : '1km Reach'}
        </span>
      </div>
    </div>
  );
};

export default MapView;
