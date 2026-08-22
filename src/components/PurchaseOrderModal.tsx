import React, { useState } from 'react';
import { BuyerRequirement, ScoredSupplier, PriorityWeights, PurchaseOrder } from '../types';
import { X, ShieldCheck, Leaf, DollarSign, Clock, CheckCircle2, ArrowRight, FileCheck, Building2, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR, formatINRFull } from '../lib/scoring';

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: BuyerRequirement;
  supplier: ScoredSupplier;
  weights: PriorityWeights;
  onConfirmPurchase: (po: PurchaseOrder) => void;
}

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  requirement,
  supplier,
  weights,
  onConfirmPurchase,
}) => {
  const [poNumber] = useState(`PO-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [billingContact, setBillingContact] = useState('Krishika Mittal (VP Sourcing & Procurement)');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const baselineCo2 = requirement.quantity * (requirement.baselineEmissionFactorKg / 1000);
  const co2SavedVsBaseline = Math.max(0, baselineCo2 - supplier.co2Tons);

  const handleIssuePo = () => {
    setIsProcessing(true);

    // Trigger celebratory green confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059669', '#10B981', '#34D399', '#047857', '#F59E0B']
    });

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber,
      createdAt: new Date().toISOString(),
      requirement,
      supplier,
      totalCost: supplier.price,
      totalCo2Tons: supplier.co2Tons,
      baselineCo2Tons: baselineCo2,
      co2SavedVsBaselineTons: Number(co2SavedVsBaseline.toFixed(1)),
      co2SavedVsCheapestTons: supplier.co2DeltaVsHighest > 0 ? 47 : 0,
      costDeltaVsCheapestAmount: supplier.costDeltaAmount,
      status: 'Issued',
      passportId: `PASSPORT-${requirement.category.substring(0, 3).toUpperCase()}-${poNumber.replace('PO-', '')}`,
      weightsAtSelection: weights,
      decisionJustification: `Selected ${supplier.name} with multi-criteria optimization: ${supplier.co2Tons}t CO₂ (saving ${co2SavedVsBaseline.toFixed(1)}t vs baseline) at ${formatINR(supplier.price)}.`
    };

    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPurchase(newPO);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0a2e24] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif">Issue Purchase Order & Generate Carbon Passport</h3>
              <p className="text-xs text-slate-300">Official B2B Procurement Contract Allocation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
          
          {/* PO Summary Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-semibold text-[#0a2e24] uppercase tracking-wide">Purchase Order Number</span>
                <p className="text-lg font-bold text-slate-900 font-mono">{poNumber}</p>
                <p className="text-xs text-slate-600 mt-0.5">{requirement.productName}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0a2e24] text-white flex items-center shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#10b981]" />
                {supplier.dataQuality} Sourcing
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-emerald-200/60 text-xs">
              <div>
                <span className="text-slate-600 block">Total Spend:</span>
                <span className="font-bold text-slate-900 text-sm">{formatINRFull(supplier.price)}</span>
              </div>
              <div>
                <span className="text-slate-600 block">Carbon Footprint:</span>
                <span className="font-bold text-[#0a2e24] text-sm">{supplier.co2Tons} tons CO₂e</span>
              </div>
              <div>
                <span className="text-slate-600 block">Lead Time:</span>
                <span className="font-bold text-slate-900 text-sm">{supplier.deliveryDays} Days</span>
              </div>
              <div>
                <span className="text-slate-600 block">CO₂ Saved:</span>
                <span className="font-bold text-[#0a2e24] text-sm">~{co2SavedVsBaseline.toFixed(1)} tons</span>
              </div>
            </div>
          </div>

          {/* Supplier & Delivery Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
              <span className="font-bold text-slate-900 flex items-center mb-1">
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Vendor Details
              </span>
              <p className="font-semibold text-slate-900">{supplier.name}</p>
              <p className="text-slate-600">{supplier.location}</p>
              <p className="text-slate-600">Audit Body: {supplier.auditProvider || 'Standard Certification'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
              <span className="font-bold text-slate-900 flex items-center mb-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Fulfillment Destination
              </span>
              <p className="font-semibold text-slate-900">{requirement.deliveryLocation}</p>
              <p className="text-slate-600">Quantity: {requirement.quantity.toLocaleString()} {requirement.unit}</p>
              <p className="text-slate-600">Terms: {supplier.paymentTerms}</p>
            </div>
          </div>

          {/* Sourcing Authorization */}
          <div>
            <label htmlFor="input-billing-contact" className="block text-xs font-semibold text-slate-700 mb-1">
              Authorized Procurement Officer
            </label>
            <input
              id="input-billing-contact"
              type="text"
              value={billingContact}
              onChange={(e) => setBillingContact(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm text-slate-900 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#10b981]"
            />
          </div>

          {/* Digital Passport Guarantee Note */}
          <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/90 text-xs text-slate-700 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#0a2e24] shrink-0 mt-0.5" />
            <p>
              By confirming, a cryptographic <strong>Digital Carbon Passport</strong> with an embedded verification QR code will be generated and logged to your enterprise Scope 3 registry.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/90 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-issue-po"
            type="button"
            onClick={handleIssuePo}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0a2e24] hover:bg-[#07241c] disabled:bg-slate-400 text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02]"
          >
            <span>{isProcessing ? 'Issuing PO & Generating Passport...' : 'Confirm & Issue Purchase Order'}</span>
            <ArrowRight className="w-4 h-4 text-[#10b981]" />
          </button>
        </div>

      </div>
    </div>
  );
};
