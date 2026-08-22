export type DataQualityTier = 'Verified' | 'Reported' | 'Estimated';

export interface ScopeBreakdown {
  rawMaterial: number; // tons CO2
  manufacturing: number; // tons CO2
  energy: number; // tons CO2
  transport: number; // tons CO2
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  location: string;
  country: string;
  price: number; // in INR
  co2Tons: number; // in metric tons CO2e
  deliveryDays: number;
  dataQuality: DataQualityTier;
  reliabilityScore: number; // 0 to 100
  auditProvider?: string;
  scopeBreakdown: ScopeBreakdown;
  greenPractices: string[];
  certifications: string[];
  contactEmail: string;
  minOrderQuantity: number;
  paymentTerms: string;
  notes?: string;
}

export interface ScoredSupplier extends Supplier {
  normalizedCost: number; // 0 to 1 (1 is lowest cost / best)
  normalizedCarbon: number; // 0 to 1 (1 is lowest carbon / best)
  normalizedDelivery: number; // 0 to 1 (1 is lowest days / best)
  totalScore: number; // 0 to 1
  rank: number;
  priceDeltaVsCheapest: number; // % delta
  co2DeltaVsHighest: number; // % reduction vs highest emission supplier
  costDeltaAmount: number; // INR difference vs cheapest
}

export interface BuyerRequirement {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  budget: number; // INR
  deliveryWindowDays: number;
  baselineEmissionFactorKg: number; // kg CO2e per unit
  industrySector: string;
  esgTargetReductionPct?: number;
  deliveryLocation: string;
  notes?: string;
}

export interface PriorityWeights {
  cost: number; // percentage 0 - 100
  carbon: number; // percentage 0 - 100
  reliability: number; // percentage 0 - 100
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  createdAt: string;
  requirement: BuyerRequirement;
  supplier: Supplier;
  totalCost: number;
  totalCo2Tons: number;
  baselineCo2Tons: number;
  co2SavedVsBaselineTons: number;
  co2SavedVsCheapestTons: number;
  costDeltaVsCheapestAmount: number;
  status: 'Issued' | 'In Production' | 'In Transit' | 'Fulfilled';
  passportId: string;
  qrCodeUrl?: string;
  weightsAtSelection: PriorityWeights;
  decisionJustification: string;
}

export interface DigitalPassport {
  id: string;
  poNumber: string;
  issueDate: string;
  productName: string;
  quantity: number;
  unit: string;
  supplierName: string;
  supplierLocation: string;
  totalCo2Tons: number;
  carbonIntensityPerUnit: string; // e.g. "3.1 kg CO₂e / kg"
  verificationTier: DataQualityTier;
  auditHash: string;
  auditorOrganization: string;
  scopeBreakdown: ScopeBreakdown;
  ghgProtocolScope: string;
  certifications: string[];
  qrPayload: string;
}

export interface AiRecommendationResult {
  recommendedSupplierId: string;
  oneSentenceSummary: string;
  tradeoffHighlights: Array<{
    title: string;
    text: string;
    type: 'carbon' | 'cost' | 'reliability';
  }>;
  negotiationTip: string;
  esgComplianceNote: string;
}
