import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { FleetMetricsCards } from './components/kpi/FleetMetricsCards';
import { FleetRoster } from './components/fleet/FleetRoster';
import { LiveOperationsMap } from './components/map/LiveOperationsMap';
import { DispatchModal } from './components/modals/DispatchModal';
import { VehicleDetailsDrawer } from './components/drawer/VehicleDetailsDrawer';
import { DriverCallModal } from './components/modals/DriverCallModal';
import { EWayBillModal } from './components/modals/EWayBillModal';
import { SimulationControlBar } from './components/common/SimulationControlBar';
import { ActiveTripsView } from './components/views/ActiveTripsView';
import { DriversView } from './components/views/DriversView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { ReportsView } from './components/views/ReportsView';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { Vehicle, Driver, DispatchFormData, CompletedTrip } from './types';
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

  // E-Way Bill Modal State
  const [eWayBillVehicle, setEWayBillVehicle] = useState<Vehicle | null>(null);

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

  // Field Simulation 1: Arrival at destination
  const handleSimulateArrival = () => {
    const runningTruck = vehicles.find((v) => v.status === 'running');
    if (!runningTruck || !runningTruck.currentTrip) {
      addToast('info', 'No Active Deliveries', 'All trucks are presently stationary in yards.');
      return;
    }

    const completedRun: CompletedTrip = {
      id: `TH-${Math.floor(1000 + Math.random() * 9000)}`,
      route: `${runningTruck.currentTrip.origin.split(' ')[0]} ➔ ${runningTruck.currentTrip.destination.split(' ')[0]}`,
      origin: runningTruck.currentTrip.origin,
      destination: runningTruck.currentTrip.destination,
      distanceKm: 275,
      durationHours: 5.8,
      completedAt: 'Just now',
      fuelConsumedLiters: 78,
      driverName: runningTruck.driver?.name || 'Assigned Driver',
      status: 'Delivered'
    };

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === runningTruck.id) {
          return {
            ...v,
            status: 'idle',
            liveSpeedKmh: 0,
            currentPayloadTons: 0,
            currentTrip: null,
            tripHistory: [completedRun, ...v.tripHistory]
          };
        }
        return v;
      })
    );

    addToast(
      'success',
      'Consignment Delivered Successfully!',
      `${runningTruck.id} (${runningTruck.plate}) arrived at ${runningTruck.currentTrip.destination}. Manifest closed.`
    );
  };

  // Field Simulation 2: Sensor Anomaly
  const handleSimulateAnomaly = () => {
    const candidateTruck = vehicles.find((v) => v.status === 'running') || vehicles[0];
    if (!candidateTruck) return;

    const newAlert = {
      id: `ALT-${Date.now()}`,
      type: 'tire_pressure' as const,
      severity: 'warning' as const,
      message: 'Rear left tire pressure dropping rapidly (down to 101 PSI)',
      timestamp: 'Just now'
    };

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === candidateTruck.id) {
          return {
            ...v,
            alerts: [newAlert, ...v.alerts]
          };
        }
        return v;
      })
    );

    addToast(
      'warning',
      'Telemetry Alert Injected',
      `Diagnostic warning triggered on ${candidateTruck.id} (${candidateTruck.plate}).`
    );
  };

  // Export Telemetry Data as CSV
  const handleExportCSV = () => {
    const headers = [
      'Vehicle ID',
      'License Plate',
      'Model',
      'Type',
      'Status',
      'Payload Capacity (Tons)',
      'Current Payload (Tons)',
      'Fuel Level (%)',
      'Live Speed (km/h)',
      'Odometer (km)',
      'Driver Name',
      'Driver Phone',
      'Current Origin',
      'Current Destination',
      'Latitude',
      'Longitude'
    ];

    const rows = vehicles.map((v) => [
      v.id,
      v.plate,
      `"${v.model}"`,
      `"${v.type}"`,
      v.status,
      v.payloadCapacityTons,
      v.currentPayloadTons,
      v.fuelPercent,
      v.liveSpeedKmh,
      v.odometerKm,
      v.driver ? `"${v.driver.name}"` : 'Unassigned',
      v.driver ? `"${v.driver.phone}"` : '',
      v.currentTrip ? `"${v.currentTrip.origin}"` : '',
      v.currentTrip ? `"${v.currentTrip.destination}"` : '',
      v.coordinates[0],
      v.coordinates[1]
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LogiTrack_Fleet_Manifest_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('info', 'Manifest Export Complete', 'Telemetry dataset downloaded as CSV.');
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
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5">
          {/* Ops Sandbox Bar */}
          <SimulationControlBar
            vehicles={vehicles}
            onSimulateArrival={handleSimulateArrival}
            onSimulateAnomaly={handleSimulateAnomaly}
            onExportCSV={handleExportCSV}
            onOpenEWayBill={(v) => setEWayBillVehicle(v)}
          />

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

      {/* National E-Way Bill Modal */}
      <EWayBillModal
        isOpen={!!eWayBillVehicle}
        onClose={() => setEWayBillVehicle(null)}
        vehicle={eWayBillVehicle}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
