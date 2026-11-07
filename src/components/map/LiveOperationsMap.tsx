import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Phone, 
  ArrowUpRight, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  AlertTriangle, 
  Gauge, 
  MapPin, 
  CheckCircle,
  Truck
} from 'lucide-react';
import { Vehicle } from '../../types';
import { getStatusBadgeConfig } from '../../utils/formatters';

interface LiveOperationsMapProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onCallDriver: (driverName: string, phone: string) => void;
}

export const LiveOperationsMap: React.FC<LiveOperationsMapProps> = ({
  vehicles,
  onSelectVehicle,
  onCallDriver
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);

  const [mapFilter, setMapFilter] = useState<'all' | 'running' | 'alerts' | 'idle'>('all');
  const [selectedPinVehicle, setSelectedPinVehicle] = useState<Vehicle | null>(null);

  // Filter vehicles for map
  const displayVehicles = vehicles.filter((v) => {
    if (mapFilter === 'running') return v.status === 'running';
    if (mapFilter === 'alerts') return v.alerts.length > 0;
    if (mapFilter === 'idle') return v.status === 'idle';
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center roughly around South-Central India transport corridor (Hyderabad - Vijayawada - Bengaluru)
      const map = L.map(mapContainerRef.current, {
        center: [16.5, 79.5],
        zoom: 6.5,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Dark Matter Tiles (stunning dark theme for enterprise logistics)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: '© OpenStreetMap | CartoDB' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      const routesGroup = L.layerGroup().addTo(map);

      markersLayerRef.current = markersGroup;
      routesLayerRef.current = routesGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Polylines whenever displayVehicles change or mapFilter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const routesGroup = routesLayerRef.current;

    if (!map || !markersGroup || !routesGroup) return;

    markersGroup.clearLayers();
    routesGroup.clearLayers();

    displayVehicles.forEach((vehicle) => {
      const statusCfg = getStatusBadgeConfig(vehicle.status);
      const isRunning = vehicle.status === 'running';
      const hasCritical = vehicle.alerts.some((a) => a.severity === 'critical');

      // Create Custom HTML Pin Icon
      const pinColor = hasCritical ? '#f43f5e' : statusCfg.colorHex;
      const html = `
        <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
          ${
            isRunning
              ? `<div class="pulse-ring" style="border: 2px solid ${pinColor}; background: ${pinColor}20;"></div>`
              : ''
          }
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-900 shadow-xl" style="background: ${pinColor};">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18" r="2"/>
              <circle cx="7" cy="18" r="2"/>
            </svg>
          </div>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-[10px] font-mono font-bold text-slate-200 px-1.5 py-0.5 rounded border border-slate-700 shadow pointer-events-none">
            ${vehicle.id}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-truck-marker',
        html,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(vehicle.coordinates, { icon: customIcon });

      marker.on('click', () => {
        setSelectedPinVehicle(vehicle);
        map.panTo(vehicle.coordinates, { animate: true });
      });

      marker.addTo(markersGroup);

      // Draw polyline routes for in-transit vehicles
      if (vehicle.currentTrip && vehicle.currentTrip.routeWaypoints.length > 1) {
        // Full route line in subtle cyan
        L.polyline(vehicle.currentTrip.routeWaypoints, {
          color: '#0d9488',
          weight: 3,
          opacity: 0.6,
          dashArray: '6, 8'
        }).addTo(routesGroup);

        // Active segment (from origin to current location) in bright teal
        const originCoords = vehicle.currentTrip.originCoords;
        L.polyline([originCoords, vehicle.coordinates], {
          color: '#14b8a6',
          weight: 4,
          opacity: 0.95
        }).addTo(routesGroup);
      }
    });
  }, [displayVehicles]);

  // Center on fleet
  const handleCenterFleet = () => {
    if (!mapInstanceRef.current || displayVehicles.length === 0) return;
    const bounds = L.latLngBounds(displayVehicles.map((v) => v.coordinates));
    mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 10 });
  };

  return (
    <div className="relative w-full h-[640px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Filter Pills */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl backdrop-blur-md shadow-xl text-xs">
          <button
            onClick={() => setMapFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              mapFilter === 'all'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Units ({vehicles.length})
          </button>
          <button
            onClick={() => setMapFilter('running')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              mapFilter === 'running'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Running Only ({vehicles.filter((v) => v.status === 'running').length})
          </button>
          <button
            onClick={() => setMapFilter('alerts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              mapFilter === 'alerts'
                ? 'bg-rose-500 text-white font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Alerts Only ({vehicles.filter((v) => v.alerts.length > 0).length})
          </button>
          <button
            onClick={() => setMapFilter('idle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              mapFilter === 'idle'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Idle ({vehicles.filter((v) => v.status === 'idle').length})
          </button>
        </div>

        {/* Map View Helpers */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleCenterFleet}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 backdrop-blur-md shadow-xl transition-all"
            title="Fit all displayed vehicles in view"
          >
            <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Fit Bounds</span>
          </button>
        </div>
      </div>

      {/* Floating Bottom Left: Corridor Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-4 bg-slate-900/90 border border-slate-800/90 px-3.5 py-2 rounded-xl backdrop-blur-md shadow-xl text-xs text-slate-300 pointer-events-auto">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>In-Transit</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Idle Depot</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span>Maintenance</span>
        </div>
        <div className="h-3 w-px bg-slate-700" />
        <span className="text-[11px] text-slate-400 font-mono">Freight Corridors: NH-65, NH-44, NH-16</span>
      </div>

      {/* Quick Pin Details Popup Card (overlay on map) */}
      {selectedPinVehicle && (
        <div className="absolute bottom-4 right-4 z-20 w-80 md:w-96 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl p-4 backdrop-blur-md animate-in slide-in-from-bottom-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-sm">{selectedPinVehicle.id}</span>
                <span className="font-mono text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  {selectedPinVehicle.plate}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedPinVehicle.model}</p>
            </div>
            <button
              onClick={() => setSelectedPinVehicle(null)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 my-3 text-xs">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Speedometer</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-white text-sm mt-0.5">
                <Gauge className="w-4 h-4 text-teal-400" />
                <span>{selectedPinVehicle.liveSpeedKmh} km/h</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Status</span>
              <div className="text-sm font-bold capitalize mt-0.5 text-teal-400">
                {selectedPinVehicle.status}
              </div>
            </div>
          </div>

          {/* Route info */}
          {selectedPinVehicle.currentTrip ? (
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-3 text-xs">
              <div className="flex justify-between items-center text-slate-200 font-semibold mb-1">
                <span>{selectedPinVehicle.currentTrip.origin.split(' ')[0]}</span>
                <span className="text-teal-400 text-xs">➔</span>
                <span>{selectedPinVehicle.currentTrip.destination.split(' ')[0]}</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full"
                  style={{ width: `${selectedPinVehicle.currentTrip.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>{selectedPinVehicle.currentTrip.progressPercent}% complete</span>
                <span className="text-emerald-400">{selectedPinVehicle.currentTrip.estimatedArrival}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 mb-3 text-xs text-slate-400 text-center">
              Stationary at Depot Yard / Ready
            </div>
          )}

          {/* Driver & Action buttons */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
            {selectedPinVehicle.driver ? (
              <div className="text-xs">
                <div className="font-semibold text-slate-200">{selectedPinVehicle.driver.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{selectedPinVehicle.driver.phone}</div>
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">No driver assigned</span>
            )}

            <div className="flex items-center gap-2">
              {selectedPinVehicle.driver && (
                <button
                  onClick={() =>
                    onCallDriver(selectedPinVehicle.driver!.name, selectedPinVehicle.driver!.phone)
                  }
                  className="p-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 transition-colors"
                  title="Call driver"
                >
                  <Phone className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {
                  onSelectVehicle(selectedPinVehicle);
                  setSelectedPinVehicle(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
              >
                <span>Telemetry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

