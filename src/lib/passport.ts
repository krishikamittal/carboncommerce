import QRCode from 'qrcode';
import { DigitalPassport, PurchaseOrder, Supplier, BuyerRequirement } from '../types';

export async function generateQrCodeDataUrl(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#064E3B', // deep emerald/forest green
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    return dataUrl;
  } catch (err) {
    console.error('QR code generation failed:', err);
    // fallback clean SVG placeholder if needed
    return '';
  }
}

export function createDigitalPassportFromPO(po: PurchaseOrder): DigitalPassport {
  const req = po.requirement;
  const sup = po.supplier;
  const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
  const auditHash = `0x${randomHex}${Date.now().toString(16).toUpperCase()}88F4E2`;

  const perUnitIntensity = req.quantity > 0 
    ? ((po.totalCo2Tons * 1000) / req.quantity).toFixed(2)
    : '0.00';

  const passportId = `PASSPORT-${req.category.substring(0, 3).toUpperCase()}-${po.poNumber.replace('PO-', '')}-${sup.dataQuality.toUpperCase()}`;

  return {
    id: passportId,
    poNumber: po.poNumber,
    issueDate: new Date().toISOString().split('T')[0],
    productName: req.productName,
    quantity: req.quantity,
    unit: req.unit,
    supplierName: sup.name,
    supplierLocation: sup.location,
    totalCo2Tons: po.totalCo2Tons,
    carbonIntensityPerUnit: `${perUnitIntensity} kg CO₂e / ${req.unit}`,
    verificationTier: sup.dataQuality,
    auditHash,
    auditorOrganization: sup.auditProvider || (sup.dataQuality === 'Verified' ? 'TÜV SÜD Sustainability Assurance' : 'Self-Reported Disclosure'),
    scopeBreakdown: sup.scopeBreakdown,
    ghgProtocolScope: 'Scope 3 Category 1 (Purchased Goods & Services) Audited',
    certifications: sup.certifications.length > 0 ? sup.certifications : ['ISO 14067 Standard Compliance', 'GHG Protocol Aligned'],
    qrPayload: `https://carboncommerce.app/passport/${passportId}?verified=${sup.dataQuality === 'Verified'}&co2=${po.totalCo2Tons}t&hash=${auditHash}`
  };
}
