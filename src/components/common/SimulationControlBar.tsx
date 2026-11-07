import React from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  FileText, 
  RefreshCw,
  Gauge,
  Truck
} from 'lucide-react';
import { Vehicle } from '../../types';

interface SimulationControlBarProps {
  vehicles: Vehicle[];
  onSimulateArrival: () => void;
  onSimulateAnomaly: () => void;
  onExportCSV: () => void;
  onOpenEWayBill: (vehicle: Vehicle) => void;
}

export const SimulationControlBar: React.FC<SimulationControlBarProps> = ({
  vehicles,
  onSimulateArrival,
  onSimulateAnomaly,
  onExportCSV,
  onOpenEWayBill
}) => {
  const runningTruck = vehicles.find((v) => v.status === 'running');

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-200">Ops Field Event Sandbox:</span>
          <span className="text-[11px] text-slate-400 ml-1 hidden sm:inline">
            Trigger real-time telemetry events & export live fleet manifests
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Simulate Delivery Arrival */}
        <button
          onClick={onSimulateArrival}
          disabled={!runningTruck}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            runningTruck
              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-transparent'
          }`}
          title="Simulate destination arrival & delivery confirmation"
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Simulate Arrival</span>
        </button>

        {/* Simulate Sensor Anomaly */}
        <button
          onClick={onSimulateAnomaly}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition-all"
          title="Inject a low fuel / overspeed telemetry warning"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Simulate Anomaly</span>
        </button>

        {/* View E-Way Bill */}
        {runningTruck && (
          <button
            onClick={() => onOpenEWayBill(runningTruck)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold transition-all"
            title="Inspect active GST E-Way Freight Bill"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>E-Way Bill ({runningTruck.id})</span>
          </button>
        )}

        {/* Export Telemetry CSV */}
        <button
          onClick={onExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-semibold transition-all"
          title="Download live fleet coordinates & telemetry as CSV"
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};

