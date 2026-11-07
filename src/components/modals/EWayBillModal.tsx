import React from 'react';
import { X, Printer, Download, ShieldCheck, QrCode, FileText, CheckCircle2, Truck } from 'lucide-react';
import { Vehicle } from '../../types';
import { formatCurrencyINR, formatKm } from '../../utils/formatters';

interface EWayBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

export const EWayBillModal: React.FC<EWayBillModalProps> = ({
  isOpen,
  onClose,
  vehicle
}) => {
  if (!isOpen || !vehicle || !vehicle.currentTrip) return null;

  const trip = vehicle.currentTrip;
  const ewayBillNo = `2810-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">National E-Way Freight Bill & Consignment Manifest</h3>
              <p className="text-[11px] text-slate-400 font-mono">Form GST EWB-01 • Rule 138 Central Goods and Services Tax Rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs bg-slate-50 border-y border-slate-200">
          {/* Top Doc Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-300 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">E-Way Bill Number</span>
              <span className="font-mono text-base font-extrabold text-slate-900 tracking-wider">{ewayBillNo}</span>
              <div className="text-[11px] text-slate-600 mt-0.5">
                Generated Date: <strong>Today, 06:00 AM</strong> • Valid Until: <strong>Tomorrow, 11:59 PM</strong>
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="text-right">
              <div className="font-mono text-[10px] tracking-widest text-slate-600 font-bold mb-1">
                |||| | ||||| || |||||| ||| |||| || |||
              </div>
              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                FASTag Linked & Active
              </span>
            </div>
          </div>

          {/* PART-A: Shipper & Consignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">From (Consignor / Shipper)</span>
              <div className="font-bold text-slate-900">{trip.origin}</div>
              <div className="text-[11px] text-slate-600 mt-1 font-mono">GSTIN: 36AAACL2819K1ZS</div>
              <div className="text-[11px] text-slate-500">Dispatch Depot Terminal 4</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">To (Consignee / Recipient)</span>
              <div className="font-bold text-slate-900">{trip.destination}</div>
              <div className="text-[11px] text-slate-600 mt-1 font-mono">GSTIN: 37AABCA9142L1Z8</div>
              <div className="text-[11px] text-slate-500">Logistics Receiving Bay 2</div>
            </div>
          </div>

          {/* PART-B: Transport & Vehicle Details */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Vehicle & Pilot Authentication</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Vehicle Reg. No.</span>
                <span className="font-mono font-bold text-slate-900">{vehicle.plate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Fleet Unit ID</span>
                <span className="font-mono font-bold text-slate-900">{vehicle.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Assigned Pilot</span>
                <span className="font-bold text-slate-900">{vehicle.driver?.name || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Driver Mobile</span>
                <span className="font-mono font-bold text-slate-900">{vehicle.driver?.phone || '--'}</span>
              </div>
            </div>
          </div>

          {/* Consignment Items */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5">HSN Code</th>
                  <th className="p-2.5">Gross Weight</th>
                  <th className="p-2.5 text-right">Taxable Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-medium">{trip.cargoDescription}</td>
                  <td className="p-2.5 font-mono text-slate-600">8471.30</td>
                  <td className="p-2.5 font-mono font-bold">{trip.cargoWeightTons} Tons</td>
                  <td className="p-2.5 font-mono font-bold text-right text-slate-900">{formatCurrencyINR(2450000)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Transit Checkpoints */}
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-teal-900 font-semibold">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>AIS-140 GPS Telemetry Tracking Active & Linked with VAHAN Portal</span>
            </div>
            <span className="font-mono text-teal-800 text-[11px] font-bold">100% Compliant</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white flex items-center justify-between border-t border-slate-200">
          <span className="text-[11px] text-slate-500">
            Carrier: <strong>Apex Freightways Logistics Pvt Ltd</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print E-Way Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

