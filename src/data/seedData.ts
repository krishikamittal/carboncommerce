import { BuyerRequirement, Supplier, PurchaseOrder, DigitalPassport } from '../types';

export const DEFAULT_REQUIREMENT: BuyerRequirement = {
  id: 'req-aluminium-10k',
  productName: '10,000 kg Aluminium Billets (Grade 6063-T6)',
  category: 'Non-Ferrous Metals & Alloys',
  quantity: 10000,
  unit: 'kg',
  budget: 2100000,
  deliveryWindowDays: 7,
  baselineEmissionFactorKg: 5.7, // 57 tons for 10,000 kg
  industrySector: 'Automotive & Lightweight Precision Engineering',
  esgTargetReductionPct: 35,
  deliveryLocation: 'Pune Assembly Plant, Sector 4, Maharashtra',
  notes: 'High-purity extrusion grade with verified Scope 1-3 traceability certificate required for EU CBAM export compliance.'
};

export const DEMO_PRESET_REQUIREMENTS: BuyerRequirement[] = [
  DEFAULT_REQUIREMENT,
  {
    id: 'req-packaging-50k',
    productName: '50,000 Heavy-Duty Corrugated Shipping Boxes',
    category: 'Sustainable Packaging',
    quantity: 50000,
    unit: 'boxes',
    budget: 850000,
    deliveryWindowDays: 6,
    baselineEmissionFactorKg: 0.38, // 19 tons baseline
    industrySector: 'E-Commerce Logistics & FMCG',
    esgTargetReductionPct: 40,
    deliveryLocation: 'Bengaluru Fulfillment Center, Karnataka',
    notes: 'FSC-certified recycled kraft board, soy-based ink printing.'
  },
  {
    id: 'req-steel-5k',
    productName: '5,000 kg High-Tensile Structural Steel Beams',
    category: 'Ferrous Metals & Construction',
    quantity: 5000,
    unit: 'kg',
    budget: 450000,
    deliveryWindowDays: 10,
    baselineEmissionFactorKg: 2.4, // 12 tons baseline
    industrySector: 'Green Infrastructure & Modular Building',
    esgTargetReductionPct: 50,
    deliveryLocation: 'Navi Mumbai Metro Project Depot, Maharashtra',
    notes: 'EAF hydrogen-reduced DRI feedstock preferred with ISO 14025 EPD.'
  },
  {
    id: 'req-cotton-2500m',
    productName: '2,500 m GOTS-Certified Organic Canvas Textile',
    category: 'Industrial Textiles & Fabrics',
    quantity: 2500,
    unit: 'meters',
    budget: 625000,
    deliveryWindowDays: 5,
    baselineEmissionFactorKg: 4.2, // 10.5 tons baseline
    industrySector: 'Apparel & Uniform Manufacturing',
    esgTargetReductionPct: 45,
    deliveryLocation: 'Tirupur Garment Hub, Tamil Nadu',
    notes: 'Zero hazardous chemical discharge (ZDHC Level 3), closed-loop water treatment.'
  }
];

