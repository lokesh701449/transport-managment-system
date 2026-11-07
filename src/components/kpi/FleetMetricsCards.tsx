import React from 'react';
import { 
  Truck, 
  Navigation, 
  PauseCircle, 
  AlertOctagon, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Fuel
} from 'lucide-react';
import { Vehicle } from '../../types';

interface FleetMetricsCardsProps {
  vehicles: Vehicle[];
  activeFilter: string;
  onFilterChange: (status: string) => void;
}

export const FleetMetricsCards: React.FC<FleetMetricsCardsProps> = ({
  vehicles,
  activeFilter,
  onFilterChange,
}) => {
  const totalLorries = vehicles.length;
  const runningCount = vehicles.filter((v) => v.status === 'running').length;
  const idleCount = vehicles.filter((v) => v.status === 'idle').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'maintenance').length;
  const loadingCount = vehicles.filter((v) => v.status === 'loading').length;

  // Calculate critical alerts count
  const allAlerts = vehicles.flatMap((v) => v.alerts);
  const criticalAlertsCount = allAlerts.filter((a) => a.severity === 'critical').length;
  const totalAlertsCount = allAlerts.length;

  // Metrics
  const utilizationRate = Math.round(((runningCount + loadingCount) / (totalLorries || 1)) * 100);
  const avgSpeed = Math.round(
    vehicles
      .filter((v) => v.status === 'running')
      .reduce((acc, v) => acc + v.liveSpeedKmh, 0) / (runningCount || 1)
  );

  const kpis = [
    {
      id: 'all',
      title: 'Total Fleet Size',
      value: totalLorries,
      subtitle: `${loadingCount} at loading docks`,
      icon: Truck,
      color: 'teal',
      bgGlow: 'from-teal-500/10 to-teal-500/0',
      borderColor: 'border-teal-500/30',
      badge: `${utilizationRate}% Utilized`,
      badgeColor: 'bg-teal-500/20 text-teal-300'
    },
    {
      id: 'running',
      title: 'Active / In-Transit',
      value: runningCount,
      subtitle: `Avg. Speed: ${avgSpeed} km/h`,
      icon: Navigation,
      color: 'emerald',
      bgGlow: 'from-emerald-500/10 to-emerald-500/0',
      borderColor: 'border-emerald-500/30',
      badge: 'Live GPS',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 animate-pulse'
    },
    {
      id: 'idle',
      title: 'Idle / Available',
      value: idleCount,
      subtitle: 'Awaiting cargo dispatch',
      icon: PauseCircle,
      color: 'amber',
      bgGlow: 'from-amber-500/10 to-amber-500/0',
      borderColor: 'border-amber-500/30',
      badge: 'Ready to Assign',
      badgeColor: 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'maintenance',
      title: 'Maintenance / Out-of-Service',
      value: maintenanceCount,
      subtitle: 'Workshop bay triage',
      icon: AlertOctagon,
      color: 'rose',
      bgGlow: 'from-rose-500/10 to-rose-500/0',
      borderColor: 'border-rose-500/30',
      badge: 'Grounded',
      badgeColor: 'bg-rose-500/20 text-rose-300'
    },
    {
      id: 'alerts',
      title: 'Critical Alerts',
      value: criticalAlertsCount,
      subtitle: `${totalAlertsCount} total active events`,
      icon: AlertTriangle,
      color: 'purple',
      bgGlow: 'from-purple-500/10 to-purple-500/0',
      borderColor: 'border-purple-500/30',
      badge: criticalAlertsCount > 0 ? 'Urgent Action' : 'Cleared',
      badgeColor: criticalAlertsCount > 0 ? 'bg-rose-500/30 text-rose-300 animate-bounce' : 'bg-slate-700 text-slate-300'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const isSelected = activeFilter === kpi.id;

        return (
          <div
            key={kpi.id}
            onClick={() => onFilterChange(kpi.id)}
            role="button"
            tabIndex={0}
            className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-200 cursor-pointer border backdrop-blur-sm select-none ${
              isSelected
                ? 'bg-slate-800/90 ring-2 ring-teal-500 border-teal-500 shadow-lg shadow-teal-500/10 translate-y-[-2px]'
                : 'bg-slate-900/80 hover:bg-slate-800/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Top Row: Title & Icon */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                {kpi.title}
              </span>
              <div
                className={`p-2 rounded-xl transition-all ${
                  isSelected ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Middle: Big Metric Value & Badge */}
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-mono">
                {kpi.value}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.badgeColor}`}>
                {kpi.badge}
              </span>
            </div>

            {/* Bottom Row: Subtitle & Quick Hint */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span className="truncate">{kpi.subtitle}</span>
              <span className="text-[10px] text-slate-500 group-hover:text-teal-400 transition-colors font-medium">
                {isSelected ? 'Active filter' : 'Filter by'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

