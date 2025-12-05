'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface Geoloc {
  latitude: number;
  longitude: number;
}

interface Property {
  id: number;
  nom: string;
  geolocalisation?: Geoloc | null;
}

interface IconDefaultWithGetIcon extends L.Icon.Default {
  _getIconUrl?: () => void;
}

// Fix du marker par défaut Leaflet avec Next.js
delete (L.Icon.Default.prototype as IconDefaultWithGetIcon)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

interface Props {
  properties: Property[];
  center?: Geoloc;
  zoom?: number;
}

export default function Map({ properties, center = { latitude: 6.1319, longitude: 1.2227 }, zoom = 13 }: Props) {

  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={zoom}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {properties.map((p) =>
        p.geolocalisation ? (
          <Marker
            key={p.id}
            position={[p.geolocalisation.latitude, p.geolocalisation.longitude]}
          >
            <Popup>
              {p.nom}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
