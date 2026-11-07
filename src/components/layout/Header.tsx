import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Play, 
  Pause, 
  PlusCircle, 
  Bell, 
  Clock, 
  Radio, 
  CheckCheck,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { VehicleAlert } from '../../types';

interface HeaderProps {
  onOpenDispatchModal: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  alerts: VehicleAlert[];
  onSelectAlertTruck?: (truckId: string) => void;
  totalAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDispatchModal,
  isSimulating,
  onToggleSimulation,
  alerts,
  onSelectAlertTruck,
  totalAlertsCount
}) => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
      setDate(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-500/20">
            <Truck className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                LogiTrack <span className="text-xs uppercase font-extrabold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">TMS 2.4</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Fleet Operations & Live Telemetry Hub
            </p>
          </div>
        </div>

        {/* Center: Live Telemetry Indicator & Clock */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <button
              onClick={onToggleSimulation}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                isSimulating
                  ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
              }`}
              title={isSimulating ? 'Pause simulated telemetry updates' : 'Resume live telemetry updates'}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SIM ACTIVE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                  <span>SIM PAUSED</span>
                </>
              )}
            </button>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'text-teal-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="font-mono text-[11px]">GPS Telemetry: 1.5s rate</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300 text-xs">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-mono font-medium text-slate-200">{time || '--:--:--'}</span>
            <span className="text-slate-500 text-[11px] hidden xl:inline">({date})</span>
          </div>
        </div>

        {/* Right: Quick Action CTAs & Alerts */}
        <div className="flex items-center gap-3">
          {/* Alerts Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
              className={`relative p-2 rounded-lg border transition-all ${
                totalAlertsCount > 0
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 hover:bg-rose-500/20'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-850'
              }`}
              title="Fleet Alerts"
            >
              <Bell className="w-4 h-4" />
              {totalAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                  {totalAlertsCount}
                </span>
              )}
            </button>

            {showAlertsDropdown && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold text-slate-200">Active Fleet Alerts</span>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                    {totalAlertsCount} unresolved
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/80 my-1">
                  {alerts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      <CheckCheck className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                      All fleet units operating normally
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="py-2.5 px-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
                        onClick={() => {
                          setShowAlertsDropdown(false);
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              alert.severity === 'critical'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            }`}
                          >
                            {alert.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-snug">{alert.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* New Trip Dispatch Primary Button */}
          <button
            onClick={onOpenDispatchModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-semibold text-xs shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">New Trip Dispatch</span>
            <span className="sm:hidden">Dispatch</span>
          </button>

          {/* Operator Profile Chip */}
          <div className="hidden lg:flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-teal-400">
              OPS
            </div>
            <div className="text-left text-xs">
              <div className="font-semibold text-slate-200">Dispatcher</div>
              <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

