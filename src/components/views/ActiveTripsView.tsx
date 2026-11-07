import React from 'react';
import { Route, Truck, Clock, ArrowRight, Gauge, Phone, ArrowUpRight, Package, ShieldCheck } from 'lucide-react';
import { Vehicle } from '../../types';

interface ActiveTripsViewProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onCallDriver: (driverName: string, phone: string) => void;
  onOpenDispatchModal: () => void;
}

export const ActiveTripsView: React.FC<ActiveTripsViewProps> = ({
  vehicles,
  onSelectVehicle,
  onCallDriver,
  onOpenDispatchModal
}) => {
  const activeTripsVehicles = vehicles.filter((v) => v.status === 'running' || v.status === 'loading');

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Route className="w-5 h-5 text-teal-400" />
            <span>Active Freight Trips & Live Transit Manifests</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time waypoint progression, telemetry tracking, and consignment manifests
          </p>
        </div>

        <button
          onClick={onOpenDispatchModal}
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all"
        >
          + Dispatch New Trip
        </button>
      </div>

      {/* Trips Grid */}
      {activeTripsVehicles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
          No trucks are currently in transit.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeTripsVehicles.map((truck) => {
            const trip = truck.currentTrip;
            if (!trip) return null;

            return (
              <div
                key={truck.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Trip Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{truck.id}</span>
                        <span className="font-mono text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          {truck.plate}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {truck.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{truck.model}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-slate-200">{trip.consignmentRef}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Manifest Ref</div>
                    </div>
                  </div>

                  {/* Route Corridor Banner */}
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-100">
                      <span>{trip.origin}</span>
                      <ArrowRight className="w-4 h-4 text-teal-400 shrink-0 mx-2" />
                      <span>{trip.destination}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${trip.progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                      <span className="text-teal-400 font-bold">{trip.progressPercent}% Completed</span>
                      <span>Dep: {trip.departureTime}</span>
                      <span className="text-emerald-400">ETA: {trip.estimatedArrival}</span>
                    </div>
                  </div>

                  {/* Consignment Details */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Package className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span className="truncate">{trip.cargoDescription}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Cargo Weight: <strong className="text-slate-200">{trip.cargoWeightTons} Tons</strong></span>
                      <span>Speed: <strong className="text-teal-400 font-mono">{truck.liveSpeedKmh} km/h</strong></span>
                      <span>Fuel: <strong className="text-emerald-400 font-mono">{truck.fuelPercent}%</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer: Driver & Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  {truck.driver ? (
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-slate-200">{truck.driver.name}</div>
                      <button
                        onClick={() => onCallDriver(truck.driver!.name, truck.driver!.phone)}
                        className="p-1 rounded bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 transition-colors"
                        title="Call driver"
                      >
                        <Phone className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-xs italic">Unassigned</span>
                  )}

                  <button
                    onClick={() => onSelectVehicle(truck)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors"
                  >
                    <span>View Telemetry</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
