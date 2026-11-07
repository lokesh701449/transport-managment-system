import React, { useState, useMemo } from 'react';
import { 
  Table, 
  LayoutGrid, 
  Search, 
  SlidersHorizontal, 
  Phone, 
  ArrowUpRight, 
  Fuel, 
  Gauge, 
  Clock, 
  MapPin, 
  Wrench, 
  CheckCircle,
  Truck,
  AlertTriangle,
  User,
  ArrowRight,
  Send
} from 'lucide-react';
import { Vehicle, VehicleStatus, ViewMode } from '../../types';
import { getStatusBadgeConfig, formatKm } from '../../utils/formatters';

interface FleetRosterProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenDispatchModalWithVehicle?: (vehicleId: string) => void;
  onSendToMaintenance: (vehicleId: string) => void;
  onCallDriver: (driverName: string, phone: string) => void;
  activeStatusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export const FleetRoster: React.FC<FleetRosterProps> = ({
  vehicles,
  onSelectVehicle,
  onOpenDispatchModalWithVehicle,
  onSendToMaintenance,
  onCallDriver,
  activeStatusFilter,
  onStatusFilterChange
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'payload' | 'fuel' | 'speed'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter & Search Logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Status Filter
      if (activeStatusFilter === 'running' && v.status !== 'running') return false;
      if (activeStatusFilter === 'idle' && v.status !== 'idle') return false;
      if (activeStatusFilter === 'maintenance' && v.status !== 'maintenance') return false;
      if (activeStatusFilter === 'loading' && v.status !== 'loading') return false;
      if (activeStatusFilter === 'alerts' && v.alerts.length === 0) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesPlate = v.plate.toLowerCase().includes(query);
        const matchesId = v.id.toLowerCase().includes(query);
        const matchesDriver = v.driver?.name.toLowerCase().includes(query) ?? false;
        const matchesModel = v.model.toLowerCase().includes(query);
        const matchesRoute =
          v.currentTrip?.origin.toLowerCase().includes(query) ||
          v.currentTrip?.destination.toLowerCase().includes(query) ||
          false;

        return matchesPlate || matchesId || matchesDriver || matchesModel || matchesRoute;
      }

      return true;
    });
  }, [vehicles, activeStatusFilter, searchQuery]);

  // Sort Logic
  const sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') {
        comparison = a.id.localeCompare(b.id);
      } else if (sortBy === 'payload') {
        comparison = a.payloadCapacityTons - b.payloadCapacityTons;
      } else if (sortBy === 'fuel') {
        comparison = a.fuelPercent - b.fuelPercent;
      } else if (sortBy === 'speed') {
        comparison = a.liveSpeedKmh - b.liveSpeedKmh;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredVehicles, sortBy, sortOrder]);

  const toggleSort = (field: 'id' | 'payload' | 'fuel' | 'speed') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Search, Filter Tabs, Sort, & View Toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl backdrop-blur-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search license plate, vehicle ID, driver, corridor..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: 'all', label: 'All Fleet' },
            { id: 'running', label: 'Running' },
            { id: 'idle', label: 'Idle / Available' },
            { id: 'loading', label: 'Loading' },
            { id: 'maintenance', label: 'Maintenance' },
            { id: 'alerts', label: 'With Alerts' }
          ].map((tab) => {
            const isActive = activeStatusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusFilterChange(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Sort & View Mode Switcher */}
        <div className="flex items-center gap-2 self-end lg:self-center">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-2 py-1.5 rounded-xl text-xs text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-500">Sort:</span>
            <button
              onClick={() => toggleSort('id')}
              className={`px-1.5 py-0.5 rounded text-[11px] ${sortBy === 'id' ? 'text-teal-400 font-bold' : 'hover:text-white'}`}
            >
              ID
            </button>
            <button
              onClick={() => toggleSort('payload')}
              className={`px-1.5 py-0.5 rounded text-[11px] ${sortBy === 'payload' ? 'text-teal-400 font-bold' : 'hover:text-white'}`}
            >
              Payload
            </button>
            <button
              onClick={() => toggleSort('fuel')}
              className={`px-1.5 py-0.5 rounded text-[11px] ${sortBy === 'fuel' ? 'text-teal-400 font-bold' : 'hover:text-white'}`}
            >
              Fuel
            </button>
            <button
              onClick={() => toggleSort('speed')}
              className={`px-1.5 py-0.5 rounded text-[11px] ${sortBy === 'speed' ? 'text-teal-400 font-bold' : 'hover:text-white'}`}
            >
              Speed
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 p-0.5 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-teal-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-teal-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <span className="font-semibold text-slate-200">{sortedVehicles.length}</span> of {vehicles.length} fleet units
        </span>
        {activeStatusFilter !== 'all' && (
          <button
            onClick={() => onStatusFilterChange('all')}
            className="text-teal-400 hover:underline text-xs"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Roster Display */}
      {sortedVehicles.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <Truck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No vehicles match current criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset the status filters to view other fleet units.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onStatusFilterChange('all');
            }}
            className="mt-4 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3 px-4">Vehicle ID & Plate</th>
                <th className="py-3 px-4">Type & Payload</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Driver</th>
                <th className="py-3 px-4">Current Trip / Route</th>
                <th className="py-3 px-4">Fuel & Odometer</th>
                <th className="py-3 px-4">Live Speed / ETA</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {sortedVehicles.map((truck) => {
                const statusCfg = getStatusBadgeConfig(truck.status);

                return (
                  <tr
                    key={truck.id}
                    onClick={() => onSelectVehicle(truck)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    {/* Vehicle ID & Plate */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-teal-500/50 transition-colors">
                          <Truck className="w-4 h-4 text-slate-300 group-hover:text-teal-400 transition-colors" />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-slate-100 flex items-center gap-1.5">
                            <span>{truck.id}</span>
                            {truck.alerts.length > 0 && (
                              <span
                                title={`${truck.alerts.length} active alert(s)`}
                                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white font-bold"
                              >
                                !
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 inline-block mt-0.5">
                            {truck.plate}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type & Payload */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{truck.type}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Cap: <span className="text-slate-300 font-semibold">{truck.payloadCapacityTons} T</span>
                        {truck.currentPayloadTons > 0 && (
                          <span className="text-slate-500 ml-1">
                            ({Math.round((truck.currentPayloadTons / truck.payloadCapacityTons) * 100)}% loaded)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusCfg.bg} ${statusCfg.glow}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse`}></span>
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Assigned Driver */}
                    <td className="py-3.5 px-4">
                      {truck.driver ? (
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-semibold text-slate-200">{truck.driver.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                              <span>{truck.driver.phone}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCallDriver(truck.driver!.name, truck.driver!.phone);
                            }}
                            className="p-1 rounded-lg bg-slate-800 hover:bg-teal-500/20 text-slate-400 hover:text-teal-400 border border-slate-700/60 transition-colors"
                            title={`Call driver ${truck.driver.name}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-xs">Unassigned</span>
                      )}
                    </td>

                    {/* Current Trip / Route */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {truck.currentTrip ? (
                        <div>
                          <div className="font-medium text-slate-200 truncate flex items-center gap-1.5">
                            <span className="truncate">{truck.currentTrip.origin.split(' ')[0]}</span>
                            <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{truck.currentTrip.destination.split(' ')[0]}</span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${truck.currentTrip.progressPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>{truck.currentTrip.progressPercent}% en route</span>
                            <span className="text-slate-500">{truck.currentTrip.consignmentRef}</span>
                          </div>
                        </div>
                      ) : truck.status === 'idle' ? (
                        <span className="text-amber-400/80 text-xs">Ready in Yard</span>
                      ) : (
                        <span className="text-slate-500 text-xs">No active transit</span>
                      )}
                    </td>

                    {/* Fuel & Odometer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Fuel
                          className={`w-3.5 h-3.5 shrink-0 ${
                            truck.fuelPercent < 20 ? 'text-rose-400 animate-bounce' : 'text-slate-400'
                          }`}
                        />
                        <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              truck.fuelPercent < 20
                                ? 'bg-rose-500'
                                : truck.fuelPercent < 40
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${truck.fuelPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-slate-300">
                          {truck.fuelPercent}%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        {formatKm(truck.odometerKm)}
                      </div>
                    </td>

                    {/* Live Speed / ETA */}
                    <td className="py-3.5 px-4">
                      {truck.status === 'running' ? (
                        <div>
                          <div className="font-mono font-bold text-slate-100 flex items-center gap-1.5">
                            <Gauge className="w-3.5 h-3.5 text-teal-400" />
                            <span>{truck.liveSpeedKmh} km/h</span>
                          </div>
                          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>ETA: {truck.currentTrip?.estimatedArrival.split(',')[1] || 'On Schedule'}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="font-mono text-slate-500 text-xs">0 km/h (Stationary)</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {truck.status === 'idle' && onOpenDispatchModalWithVehicle && (
                          <button
                            onClick={() => onOpenDispatchModalWithVehicle(truck.id)}
                            className="px-2.5 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                            title="Dispatch this truck"
                          >
                            <Send className="w-3 h-3" />
                            <span>Dispatch</span>
                          </button>
                        )}
                        <button
                          onClick={() => onSelectVehicle(truck)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                          title="Open vehicle telemetry drawer"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* VISUAL CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedVehicles.map((truck) => {
            const statusCfg = getStatusBadgeConfig(truck.status);

            return (
              <div
                key={truck.id}
                onClick={() => onSelectVehicle(truck)}
                className="group relative bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-teal-500/5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Plate, ID & Status Badge */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-100 text-sm">{truck.id}</span>
                        <span className="font-mono text-[11px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          {truck.plate}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 font-medium">{truck.model}</div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusCfg.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}></span>
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Route & Trip Section (if running or loading) */}
                  {truck.currentTrip ? (
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                        <span className="truncate">{truck.currentTrip.origin.split(' ')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0 mx-2" />
                        <span className="truncate">{truck.currentTrip.destination.split(' ')[0]}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${truck.currentTrip.progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                        <span>{truck.currentTrip.progressPercent}% completed</span>
                        <span className="text-emerald-400">{truck.currentTrip.estimatedArrival.split(',')[0]}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50 flex items-center justify-between text-xs text-slate-400">
                      <span>Vehicle Status:</span>
                      <span className="font-semibold text-slate-300">
                        {truck.status === 'idle' ? 'Ready for Dispatch' : 'Workshop Diagnostic'}
                      </span>
                    </div>
                  )}

                  {/* Telemetry Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Speed & Engine</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-slate-200 mt-1">
                        <Gauge className="w-3.5 h-3.5 text-teal-400" />
                        <span>{truck.liveSpeedKmh} km/h</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Fuel & Range</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-slate-200 mt-1">
                        <Fuel
                          className={`w-3.5 h-3.5 ${
                            truck.fuelPercent < 20 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                          }`}
                        />
                        <span>{truck.fuelPercent}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver & Alert Badges */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-300 font-medium">
                        {truck.driver?.name || 'No driver assigned'}
                      </span>
                    </div>

                    {truck.alerts.length > 0 && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        {truck.alerts.length} alert{truck.alerts.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div
                  className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-[11px] font-mono text-slate-500">
                    Odo: {formatKm(truck.odometerKm)}
                  </div>

                  <div className="flex items-center gap-2">
                    {truck.driver && (
                      <button
                        onClick={() => onCallDriver(truck.driver!.name, truck.driver!.phone)}
                        className="p-1.5 bg-slate-800 hover:bg-teal-500/20 text-slate-300 hover:text-teal-400 rounded-lg transition-colors"
                        title="Call Driver"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {truck.status === 'idle' && onOpenDispatchModalWithVehicle && (
                      <button
                        onClick={() => onOpenDispatchModalWithVehicle(truck.id)}
                        className="px-2.5 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-lg font-semibold transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Dispatch</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectVehicle(truck)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
