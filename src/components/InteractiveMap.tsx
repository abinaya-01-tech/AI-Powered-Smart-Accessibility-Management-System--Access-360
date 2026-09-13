import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LocationItem } from '../types';
import { ScoreBadge } from './ScoreBadge';
import { CheckCircle2, AlertTriangle, ExternalLink, MapPin, Layers, X, Navigation } from 'lucide-react';

interface InteractiveMapProps {
  locations: LocationItem[];
  selectedLocation: LocationItem | null;
  onSelectLocation: (loc: LocationItem | null) => void;
  center?: L.LatLngTuple;
  zoom?: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  center = [37.7749, -122.4194] as L.LatLngTuple,
  zoom = 14
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [mapType, setMapType] = useState<'osm' | 'osm_satellite'>('osm');

  // Helper to generate accessible pin colors
  const getPinColor = (category: string) => {
    switch (category) {
      case 'Highly Accessible':
        return '#059669'; // Emerald
      case 'Accessible':
        return '#2563eb'; // Blue
      case 'Partially Accessible':
        return '#d97706'; // Amber
      case 'Poor Accessibility':
        return '#dc2626'; // Red
      default:
        return '#4b5563';
    }
  };

  const createCustomIcon = (loc: LocationItem, isSelected: boolean) => {
    const color = getPinColor(loc.accessibilityCategory);
    const size = isSelected ? 38 : 30;
    const svgIcon = `
      <svg width="${size}" height="${size + 10}" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.16344 0 0 7.16344 0 16C0 27.5 16 42 16 42C16 42 32 27.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="${color}" stroke="#ffffff" stroke-width="2.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"/>
        <circle cx="16" cy="15" r="9" fill="#ffffff"/>
        <text x="16" y="19" font-size="10" font-family="sans-serif" font-weight="bold" fill="${color}" text-anchor="middle">${loc.accessibilityScore}</text>
      </svg>
    `;

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: svgIcon,
      iconSize: [size, size + 10],
      iconAnchor: [size / 2, size + 10],
      popupAnchor: [0, -size]
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true
      });

      // Default OpenStreetMap standard tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive during simple state toggles, destroy on full unmount
    };
  }, []);

  // Update tile layer if changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (mapType === 'osm_satellite') {
      // High contrast carto layer for accessibility
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB &copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);
    }
  }, [mapType]);

  // Sync markers when locations or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker: L.Marker) => marker.remove());
    markersRef.current = {};

    locations.forEach(loc => {
      const isSelected = selectedLocation?.id === loc.id;
      const icon = createCustomIcon(loc, isSelected);

      const marker = L.marker([loc.latitude, loc.longitude], { icon }).addTo(map);

      marker.on('click', () => {
        onSelectLocation(loc);
        map.panTo([loc.latitude, loc.longitude], { animate: true });
      });

      markersRef.current[loc.id] = marker;
    });
  }, [locations, selectedLocation]);

  // Pan to selected location
  useEffect(() => {
    if (selectedLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedLocation.latitude, selectedLocation.longitude], 15, {
        animate: true
      });
    }
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-slate-300 shadow-md">
      {/* Map layer toggle & controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2 bg-white/95 backdrop-blur-xs p-2 rounded-xl border border-slate-200 shadow-lg text-xs font-semibold">
        <div className="flex items-center gap-1.5 px-2 py-1 text-slate-600 border-b border-slate-100">
          <Layers className="w-3.5 h-3.5" />
          <span>Map Provider</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setMapType('osm')}
            className={`px-2.5 py-1.5 rounded-lg transition ${
              mapType === 'osm' ? 'bg-blue-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            OpenStreetMap
          </button>
          <button
            onClick={() => setMapType('osm_satellite')}
            className={`px-2.5 py-1.5 rounded-lg transition ${
              mapType === 'osm_satellite' ? 'bg-blue-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Carto Voyager
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-lg text-xs">
        <span className="font-bold text-slate-800 block mb-2 uppercase tracking-wider text-[11px]">
          Accessibility Legend
        </span>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-slate-700 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            <span>80–100: High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span>60–79: Accessible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>40–59: Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
            <span>0–39: Poor</span>
          </div>
        </div>
      </div>

      {/* Map canvas container */}
      <div ref={mapContainerRef} className="w-full h-full" tabIndex={0} aria-label="Interactive Accessibility Map" />

      {/* Selected Location Details Card Popup */}
      {selectedLocation && (
        <div className="absolute top-4 left-4 max-w-sm w-full z-[1001] bg-white rounded-2xl p-5 shadow-2xl border border-slate-300 animate-in fade-in slide-in-from-left-4 duration-200">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                {selectedLocation.id}
              </span>
              <h4 className="font-bold text-base text-slate-900 leading-tight">
                {selectedLocation.name}
              </h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                {selectedLocation.address}
              </p>
            </div>
            <button
              onClick={() => onSelectLocation(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              aria-label="Close location detail"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="my-3">
            <ScoreBadge
              score={selectedLocation.accessibilityScore}
              category={selectedLocation.accessibilityCategory}
              size="sm"
            />
          </div>

          <div className="text-xs space-y-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-700 block">Verified Infrastructure:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <span className={`inline-flex items-center gap-1 ${selectedLocation.features.ramp ? 'text-emerald-700 font-semibold' : 'text-slate-400 line-through'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Ramp
              </span>
              <span className={`inline-flex items-center gap-1 ${selectedLocation.features.lift ? 'text-emerald-700 font-semibold' : 'text-slate-400 line-through'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Lift / Elevator
              </span>
              <span className={`inline-flex items-center gap-1 ${selectedLocation.features.accessibleToilet ? 'text-emerald-700 font-semibold' : 'text-slate-400 line-through'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Accessible Toilet
              </span>
              <span className={`inline-flex items-center gap-1 ${selectedLocation.features.handrail ? 'text-emerald-700 font-semibold' : 'text-slate-400 line-through'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Handrail
              </span>
            </div>

            {selectedLocation.features.stairs && (
              <div className="pt-2 text-rose-700 flex items-center gap-1 border-t border-slate-200">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Stairs detected at entry / perimeter</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition"
            >
              <Navigation className="w-3.5 h-3.5" />
              Google Maps Route
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
