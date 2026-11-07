import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  MapPin, 
  Route, 
  Users, 
  Wrench, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Fuel
} from 'lucide-react';

export type NavTab = 'dashboard' | 'fleet' | 'map' | 'trips' | 'drivers' | 'maintenance' | 'reports';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  runningCount: number;
  idleCount: number;
  maintenanceCount: number;
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  runningCount,
  idleCount,
  maintenanceCount,
  alertCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'fleet' as NavTab,
      label: 'Fleet Roster',
      icon: Truck,
      badge: runningCount + idleCount + maintenanceCount
    },
    {
      id: 'map' as NavTab,
      label: 'Live Operations Map',
      icon: MapPin,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
    },
    {
      id: 'trips' as NavTab,
      label: 'Active Trips',
      icon: Route,
      badge: runningCount,
      badgeColor: 'bg-teal-500/20 text-teal-300'
    },
    {
      id: 'drivers' as NavTab,
      label: 'Drivers & Crew',
      icon: Users,
      badge: null
    },
    {
      id: 'maintenance' as NavTab,
      label: 'Maintenance',
      icon: Wrench,
      badge: maintenanceCount,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
    },
    {
      id: 'reports' as NavTab,
      label: 'Fleet Reports',
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-2 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30 shadow-sm shadow-teal-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Telemetry Status Box (when expanded) */}
      {!isCollapsed && (
        <div className="p-3 mx-2 mb-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fleet Gateways
            </span>
            <span className="text-emerald-400 font-mono">100% UP</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>AIS-140 GPS Feed:</span>
              <span className="text-slate-200 font-mono">18 Nodes</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>CAN-Bus Telemetry:</span>
              <span className="text-emerald-400 font-mono">Synced</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-medium"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
