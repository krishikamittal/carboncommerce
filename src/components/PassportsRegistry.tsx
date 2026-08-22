import React, { useState } from 'react';
import { DigitalPassport } from '../types';
import { ShieldCheck, QrCode, Search, Filter, ExternalLink, Leaf, Building2, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { generateQrCodeDataUrl } from '../lib/passport';

interface PassportsRegistryProps {
  passports: DigitalPassport[];
  onSelectPassport: (passport: DigitalPassport) => void;
  onStartNewSourcing: () => void;
}

export const PassportsRegistry: React.FC<PassportsRegistryProps> = ({
  passports,
  onSelectPassport,
  onStartNewSourcing,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | 'Verified' | 'Reported' | 'Estimated'>('All');
  const [previewPassport, setPreviewPassport] = useState<DigitalPassport | null>(null);
  const [qrUrl, setQrUrl] = useState<string>('');

  const filtered = passports.filter((p) => {
    const matchSearch = p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.poNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchTier = tierFilter === 'All' || p.verificationTier === tierFilter;
    return matchSearch && matchTier;
  });

  const handleOpenQrPreview = async (p: DigitalPassport) => {
    setPreviewPassport(p);
    const url = await generateQrCodeDataUrl(p.qrPayload);
    setQrUrl(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-[#0a2e24] border border-emerald-300">
              Scope 3 Verifiable Carbon Registry
            </span>
            <span className="text-xs text-slate-600 font-semibold">Digital Product Passports (DPP)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-1">
            Digital Carbon Passports Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Tamper-proof, QR-code backed lifecycle emission records for audit readiness, ESG disclosures, and customer transparency.
          </p>
        </div>

        <button
          onClick={onStartNewSourcing}
          className="px-4.5 py-2.5 rounded-xl bg-[#0a2e24] hover:bg-[#07241c] text-white font-semibold text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          Issue New Sourcing Passport
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by product, supplier, or passport ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#10b981]"
          />
        </div>

        {/* Tier Filter Chips */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {(['All', 'Verified', 'Reported', 'Estimated'] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setTierFilter(tier)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors ${
                tierFilter === tier
                  ? 'bg-[#0a2e24] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

      </div>

      {/* Passports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((passport) => {
          return (
            <div
              key={passport.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Top header */}
                <div className="p-4 bg-[#0a2e24] text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#10b981] font-bold">{passport.id}</span>
                    <h3 className="font-bold text-sm text-white line-clamp-1 mt-0.5">{passport.productName}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#10b981]/20 text-emerald-200 border border-[#10b981]/30">
                    {passport.verificationTier}
                  </span>
                </div>

                {/* Body stats */}
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
                    <div>
                      <span className="text-[10px] text-[#0a2e24] block font-semibold">Total Carbon:</span>
                      <span className="text-base font-bold text-[#0a2e24] font-serif">{passport.totalCo2Tons} t CO₂e</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#0a2e24] block font-semibold">Intensity:</span>
                      <span className="text-xs font-bold text-slate-900">{passport.carbonIntensityPerUnit}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <p className="flex items-center"><Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400" /><strong className="text-slate-900 mr-1">Supplier:</strong> {passport.supplierName}</p>
                    <p className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /><strong className="text-slate-900 mr-1">Auditor:</strong> {passport.auditorOrganization}</p>
                    <p className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" /><strong className="text-slate-900 mr-1">Date:</strong> {passport.issueDate}</p>
                  </div>

                  {/* Certifications preview */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {passport.certifications.slice(0, 2).map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenQrPreview(passport)}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  <QrCode className="w-4 h-4 text-[#0a2e24]" />
                  <span>Scan QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectPassport(passport)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0a2e24] hover:bg-[#07241c] text-white font-bold text-xs transition-colors shadow-2xs"
                >
                  Inspect Full Passport →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick QR Inspection Modal */}
      {previewPassport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-emerald-800">{previewPassport.id}</span>
              <button
                onClick={() => setPreviewPassport(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>

            <h3 className="font-bold text-sm text-slate-900">{previewPassport.productName}</h3>
            
            {qrUrl && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block">
                <img src={qrUrl} alt="Passport QR" className="w-48 h-48 mx-auto" />
              </div>
            )}

            <div className="text-xs text-slate-700">
              <p className="font-semibold text-emerald-900">{previewPassport.totalCo2Tons} Tons CO₂e Verified</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Audited by {previewPassport.auditorOrganization}</p>
            </div>

            <button
              onClick={() => {
                onSelectPassport(previewPassport);
                setPreviewPassport(null);
              }}
              className="w-full py-2 rounded-xl bg-emerald-800 text-white font-semibold text-xs shadow-xs"
            >
              Open Full Certificate Card
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
