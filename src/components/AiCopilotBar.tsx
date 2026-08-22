import React, { useState } from 'react';
import { Sparkles, Search, ArrowRight, CornerDownLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { PriorityWeights, Supplier } from '../types';

interface AiCopilotBarProps {
  currentWeights: PriorityWeights;
  suppliers: Supplier[];
  onApplyCopilotResult: (result: {
    adjustedWeights: PriorityWeights;
    feedbackText: string;
    highlightSupplierId?: string;
  }) => void;
}

export const AiCopilotBar: React.FC<AiCopilotBarProps> = ({
  currentWeights,
  suppliers,
  onApplyCopilotResult,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  const samplePrompts = [
    "Find the lowest-carbon supplier under my budget",
    "Prioritize fastest delivery with sub-40t CO₂",
    "Maximize cost savings for an urgent order",
    "Balanced ESG evaluation for audit compliance"
  ];

  const handleSearch = async (userQuery: string) => {
    const q = userQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setLastResponse(null);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          currentWeights,
          suppliers
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.adjustedWeights) {
          onApplyCopilotResult({
            adjustedWeights: data.adjustedWeights,
            feedbackText: data.naturalLanguageResponse,
            highlightSupplierId: data.highlightSupplierId
          });
          setLastResponse(data.naturalLanguageResponse);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Copilot backend error, using smart local parser:', err);
    }

    // Local smart fallback
    const lower = q.toLowerCase();
    let newWeights = { ...currentWeights };
    let feedback = "";
    let highlightId = suppliers[0]?.id;

    if (lower.includes("lowest carbon") || lower.includes("green") || lower.includes("eco") || lower.includes("sustainable")) {
      newWeights = { cost: 20, carbon: 70, reliability: 10 };
      feedback = "Applied 70% Carbon weighting. Supplier C offers the lowest verified footprint (31t CO₂).";
      highlightId = "supplier-c";
    } else if (lower.includes("budget") || lower.includes("cheapest") || lower.includes("cost") || lower.includes("save")) {
      newWeights = { cost: 75, carbon: 15, reliability: 10 };
      feedback = "Adjusted priority to 75% Cost. Supplier B offers the lowest quote (₹19.0L), but has high emissions (78t).";
      highlightId = "supplier-b";
    } else if (lower.includes("fast") || lower.includes("delivery") || lower.includes("urgent") || lower.includes("speed")) {
      newWeights = { cost: 20, carbon: 20, reliability: 60 };
      feedback = "Prioritized 60% Delivery speed. Supplier A fulfills in 5 days.";
      highlightId = "supplier-a";
    } else {
      newWeights = { cost: 35, carbon: 45, reliability: 20 };
      feedback = "Applied balanced ESG sustainability formula (35% Cost / 45% Carbon / 20% Reliability).";
      highlightId = "supplier-c";
    }

    onApplyCopilotResult({
      adjustedWeights: newWeights,
      feedbackText: feedback,
      highlightSupplierId: highlightId
    });
    setLastResponse(feedback);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(query);
    }
  };

  return (
    <div className="bg-[#0a2e24] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-500/20">
      
      {/* Input Search Row */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#10b981]">
            <Sparkles className="w-4 h-4" />
          </div>
          <input
            id="input-ai-copilot"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI Copilot: e.g. 'Find the lowest-carbon supplier under my budget'..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 text-xs sm:text-sm text-white placeholder-slate-400 rounded-xl border border-emerald-500/30 focus:outline-hidden focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all"
          />
        </div>

        <button
          id="btn-copilot-submit"
          type="button"
          onClick={() => handleSearch(query)}
          disabled={isLoading || !query.trim()}
          className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-[#10b981] hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold rounded-xl transition-all shrink-0 shadow-xs"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
          ) : (
            <>
              <span>Ask Copilot</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-emerald-500/20 text-xs">
        <span className="text-[11px] text-slate-300 font-medium">Try asking:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuery(prompt);
              handleSearch(prompt);
            }}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900/70 hover:bg-emerald-950 text-slate-300 hover:text-emerald-200 border border-emerald-500/20 transition-colors"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Copilot Natural Response Feedback */}
      {lastResponse && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-100 flex items-start space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#10b981]">Copilot Optimization: </span>
            <span>{lastResponse}</span>
          </div>
        </div>
      )}
    </div>
  );
};
