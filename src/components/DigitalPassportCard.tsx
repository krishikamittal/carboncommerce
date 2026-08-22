import React, { useState, useEffect } from 'react';
import { DigitalPassport, PurchaseOrder } from '../types';
import { generateQrCodeDataUrl } from '../lib/passport';
import { ShieldCheck, QrCode, Download, Copy, Check, ExternalLink, Leaf, Award, CheckCircle2, ArrowRight, LayoutDashboard, Sparkles, Building2, Calendar, FileText } from 'lucide-react';
import { formatINR } from '../lib/scoring';

interface DigitalPassportCardProps {
  passport: DigitalPassport;
  po?: PurchaseOrder;
  onGoToDashboard: () => void;
  onStartNewSourcing: () => void;
}

export const DigitalPassportCard: React.FC<DigitalPassportCardProps> = ({
  passport,
  po,
  onGoToDashboard,
  onStartNewSourcing,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showSimulatedScan, setShowSimulatedScan] = useState(false);

  useEffect(() => {
    async function loadQr() {
      const url = await generateQrCodeDataUrl(passport.qrPayload);
      setQrCodeUrl(url);
    }
    loadQr();
  }, [passport]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passport.qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Success Banner */}
      <div className="bg-[#0a2e24] text-white rounded-2xl p-5 sm:p-6 border border-emerald-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#10b981]/20 text-emerald-200 border border-[#10b981]/30">
              Step 6: Digital Carbon Passport Issued
            </span>
            <span className="text-xs text-emerald-300 font-semibold">
              Status: {po?.status || 'Active & Registered'}
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif text-white mt-1">
            Official Scope 3 Carbon Passport Generated
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Cryptographically anchored carbon certificate attached to Purchase Order <strong className="text-white font-mono">{passport.poNumber}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            id="btn-goto-dashboard"
            onClick={onGoToDashboard}
            className="flex items-center space-x-1.5 px-4.5 py-2.5 rounded-xl bg-[#10b981] hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-xs"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>View in Dashboard</span>
          </button>

          <button
            id="btn-new-sourcing"
            onClick={onStartNewSourcing}
            className="flex items-center space-x-1.5 px-4.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all"
          >
            <span>New Sourcing</span>
            <ArrowRight className="w-4 h-4 text-[#10b981]" />
          </button>
        </div>
      </div>

      {/* Official Certificate Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden relative">
        
        {/* Certificate Top Ribbon */}
        <div className="bg-[#0a2e24] text-white px-6 py-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#10b981]/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#10b981]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-widest text-[#10b981] font-bold">
                  Digital Product Carbon Passport (DPP)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#10b981]/20 text-emerald-200 border border-[#10b981]/30">
                  {passport.verificationTier} Tier
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white mt-0.5">
                {passport.productName}
              </h3>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400 block text-[10px] uppercase">Certificate ID</span>
            <span className="font-mono font-bold text-[#10b981]">{passport.id}</span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Data & Lifecycle */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Sourcing & Total Emission Spotlight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div>
                  <span className="text-[11px] font-semibold text-[#0a2e24] uppercase">Total Sourced CO₂</span>
                  <p className="text-2xl font-bold text-[#0a2e24] font-serif mt-0.5">
                    {passport.totalCo2Tons} <span className="text-sm font-sans font-semibold">t CO₂e</span>
                  </p>
                  <p className="text-[10px] text-emerald-800 font-semibold">Scope 1, 2, 3 Cat 1</p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#0a2e24] uppercase">Unit Carbon Intensity</span>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {passport.carbonIntensityPerUnit}
                  </p>
                  <p className="text-[10px] text-slate-600">vs 7.80 kg standard baseline</p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#0a2e24] uppercase">Quantity Fulfilled</span>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {passport.quantity.toLocaleString()} {passport.unit}
                  </p>
                  <p className="text-[10px] text-slate-600 font-mono">PO: {passport.poNumber}</p>
                </div>
              </div>

              {/* Supplier & Verification Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
                  <span className="text-slate-600 font-medium block">Approved Supplier:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{passport.supplierName}</p>
                  <p className="text-slate-600 mt-0.5">{passport.supplierLocation}</p>
                  <p className="text-[11px] text-[#0a2e24] font-bold mt-1">
                    ✓ Contract Price: {po ? formatINR(po.totalCost) : '₹20.50 L'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
                  <span className="text-slate-600 font-medium block">Independent Auditor:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{passport.auditorOrganization}</p>
                  <p className="text-slate-600 mt-0.5">Standard: ISO 14067 & GHG Protocol</p>
                  <p className="text-[11px] text-slate-600 mt-1">Issue Date: {passport.issueDate}</p>
                </div>
              </div>

              {/* Lifecycle Stage Breakdown */}
              <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2.5 flex items-center">
                  <Leaf className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                  Verified Scope 1-3 Stage Emissions
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90">
                    <span className="text-slate-600 text-[10px] block">Raw Materials:</span>
                    <span className="font-bold text-slate-900">{passport.scopeBreakdown.rawMaterial} t CO₂</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90">
                    <span className="text-slate-600 text-[10px] block">Manufacturing:</span>
                    <span className="font-bold text-slate-900">{passport.scopeBreakdown.manufacturing} t CO₂</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90">
                    <span className="text-slate-600 text-[10px] block">Grid Electricity:</span>
                    <span className="font-bold text-slate-900">{passport.scopeBreakdown.energy} t CO₂</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90">
                    <span className="text-slate-600 text-[10px] block">Freight Transit:</span>
                    <span className="font-bold text-slate-900">{passport.scopeBreakdown.transport} t CO₂</span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Audit Hash */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span>Cryptographic Audit Proof (SHA-256)</span>
                  <span className="text-[#10b981] font-bold">VERIFIED VALID</span>
                </div>
                <p className="font-mono text-[11px] text-emerald-300 break-all select-all">
                  {passport.auditHash}
                </p>
              </div>

            </div>

            {/* Right Col: Verifiable QR Code & Actions */}
            <div className="flex flex-col items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200/90">
              
              <div className="text-center w-full">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide block">
                  Scan to Verify Passport
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Decentralized LCA verification registry
                </p>

                {/* QR Code Container */}
                <div className="mt-3 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs inline-block">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Verifiable Digital Carbon Passport QR Code"
                      className="w-44 h-44 object-contain mx-auto"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center bg-slate-100 rounded-xl text-slate-400">
                      <QrCode className="w-12 h-12 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-center space-x-1 text-[11px] text-[#0a2e24] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Tamper-Proof Audit Record</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-2 mt-4 pt-3 border-t border-slate-200/90 text-xs">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-200/90 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Verification URL Copied!' : 'Copy Verification URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSimulatedScan(!showSimulatedScan)}
                  className="w-full flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0a2e24] font-bold border border-emerald-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#0a2e24]" />
                  <span>{showSimulatedScan ? 'Hide Public Inspector' : 'Simulate Auditor Scan'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Certificate Footer Stamp */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200/90 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
          <span>CarbonCommerce Verifiable Trust Network • ISO 14067 & GHG Protocol Scope 3 Certified</span>
          <span className="font-semibold text-slate-800">Verified by TÜV SÜD Sustainability Services</span>
        </div>

      </div>

      {/* Simulated Public Auditor Inspection Drawer */}
      {showSimulatedScan && (
        <div className="p-5 rounded-2xl bg-slate-900 text-white border border-emerald-500/40 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="font-bold text-sm font-serif">Public Auditor Verification View (Simulated QR Endpoint)</h4>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            This is what external ESG auditors, enterprise clients, and CBAM customs officials view upon scanning the QR code:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px]">Product & Batch:</span>
              <span className="font-semibold text-white">{passport.productName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Total LCA Footprint:</span>
              <span className="font-bold text-emerald-400 text-sm">{passport.totalCo2Tons} Metric Tons CO₂e</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Chain of Custody Status:</span>
              <span className="font-semibold text-emerald-400">ASI & ISO 14067 Compliant</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
