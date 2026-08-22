import React, { useState, useEffect } from 'react';
import { BuyerRequirement, Supplier, ScoredSupplier, PriorityWeights, PurchaseOrder, DigitalPassport, AiRecommendationResult } from '../types';
import { scoreSuppliers } from '../lib/scoring';
import { createDigitalPassportFromPO } from '../lib/passport';
import { BuyerPrepForm } from './BuyerPrepForm';
import { FootprintCalcView } from './FootprintCalcView';
import { PrioritySliders } from './PrioritySliders';
import { AiRecommendationPanel } from './AiRecommendationPanel';
import { AiCopilotBar } from './AiCopilotBar';
import { SupplierComparisonTable } from './SupplierComparisonTable';
import { PurchaseOrderModal } from './PurchaseOrderModal';
import { DigitalPassportCard } from './DigitalPassportCard';
import { ScopeModal } from './ScopeModal';
import { Check, Compass, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Factory, Layers, RotateCcw, AlertCircle } from 'lucide-react';
import { formatINR } from '../lib/scoring';

interface StepJourneyProps {
  requirement: BuyerRequirement;
  setRequirement: (req: BuyerRequirement) => void;
  suppliers: Supplier[];
  weights: PriorityWeights;
  setWeights: (w: PriorityWeights) => void;
  onOrderIssued: (po: PurchaseOrder, passport: DigitalPassport) => void;
  onGoToDashboard: () => void;
  onResetDemo: () => void;
}

