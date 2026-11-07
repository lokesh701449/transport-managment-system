import React, { useState } from 'react';
import { Users, Phone, Star, Award, Shield, Truck, Search, CheckCircle } from 'lucide-react';
import { Driver, Vehicle } from '../../types';

interface DriversViewProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  onCallDriver: (driverName: string, phone: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const DriversView: React.FC<DriversViewProps> = ({
  drivers,
  vehicles,
  onCallDriver,
  onSelectVehicle
}) => {
  const [filterDuty, setFilterDuty] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredDrivers = drivers.filter((d) => {
    if (filterDuty !== 'all' && d.dutyStatus !== filterDuty) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.licenseNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-400" />
            <span>Fleet Pilot & Driver Personnel Roster</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Commercial heavy-vehicle licensed operators, compliance tracking & tele-dispatch
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'On Duty', 'Awaiting Assignment', 'Resting'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterDuty(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterDuty === status
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-800/80'
              }`}
            >
              {status === 'all' ? 'All Personnel' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredDrivers.map((driver) => {
          const assignedTruck = vehicles.find((v) => v.driver?.id === driver.id);

          return (
            <div
              key={driver.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center font-bold text-base text-teal-400">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{driver.name}</h3>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{driver.phone}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      driver.dutyStatus === 'On Duty'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : driver.dutyStatus === 'Awaiting Assignment'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {driver.dutyStatus}
                  </span>
                </div>

                {/* Rating & Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rating</span>
                    <span className="font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {driver.rating}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Experience</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{driver.experienceYears} yrs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Trips Done</span>
                    <span className="font-bold text-teal-400 mt-0.5 block font-mono">{driver.totalTrips}</span>
                  </div>
                </div>

                {/* License & Assigned Truck */}
                <div className="mt-3 text-xs space-y-1.5 text-slate-400">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span>License:</span>
                    <span className="text-slate-300">{driver.licenseNumber}</span>
                  </div>

                  {assignedTruck ? (
                    <div
                      onClick={() => onSelectVehicle(assignedTruck)}
                      className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/40 cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-teal-400" />
                        <span>Assigned Lorry:</span>
                      </span>
                      <span className="font-mono font-bold text-teal-400">{assignedTruck.id}</span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-slate-950/30 border border-slate-800/40 text-center text-[11px] text-slate-500">
                      No active truck assignment
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <button
                  onClick={() => onCallDriver(driver.name, driver.phone)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-teal-500/20 text-slate-200 hover:text-teal-300 border border-slate-700/80 hover:border-teal-500/30 rounded-xl text-xs font-semibold transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Pilot Terminal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