export const SEED_SUPPLIERS_ALUMINIUM: Supplier[] = [
  {
    id: 'supplier-a',
    name: 'Supplier A (Apex Metals Corp)',
    code: 'SUP-A',
    location: 'Raigarh Smelting Hub, Chhattisgarh',
    country: 'India',
    price: 2000000,
    co2Tons: 42,
    deliveryDays: 5,
    dataQuality: 'Reported',
    reliabilityScore: 88,
    auditProvider: 'Self-Reported Annual Sustainability Disclosure (GHG Protocol Scope 1-2)',
    scopeBreakdown: {
      rawMaterial: 16.5,
      manufacturing: 14.2,
      energy: 8.8,
      transport: 2.5
    },
    greenPractices: [
      '30% Solar PPA captive power generation',
      'Continuous scrap remelt furnace automation',
      'Regional road freight with Euro VI fleet'
    ],
    certifications: ['ISO 9001', 'ISO 14001', 'Bureau of Indian Standards (BIS)'],
    contactEmail: 'procurement@apexmetals.in',
    minOrderQuantity: 5000,
    paymentTerms: 'Net 30 Days'
  },
  {
    id: 'supplier-b',
    name: 'Supplier B (Bharat Thermal Smelters)',
    code: 'SUP-B',
    location: 'Angul Thermal Corridor, Odisha',
    country: 'India',
    price: 1900000,
    co2Tons: 78,
    deliveryDays: 8,
    dataQuality: 'Estimated',
    reliabilityScore: 74,
    auditProvider: 'Industry Sector Emission Benchmark Estimate (IPCC Cat 2C3)',
    scopeBreakdown: {
      rawMaterial: 22.0,
      manufacturing: 24.5,
      energy: 27.5,
      transport: 4.0
    },
    greenPractices: [
      'Conventional captive thermal power grid',
      'Standard baghouse particulate filtration'
    ],
    certifications: ['ISO 9001'],
    contactEmail: 'sales@bharat-thermal.co.in',
    minOrderQuantity: 10000,
    paymentTerms: '100% Against Dispatch'
  },
  {
    id: 'supplier-c',
    name: 'Supplier C (EcoAlloy CleanTech)',
    code: 'SUP-C',
    location: 'Kallakurichi Hydro Hub, Tamil Nadu',
    country: 'India',
    price: 2050000,
    co2Tons: 31,
    deliveryDays: 6,
    dataQuality: 'Verified',
    reliabilityScore: 96,
    auditProvider: 'TÜV SÜD Life Cycle Assessment (ISO 14067:2018 & GHG Protocol)',
    scopeBreakdown: {
      rawMaterial: 9.2,
      manufacturing: 10.5,
      energy: 8.8,
      transport: 2.5
    },
    greenPractices: [
      '100% Run-of-river Hydro Power dedicated supply',
      '85% Post-industrial recycled scrap circular feedstock',
      'Dedicated electrified rail corridor transport to Western Hubs'
    ],
    certifications: [
      'ISO 14067 (Product Carbon Footprint)',
      'Aluminium Stewardship Initiative (ASI) Chain of Custody',
      'TÜV SÜD Certified Green Metal',
      'EU CBAM Ready LCA Passport'
    ],
    contactEmail: 'esg-contracts@ecoalloy-cleantech.com',
    minOrderQuantity: 2500,
    paymentTerms: 'Net 45 Days (ESG Supplier Discount)'
  }
];

