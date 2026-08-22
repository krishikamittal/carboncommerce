import React from 'react';
import { PriorityWeights } from '../types';
import { Sliders, DollarSign, Leaf, Clock, Sparkles } from 'lucide-react';

interface PrioritySlidersProps {
  weights: PriorityWeights;
  onChange: (weights: PriorityWeights) => void;
}

export const PrioritySliders: React.FC<PrioritySlidersProps> = ({ weights, onChange }) => {
  // Balanced adjustment helper: when one slider changes, proportionally redistribute the remaining 100 - val to the other two
  const handleSliderChange = (changedKey: keyof PriorityWeights, newVal: number) => {
    const clampedVal = Math.max(0, Math.min(100, Math.round(newVal)));
    const otherKeys = (['cost', 'carbon', 'reliability'] as Array<keyof PriorityWeights>).filter(k => k !== changedKey);
    
    const remainingToDistribute = 100 - clampedVal;
    const currentSumOthers = weights[otherKeys[0]] + weights[otherKeys[1]];

    let newOther1 = 0;
    let newOther2 = 0;

    if (currentSumOthers > 0) {
      newOther1 = Math.round((weights[otherKeys[0]] / currentSumOthers) * remainingToDistribute);
      newOther2 = remainingToDistribute - newOther1;
    } else {
      newOther1 = Math.floor(remainingToDistribute / 2);
      newOther2 = remainingToDistribute - newOther1;
    }

    const updated: PriorityWeights = {
      cost: weights.cost,
      carbon: weights.carbon,
      reliability: weights.reliability,
    };
    updated[changedKey] = clampedVal;
    updated[otherKeys[0]] = Math.max(0, newOther1);
    updated[otherKeys[1]] = Math.max(0, newOther2);

    onChange(updated);
  };

  const applyPreset = (preset: { cost: number; carbon: number; reliability: number }) => {
    onChange(preset);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#0a2e24]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Decision Priority Weighting</h3>
            <p className="text-xs text-slate-600">Sliders adjust live supplier ranking. Total always sums to 100%.</p>
          </div>
        </div>

        {/* Combined proportion bar */}
        <div className="w-full sm:w-52">
          <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-100 ring-1 ring-slate-200/80">
            <div 
              className="bg-amber-600 transition-all duration-200" 
              style={{ width: `${weights.cost}%` }}
              title={`Cost: ${weights.cost}%`}
            />
            <div 
              className="bg-[#10b981] transition-all duration-200" 
              style={{ width: `${weights.carbon}%` }}
              title={`Carbon: ${weights.carbon}%`}
            />
            <div 
              className="bg-sky-600 transition-all duration-200" 
              style={{ width: `${weights.reliability}%` }}
              title={`Reliability: ${weights.reliability}%`}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-600 font-semibold mt-1">
            <span className="text-amber-800">Cost {weights.cost}%</span>
            <span className="text-emerald-800">CO₂ {weights.carbon}%</span>
            <span className="text-sky-800">Speed {weights.reliability}%</span>
          </div>
        </div>
      </div>

      {/* 3 Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        
        {/* Cost Slider */}
        <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="slider-cost" className="flex items-center text-xs font-bold text-amber-950">
              <DollarSign className="w-3.5 h-3.5 mr-1 text-amber-700" />
              Cost Priority
            </label>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/60">
              {weights.cost}%
            </span>
          </div>
          <input
            id="slider-cost"
            type="range"
            min="0"
            max="100"
            step="1"
            value={weights.cost}
            onChange={(e) => handleSliderChange('cost', Number(e.target.value))}
            className="w-full h-2 bg-amber-200/70 rounded-lg appearance-none cursor-pointer accent-amber-700"
          />
          <p className="text-[11px] text-amber-900 mt-1.5 font-medium">Focus on minimizing raw quote price.</p>
        </div>

        {/* Carbon Slider */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 ring-1 ring-emerald-500/20">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="slider-carbon" className="flex items-center text-xs font-bold text-emerald-950">
              <Leaf className="w-3.5 h-3.5 mr-1 text-emerald-700" />
              Carbon Footprint (CO₂)
            </label>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-200/90 text-emerald-950 border border-emerald-400/80">
              {weights.carbon}%
            </span>
          </div>
          <input
            id="slider-carbon"
            type="range"
            min="0"
            max="100"
            step="1"
            value={weights.carbon}
            onChange={(e) => handleSliderChange('carbon', Number(e.target.value))}
            className="w-full h-2 bg-emerald-200/80 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />
          <p className="text-[11px] text-emerald-900 mt-1.5 font-medium">Penalize heavy Scope 1-3 fossil emissions.</p>
        </div>

        {/* Reliability / Delivery Slider */}
        <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200/60">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="slider-reliability" className="flex items-center text-xs font-bold text-sky-950">
              <Clock className="w-3.5 h-3.5 mr-1 text-sky-700" />
              Delivery & Reliability
            </label>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 border border-sky-300/60">
              {weights.reliability}%
            </span>
          </div>
          <input
            id="slider-reliability"
            type="range"
            min="0"
            max="100"
            step="1"
            value={weights.reliability}
            onChange={(e) => handleSliderChange('reliability', Number(e.target.value))}
            className="w-full h-2 bg-sky-200/70 rounded-lg appearance-none cursor-pointer accent-sky-700"
          />
          <p className="text-[11px] text-sky-900 mt-1.5 font-medium">Short lead times & verified track record.</p>
        </div>

      </div>

      {/* Preset Strategy Chips */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-600 mr-1 flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-[#0a2e24]" />
          Strategy Presets:
        </span>

        <button
          id="btn-preset-balanced"
          type="button"
          onClick={() => applyPreset({ cost: 35, carbon: 45, reliability: 20 })}
          className={`text-xs px-3 py-1 rounded-lg transition-all font-semibold ${
            weights.carbon === 45 && weights.cost === 35 && weights.reliability === 20
              ? 'bg-[#0a2e24] text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          Balanced ESG (35 / 45 / 20)
        </button>

        <button
          id="btn-preset-green"
          type="button"
          onClick={() => applyPreset({ cost: 20, carbon: 70, reliability: 10 })}
          className={`text-xs px-3 py-1 rounded-lg transition-all font-semibold ${
            weights.carbon === 70 && weights.cost === 20
              ? 'bg-[#0a2e24] text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          Green First (20 / 70 / 10)
        </button>

        <button
          id="btn-preset-cost"
          type="button"
          onClick={() => applyPreset({ cost: 75, carbon: 15, reliability: 10 })}
          className={`text-xs px-3 py-1 rounded-lg transition-all font-semibold ${
            weights.cost === 75
              ? 'bg-[#0a2e24] text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          Lowest Cost (75 / 15 / 10)
        </button>

        <button
          id="btn-preset-speed"
          type="button"
          onClick={() => applyPreset({ cost: 20, carbon: 20, reliability: 60 })}
          className={`text-xs px-3 py-1 rounded-lg transition-all font-semibold ${
            weights.reliability === 60
              ? 'bg-[#0a2e24] text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          Fastest Dispatch (20 / 20 / 60)
        </button>
      </div>
    </div>
  );
};
