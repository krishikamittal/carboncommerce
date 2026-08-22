import React from 'react';
import { ScoredSupplier, Supplier } from '../types';
import { X, Layers, Factory, Zap, Truck, ShieldCheck, CheckCircle2, Leaf, Info } from 'lucide-react';
import { formatINR } from '../lib/scoring';

interface ScopeModalProps {
  supplier: ScoredSupplier | Supplier | null;
  onClose: () => void;
}

export const ScopeModal: React.FC<ScopeModalProps> = ({ supplier, onClose }) => {
  if (!supplier) return null;

  const totalCo2 = supplier.co2Tons;
  const rawPct = ((supplier.scopeBreakdown.rawMaterial / totalCo2) * 100).toFixed(0);
  const mfgPct = ((supplier.scopeBreakdown.manufacturing / totalCo2) * 100).toFixed(0);
  const energyPct = ((supplier.scopeBreakdown.energy / totalCo2) * 100).toFixed(0);
  const transPct = ((supplier.scopeBreakdown.transport / totalCo2) * 100).toFixed(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-[#0a2e24] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif">{supplier.name}</h3>
              <p className="text-xs text-slate-300">GHG Protocol Scope 1, Scope 2, Scope 3 Lifecycle Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs sm:text-sm">
          
          {/* Total & Tier Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div>
              <span className="text-[11px] font-semibold text-[#0a2e24] uppercase">Total Product Carbon Footprint</span>
              <p className="text-2xl font-bold text-[#0a2e24] font-serif">{supplier.co2Tons} <span className="text-sm font-sans font-semibold">metric tons CO₂e</span></p>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0a2e24] text-white shadow-2xs">
                {supplier.dataQuality} Tier
              </span>
              <p className="text-[10px] text-slate-600 mt-1 font-semibold">{supplier.location}</p>
            </div>
          </div>

          {/* 4-Stage Lifecycle Decomposition */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              Cradle-to-Gate Lifecycle Stage Breakdown
            </h4>

            {/* Stage 1: Raw Material */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900 flex items-center">
                  <Factory className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                  1. Raw Material Extraction & Bauxite Mining
                </span>
                <span className="font-bold text-slate-900">{supplier.scopeBreakdown.rawMaterial} t ({rawPct}%)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Scope 3 Category 1 upstream supplier bauxite mining and Bayer refining extraction.
              </p>
            </div>

            {/* Stage 2: Manufacturing & Smelting */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900 flex items-center">
                  <Layers className="w-3.5 h-3.5 mr-1.5 text-slate-700" />
                  2. Smelting & Ingot Casting
                </span>
                <span className="font-bold text-slate-900">{supplier.scopeBreakdown.manufacturing} t ({mfgPct}%)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Direct Scope 1 process emissions from Hall-Héroult cell anode oxidation and casting furnaces.
              </p>
            </div>

            {/* Stage 3: Energy Grid */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900 flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1.5 text-red-700" />
                  3. Grid Electricity & Captive Power
                </span>
                <span className="font-bold text-slate-900">{supplier.scopeBreakdown.energy} t ({energyPct}%)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Scope 2 indirect emissions from electricity consumption during electrolysis.
              </p>
            </div>

            {/* Stage 4: Freight Logistics */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900 flex items-center">
                  <Truck className="w-3.5 h-3.5 mr-1.5 text-sky-700" />
                  4. Intermodal Freight & Transportation
                </span>
                <span className="font-bold text-slate-900">{supplier.scopeBreakdown.transport} t ({transPct}%)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Scope 3 Category 4 inbound transportation to regional assembly and fulfillment hub.
              </p>
            </div>
          </div>

          {/* Audit Verification */}
          <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/90 text-xs space-y-1 text-slate-700">
            <span className="font-bold text-slate-900 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-[#0a2e24]" />
              Auditor Verification Credentials
            </span>
            <p><strong className="text-slate-800">Verification Body:</strong> {supplier.auditProvider || 'Self-Reported Disclosure'}</p>
            <p><strong className="text-slate-800">Certifications:</strong> {supplier.certifications.join(', ')}</p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4.5 py-2 bg-[#0a2e24] hover:bg-[#07241c] text-white rounded-xl text-xs font-bold transition-all"
          >
            Close Scope Breakdown
          </button>
        </div>

      </div>
    </div>
  );
};