export const SUPPLIERS_BY_CATEGORY: Record<string, Supplier[]> = {
  'req-aluminium-10k': SEED_SUPPLIERS_ALUMINIUM,
  'req-packaging-50k': [
    {
      id: 'pkg-a',
      name: 'BioPack Solutions',
      code: 'PKG-A',
      location: 'Hosur Green Park, TN',
      country: 'India',
      price: 820000,
      co2Tons: 11.2,
      deliveryDays: 5,
      dataQuality: 'Verified',
      reliabilityScore: 95,
      auditProvider: 'SGS Carbon Trust ISO 14064',
      scopeBreakdown: { rawMaterial: 4.8, manufacturing: 3.2, energy: 2.1, transport: 1.1 },
      greenPractices: ['100% Recycled Kraft paper', 'Bio-degradable corn-starch adhesive'],
      certifications: ['FSC Recycled 100%', 'ISO 14001'],
      contactEmail: 'order@biopack.in',
      minOrderQuantity: 10000,
      paymentTerms: 'Net 30'
    },
    {
      id: 'pkg-b',
      name: 'Standard Corrugators Ltd',
      code: 'PKG-B',
      location: 'Peenya Industrial Area, KA',
      country: 'India',
      price: 760000,
      co2Tons: 18.5,
      deliveryDays: 7,
      dataQuality: 'Estimated',
      reliabilityScore: 78,
      scopeBreakdown: { rawMaterial: 9.5, manufacturing: 4.5, energy: 3.2, transport: 1.3 },
      greenPractices: ['Standard mill paperboard'],
      certifications: ['ISO 9001'],
      contactEmail: 'sales@standardcorr.com',
      minOrderQuantity: 20000,
      paymentTerms: 'Advance'
    },
    {
      id: 'pkg-c',
      name: 'EcoKraft Paper Mills',
      code: 'PKG-C',
      location: 'Vapi Industrial Estate, GJ',
      country: 'India',
      price: 790000,
      co2Tons: 14.0,
      deliveryDays: 6,
      dataQuality: 'Reported',
      reliabilityScore: 89,
      scopeBreakdown: { rawMaterial: 6.2, manufacturing: 4.0, energy: 2.6, transport: 1.2 },
      greenPractices: ['Biomass boiler steam generation'],
      certifications: ['FSC Mix'],
      contactEmail: 'supply@ecokraft.in',
      minOrderQuantity: 15000,
      paymentTerms: 'Net 30'
    }
  ],
  'req-steel-5k': [
    {
      id: 'stl-a',
      name: 'GreenSteel Electra',
      code: 'STL-A',
      location: 'Bellary Hub, KA',
      country: 'India',
      price: 435000,
      co2Tons: 5.4,
      deliveryDays: 8,
      dataQuality: 'Verified',
      reliabilityScore: 94,
      auditProvider: 'Bureau Veritas EPD',
      scopeBreakdown: { rawMaterial: 1.8, manufacturing: 1.9, energy: 1.1, transport: 0.6 },
      greenPractices: ['Renewable EAF steelmaking', 'Direct Hydrogen DRI'],
      certifications: ['ResponsibleSteel Certified', 'ISO 14067'],
      contactEmail: 'esg@greensteel.in',
      minOrderQuantity: 2000,
      paymentTerms: 'Net 45'
    },
    {
      id: 'stl-b',
      name: 'Classic Blast Furnaces',
      code: 'STL-B',
      location: 'Jamshedpur Works, JH',
      country: 'India',
      price: 395000,
      co2Tons: 11.8,
      deliveryDays: 10,
      dataQuality: 'Reported',
      reliabilityScore: 82,
      scopeBreakdown: { rawMaterial: 4.5, manufacturing: 4.2, energy: 2.3, transport: 0.8 },
      greenPractices: ['Blast furnace top gas recovery'],
      certifications: ['ISO 9001'],
      contactEmail: 'sales@classicsteel.co.in',
      minOrderQuantity: 5000,
      paymentTerms: 'Net 15'
    }
  ],
  'req-cotton-2500m': [
    {
      id: 'cot-a',
      name: 'Pristine Organic Weaves',
      code: 'COT-A',
      location: 'Coimbatore Textile Belt, TN',
      country: 'India',
      price: 610000,
      co2Tons: 4.6,
      deliveryDays: 4,
      dataQuality: 'Verified',
      reliabilityScore: 97,
      auditProvider: 'Control Union GOTS Audit',
      scopeBreakdown: { rawMaterial: 1.5, manufacturing: 1.6, energy: 1.0, transport: 0.5 },
      greenPractices: ['Rainfed regenerative organic cotton', 'Solar powered spinning mills', 'Zero liquid discharge'],
      certifications: ['GOTS Version 7.0', 'OEKO-TEX Standard 100', 'Fair Trade Certified'],
      contactEmail: 'hello@pristineweaves.com',
      minOrderQuantity: 1000,
      paymentTerms: 'Net 30'
    },
    {
      id: 'cot-b',
      name: 'Metro Canvas Mills',
      code: 'COT-B',
      location: 'Surat, GJ',
      country: 'India',
      price: 575000,
      co2Tons: 9.8,
      deliveryDays: 6,
      dataQuality: 'Estimated',
      reliabilityScore: 80,
      scopeBreakdown: { rawMaterial: 4.2, manufacturing: 3.1, energy: 1.8, transport: 0.7 },
      greenPractices: ['Conventional synthetic blended yarns'],
      certifications: ['ISO 9001'],
      contactEmail: 'sales@metrocanvas.in',
      minOrderQuantity: 2000,
      paymentTerms: 'Net 15'
    }
  ]
};

