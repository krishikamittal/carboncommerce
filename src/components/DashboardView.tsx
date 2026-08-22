import React, { useState } from 'react';
import { PurchaseOrder, DigitalPassport } from '../types';
import { formatINR, formatINRFull } from '../lib/scoring';
import { DollarSign, Leaf, ShoppingCart, TrendingDown, Award, ArrowUpRight, ShieldCheck, QrCode, PlusCircle, Sparkles, Filter, ExternalLink, Layers, ArrowRight } from 'lucide-react';

interface DashboardViewProps {
  purchaseOrders: PurchaseOrder[];
  passports: DigitalPassport[];
  onStartNewSourcing: () => void;
  onViewPassport: (passportId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  purchaseOrders,
  passports,
  onStartNewSourcing,
  onViewPassport,
}) => {
  const [timeframe, setTimeframe] = useState<'All' | '2026' | 'Q3'>('All');

  // Compute aggregate metrics
  const totalSpend = purchaseOrders.reduce((sum, po) => sum + po.totalCost, 0);
  const totalCo2 = purchaseOrders.reduce((sum, po) => sum + po.totalCo2Tons, 0);
  const totalBaselineCo2 = purchaseOrders.reduce((sum, po) => sum + (po.baselineCo2Tons || (po.totalCo2Tons * 1.6)), 0);
  const totalCo2Avoided = Math.max(0, totalBaselineCo2 - totalCo2);
  const avgCarbonSavingsPct = totalBaselineCo2 > 0 
    ? ((totalCo2Avoided / totalBaselineCo2) * 100).toFixed(1)
    : '42.8';

  // Monthly emission data points for chart
  const monthlyData = [
    { month: 'Apr 2026', baseline: 65, actual: 62, spend: 1850000 },
    { month: 'May 2026', baseline: 78, actual: 60, spend: 2200000 },
    { month: 'Jun 2026', baseline: 85, actual: 52, spend: 2400000 },
    { month: 'Jul 2026', baseline: 92, actual: 48, spend: 2150000 },
    { month: 'Aug 2026', baseline: 114, actual: 64.5, spend: 3380000 }
  ];

  // Scatter plot data for Cost vs Carbon
  const scatterPoints = [
    { name: 'Supplier B (Thermal Smelter)', cost: 1900000, co2: 78, tier: 'Estimated', recommended: false },
    { name: 'Supplier A (Apex Metals)', cost: 2000000, co2: 42, tier: 'Reported', recommended: false },
    { name: 'Supplier C (EcoAlloy Hydro)', cost: 2050000, co2: 31, tier: 'Verified', recommended: true },
    { name: 'Standard Corrugators', cost: 760000, co2: 18.5, tier: 'Estimated', recommended: false },
    { name: 'BioPack Solutions', cost: 820000, co2: 11.2, tier: 'Verified', recommended: true },
    { name: 'Classic Blast Furnaces', cost: 395000, co2: 11.8, tier: 'Reported', recommended: false },
    { name: 'GreenSteel Electra', cost: 435000, co2: 5.4, tier: 'Verified', recommended: true },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-[#0a2e24] border border-emerald-300">
              Executive ESG & Procurement Command Center
            </span>
            <span className="text-xs text-slate-600 font-semibold">Scope 3 Real-time Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-1">
            Sustainable Procurement Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time tracking of capital efficiency, avoided greenhouse gas emissions, and verified supplier passports.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            id="btn-dash-new-sourcing"
            onClick={onStartNewSourcing}
            className="flex items-center space-x-2 px-4.5 py-2.5 rounded-xl bg-[#0a2e24] hover:bg-[#07241c] text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4 text-[#10b981]" />
            <span>Launch Sourcing Sorter</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Spend */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Spend</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-serif mt-2">
            {formatINR(totalSpend)}
          </p>
          <p className="text-xs text-slate-600 mt-1 flex items-center">
            <span className="font-semibold text-slate-900 mr-1">{purchaseOrders.length}</span> Purchase Orders Issued
          </p>
        </div>

        {/* Cumulative CO2 Tracked */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Cumulative CO₂</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-[#0a2e24] border border-emerald-200">
              <Leaf className="w-4 h-4 text-[#10b981]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#0a2e24] font-serif mt-2">
            {totalCo2.toFixed(1)} <span className="text-sm font-sans font-semibold text-slate-600">tons CO₂e</span>
          </p>
          <p className="text-xs text-emerald-800 font-medium mt-1">
            Scope 1, 2 & 3 Category 1 Audited
          </p>
        </div>

        {/* Avg Carbon Reduction % */}
        <div className="p-5 rounded-2xl bg-white border border-[#10b981]/30 ring-1 ring-[#10b981]/20 shadow-xs bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#0a2e24] uppercase tracking-wider">Avg Carbon Savings</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-[#0a2e24] border border-emerald-300">
              <TrendingDown className="w-4 h-4 text-[#0a2e24]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#0a2e24] font-serif mt-2">
            ↓ {avgCarbonSavingsPct}%
          </p>
          <p className="text-xs text-emerald-800 font-medium mt-1">
            vs standard market baseline
          </p>
        </div>

        {/* Total CO2 Kept Out of Atmosphere */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Net CO₂ Avoided</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
              <Award className="w-4 h-4 text-teal-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-teal-950 font-serif mt-2">
            {totalCo2Avoided.toFixed(1)} <span className="text-sm font-sans font-semibold text-slate-600">tons CO₂e</span>
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Direct decarbonization impact
          </p>
        </div>

      </div>

      {/* Mandatory Worked Example Highlight Stat Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0a2e24] text-white shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#10b981]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-[#10b981]/20 text-emerald-200 border border-[#10b981]/30">
                  Real-World Impact Spotlight
                </span>
                <span className="text-xs text-slate-300 font-medium">10,000 kg Aluminium Sourcing Case</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-white mt-1">
                A real carbon-smart supplier switch cut emissions from 57t to 32t (~44% reduction) for &lt;2% cost increase.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                By making carbon a first-class visible variable alongside price and delivery, procurement teams avoided 25 metric tons of CO₂ by reallocating spend to hydro-powered, high-scrap smelters with zero supply-chain disruption.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onStartNewSourcing}
              className="px-4.5 py-2.5 rounded-xl bg-[#10b981] hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-xs flex items-center space-x-1.5"
            >
              <span>Try Sourcing Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2 Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Emissions Over Time (Baseline vs Actual) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Procurement Emissions Over Time</h3>
              <p className="text-xs text-slate-600">Baseline unoptimized emissions vs CarbonCommerce actuals (tons CO₂e)</p>
            </div>
            
            <div className="flex items-center space-x-3 text-xs font-medium">
              <span className="flex items-center"><span className="w-3 h-3 rounded bg-slate-300 mr-1.5" /> Conventional Baseline</span>
              <span className="flex items-center"><span className="w-3 h-3 rounded bg-[#0a2e24] mr-1.5" /> CarbonCommerce Actual</span>
            </div>
          </div>

          {/* SVG Visual Bar Chart */}
          <div className="h-60 flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyData.map((item, idx) => {
              const maxScale = 120;
              const baselineHeight = (item.baseline / maxScale) * 100;
              const actualHeight = (item.actual / maxScale) * 100;
              const saved = item.baseline - item.actual;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] text-[#0a2e24] font-bold mb-1 opacity-90">
                    -{saved.toFixed(0)}t
                  </div>
                  <div className="w-full flex items-end justify-center gap-1.5 h-44">
                    {/* Baseline Bar */}
                    <div
                      style={{ height: `${baselineHeight}%` }}
                      className="w-full max-w-[20px] bg-slate-300 rounded-t-md group-hover:bg-slate-400 transition-all"
                      title={`${item.month} Baseline: ${item.baseline}t CO₂`}
                    />
                    {/* Actual Bar */}
                    <div
                      style={{ height: `${actualHeight}%` }}
                      className="w-full max-w-[20px] bg-[#0a2e24] rounded-t-md group-hover:bg-emerald-900 transition-all shadow-xs"
                      title={`${item.month} Actual: ${item.actual}t CO₂`}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 mt-2 truncate w-full text-center">
                    {item.month.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Cumulative Scope 3 Reduction: <strong className="text-[#0a2e24] font-bold">42.8% YoY</strong></span>
            <span>Total Orders: <strong className="text-slate-900 font-bold">5 Batches</strong></span>
          </div>
        </div>

        {/* Chart 2: Cost vs Carbon Scatter Plot */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cost vs. Carbon Pareto Frontier</h3>
              <p className="text-xs text-slate-600">Supplier positioning: Price (X-axis) vs CO₂ Footprint (Y-axis)</p>
            </div>
            <span className="text-[11px] font-bold text-[#0a2e24] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              ★ AI Optimal Frontier
            </span>
          </div>

          {/* Scatter Stage Canvas / Graph */}
          <div className="h-60 relative bg-slate-50/70 rounded-xl border border-slate-200 p-4">
            
            {/* Grid lines */}
            <div className="absolute inset-4 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
            </div>

            {/* Y Axis Label */}
            <div className="absolute top-2 left-2 text-[10px] font-bold text-[#0a2e24] uppercase">
              ↑ Higher CO₂ Footprint
            </div>

            {/* X Axis Label */}
            <div className="absolute bottom-2 right-2 text-[10px] font-bold text-amber-900 uppercase">
              Higher Cost →
            </div>

            {/* Scatter points */}
            {scatterPoints.map((pt, i) => {
              // Normalize cost: 395k to 2050k -> 10% to 90%
              const minCost = 350000;
              const maxCost = 2150000;
              const leftPct = ((pt.cost - minCost) / (maxCost - minCost)) * 80 + 10;
              
              // Normalize CO2: 5t to 80t -> 85% (low co2 is bottom) to 15% (high co2 is top)
              const minCo2 = 4;
              const maxCo2 = 82;
              const topPct = 85 - (((pt.co2 - minCo2) / (maxCo2 - minCo2)) * 70);

              return (
                <div
                  key={i}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-transform group-hover:scale-150 ${
                      pt.recommended
                        ? 'bg-[#0a2e24] ring-4 ring-[#10b981]/50 shadow-md text-white'
                        : 'bg-slate-700 ring-2 ring-slate-300 text-white'
                    }`}
                  >
                    {pt.recommended && <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />}
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30 w-48 p-2.5 rounded-xl bg-slate-900 text-white text-[11px] shadow-lg pointer-events-none">
                    <p className="font-bold text-[#10b981]">{pt.name}</p>
                    <p className="text-slate-300">Quote: {formatINR(pt.cost)}</p>
                    <p className="text-emerald-400 font-semibold">Emissions: {pt.co2}t CO₂e</p>
                    <p className="text-[10px] text-slate-400">Tier: {pt.tier}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#0a2e24] mr-1.5" /> Pareto-Efficient AI Recommendations</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-slate-700 mr-1.5" /> High-Carbon Bids</span>
          </div>
        </div>

      </div>

      {/* Recent Purchase Orders & Verifiable Passports Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Procurement Orders & Digital Carbon Passports</h3>
            <p className="text-xs text-slate-600">Active contracts with verifiable audit hashes and Scope 3 lifecycle badges.</p>
          </div>
          <span className="text-xs font-bold text-[#0a2e24] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {purchaseOrders.length} Logged Passports
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">PO & Date</th>
                <th className="py-3.5 px-4">Product Requirement</th>
                <th className="py-3.5 px-4">Selected Supplier</th>
                <th className="py-3.5 px-4">Spend (INR)</th>
                <th className="py-3.5 px-4">CO₂ Footprint</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Digital Passport</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* PO Number & Date */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    <div>
                      <span>{po.poNumber}</span>
                      <p className="font-sans font-normal text-[11px] text-slate-500">
                        {new Date(po.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>

                  {/* Product */}
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {po.requirement.productName}
                      </span>
                      <p className="text-[11px] text-slate-500">{po.requirement.quantity.toLocaleString()} {po.requirement.unit}</p>
                    </div>
                  </td>

                  {/* Supplier */}
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-semibold text-slate-900 text-xs">{po.supplier.name}</span>
                      <span className="block text-[10px] text-[#0a2e24] font-semibold">{po.supplier.dataQuality} Tier</span>
                    </div>
                  </td>

                  {/* Spend */}
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatINRFull(po.totalCost)}
                  </td>

                  {/* CO2 */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-800 flex items-center">
                      <Leaf className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      {po.totalCo2Tons} t CO₂
                    </span>
                    <span className="text-[10px] text-emerald-800 font-medium">
                      saved ~{po.co2SavedVsBaselineTons}t vs base
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-[#0a2e24] border border-emerald-300">
                      {po.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      id={`btn-view-passport-${po.id}`}
                      type="button"
                      onClick={() => onViewPassport(po.passportId)}
                      className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0a2e24] text-xs font-bold border border-emerald-200 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#0a2e24]" />
                      <span>View Passport</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
