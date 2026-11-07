import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Truck, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Package, 
  AlertCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Vehicle, Driver, DispatchFormData } from '../../types';
import { POPULAR_LOCATIONS } from '../../data/mockData';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  preSelectedVehicleId?: string;
  onDispatchSuccess: (formData: DispatchFormData) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  drivers,
  preSelectedVehicleId,
  onDispatchSuccess
}) => {
  // Only idle vehicles can be dispatched
  const idleVehicles = vehicles.filter((v) => v.status === 'idle');
  // Available drivers
  const availableDrivers = drivers.filter(
    (d) => d.dutyStatus === 'Awaiting Assignment' || d.dutyStatus === 'Off Duty'
  );

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [consignmentRef, setConsignmentRef] = useState<string>('');
  const [cargoDescription, setCargoDescription] = useState<string>('');
  const [cargoWeightTons, setCargoWeightTons] = useState<number>(12);
  const [origin, setOrigin] = useState<string>('Hyderabad Hub (Shamshabad)');
  const [destination, setDestination] = useState<string>('Vijayawada Logistics Park (Gannavaram)');
  const [departureTime, setDepartureTime] = useState<string>('Today, 07:00 PM');
  const [estimatedArrival, setEstimatedArrival] = useState<string>('Tomorrow, 04:30 AM');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Set initial selections when opened
  useEffect(() => {
    if (isOpen) {
      const initialTruck = preSelectedVehicleId
        ? idleVehicles.find((v) => v.id === preSelectedVehicleId) || idleVehicles[0]
        : idleVehicles[0];

      if (initialTruck) {
        setSelectedVehicleId(initialTruck.id);
      }
      if (availableDrivers.length > 0) {
        setSelectedDriverId(availableDrivers[0].id);
      }
      // Generate random consignment reference
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      setConsignmentRef(`CN-${randomSuffix}-EXP`);
      setCargoDescription('High-Priority Manufacturing Parts & Raw Assemblies');
      setValidationError(null);
    }
  }, [isOpen, preSelectedVehicleId]);

  if (!isOpen) return null;

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const isOverweight = currentVehicle ? cargoWeightTons > currentVehicle.payloadCapacityTons : false;

  const handleQuickFill = (preset: 'vja' | 'blr' | 'viz') => {
    if (preset === 'vja') {
      setOrigin('Hyderabad Hub (Shamshabad)');
      setDestination('Vijayawada Logistics Park (Gannavaram)');
      setDepartureTime('Today, 08:00 PM');
      setEstimatedArrival('Tomorrow, 04:30 AM');
      setCargoDescription('E-Commerce Parcels & Retail Consignments');
    } else if (preset === 'blr') {
      setOrigin('Hyderabad Hub (Shamshabad)');
      setDestination('Bengaluru Electronic City Hub');
      setDepartureTime('Today, 09:30 PM');
      setEstimatedArrival('Tomorrow, 09:00 AM');
      setCargoDescription('Industrial Electric Motors & Cables');
    } else {
      setOrigin('Vijayawada Logistics Park (Gannavaram)');
      setDestination('Visakhapatnam Port Berth 4');
      setDepartureTime('Today, 10:00 PM');
      setEstimatedArrival('Tomorrow, 06:00 AM');
      setCargoDescription('Agriculture Machinery & Spare Units');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVehicleId) {
      setValidationError('Please select an idle lorry for dispatch.');
      return;
    }

    if (!selectedDriverId) {
      setValidationError('Please assign an available driver.');
      return;
    }

    if (!consignmentRef.trim()) {
      setValidationError('Consignment reference number is required.');
      return;
    }

    if (!origin.trim() || !destination.trim()) {
      setValidationError('Origin and destination addresses cannot be empty.');
      return;
    }

    if (origin === destination) {
      setValidationError('Origin and destination cannot be the same location.');
      return;
    }

    if (isOverweight) {
      setValidationError(
        `Cargo weight (${cargoWeightTons} T) exceeds vehicle rated capacity (${currentVehicle?.payloadCapacityTons} T).`
      );
      return;
    }

    onDispatchSuccess({
      vehicleId: selectedVehicleId,
      driverId: selectedDriverId,
      consignmentRef,
      cargoDescription,
      cargoWeightTons,
      origin,
      destination,
      departureTime,
      estimatedArrival
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">New Trip Dispatch Order</h2>
              <p className="text-xs text-slate-400">
                Assign vehicle, driver, route corridor, and create freight manifest
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Quick Corridor Templates */}
          <div className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Quick Corridors:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('vja')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition-colors"
              >
                Hyd ➔ Vja (NH-65)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('blr')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition-colors"
              >
                Hyd ➔ Blr (NH-44)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('viz')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition-colors"
              >
                Vja ➔ Vizag (NH-16)
              </button>
            </div>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Lorry Selection & Driver Selection (Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lorry Selector (Filtered to IDLE only) */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-teal-400" />
                Select Available Lorry (Idle Trucks Only)
              </label>
              {idleVehicles.length === 0 ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs">
                  No trucks are currently in 'Idle' state. Free up a vehicle or wait for deliveries to conclude.
                </div>
              ) : (
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-teal-500"
                >
                  {idleVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.id} ({v.plate}) — {v.type} [{v.payloadCapacityTons} T]
                    </option>
                  ))}
                </select>
              )}
              {currentVehicle && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Fuel: <span className="text-emerald-400 font-mono">{currentVehicle.fuelPercent}%</span> | Max Payload:{' '}
                  <span className="text-slate-200 font-mono">{currentVehicle.payloadCapacityTons} Tons</span>
                </p>
              )}
            </div>

            {/* Driver Selector */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-400" />
                Assign Certified Driver
              </label>
              {availableDrivers.length === 0 ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs">
                  All drivers are presently on duty.
                </div>
              ) : (
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-500"
                >
                  {availableDrivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.phone}) — Rating {d.rating}★
                    </option>
                  ))}
                </select>
              )}
              <p className="text-[11px] text-slate-400 mt-1">
                Drivers filtered by duty clearance & regulatory rest cycles.
              </p>
            </div>
          </div>

          {/* Consignment Ref & Cargo Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-teal-400" />
                Consignment Reference ID
              </label>
              <input
                type="text"
                value={consignmentRef}
                onChange={(e) => setConsignmentRef(e.target.value)}
                placeholder="e.g. CN-94821-EXP"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Cargo Weight (Tons)</span>
                {currentVehicle && (
                  <span className={`text-[11px] ${isOverweight ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                    Rated: {currentVehicle.payloadCapacityTons} T max
                  </span>
                )}
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="40"
                value={cargoWeightTons}
                onChange={(e) => setCargoWeightTons(parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 bg-slate-950 border rounded-xl font-mono text-xs focus:outline-none ${
                  isOverweight
                    ? 'border-rose-500 text-rose-300 focus:border-rose-400'
                    : 'border-slate-700 text-slate-200 focus:border-teal-500'
                }`}
              />
              {isOverweight && (
                <p className="text-[11px] text-rose-400 mt-1">
                  Warning: Exceeds vehicle payload limit by{' '}
                  {(cargoWeightTons - (currentVehicle?.payloadCapacityTons || 0)).toFixed(1)} Tons!
                </p>
              )}
            </div>
          </div>

          {/* Cargo Manifest Description */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Consignment Description / Goods Classification
            </label>
            <input
              type="text"
              value={cargoDescription}
              onChange={(e) => setCargoDescription(e.target.value)}
              placeholder="e.g. Industrial Electronics, FMCG Boxes, Pharmaceutical Containers"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Origin & Destination Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                Origin (Pickup Address / Hub)
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Origin location..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Destination (Drop Address / Terminal)
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination location..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Departure & Arrival Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                Scheduled Departure Time
              </label>
              <input
                type="text"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                placeholder="e.g. Today, 07:00 PM"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                Estimated Arrival Time (ETA)
              </label>
              <input
                type="text"
                value={estimatedArrival}
                onChange={(e) => setEstimatedArrival(e.target.value)}
                placeholder="e.g. Tomorrow, 04:30 AM"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={idleVehicles.length === 0 || isOverweight}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs shadow-lg transition-all ${
              idleVehicles.length === 0 || isOverweight
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Confirm & Dispatch Lorry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