export const SEED_HISTORICAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-2026-0645',
    poNumber: 'PO-2026-0645',
    createdAt: '2026-08-04T10:15:00Z',
    requirement: {
      id: 'req-seed-1',
      productName: '8,000 kg Aluminium Extrusions (Structural)',
      category: 'Non-Ferrous Metals & Alloys',
      quantity: 8000,
      unit: 'kg',
      budget: 1750000,
      deliveryWindowDays: 8,
      baselineEmissionFactorKg: 7.125, // 57t baseline
      industrySector: 'Automotive & Precision',
      deliveryLocation: 'Pune Assembly Plant'
    },
    supplier: {
      id: 'supplier-c',
      name: 'Supplier C (EcoAlloy CleanTech)',
      code: 'SUP-C',
      location: 'Kallakurichi Hydro Hub, TN',
      country: 'India',
      price: 1680000,
      co2Tons: 32,
      deliveryDays: 6,
      dataQuality: 'Verified',
      reliabilityScore: 96,
      auditProvider: 'TÜV SÜD Life Cycle Assessment',
      scopeBreakdown: { rawMaterial: 9.8, manufacturing: 10.9, energy: 8.8, transport: 2.5 },
      greenPractices: ['100% Hydro power smelting', '85% recycled scrap'],
      certifications: ['ISO 14067', 'ASI CoC'],
      contactEmail: 'esg@ecoalloy.com',
      minOrderQuantity: 2500,
      paymentTerms: 'Net 45'
    },
    totalCost: 1680000,
    totalCo2Tons: 32,
    baselineCo2Tons: 57,
    co2SavedVsBaselineTons: 25,
    co2SavedVsCheapestTons: 28,
    costDeltaVsCheapestAmount: 30000,
    status: 'Fulfilled',
    passportId: 'PASSPORT-AL-0645-TUV',
    weightsAtSelection: { cost: 35, carbon: 45, reliability: 20 },
    decisionJustification: 'Switched from 57t thermal baseline to 32t hydro-powered metal (~44% CO₂ reduction) for less than 1.8% cost variance.'
  },
  {
    id: 'po-2026-0792',
    poNumber: 'PO-2026-0792',
    createdAt: '2026-08-11T14:30:00Z',
    requirement: {
      id: 'req-seed-2',
      productName: '40,000 Recycled Corrugated Cartons',
      category: 'Sustainable Packaging',
      quantity: 40000,
      unit: 'boxes',
      budget: 680000,
      deliveryWindowDays: 6,
      baselineEmissionFactorKg: 0.475, // 19t baseline
      industrySector: 'E-Commerce Logistics',
      deliveryLocation: 'Bengaluru Fulfillment'
    },
    supplier: {
      id: 'pkg-a',
      name: 'BioPack Solutions',
      code: 'PKG-A',
      location: 'Hosur Green Park, TN',
      country: 'India',
      price: 656000,
      co2Tons: 10.5,
      deliveryDays: 5,
      dataQuality: 'Verified',
      reliabilityScore: 95,
      scopeBreakdown: { rawMaterial: 4.5, manufacturing: 3.0, energy: 2.0, transport: 1.0 },
      greenPractices: ['100% Recycled Kraft paper'],
      certifications: ['FSC Recycled 100%'],
      contactEmail: 'order@biopack.in',
      minOrderQuantity: 10000,
      paymentTerms: 'Net 30'
    },
    totalCost: 656000,
    totalCo2Tons: 10.5,
    baselineCo2Tons: 19,
    co2SavedVsBaselineTons: 8.5,
    co2SavedVsCheapestTons: 6.8,
    costDeltaVsCheapestAmount: 18000,
    status: 'In Transit',
    passportId: 'PASSPORT-PKG-0792-SGS',
    weightsAtSelection: { cost: 40, carbon: 45, reliability: 15 },
    decisionJustification: 'Procured 100% FSC recycled cartons, cutting 8.5 tons CO₂e vs virgin fiber packaging.'
  },
  {
    id: 'po-2026-0881',
    poNumber: 'PO-2026-0881',
    createdAt: '2026-08-18T09:00:00Z',
    requirement: {
      id: 'req-seed-3',
      productName: '12,000 kg Hydro-Grade Green Steel',
      category: 'Ferrous Metals & Construction',
      quantity: 12000,
      unit: 'kg',
      budget: 1100000,
      deliveryWindowDays: 9,
      baselineEmissionFactorKg: 3.16, // 38t baseline
      industrySector: 'Green Infrastructure',
      deliveryLocation: 'Navi Mumbai Depot'
    },
    supplier: {
      id: 'stl-a',
      name: 'GreenSteel Electra',
      code: 'STL-A',
      location: 'Bellary Hub, KA',
      country: 'India',
      price: 1044000,
      co2Tons: 22,
      deliveryDays: 8,
      dataQuality: 'Verified',
      reliabilityScore: 94,
      scopeBreakdown: { rawMaterial: 7.2, manufacturing: 7.8, energy: 4.8, transport: 2.2 },
      greenPractices: ['Renewable EAF steelmaking'],
      certifications: ['ResponsibleSteel Certified'],
      contactEmail: 'esg@greensteel.in',
      minOrderQuantity: 2000,
      paymentTerms: 'Net 45'
    },
    totalCost: 1044000,
    totalCo2Tons: 22,
    baselineCo2Tons: 38,
    co2SavedVsBaselineTons: 16,
    co2SavedVsCheapestTons: 14.2,
    costDeltaVsCheapestAmount: 22000,
    status: 'In Production',
    passportId: 'PASSPORT-STL-0881-BV',
    weightsAtSelection: { cost: 30, carbon: 50, reliability: 20 },
    decisionJustification: 'Procured EAF hydrogen-melt steel, saving 16 metric tons of CO₂ emissions for infrastructure framing.'
  }
];

