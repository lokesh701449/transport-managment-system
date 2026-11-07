import React from 'react';
import { BarChart3, TrendingUp, Fuel, Award, ShieldCheck, Download, Calendar } from 'lucide-react';
import { Vehicle } from '../../types';
import { formatCurrencyINR, formatKm } from '../../utils/formatters';

interface ReportsViewProps {
  vehicles: Vehicle[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ vehicles }) => {
  const totalFleetDistance = vehicles.reduce((sum, v) => sum + v.odometerKm, 0);
  const running = vehicles.filter((v) => v.status === 'running').length;
  const idle = vehicles.filter((v) => v.status === 'idle').length;
  const maintenance = vehicles.filter((v) => v.status === 'maintenance').length;
  const loading = vehicles.filter((v) => v.status === 'loading').length;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            <span>Fleet Analytics & Executive Operations Report</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Key operational metrics, corridor freight volume, fuel economy, and compliance SLAs
          </p>
        </div>

        <button
          onClick={() => alert('Exporting Fleet Operations CSV & PDF manifest report...')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
        >
          <Download className="w-4 h-4 text-teal-400" />
          <span>Export Monthly Manifest</span>
        </button>
      </div>

      {/* Top Aggregates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Total Fleet Kilometers</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">{formatKm(totalFleetDistance)}</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% vs last month</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">On-Time Delivery SLA</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">98.6%</div>
          <div className="text-[11px] text-slate-400 mt-1">Target threshold: &gt;95.0%</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Average Fleet Efficiency</span>
          <div className="text-2xl font-mono font-bold text-teal-300 mt-1">3.85 km/L</div>
          <div className="text-[11px] text-slate-400 mt-1">Diesel BS-VI Fleet Aggregate</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Safety & Compliance Index</span>
          <div className="text-2xl font-mono font-bold text-sky-400 mt-1">99.2 / 100</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">Zero major safety incidents</div>
        </div>
      </div>

      {/* Corridor Breakdown & Utilization Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Corridor Freight Volume */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            High-Volume Freight Corridors (This Month)
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>NH-65: Hyderabad ⇄ Vijayawada</span>
                <span className="font-mono text-teal-400">42,500 Ton-Km</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>NH-44: Hyderabad ⇄ Bengaluru</span>
                <span className="font-mono text-teal-400">38,100 Ton-Km</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '76%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>NH-16: Vijayawada ⇄ Visakhapatnam Port</span>
                <span className="font-mono text-teal-400">29,400 Ton-Km</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>NH-48: Pune ⇄ Bengaluru</span>
                <span className="font-mono text-teal-400">18,200 Ton-Km</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '38%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Status Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Real-Time Capacity Allocation
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Active Highway Transit
              </span>
              <span className="font-mono font-bold text-white">{running} Lorries</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="flex items-center gap-2 text-amber-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Idle Yard Standby
              </span>
              <span className="font-mono font-bold text-white">{idle} Lorries</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="flex items-center gap-2 text-blue-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                Dock Loading / Consignment Stowing
              </span>
              <span className="font-mono font-bold text-white">{loading} Lorries</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="flex items-center gap-2 text-rose-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                Workshop Maintenance Bay
              </span>
              <span className="font-mono font-bold text-white">{maintenance} Lorries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
