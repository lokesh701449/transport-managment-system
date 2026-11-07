import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Fuel, 
  Gauge, 
  Wrench, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Phone, 
  Send, 
  User, 
  Activity, 
  FileText, 
  Check, 
  ArrowRight,
  Disc
} from 'lucide-react';
import { Vehicle } from '../../types';
import { getStatusBadgeConfig, formatKm, formatCurrencyINR, isDateOverdue } from '../../utils/formatters';

interface VehicleDetailsDrawerProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSendToMaintenance: (vehicleId: string) => void;
  onCompleteMaintenance: (vehicleId: string) => void;
  onOpenDispatchModalWithVehicle: (vehicleId: string) => void;
  onCallDriver: (driverName: string, phone: string) => void;
}

export const VehicleDetailsDrawer: React.FC<VehicleDetailsDrawerProps> = ({
  vehicle,
  onClose,
  onSendToMaintenance,
  onCompleteMaintenance,
  onOpenDispatchModalWithVehicle,
  onCallDriver
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'maintenance'>('overview');

  if (!vehicle) return null;

  const statusCfg = getStatusBadgeConfig(vehicle.status);
  const payloadPercent = Math.round((vehicle.currentPayloadTons / vehicle.payloadCapacityTons) * 100);

  const isFitnessOverdue = isDateOverdue(vehicle.fitnessCertExpiry);
  const isPucOverdue = isDateOverdue(vehicle.pollutionCertExpiry);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Drawer Top Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-white font-mono tracking-tight">{vehicle.id}</h2>
                  <span className="font-mono text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-semibold">
                    {vehicle.plate}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusCfg.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}></span>
                    {statusCfg.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{vehicle.model} • {vehicle.type}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Top Bar */}
          <div className="px-5 py-2.5 bg-slate-950/30 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-slate-400">
              <span>Odo: <strong className="text-slate-200 font-mono">{formatKm(vehicle.odometerKm)}</strong></span>
              <span>•</span>
              <span>Fuel: <strong className="text-emerald-400 font-mono">{vehicle.fuelPercent}%</strong></span>
            </div>

            <div className="flex items-center gap-2">
              {vehicle.status === 'idle' && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenDispatchModalWithVehicle(vehicle.id);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Now</span>
                </button>
              )}

              {vehicle.status !== 'maintenance' ? (
                <button
                  onClick={() => onSendToMaintenance(vehicle.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold rounded-lg transition-all"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Send to Maintenance</span>
                </button>
              ) : (
                <button
                  onClick={() => onCompleteMaintenance(vehicle.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Complete Service & Return</span>
                </button>
              )}
            </div>
          </div>

          {/* Drawer Tab Navigation */}
          <div className="flex items-center border-b border-slate-800 px-5 bg-slate-950/20">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Overview & Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab('trips')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'trips'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Trip History ({vehicle.tripHistory.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('maintenance')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'maintenance'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Maintenance Logs ({vehicle.maintenanceLogs.length})</span>
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Active Alerts Banner if any */}
                {vehicle.alerts.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Active Diagnostic Warnings ({vehicle.alerts.length})</span>
                    </div>
                    {vehicle.alerts.map((alert) => (
                      <div key={alert.id} className="text-xs text-rose-200 flex items-start justify-between gap-2">
                        <span>• {alert.message}</span>
                        <span className="text-[10px] text-rose-400 font-mono whitespace-nowrap">{alert.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Engine & Live Telemetry Metrics */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Engine & Powertrain Status
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">Engine Health</span>
                      <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            vehicle.engineStatus === 'Optimal'
                              ? 'bg-emerald-400'
                              : vehicle.engineStatus === 'Warning'
                              ? 'bg-amber-400'
                              : vehicle.engineStatus === 'Overheating'
                              ? 'bg-rose-400 animate-ping'
                              : 'bg-slate-500'
                          }`}
                        />
                        <span>{vehicle.engineStatus}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">Coolant Temp</span>
                      <div className="text-sm font-bold font-mono text-white mt-1">
                        {vehicle.coolantTempC}°C
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">Battery System</span>
                      <div className="text-sm font-bold font-mono text-white mt-1">
                        {vehicle.batteryVoltage} V
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">Current Velocity</span>
                      <div className="text-sm font-bold font-mono text-teal-400 mt-1">
                        {vehicle.liveSpeedKmh} km/h
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payload Capacity Utilization */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-300">Payload Capacity Utilization</span>
                    <span className="font-mono font-bold text-slate-200">
                      {vehicle.currentPayloadTons} / {vehicle.payloadCapacityTons} Tons ({payloadPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        payloadPercent > 90
                          ? 'bg-amber-500'
                          : payloadPercent > 0
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${Math.max(payloadPercent, 4)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {payloadPercent === 0
                      ? 'Lorry is presently empty and ready for cargo loading.'
                      : `Consignment is safely stowed within certified gross vehicle weight limits.`}
                  </p>
                </div>

                {/* Tire Pressure Telemetry (TPMS Multi-Axle Schematic) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Disc className="w-4 h-4 text-teal-400" />
                      <span>Tire Pressure Monitoring (TPMS)</span>
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">Standard Target: 110-120 PSI</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 relative">
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                      {/* Steer Axle */}
                      <div className="text-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400">Front Left</span>
                        <div
                          className={`text-sm font-mono font-bold mt-1 ${
                            vehicle.tirePressurePsi.frontLeft < 108 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {vehicle.tirePressurePsi.frontLeft} PSI
                        </div>
                      </div>

                      <div className="text-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400">Front Right</span>
                        <div
                          className={`text-sm font-mono font-bold mt-1 ${
                            vehicle.tirePressurePsi.frontRight < 108 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {vehicle.tirePressurePsi.frontRight} PSI
                        </div>
                      </div>

                      {/* Drive Axle 1 */}
                      <div className="text-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400">Rear Axle 1 (L)</span>
                        <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
                          {vehicle.tirePressurePsi.rearLeft1} PSI
                        </div>
                      </div>

                      <div className="text-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400">Rear Axle 1 (R)</span>
                        <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
                          {vehicle.tirePressurePsi.rearRight1} PSI
                        </div>
                      </div>

                      {/* Drive Axle 2 */}
                      <div className="text-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400">Rear Axle 2 (L)</span>
                        <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
                          {vehicle.tirePressurePsi.rearLeft2} PSI
                        </div>
                      </div>

                      <div className="text-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400">Rear Axle 2 (R)</span>
                        <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
                          {vehicle.tirePressurePsi.rearRight2} PSI
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regulatory Compliance & Certificates */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Statutory Compliance & Certifications
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="font-semibold text-slate-200">Commercial Comprehensive Insurance</div>
                          <div className="text-[11px] text-slate-400">ICICI Lombard General Policy</div>
                        </div>
                      </div>
                      <span className="font-mono text-emerald-400 text-xs font-semibold">
                        Valid until {vehicle.insuranceExpiry}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <FileText className={`w-4 h-4 ${isFitnessOverdue ? 'text-rose-400' : 'text-emerald-400'}`} />
                        <div>
                          <div className="font-semibold text-slate-200">Annual Fitness Certificate (Form 38)</div>
                          <div className="text-[11px] text-slate-400">Regional Transport Authority (RTO)</div>
                        </div>
                      </div>
                      <span
                        className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                          isFitnessOverdue
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'text-emerald-400'
                        }`}
                      >
                        {isFitnessOverdue ? 'OVERDUE: ' : 'Valid until '}
                        {vehicle.fitnessCertExpiry}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 ${isPucOverdue ? 'text-rose-400' : 'text-emerald-400'}`} />
                        <div>
                          <div className="font-semibold text-slate-200">Pollution Under Control (PUC)</div>
                          <div className="text-[11px] text-slate-400">BS-VI Emission Standards</div>
                        </div>
                      </div>
                      <span
                        className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                          isPucOverdue
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'text-emerald-400'
                        }`}
                      >
                        {isPucOverdue ? 'EXPIRED: ' : 'Valid until '}
                        {vehicle.pollutionCertExpiry}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assigned Driver Profile */}
                {vehicle.driver && (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-sm">
                          {vehicle.driver.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-100 text-xs">{vehicle.driver.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Lic: {vehicle.driver.licenseNumber}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onCallDriver(vehicle.driver!.name, vehicle.driver!.phone)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Driver</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* TAB 2: TRIP HISTORY */}
            {activeTab === 'trips' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                  <span>Last 5 Completed Freight Runs</span>
                  <span>Total Recorded: {formatKm(vehicle.odometerKm)}</span>
                </div>

                {vehicle.tripHistory.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <div className="flex items-center gap-2">
                        <span>{trip.origin}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                        <span>{trip.destination}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {trip.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                      <div>
                        <span>Distance: </span>
                        <strong className="text-slate-200">{trip.distanceKm} km</strong>
                      </div>
                      <div>
                        <span>Duration: </span>
                        <strong className="text-slate-200">{trip.durationHours} hrs</strong>
                      </div>
                      <div>
                        <span>Fuel Consumed: </span>
                        <strong className="text-slate-200">{trip.fuelConsumedLiters} L</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                      <span>Pilot: {trip.driverName}</span>
                      <span>{trip.completedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: MAINTENANCE LOG */}
            {activeTab === 'maintenance' && (
              <div className="space-y-4">
                {/* Service Mileage Summary */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Last Service Date</span>
                    <div className="font-mono font-bold text-slate-200 mt-1">{vehicle.lastServiceDate}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Next Service Scheduled</span>
                    <div className="font-mono font-bold text-teal-400 mt-1">
                      {formatKm(vehicle.nextServiceKm)}
                    </div>
                  </div>
                </div>

                {/* Maintenance Records List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Past Service Work Orders
                  </h4>

                  {vehicle.maintenanceLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-200">{log.type}</div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : log.status === 'In Progress'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">{log.notes}</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
                        <span>{log.workshop}</span>
                        <span className="text-slate-200 font-bold">{formatCurrencyINR(log.cost)}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

