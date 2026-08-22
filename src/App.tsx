import React, { useState } from 'react';
import { BuyerRequirement, Supplier, PriorityWeights, PurchaseOrder, DigitalPassport } from './types';
import {
  DEFAULT_REQUIREMENT,
  SEED_SUPPLIERS_ALUMINIUM,
  SUPPLIERS_BY_CATEGORY,
  SEED_HISTORICAL_PURCHASE_ORDERS,
  INITIAL_PASSPORT_ALUMINIUM
} from './data/seedData';
import { Header } from './components/Header';
import { StepJourney } from './components/StepJourney';
import { DashboardView } from './components/DashboardView';
import { PassportsRegistry } from './components/PassportsRegistry';
import { DigitalPassportCard } from './components/DigitalPassportCard';
import { Leaf, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'journey' | 'dashboard' | 'passports'>('journey');
  const [requirement, setRequirement] = useState<BuyerRequirement>(DEFAULT_REQUIREMENT);
  const [weights, setWeights] = useState<PriorityWeights>({ cost: 35, carbon: 45, reliability: 20 });
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(SEED_HISTORICAL_PURCHASE_ORDERS);
  const [passports, setPassports] = useState<DigitalPassport[]>([
    INITIAL_PASSPORT_ALUMINIUM,
    {
      id: 'PASSPORT-PKG-0792-SGS',
      poNumber: 'PO-2026-0792',
      issueDate: '2026-08-11',
      productName: '40,000 Recycled Corrugated Cartons',
      quantity: 40000,
      unit: 'boxes',
      supplierName: 'BioPack Solutions',
      supplierLocation: 'Hosur Green Park, Tamil Nadu',
      totalCo2Tons: 10.5,
      carbonIntensityPerUnit: '0.26 kg CO₂e / box',
      verificationTier: 'Verified',
      auditHash: '0x8829BA10928CF4120938EF429188AC901',
      auditorOrganization: 'SGS Carbon Trust & FSC Chain of Custody',
      scopeBreakdown: { rawMaterial: 4.5, manufacturing: 3.0, energy: 2.0, transport: 1.0 },
      ghgProtocolScope: 'Scope 3 Category 1 Audited',
      certifications: ['FSC Recycled 100%', 'ISO 14001'],
      qrPayload: 'https://carboncommerce.app/passport/PASSPORT-PKG-0792-SGS?verified=true'
    },
    {
      id: 'PASSPORT-STL-0881-BV',
      poNumber: 'PO-2026-0881',
      issueDate: '2026-08-18',
      productName: '12,000 kg Hydro-Grade Green Steel',
      quantity: 12000,
      unit: 'kg',
      supplierName: 'GreenSteel Electra',
      supplierLocation: 'Bellary Hub, Karnataka',
      totalCo2Tons: 22,
      carbonIntensityPerUnit: '1.83 kg CO₂e / kg steel',
      verificationTier: 'Verified',
      auditHash: '0x3344BA992110DE98827361AA9281726C',
      auditorOrganization: 'Bureau Veritas Environmental Product Declaration',
      scopeBreakdown: { rawMaterial: 7.2, manufacturing: 7.8, energy: 4.8, transport: 2.2 },
      ghgProtocolScope: 'Scope 3 Category 1 Audited',
      certifications: ['ResponsibleSteel Certified', 'ISO 14067'],
      qrPayload: 'https://carboncommerce.app/passport/PASSPORT-STL-0881-BV?verified=true'
    }
  ]);

  const [selectedPassportDetail, setSelectedPassportDetail] = useState<DigitalPassport | null>(null);

  // Dynamic suppliers depending on selected requirement
  const currentSuppliers: Supplier[] = SUPPLIERS_BY_CATEGORY[requirement.id] || SEED_SUPPLIERS_ALUMINIUM;

  const handleOrderIssued = (newPO: PurchaseOrder, newPassport: DigitalPassport) => {
    setPurchaseOrders(prev => [newPO, ...prev]);
    setPassports(prev => [newPassport, ...prev]);
  };

  const handleResetDemo = () => {
    setRequirement(DEFAULT_REQUIREMENT);
    setWeights({ cost: 35, carbon: 45, reliability: 20 });
    setSelectedPassportDetail(null);
    setActiveTab('journey');
  };

  const handleViewPassportById = (passportId: string) => {
    const found = passports.find(p => p.id === passportId || p.poNumber === passportId);
    if (found) {
      setSelectedPassportDetail(found);
      setActiveTab('passports');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f5f4] text-slate-900 font-sans flex flex-col selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedPassportDetail(null);
          setActiveTab(tab);
        }}
        onResetDemo={handleResetDemo}
        passportsCount={passports.length}
      />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* TAB 1: 6-Step Sourcing Flow */}
        {activeTab === 'journey' && (
          <StepJourney
            requirement={requirement}
            setRequirement={setRequirement}
            suppliers={currentSuppliers}
            weights={weights}
            setWeights={setWeights}
            onOrderIssued={handleOrderIssued}
            onGoToDashboard={() => setActiveTab('dashboard')}
            onResetDemo={handleResetDemo}
          />
        )}

        {/* TAB 2: Executive Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView
            purchaseOrders={purchaseOrders}
            passports={passports}
            onStartNewSourcing={() => {
              setActiveTab('journey');
            }}
            onViewPassport={handleViewPassportById}
          />
        )}

        {/* TAB 3: Digital Passports Registry */}
        {activeTab === 'passports' && (
          selectedPassportDetail ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setSelectedPassportDetail(null)}
                className="text-xs font-bold text-[#0a2e24] hover:text-emerald-900 flex items-center space-x-1"
              >
                <span>← Back to All Passports Registry</span>
              </button>
              <DigitalPassportCard
                passport={selectedPassportDetail}
                onGoToDashboard={() => {
                  setSelectedPassportDetail(null);
                  setActiveTab('dashboard');
                }}
                onStartNewSourcing={() => {
                  setSelectedPassportDetail(null);
                  setActiveTab('journey');
                }}
              />
            </div>
          ) : (
            <PassportsRegistry
              passports={passports}
              onSelectPassport={(p) => setSelectedPassportDetail(p)}
              onStartNewSourcing={() => setActiveTab('journey')}
            />
          )
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/90 py-6 mt-12 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-[#0a2e24] flex items-center justify-center text-[#10b981]">
              <Leaf className="w-3 h-3" />
            </div>
            <span className="font-bold text-slate-900 font-serif">CarbonCommerce</span>
            <span>— AI-Driven B2B Scope 3 Decarbonization Platform</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-600">
            <span className="flex items-center text-[#0a2e24] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              GHG Protocol Scope 3 Category 1 Aligned
            </span>
            <span className="hidden md:inline">•</span>
            <span className="text-[11px] text-slate-500 font-medium">
              Enterprise SAP / Oracle ERP Connector Ready
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
