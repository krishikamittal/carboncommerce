import React, { useState } from 'react';
import { ScoredSupplier, PriorityWeights } from '../types';
import { ShieldCheck, HelpCircle, CheckCircle, ChevronDown, ChevronUp, ArrowRight, Award, Factory, Zap, Truck, Layers, Leaf, AlertTriangle } from 'lucide-react';
import { formatINR, formatINRFull } from '../lib/scoring';

interface SupplierComparisonTableProps {
  suppliers: ScoredSupplier[];
  weights: PriorityWeights;
  highlightSupplierId?: string;
  onSelectSupplier: (supplier: ScoredSupplier) => void;
  onOpenScopeModal: (supplier: ScoredSupplier) => void;
}

export const SupplierComparisonTable: React.FC<SupplierComparisonTableProps> = ({
  suppliers,
  weights,
  highlightSupplierId,
  onSelectSupplier,
  onOpenScopeModal,
}) => {
  const [expandedSupplierId, setExpandedSupplierId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSupplierId(expandedSupplierId === id ? null : id);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Verified':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-700" />
            Verified (Tier 1)
          </span>
        );
      case 'Reported':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-900 border border-sky-300">
            <CheckCircle className="w-3.5 h-3.5 mr-1 text-sky-700" />
            Reported (Tier 2)
          </span>
        );
      case 'Estimated':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-700" />
            Estimated (Tier 3)
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      
      {/* Table Header / Summary */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">Supplier Comparison Matrix</h3>
          <p className="text-xs text-slate-600">
            Ranked dynamically by weighted multi-criteria decision score (Cost {weights.cost}% + Carbon {weights.carbon}% + Speed {weights.reliability}%).
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 flex items-center gap-3">
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#10b981] mr-1.5" /> Best in Category</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" /> Lowest Quote</span>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4 w-16">Rank</th>
              <th className="py-3.5 px-4">Supplier & Location</th>
              <th className="py-3.5 px-4">Price (INR)</th>
              <th className="py-3.5 px-4">CO₂ Footprint</th>
              <th className="py-3.5 px-4">Delivery & Reliability</th>
              <th className="py-3.5 px-4">Data Quality</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map((supplier) => {
              const isTop = supplier.rank === 1;
              const isHighlighted = supplier.id === highlightSupplierId;
              const isExpanded = expandedSupplierId === supplier.id;

              return (
                <React.Fragment key={supplier.id}>
                  <tr
                    className={`transition-colors ${
                      isTop
                        ? 'bg-emerald-50/40 hover:bg-emerald-50/70'
                        : isHighlighted
                        ? 'bg-sky-50/50 hover:bg-sky-50/80'
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Rank & Score */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col items-center">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isTop
                              ? 'bg-[#0a2e24] text-white shadow-xs'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          #{supplier.rank}
                        </span>
                        <span className="text-[11px] font-bold text-slate-800 mt-1">
                          {(supplier.totalScore * 100).toFixed(1)}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium">pts</span>
                      </div>
                    </td>

                    {/* Supplier Name & Location */}
                    <td className="py-4 px-4 align-top">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900 text-sm">
                            {supplier.name}
                          </span>
                          {isTop && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0a2e24] text-white flex items-center">
                              <Award className="w-3 h-3 mr-0.5 text-emerald-400" /> AI Top Pick
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{supplier.location}</p>
                        
                        {/* Scope pill preview */}
                        <div className="flex items-center gap-1 mt-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenScopeModal(supplier)}
                            className="text-[10px] font-semibold text-[#0a2e24] hover:text-emerald-950 underline flex items-center"
                          >
                            <Layers className="w-3 h-3 mr-1 text-emerald-600" />
                            View Scope 1-3 Breakdown
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Price & Delta */}
                    <td className="py-4 px-4 align-top">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">
                          {formatINRFull(supplier.price)}
                        </span>
                        <div className="mt-0.5">
                          {supplier.priceDeltaVsCheapest === 0 ? (
                            <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded-md">
                              ★ Lowest Price
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-600 font-medium">
                              +{supplier.priceDeltaVsCheapest}% (+{formatINR(supplier.costDeltaAmount)})
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Carbon Footprint & Delta */}
                    <td className="py-4 px-4 align-top">
                      <div>
                        <span className="font-bold text-emerald-800 text-sm flex items-center">
                          <Leaf className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          {supplier.co2Tons} tons CO₂e
                        </span>
                        <div className="mt-0.5">
                          {supplier.co2DeltaVsHighest > 0 ? (
                            <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                              ↓ {supplier.co2DeltaVsHighest}% lower CO₂
                            </span>
                          ) : (
                            <span className="text-[11px] text-amber-800 font-medium">
                              High emission profile
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Delivery & Reliability */}
                    <td className="py-4 px-4 align-top">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">
                          {supplier.deliveryDays} Days
                        </span>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <div className="w-14 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-sky-600 h-1.5 rounded-full"
                              style={{ width: `${supplier.reliabilityScore}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-700">
                            {supplier.reliabilityScore}%
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Data Quality Tier */}
                    <td className="py-4 px-4 align-top">
                      {getTierBadge(supplier.dataQuality)}
                      <p className="text-[10px] text-slate-600 mt-1 max-w-[140px] truncate" title={supplier.auditProvider}>
                        {supplier.auditProvider || 'Standard self-disclosure'}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right align-top">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => toggleExpand(supplier.id)}
                          className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors"
                          title="Toggle supplier details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          id={`btn-select-supplier-${supplier.id}`}
                          type="button"
                          onClick={() => onSelectSupplier(supplier)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                            isTop
                              ? 'bg-[#0a2e24] hover:bg-[#07241c] text-white shadow-xs'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          <span>Select</span>
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Accordion Details */}
                  {isExpanded && (
                    <tr className="bg-slate-50/90 border-b border-slate-200">
                      <td colSpan={7} className="p-4 sm:p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          
                          {/* Scope Breakdown */}
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                            <h4 className="font-bold text-slate-900 flex items-center mb-2">
                              <Layers className="w-4 h-4 mr-1.5 text-[#0a2e24]" />
                              GHG Lifecycle Emissions Breakdown
                            </h4>
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-slate-600">
                                <span className="flex items-center"><Factory className="w-3.5 h-3.5 mr-1 text-slate-500" /> Raw Materials Extraction:</span>
                                <span className="font-bold text-slate-900">{supplier.scopeBreakdown.rawMaterial} t CO₂</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-600">
                                <span className="flex items-center"><Layers className="w-3.5 h-3.5 mr-1 text-slate-500" /> Smelting & Processing:</span>
                                <span className="font-bold text-slate-900">{supplier.scopeBreakdown.manufacturing} t CO₂</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-600">
                                <span className="flex items-center"><Zap className="w-3.5 h-3.5 mr-1 text-amber-600" /> Grid Energy Intensity:</span>
                                <span className="font-bold text-slate-900">{supplier.scopeBreakdown.energy} t CO₂</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-600">
                                <span className="flex items-center"><Truck className="w-3.5 h-3.5 mr-1 text-sky-600" /> Freight & Transport:</span>
                                <span className="font-bold text-slate-900">{supplier.scopeBreakdown.transport} t CO₂</span>
                              </div>
                            </div>
                          </div>

                          {/* Green Practices & Levers */}
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                            <h4 className="font-bold text-slate-900 flex items-center mb-2">
                              <Leaf className="w-4 h-4 mr-1.5 text-[#0a2e24]" />
                              Verified Decarbonization Levers
                            </h4>
                            <ul className="space-y-1 text-slate-600">
                              {supplier.greenPractices.map((practice, idx) => (
                                <li key={idx} className="flex items-start">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0 mt-0.5" />
                                  <span>{practice}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Compliance & Certifications */}
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                            <h4 className="font-bold text-slate-900 flex items-center mb-2">
                              <ShieldCheck className="w-4 h-4 mr-1.5 text-[#0a2e24]" />
                              Audit Credentials & Terms
                            </h4>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {supplier.certifications.map((c, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-950 border border-emerald-200">
                                  {c}
                                </span>
                              ))}
                            </div>
                            <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                              <p><span className="font-semibold text-slate-800">MOQ:</span> {supplier.minOrderQuantity.toLocaleString()} kg</p>
                              <p><span className="font-semibold text-slate-800">Payment Terms:</span> {supplier.paymentTerms}</p>
                              <p><span className="font-semibold text-slate-800">Contact:</span> {supplier.contactEmail}</p>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
