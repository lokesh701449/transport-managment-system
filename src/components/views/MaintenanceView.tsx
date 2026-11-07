import React from 'react';
import { Wrench, AlertTriangle, CheckCircle2, Clock, Truck, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { Vehicle } from '../../types';
import { formatCurrencyINR, formatKm, isDateOverdue } from '../../utils/formatters';

interface MaintenanceViewProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onCompleteMaintenance: (vehicleId: string) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  vehicles,
  onSelectVehicle,
  onCompleteMaintenance
}) => {
  const maintenanceVehicles = vehicles.filter((v) => v.status === 'maintenance');
  const alertVehicles = vehicles.filter((v) => v.alerts.length > 0 && v.status !== 'maintenance');

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-rose-400" />
            <span>Fleet Maintenance & Service Bay Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active workshop repairs, scheduled preventative overhauls, and regulatory compliance triage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            {maintenanceVehicles.length} Units Grounded
          </span>
        </div>
      </div>

      {/* Currently In Maintenance Bays */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <span>Active Workshop Overhauls</span>
          <span className="text-xs font-normal text-slate-400">({maintenanceVehicles.length} vehicles)</span>
        </h3>

        {maintenanceVehicles.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            No vehicles are presently grounded in workshop bays.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {maintenanceVehicles.map((truck) => {
              const latestLog = truck.maintenanceLogs[0];

              return (
                <div
                  key={truck.id}
                  className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-4 shadow-xl space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{truck.id}</span>
                        <span className="font-mono text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          {truck.plate}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          In Workshop
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{truck.model}</p>
                    </div>

                    <button
                      onClick={() => onSelectVehicle(truck)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                      title="Inspect"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Active Issue Card */}
                  {latestLog && (
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span>Work Order: {latestLog.type}</span>
                        <span className="text-amber-400">{latestLog.status}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{latestLog.notes}</p>
                      <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
                        <span>{latestLog.workshop}</span>
                        <span className="text-rose-400 font-bold">Est: {formatCurrencyINR(latestLog.cost)}</span>
                      </div>
                    </div>
                  )}

                  {/* Alerts attached to this truck */}
                  {truck.alerts.length > 0 && (
                    <div className="space-y-1">
                      {truck.alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-center gap-2 text-[11px] text-rose-300 bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-rose-500/20"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                          <span className="truncate">{alert.message}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      Odometer: {formatKm(truck.odometerKm)}
                    </span>
                    <button
                      onClick={() => onCompleteMaintenance(truck.id)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      Mark Repaired & Release to Fleet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Vehicles with Warnings / Overdue Certs */}
      {alertVehicles.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <span>Vehicles Flagged for Preventative Attention</span>
            <span className="text-xs font-normal text-amber-400">({alertVehicles.length} active)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alertVehicles.map((truck) => (
              <div
                key={truck.id}
                onClick={() => onSelectVehicle(truck)}
                className="bg-slate-900/60 border border-amber-500/30 hover:border-amber-500/50 rounded-2xl p-4 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-slate-100">{truck.id}</div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Needs Attention
                  </span>
                </div>

                <div className="text-xs text-slate-400">{truck.model} ({truck.plate})</div>

                {truck.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]"
                  >
                    {alert.message}
                  </div>
                ))}

                <div className="text-[11px] text-teal-400 font-semibold flex items-center gap-1 justify-end">
                  <span>Open Diagnostic Drawer</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
