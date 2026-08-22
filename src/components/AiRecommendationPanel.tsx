import React from 'react';
import { ScoredSupplier, BuyerRequirement, PriorityWeights, AiRecommendationResult } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, TrendingDown, Clock, Award, CheckCircle2, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { formatINR, formatINRFull } from '../lib/scoring';

interface AiRecommendationPanelProps {
  topSupplier: ScoredSupplier;
  allSuppliers: ScoredSupplier[];
  requirement: BuyerRequirement;
  weights: PriorityWeights;
  aiResult?: AiRecommendationResult | null;
  isLoadingAi?: boolean;
  onRefreshAi?: () => void;
  onSelectSupplier: (supplier: ScoredSupplier) => void;
}

export const AiRecommendationPanel: React.FC<AiRecommendationPanelProps> = ({
  topSupplier,
  allSuppliers,
  requirement,
  weights,
  aiResult,
  isLoadingAi = false,
  onRefreshAi,
  onSelectSupplier,
}) => {
  if (!topSupplier) return null;

  const cheapest = [...allSuppliers].sort((a, b) => a.price - b.price)[0];
  const lowestCarbon = [...allSuppliers].sort((a, b) => a.co2Tons - b.co2Tons)[0];

  const priceDelta = topSupplier.price - cheapest.price;
  const pricePct = cheapest.price > 0 ? ((priceDelta / cheapest.price) * 100).toFixed(1) : '0';
  const co2CutVsCheapest = cheapest.co2Tons - topSupplier.co2Tons;
  const co2CutPct = cheapest.co2Tons > 0 ? ((co2CutVsCheapest / cheapest.co2Tons) * 100).toFixed(0) : '0';

  // Default natural language justification if AI result isn't loaded yet
  const summaryText = aiResult?.oneSentenceSummary || (
    topSupplier.id === 'supplier-c' || topSupplier.name.includes('C')
      ? `A price delta of just ₹${(priceDelta / 100000).toFixed(1)}L (${pricePct}%) buys a ${co2CutPct}% CO₂ cut and faster delivery vs the cheapest alternative (Supplier B at ₹${(cheapest.price / 100000).toFixed(1)}L with ${cheapest.co2Tons}t CO₂).`
      : topSupplier.id === cheapest.id
      ? `${topSupplier.name} wins on cost efficiency (${formatINR(topSupplier.price)}), saving budget while maintaining ${topSupplier.co2Tons}t CO₂ footprint.`
      : `${topSupplier.name} delivers the optimal multi-criteria balance with ${topSupplier.co2Tons}t CO₂ at ${formatINR(topSupplier.price)} (${topSupplier.deliveryDays}d delivery).`
  );

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0a2e24] text-white p-5 sm:p-6 shadow-xl border border-emerald-500/20">
      
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with AI Pill */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#10b981]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#10b981]">
                AI Sourcing Recommendation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/20 text-emerald-200 border border-[#10b981]/30">
                Score: {(topSupplier.totalScore * 100).toFixed(1)}/100 (#1 Rank)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif tracking-tight text-white mt-0.5">
              {topSupplier.name}
            </h2>
          </div>
        </div>

        {/* Live Refresh AI Button */}
        {onRefreshAi && (
          <button
            id="btn-refresh-ai"
            onClick={onRefreshAi}
            disabled={isLoadingAi}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10 transition-colors disabled:opacity-50"
            title="Re-run Gemini AI multi-criteria analysis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
            <span>{isLoadingAi ? 'Analyzing...' : 'Refresh AI Analysis'}</span>
          </button>
        )}
      </div>

      {/* Main 1-Sentence Executive Justification */}
      <div className="relative z-10 my-4 p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
        <div className="flex items-start space-x-3">
          <Award className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs uppercase font-bold text-emerald-300 tracking-wider">Executive Decision Justification</p>
            <p className="text-sm sm:text-base font-semibold text-white mt-0.5 leading-snug">
              "{summaryText}"
            </p>
          </div>
        </div>
      </div>

      {/* Key Metric Comparison Badges */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        
        {/* Cost Comparison */}
        <div className="p-3.5 rounded-xl bg-black/25 border border-white/10">
          <div className="text-[11px] text-slate-300 flex items-center justify-between font-medium">
            <span>Procurement Quote</span>
            <span className="text-xs font-bold text-white">{formatINR(topSupplier.price)}</span>
          </div>
          <p className="text-xs font-semibold text-amber-300 mt-1">
            {priceDelta > 0 ? `+₹${(priceDelta / 100000).toFixed(1)}L (+${pricePct}%) vs raw lowest` : 'Lowest quote on market'}
          </p>
          <p className="text-[10px] text-slate-300 mt-0.5">Budget: {formatINR(requirement.budget)}</p>
        </div>

        {/* Carbon Comparison */}
        <div className="p-3.5 rounded-xl bg-black/25 border border-[#10b981]/30 ring-1 ring-[#10b981]/20">
          <div className="text-[11px] text-slate-300 flex items-center justify-between font-medium">
            <span>Carbon Footprint</span>
            <span className="text-xs font-bold text-[#10b981]">{topSupplier.co2Tons} tons CO₂e</span>
          </div>
          <p className="text-xs font-bold text-emerald-300 mt-1 flex items-center">
            <TrendingDown className="w-3 h-3 mr-1" />
            {co2CutVsCheapest > 0 ? `${co2CutPct}% emissions cut vs cheapest` : 'Lowest carbon option'}
          </p>
          <p className="text-[10px] text-slate-300 mt-0.5">Tier: {topSupplier.dataQuality} (Scope 1-3)</p>
        </div>

        {/* Delivery & Assurance */}
        <div className="p-3.5 rounded-xl bg-black/25 border border-white/10">
          <div className="text-[11px] text-slate-300 flex items-center justify-between font-medium">
            <span>Fulfillment Speed</span>
            <span className="text-xs font-bold text-white">{topSupplier.deliveryDays} Days</span>
          </div>
          <p className="text-xs font-semibold text-sky-300 mt-1 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {topSupplier.reliabilityScore}% reliability rating
          </p>
          <p className="text-[10px] text-slate-300 mt-0.5">Lead target: {requirement.deliveryWindowDays} days</p>
        </div>

      </div>

      {/* Tradeoff Highlights & Negotiation Advice */}
      {aiResult && aiResult.tradeoffHighlights && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-2.5 my-3 pt-2 text-xs">
          {aiResult.tradeoffHighlights.map((hl, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="font-bold text-[#10b981] block mb-0.5">{hl.title}</span>
              <p className="text-slate-200 text-[11px] leading-relaxed">{hl.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* ESG Compliance & Negotiation Footnote */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
        <div className="flex items-center space-x-2 text-emerald-200">
          <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
          <span className="text-[11px] text-slate-300">
            {aiResult?.esgComplianceNote || "Meets GHG Protocol Scope 3 Category 1 (Purchased Goods) audit guidelines with third-party verification."}
          </span>
        </div>

        {/* Action Button: Proceed to PO */}
        <button
          id="btn-select-top-recommendation"
          onClick={() => onSelectSupplier(topSupplier)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-emerald-400 text-slate-950 font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <span>Select & Issue PO</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