export const INITIAL_PASSPORT_ALUMINIUM: DigitalPassport = {
  id: 'PASSPORT-AL-0645-TUV',
  poNumber: 'PO-2026-0645',
  issueDate: '2026-08-04',
  productName: '10,000 kg Aluminium Billets (Grade 6063-T6)',
  quantity: 10000,
  unit: 'kg',
  supplierName: 'Supplier C (EcoAlloy CleanTech)',
  supplierLocation: 'Kallakurichi Hydro Hub, Tamil Nadu, India',
  totalCo2Tons: 31,
  carbonIntensityPerUnit: '3.10 kg CO₂e / kg Al (vs 7.80 kg standard)',
  verificationTier: 'Verified',
  auditHash: '0x7F9B8A44C1D983E002B4912FA88390EC129A88F44199E392819BB8F42026',
  auditorOrganization: 'TÜV SÜD Sustainability Assurance & ASI Custody Auditor',
  scopeBreakdown: {
    rawMaterial: 9.2,
    manufacturing: 10.5,
    energy: 8.8,
    transport: 2.5
  },
  ghgProtocolScope: 'Scope 3 Category 1 (Purchased Goods & Services) Certified',
  certifications: [
    'ISO 14067:2018 (Product Carbon Footprint)',
    'Aluminium Stewardship Initiative (ASI Chain-of-Custody)',
    'EU CBAM Ready Verifiable Declaration',
    'TÜV SÜD Zero-Fossil Energy Verification'
  ],
  qrPayload: 'https://carboncommerce.app/passport/PASSPORT-AL-0645-TUV?verified=true&hash=0x7F9B8A44C1D983E'
};
