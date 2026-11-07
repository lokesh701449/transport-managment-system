import { VehicleStatus } from '../types';

export function getStatusBadgeConfig(status: VehicleStatus) {
  switch (status) {
    case 'running':
      return {
        label: 'Running',
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-500',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
        colorHex: '#10b981'
      };
    case 'idle':
      return {
        label: 'Idle / Available',
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        dot: 'bg-amber-500',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
        colorHex: '#f59e0b'
      };
    case 'maintenance':
      return {
        label: 'In Maintenance',
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        dot: 'bg-rose-500',
        glow: 'shadow-[0_0_12px_rgba(244,63,94,0.3)]',
        colorHex: '#f43f5e'
      };
    case 'loading':
      return {
        label: 'Loading Cargo',
        bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        dot: 'bg-blue-500',
        glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]',
        colorHex: '#3b82f6'
      };
    default:
      return {
        label: 'Unknown',
        bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
        dot: 'bg-slate-500',
        glow: '',
        colorHex: '#94a3b8'
      };
  }
}

export function formatKm(val: number): string {
  return new Intl.NumberFormat('en-IN').format(val) + ' km';
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function isDateOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date('2026-11-07');
}