export const StepJourney: React.FC<StepJourneyProps> = ({
  requirement,
  setRequirement,
  suppliers,
  weights,
  setWeights,
  onOrderIssued,
  onGoToDashboard,
  onResetDemo,
}) => {
  // Step 1 = Buyer Prep, Step 2 = Platform Match, Step 3 = Footprint Calc, Step 4 = AI Ranking, Step 5 = Purchase/Select, Step 6 = Digital Passport
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSupplierForPO, setSelectedSupplierForPO] = useState<ScoredSupplier | null>(null);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [activePassport, setActivePassport] = useState<DigitalPassport | null>(null);
  const [activePO, setActivePO] = useState<PurchaseOrder | null>(null);
  const [modalSupplierForScope, setModalSupplierForScope] = useState<ScoredSupplier | null>(null);

  // AI Recommendation State
  const [aiResult, setAiResult] = useState<AiRecommendationResult | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [highlightSupplierId, setHighlightSupplierId] = useState<string | undefined>(undefined);

  // Compute live scored suppliers
  const scoredSuppliers = scoreSuppliers(suppliers, weights);
  const topSupplier = scoredSuppliers[0];

  // Auto-fetch AI recommendation when entering step 4 or when weights change substantially
  const fetchAiRecommendation = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirement,
          suppliers: scoredSuppliers,
          weights
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAiResult(data);
          setIsLoadingAi(false);
          return;
        }
      }
    } catch (e) {
      console.warn('AI recommendation API error:', e);
    }

    // Default high-precision fallback
    setIsLoadingAi(false);
  };

  useEffect(() => {
    if (currentStep === 4) {
      fetchAiRecommendation();
    }
  }, [currentStep, weights.cost, weights.carbon, weights.reliability]);

  // Step 5 handler
  const handleInitiatePurchase = (supplier: ScoredSupplier) => {
    setSelectedSupplierForPO(supplier);
    setIsPOModalOpen(true);
  };

  const handleConfirmPurchase = (po: PurchaseOrder) => {
    setIsPOModalOpen(false);
    const passport = createDigitalPassportFromPO(po);
    setActivePO(po);
    setActivePassport(passport);
    onOrderIssued(po, passport);
    setCurrentStep(6);
  };

  const stepsList = [
    { num: 1, title: 'Buyer Prep', desc: 'Define Requirement' },
    { num: 2, title: 'Platform Match', desc: 'Supplier Discovery' },
    { num: 3, title: 'Footprint Calc', desc: 'Scope 1-3 LCA' },
    { num: 4, title: 'AI Ranking', desc: 'Sliders & Copilot' },
    { num: 5, title: 'Purchase Order', desc: 'Issue PO' },
    { num: 6, title: 'Digital Passport', desc: 'Verifiable DPP' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 6-Step Stepper Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1">
          {stepsList.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <button
                key={step.num}
                type="button"
                id={`step-nav-${step.num}`}
                onClick={() => {
                  // Allow jumping back to earlier steps or next step
                  if (step.num <= Math.max(currentStep, 4) || (step.num === 6 && activePassport)) {
                    setCurrentStep(step.num);
                  }
                }}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all text-left shrink-0 ${
                  isCurrent
                    ? 'bg-[#0a2e24] text-white shadow-xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100/80'
                    : 'text-slate-500 hover:text-slate-800 opacity-60'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-[#10b981] text-[#0a2e24]'
                      : isDone
                      ? 'bg-[#0a2e24] text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : step.num}
                </span>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold leading-none">{step.title}</p>
                  <p className={`text-[10px] ${isCurrent ? 'text-emerald-200' : 'text-slate-500'} leading-none mt-0.5`}>
                    {step.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Buyer Prep */}
      {currentStep === 1 && (
        <BuyerPrepForm
          requirement={requirement}
          setRequirement={setRequirement}
          onProceed={() => setCurrentStep(2)}
        />
      )}

      {/* STEP 2: Platform Match */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Step 2: Platform Match
                  </span>
                  <span className="text-xs text-slate-700 font-medium">3 Verified Suppliers Discovered</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
                  Matching Suppliers for {requirement.productName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                  Target budget: <strong>{formatINR(requirement.budget)}</strong> • Delivery location: <strong>{requirement.deliveryLocation}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 text-xs font-semibold border border-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Modify Requirement</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0a2e24] hover:bg-[#07241c] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
                >
                  <span>Calculate Lifecycle Footprint</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>

            {/* Quick Sourcing Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {suppliers.map((s) => (
                <div key={s.id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{s.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {s.dataQuality} Tier
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">{s.location}</p>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/80 text-xs">
                      <div>
                        <span className="text-slate-600 block text-[10px]">Price:</span>
                        <span className="font-bold text-slate-900">{formatINR(s.price)}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 block text-[10px]">CO₂:</span>
                        <span className="font-bold text-emerald-800">{s.co2Tons}t</span>
                      </div>
                      <div>
                        <span className="text-slate-600 block text-[10px]">Transit:</span>
                        <span className="font-bold text-slate-900">{s.deliveryDays}d</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-700">
                    <p className="line-clamp-1">✓ {s.greenPractices[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Footprint Calculation */}
      {currentStep === 3 && (
        <FootprintCalcView
          requirement={requirement}
          suppliers={suppliers}
          onProceedToRanking={() => setCurrentStep(4)}
        />
      )}

      {/* STEP 4: AI Ranking & Sliders */}
      {currentStep === 4 && (
        <div className="space-y-6">
          
          {/* Priority Sliders */}
          <PrioritySliders
            weights={weights}
            onChange={setWeights}
          />

          {/* AI Copilot Natural Language Bar */}
          <AiCopilotBar
            currentWeights={weights}
            suppliers={suppliers}
            onApplyCopilotResult={({ adjustedWeights, feedbackText, highlightSupplierId }) => {
              setWeights(adjustedWeights);
              setHighlightSupplierId(highlightSupplierId);
            }}
          />

          {/* AI Top Recommendation Banner Panel */}
          <AiRecommendationPanel
            topSupplier={topSupplier}
            allSuppliers={scoredSuppliers}
            requirement={requirement}
            weights={weights}
            aiResult={aiResult}
            isLoadingAi={isLoadingAi}
            onRefreshAi={fetchAiRecommendation}
            onSelectSupplier={handleInitiatePurchase}
          />

          {/* Full Supplier Comparison Matrix */}
          <SupplierComparisonTable
            suppliers={scoredSuppliers}
            weights={weights}
            highlightSupplierId={highlightSupplierId}
            onSelectSupplier={handleInitiatePurchase}
            onOpenScopeModal={(s) => setModalSupplierForScope(s)}
          />

        </div>
      )}

      {/* STEP 5: Purchase Selection Modal / Overlay */}
      {selectedSupplierForPO && (
        <PurchaseOrderModal
          isOpen={isPOModalOpen}
          onClose={() => setIsPOModalOpen(false)}
          requirement={requirement}
          supplier={selectedSupplierForPO}
          weights={weights}
          onConfirmPurchase={handleConfirmPurchase}
        />
      )}

      {/* STEP 6: Digital Carbon Passport View */}
      {currentStep === 6 && activePassport && (
        <DigitalPassportCard
          passport={activePassport}
          po={activePO || undefined}
          onGoToDashboard={onGoToDashboard}
          onStartNewSourcing={() => {
            setCurrentStep(1);
          }}
        />
      )}

      {/* Scope 1-3 Deep Drill-down Modal */}
      {modalSupplierForScope && (
        <ScopeModal
          supplier={modalSupplierForScope}
          onClose={() => setModalSupplierForScope(null)}
        />
      )}

    </div>
  );
};
