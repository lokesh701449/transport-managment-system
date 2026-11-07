import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { FleetMetricsCards } from './components/kpi/FleetMetricsCards';
import { FleetRoster } from './components/fleet/FleetRoster';
import { LiveOperationsMap } from './components/map/LiveOperationsMap';
import { DispatchModal } from './components/modals/DispatchModal';
import { VehicleDetailsDrawer } from './components/drawer/VehicleDetailsDrawer';
import { DriverCallModal } from './components/modals/DriverCallModal';
import { ActiveTripsView } from './components/views/ActiveTripsView';
import { DriversView } from './components/views/DriversView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { ReportsView } from './components/views/ReportsView';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { Vehicle, Driver, DispatchFormData, VehicleAlert } from './types';
import { INITIAL_VEHICLES, INITIAL_DRIVERS, POPULAR_LOCATIONS } from './data/mockData';

export function App() {
  // Master State
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeKpiFilter, setActiveKpiFilter] = useState<string>('all');

  // Modals & Drawers
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [preSelectedDispatchVehicleId, setPreSelectedDispatchVehicleId] = useState<string | undefined>();
  const [selectedVehicleForDrawer, setSelectedVehicleForDrawer] = useState<Vehicle | null>(null);

  // Call Driver Modal
  const [callModalState, setCallModalState] = useState<{
    isOpen: boolean;
    driverName: string;
    driverPhone: string;
  }>({
    isOpen: false,
    driverName: '',
    driverPhone: ''
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Telemetry Simulation toggle
  const [isSimulating, setIsSimulating] = useState(true);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // auto dismiss after 5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Real-time Telemetry Simulation Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          if (vehicle.status !== 'running') return vehicle;

          // Fluctuate speed subtly (+/- 1-3 km/h, keep between 48 and 74)
          const speedDelta = (Math.random() - 0.48) * 3;
          let newSpeed = Math.round(Math.min(76, Math.max(48, vehicle.liveSpeedKmh + speedDelta)));

          // Increment odometer by ~0.04 km
          const newOdo = vehicle.odometerKm + 0.04;

          // Increment trip progress if in transit
          let updatedTrip = vehicle.currentTrip;
          let newCoords = vehicle.coordinates;

          if (updatedTrip) {
            const nextProgress = Math.min(99.5, updatedTrip.progressPercent + 0.15);

            // Slightly nudge coordinates towards destination
            const [destLat, destLng] = updatedTrip.destinationCoords;
            const [curLat, curLng] = vehicle.coordinates;
            const latStep = (destLat - curLat) * 0.003;
            const lngStep = (destLng - curLng) * 0.003;
            newCoords = [curLat + latStep, curLng + lngStep];

            updatedTrip = {
              ...updatedTrip,
              progressPercent: Math.round(nextProgress * 10) / 10,
              currentCoords: newCoords
            };
          }

          return {
            ...vehicle,
            liveSpeedKmh: newSpeed,
            odometerKm: Math.round(newOdo * 10) / 10,
            coordinates: newCoords,
            currentTrip: updatedTrip
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Sync selected vehicle drawer with live updates
  useEffect(() => {
    if (selectedVehicleForDrawer) {
      const updated = vehicles.find((v) => v.id === selectedVehicleForDrawer.id);
      if (updated) {
        setSelectedVehicleForDrawer(updated);
      }
    }
  }, [vehicles]);

  // Open Dispatch Modal handler
  const handleOpenDispatchModal = (vehicleId?: string) => {
    setPreSelectedDispatchVehicleId(vehicleId);
    setIsDispatchModalOpen(true);
  };

  // Form Submission handler for Dispatch
  const handleDispatchSuccess = (formData: DispatchFormData) => {
    const assignedDriver = drivers.find((d) => d.id === formData.driverId);
    const vehicle = vehicles.find((v) => v.id === formData.vehicleId);

    if (!vehicle || !assignedDriver) return;

    // Find approximate coords from presets
    const originLoc = POPULAR_LOCATIONS.find((l) => l.name === formData.origin) || {
      coords: vehicle.coordinates
    };
    const destLoc = POPULAR_LOCATIONS.find((l) => l.name === formData.destination) || {
      coords: [16.5062, 80.6480] as [number, number]
    };

    // Update vehicle to running
    const updatedVehicles = vehicles.map((v) => {
      if (v.id === formData.vehicleId) {
        return {
          ...v,
          status: 'running' as const,
          currentPayloadTons: formData.cargoWeightTons,
          liveSpeedKmh: 58,
          driver: {
            ...assignedDriver,
            dutyStatus: 'On Duty' as const,
            assignedVehicleId: v.id
          },
          currentTrip: {
            tripId: `TRP-${Math.floor(1000 + Math.random() * 9000)}`,
            consignmentRef: formData.consignmentRef,
            cargoDescription: formData.cargoDescription,
            cargoWeightTons: formData.cargoWeightTons,
            origin: formData.origin,
            destination: formData.destination,
            originCoords: originLoc.coords,
            destinationCoords: destLoc.coords,
            currentCoords: originLoc.coords,
            departureTime: formData.departureTime,
            estimatedArrival: formData.estimatedArrival,
            progressPercent: 2,
            routeWaypoints: [originLoc.coords, destLoc.coords]
          }
        };
      }
      return v;
    });

    // Update driver dutyStatus
    const updatedDrivers = drivers.map((d) => {
      if (d.id === formData.driverId) {
        return {
          ...d,
          dutyStatus: 'On Duty' as const,
          assignedVehicleId: formData.vehicleId
        };
      }
      return d;
    });

    setVehicles(updatedVehicles);
    setDrivers(updatedDrivers);

    addToast(
      'success',
      'Freight Trip Dispatched',
      `${formData.vehicleId} (${vehicle.plate}) en route to ${formData.destination} piloted by ${assignedDriver.name}.`
    );
  };

  // Send to Maintenance handler
  const handleSendToMaintenance = (vehicleId: string) => {
    const truck = vehicles.find((v) => v.id === vehicleId);
    if (!truck) return;

    const newMaintenanceRecord = {
      id: `ML-${Math.floor(1000 + Math.random() * 9000)}`,
      date: '2026-11-07',
      type: 'Brake Overhaul' as const,
      cost: 21500,
      workshop: 'Regional Fleet Workshop Depot',
      status: 'In Progress' as const,
      notes: 'Grounded for diagnostic triage and preventive maintenance check.'
    };

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            status: 'maintenance',
            liveSpeedKmh: 0,
            currentPayloadTons: 0,
            currentTrip: null,
            maintenanceLogs: [newMaintenanceRecord, ...v.maintenanceLogs]
          };
        }
        return v;
      })
    );

    addToast(
      'warning',
      'Vehicle Grounded for Maintenance',
      `${truck.id} (${truck.plate}) transitioned to Workshop Bay for service.`
    );
  };

  // Complete Maintenance handler
  const handleCompleteMaintenance = (vehicleId: string) => {
    const truck = vehicles.find((v) => v.id === vehicleId);
    if (!truck) return;

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          // Clear breakdown alerts
          const remainingAlerts = v.alerts.filter((a) => a.type !== 'breakdown');

          const updatedLogs = v.maintenanceLogs.map((log, idx) =>
            idx === 0 ? { ...log, status: 'Completed' as const } : log
          );

          return {
            ...v,
            status: 'idle',
            lastServiceDate: '2026-11-07',
            engineStatus: 'Optimal',
            coolantTempC: 32,
            alerts: remainingAlerts,
            maintenanceLogs: updatedLogs
          };
        }
        return v;
      })
    );

    addToast(
      'success',
      'Service Completed & Released',
      `${truck.id} cleared all workshop diagnostics and returned to Idle Standby.`
    );
  };

  // Driver Call handler
  const handleCallDriver = (driverName: string, phone: string) => {
    setCallModalState({
      isOpen: true,
      driverName,
      driverPhone: phone
    });
  };

  // All active alerts for dropdown
  const allAlerts = vehicles.flatMap((v) => v.alerts);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Enterprise Header */}
      <Header
        onOpenDispatchModal={() => handleOpenDispatchModal()}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        alerts={allAlerts}
        totalAlertsCount={allAlerts.length}
      />

      {/* Main Workspace with Collapsible Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          runningCount={vehicles.filter((v) => v.status === 'running').length}
          idleCount={vehicles.filter((v) => v.status === 'idle').length}
          maintenanceCount={vehicles.filter((v) => v.status === 'maintenance').length}
          alertCount={allAlerts.length}
        />

        {/* Primary View Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* TAB 1: DASHBOARD (Overview) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Top-Level KPI Summary Cards */}
              <FleetMetricsCards
                vehicles={vehicles}
                activeFilter={activeKpiFilter}
                onFilterChange={setActiveKpiFilter}
              />

              {/* Live Operations Map Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                    Live Corridor Map & Active Telemetry Radar
                  </h2>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
                  >
                    Expand Full Map View ➔
                  </button>
                </div>
                <LiveOperationsMap
                  vehicles={vehicles}
                  onSelectVehicle={(v) => setSelectedVehicleForDrawer(v)}
                  onCallDriver={handleCallDriver}
                />
              </div>

              {/* Fleet Roster (Table/Grid) */}
              <div className="space-y-2">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Fleet Roster & Telemetry Manifest
                </h2>
                <FleetRoster
                  vehicles={vehicles}
                  onSelectVehicle={(v) => setSelectedVehicleForDrawer(v)}
                  onOpenDispatchModalWithVehicle={(vId) => handleOpenDispatchModal(vId)}
                  onSendToMaintenance={handleSendToMaintenance}
                  onCallDriver={handleCallDriver}
                  activeStatusFilter={activeKpiFilter}
                  onStatusFilterChange={setActiveKpiFilter}
                />
              </div>
            </div>
          )}

          {/* TAB 2: FLEET ROSTER */}
          {activeTab === 'fleet' && (
            <div className="space-y-4">
              <FleetMetricsCards
                vehicles={vehicles}
                activeFilter={activeKpiFilter}
                onFilterChange={setActiveKpiFilter}
              />
              <FleetRoster
                vehicles={vehicles}
                onSelectVehicle={(v) => setSelectedVehicleForDrawer(v)}
                onOpenDispatchModalWithVehicle={(vId) => handleOpenDispatchModal(vId)}
                onSendToMaintenance={handleSendToMaintenance}
                onCallDriver={handleCallDriver}
                activeStatusFilter={activeKpiFilter}
                onStatusFilterChange={setActiveKpiFilter}
              />
            </div>
          )}

          {/* TAB 3: LIVE OPERATIONS MAP */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                <div>
                  <h2 className="text-base font-bold text-white">Full-Screen Corridor Operations Map</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live telemetry tracking, waypoints, and automated GPS geofencing across freight routes
                  </p>
                </div>
                <button
                  onClick={() => handleOpenDispatchModal()}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  + New Dispatch
                </button>
              </div>
              <LiveOperationsMap
                vehicles={vehicles}
                onSelectVehicle={(v) => setSelectedVehicleForDrawer(v)}
                onCallDriver={handleCallDriver}
              />
            </div>
          )}

          {/* TAB 4: ACTIVE TRIPS */}
          {activeTab === 'trips' && (
            <ActiveTripsView
              vehicles={vehicles}
              onSelectVehicle={(v) => setSelectedVehicleForDrawer(v)}
              onCallDriver={handleCallDriver}
              onOpenDispatchModal={() => handleOpenDispatchModal()}
            />
          )}

          {/* TAB 5: DRIVERS & CREW */}
          {activeTab === 'drivers' && (
            <DriversView
              drivers={drivers}
              vehicles={vehicles}
              onCallDriver={handleCallDriver}
              onSelectVehicle={(v) => setSelectedVehicleForDrawer(v)}
            />
          )}

          {/* TAB 6: MAINTENANCE & HEALTH */}
          {activeTab === 'maintenance' && (
            <MaintenanceView
              vehicles={vehicles}
              onSelectVehicle={(v) => setSelectedVehicleForDrawer(v)}
              onCompleteMaintenance={handleCompleteMaintenance}
            />
          )}

          {/* TAB 7: REPORTS & ANALYTICS */}
          {activeTab === 'reports' && <ReportsView vehicles={vehicles} />}
        </main>
      </div>

      {/* Slide-over Vehicle Details & Telemetry Drawer */}
      <VehicleDetailsDrawer
        vehicle={selectedVehicleForDrawer}
        onClose={() => setSelectedVehicleForDrawer(null)}
        onSendToMaintenance={handleSendToMaintenance}
        onCompleteMaintenance={handleCompleteMaintenance}
        onOpenDispatchModalWithVehicle={(vId) => handleOpenDispatchModal(vId)}
        onCallDriver={handleCallDriver}
      />

      {/* New Trip Dispatch Modal */}
      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        vehicles={vehicles}
        drivers={drivers}
        preSelectedVehicleId={preSelectedDispatchVehicleId}
        onDispatchSuccess={handleDispatchSuccess}
      />

      {/* VoIP Driver Phone Call Simulation Modal */}
      <DriverCallModal
        isOpen={callModalState.isOpen}
        driverName={callModalState.driverName}
        driverPhone={callModalState.driverPhone}
        onClose={() => setCallModalState({ isOpen: false, driverName: '', driverPhone: '' })}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
