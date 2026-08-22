import React from 'react';
import { BuyerRequirement, Supplier, ScoredSupplier } from '../types';
import { Layers, Factory, Zap, Truck, ShieldCheck, ArrowRight, TrendingDown, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../lib/scoring';

interface FootprintCalcViewProps {
  requirement: BuyerRequirement;
  suppliers: Supplier[];
  onProceedToRanking: () => void;
}

export const FootprintCalcView: React.FC<FootprintCalcViewProps> = ({
  requirement,
  suppliers,
  onProceedToRanking,
}) => {
  const maxCo2 = Math.max(...suppliers.map(s => s.co2Tons), 80);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-[#0a2e24] border border-emerald-300">
                Step 3: Lifecycle Footprint Calculation
              </span>
              <span className="text-xs text-slate-600 font-semibold">
                GHG Protocol Scope 1, Scope 2, Scope 3 Category 1
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1 font-serif">
              Cradle-to-Gate Emission Attribution
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-0.5">
              We decompose supplier carbon footprint into four verified lifecycle stages: Raw Material extraction, Smelting & manufacturing, Grid electricity intensity, and Freight transport.
            </p>
          </div>

          <button
            id="btn-proceed-to-ranking"
            type="button"
            onClick={onProceedToRanking}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0a2e24] hover:bg-[#07241c] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0"
          >
            <span>Proceed to AI Ranking & Sliders</span>
            <ArrowRight className="w-4 h-4 text-[#10b981]" />
          </button>
        </div>
      </div>

      {/* Visual Stacked Emission Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Emissions Stage Breakdown Comparison</h3>
          
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
            <span className="flex items-center"><span className="w-3 h-3 rounded bg-amber-700 mr-1.5" /> Raw Materials</span>
            <span className="flex items-center"><span className="w-3 h-3 rounded bg-slate-700 mr-1.5" /> Smelting / Mfg</span>
            <span className="flex items-center"><span className="w-3 h-3 rounded bg-red-700 mr-1.5" /> Grid Energy</span>
            <span className="flex items-center"><span className="w-3 h-3 rounded bg-sky-700 mr-1.5" /> Logistics</span>
          </div>
        </div>

        <div className="space-y-5">
          {suppliers.map((supplier) => {
            const rawPct = (supplier.scopeBreakdown.rawMaterial / supplier.co2Tons) * 100;
            const mfgPct = (supplier.scopeBreakdown.manufacturing / supplier.co2Tons) * 100;
            const energyPct = (supplier.scopeBreakdown.energy / supplier.co2Tons) * 100;
            const transPct = (supplier.scopeBreakdown.transport / supplier.co2Tons) * 100;
            const barWidthPct = (supplier.co2Tons / maxCo2) * 100;

            const isCleanest = supplier.co2Tons === Math.min(...suppliers.map(s => s.co2Tons));

            return (
              <div key={supplier.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{supplier.name}</span>
                    {isCleanest && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0a2e24] text-white">
                        Lowest Footprint (31t)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-semibold text-slate-700">{formatINR(supplier.price)}</span>
                    <span className="font-bold text-emerald-800 text-sm">{supplier.co2Tons} t CO₂e Total</span>
                  </div>
                </div>

                {/* Stacked Proportional Bar */}
                <div className="w-full bg-slate-200 h-6 rounded-lg overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${(supplier.scopeBreakdown.rawMaterial / maxCo2) * 100}%` }}
                    className="bg-amber-700 hover:opacity-90 transition-all flex items-center justify-center text-[10px] text-white font-semibold"
                    title={`Raw Materials: ${supplier.scopeBreakdown.rawMaterial}t (${rawPct.toFixed(0)}%)`}
                  >
                    {rawPct > 15 ? `${supplier.scopeBreakdown.rawMaterial}t` : ''}
                  </div>
                  <div
                    style={{ width: `${(supplier.scopeBreakdown.manufacturing / maxCo2) * 100}%` }}
                    className="bg-slate-700 hover:opacity-90 transition-all flex items-center justify-center text-[10px] text-white font-semibold"
                    title={`Manufacturing: ${supplier.scopeBreakdown.manufacturing}t (${mfgPct.toFixed(0)}%)`}
                  >
                    {mfgPct > 15 ? `${supplier.scopeBreakdown.manufacturing}t` : ''}
                  </div>
                  <div
                    style={{ width: `${(supplier.scopeBreakdown.energy / maxCo2) * 100}%` }}
                    className="bg-red-700 hover:opacity-90 transition-all flex items-center justify-center text-[10px] text-white font-semibold"
                    title={`Grid Energy: ${supplier.scopeBreakdown.energy}t (${energyPct.toFixed(0)}%)`}
                  >
                    {energyPct > 15 ? `${supplier.scopeBreakdown.energy}t` : ''}
                  </div>
                  <div
                    style={{ width: `${(supplier.scopeBreakdown.transport / maxCo2) * 100}%` }}
                    className="bg-sky-700 hover:opacity-90 transition-all flex items-center justify-center text-[10px] text-white font-semibold"
                    title={`Transport: ${supplier.scopeBreakdown.transport}t (${transPct.toFixed(0)}%)`}
                  >
                    {transPct > 10 ? `${supplier.scopeBreakdown.transport}t` : ''}
                  </div>
                </div>

                {/* Micro Metric breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px] text-slate-700">
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-medium">Raw Materials:</span>
                    <span className="font-bold text-slate-900">{supplier.scopeBreakdown.rawMaterial}t ({rawPct.toFixed(0)}%)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-medium">Processing:</span>
                    <span className="font-bold text-slate-900">{supplier.scopeBreakdown.manufacturing}t ({mfgPct.toFixed(0)}%)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-medium">Grid Electricity:</span>
                    <span className="font-bold text-slate-900">{supplier.scopeBreakdown.energy}t ({energyPct.toFixed(0)}%)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-medium">Freight Transit:</span>
                    <span className="font-bold text-slate-900">{supplier.scopeBreakdown.transport}t ({transPct.toFixed(0)}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decarbonization Levers & Why Supplier C Leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-[#0a2e24] text-white rounded-2xl p-6 border border-[#0a2e24]/20 shadow-md">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#10b981]" />
            <h3 className="font-bold text-sm text-[#10b981]">Why Supplier C Cuts 47 Tons CO₂e vs Supplier B</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Primary aluminium smelting is one of the world's most electricity-intensive processes. Supplier B relies on a coal-fired thermal grid (27.5t grid emissions), whereas Supplier C operates 100% dedicated run-of-river hydro power and 85% recycled scrap circular loop.
          </p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center text-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0 text-[#10b981]" />
              <span>Hydro Power Electricity saves ~18.7 tons CO₂</span>
            </div>
            <div className="flex items-center text-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0 text-[#10b981]" />
              <span>85% Scrap Recycled circular feedstock saves ~12.8 tons CO₂</span>
            </div>
            <div className="flex items-center text-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0 text-[#10b981]" />
              <span>Electrified Rail Transit saves ~1.5 tons CO₂ vs heavy diesel trucking</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center space-x-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-[#0a2e24]" />
            <h3 className="font-bold text-sm text-slate-900">Audit & Scope 3 Data Integrity Tiers</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            In standard procurement, missing or unverified data causes companies to misreport Scope 3 emissions. CarbonCommerce classifies every quote into three trust tiers:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
              <span className="font-bold text-[#0a2e24]">Tier 1: Verified (Supplier C)</span> — Third-party audited via ISO 14067 LCA and digital custody sensor integration. Audit hash recorded on passport.
            </div>
            <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950">
              <span className="font-bold text-sky-900">Tier 2: Reported (Supplier A)</span> — Supplier-submitted annual corporate ESG sustainability disclosures.
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
              <span className="font-bold text-amber-900">Tier 3: Estimated (Supplier B)</span> — Statistical sector averages from IPCC/Ecoinvent databases.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
