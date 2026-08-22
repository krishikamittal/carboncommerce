import React from 'react';
import { BuyerRequirement } from '../types';
import { DEMO_PRESET_REQUIREMENTS } from '../data/seedData';
import { Package, DollarSign, Calendar, MapPin, Sparkles, ArrowRight, Tag, Factory } from 'lucide-react';
import { formatINR } from '../lib/scoring';

interface BuyerPrepFormProps {
  requirement: BuyerRequirement;
  setRequirement: (req: BuyerRequirement) => void;
  onProceed: () => void;
}

export const BuyerPrepForm: React.FC<BuyerPrepFormProps> = ({
  requirement,
  setRequirement,
  onProceed,
}) => {
  const handlePresetSelect = (preset: BuyerRequirement) => {
    setRequirement(preset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceed();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Preset Selector Banner */}
      <div className="bg-[#0a2e24] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-[#0a2e24]/20 relative overflow-hidden">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#10b981]" />
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
            Quick Sourcing Scenarios & Worked Demo
          </span>
        </div>
        <h2 className="text-xl font-bold font-serif text-white">
          Step 1: Buyer Requirement Definition
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Select the pre-configured 10,000 kg aluminium worked example to test the full Cost vs Carbon vs Reliability decision engine, or choose another commodity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4">
          {DEMO_PRESET_REQUIREMENTS.map((preset) => {
            const isSelected = requirement.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                id={`btn-preset-${preset.id}`}
                onClick={() => handlePresetSelect(preset)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-[#10b981]/20 border-[#10b981] ring-2 ring-[#10b981]/40 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wide">
                    {preset.category.split(' ')[0]}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#10b981]" />}
                </div>
                <p className="text-xs font-bold text-white mt-1 line-clamp-1">{preset.productName}</p>
                <div className="flex justify-between items-center text-[11px] text-slate-300 mt-1.5 pt-1.5 border-t border-white/10">
                  <span>{preset.quantity.toLocaleString()} {preset.unit}</span>
                  <span className="font-semibold text-emerald-300">{formatINR(preset.budget)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center">
          <Tag className="w-4 h-4 mr-2 text-[#0a2e24]" />
          Purchase Requirement Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          
          {/* Product Name */}
          <div className="md:col-span-2">
            <label htmlFor="input-product-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Product / Material Specification Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Package className="w-4 h-4" />
              </div>
              <input
                id="input-product-name"
                type="text"
                required
                value={requirement.productName}
                onChange={(e) => setRequirement({ ...requirement, productName: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                placeholder="e.g. 10,000 kg Aluminium Billets Grade 6063"
              />
            </div>
          </div>

          {/* Commodity Category */}
          <div>
            <label htmlFor="input-category" className="block text-xs font-semibold text-slate-700 mb-1">
              Procurement Category
            </label>
            <input
              id="input-category"
              type="text"
              value={requirement.category}
              onChange={(e) => setRequirement({ ...requirement, category: e.target.value })}
              className="w-full px-3 py-2 text-sm text-slate-900 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>

          {/* Industry Sector */}
          <div>
            <label htmlFor="input-sector" className="block text-xs font-semibold text-slate-700 mb-1">
              Industry Sector / Business Unit
            </label>
            <input
              id="input-sector"
              type="text"
              value={requirement.industrySector}
              onChange={(e) => setRequirement({ ...requirement, industrySector: e.target.value })}
              className="w-full px-3 py-2 text-sm text-slate-900 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="input-quantity" className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity *
              </label>
              <input
                id="input-quantity"
                type="number"
                required
                min="1"
                value={requirement.quantity}
                onChange={(e) => setRequirement({ ...requirement, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm text-slate-900 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label htmlFor="input-unit" className="block text-xs font-semibold text-slate-700 mb-1">
                Unit of Measure
              </label>
              <select
                id="input-unit"
                value={requirement.unit}
                onChange={(e) => setRequirement({ ...requirement, unit: e.target.value })}
                className="w-full px-3 py-2 text-sm text-slate-900 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="metric tons">Metric Tons</option>
                <option value="boxes">Boxes / Units</option>
                <option value="meters">Meters</option>
                <option value="liters">Liters</option>
              </select>
            </div>
          </div>

          {/* Target Budget */}
          <div>
            <label htmlFor="input-budget" className="block text-xs font-semibold text-slate-700 mb-1">
              Target Budget (INR ₹) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                id="input-budget"
                type="number"
                required
                min="1000"
                step="1000"
                value={requirement.budget}
                onChange={(e) => setRequirement({ ...requirement, budget: Number(e.target.value) })}
                className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-semibold"
              />
            </div>
            <p className="text-[11px] text-slate-600 mt-1">Formatted: {formatINR(requirement.budget)}</p>
          </div>

          {/* Delivery Window */}
          <div>
            <label htmlFor="input-delivery-window" className="block text-xs font-semibold text-slate-700 mb-1">
              Required Delivery Window (Days) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="input-delivery-window"
                type="number"
                required
                min="1"
                max="90"
                value={requirement.deliveryWindowDays}
                onChange={(e) => setRequirement({ ...requirement, deliveryWindowDays: Number(e.target.value) })}
                className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Delivery Location */}
          <div>
            <label htmlFor="input-location" className="block text-xs font-semibold text-slate-700 mb-1">
              Destination / Fulfillment Hub
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                id="input-location"
                type="text"
                value={requirement.deliveryLocation}
                onChange={(e) => setRequirement({ ...requirement, deliveryLocation: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            id="btn-submit-requirement"
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#0a2e24] hover:bg-[#07241c] text-white font-semibold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Match Sourcing Suppliers & Calculate Carbon</span>
            <ArrowRight className="w-4 h-4 text-[#10b981]" />
          </button>
        </div>

      </form>

    </div>
  );
};
