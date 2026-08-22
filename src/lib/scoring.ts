import { Supplier, ScoredSupplier, PriorityWeights } from '../types';

/**
 * Calculates transparent multi-criteria decision score for suppliers.
 * Formula:
 * Score = (w_cost * norm_cost) + (w_carbon * norm_carbon) + (w_reliability * norm_delivery)
 *
 * We use inverse-ratio normalization (Best / Actual) which is standard in procurement MCDM:
 * - Cost Score: minPrice / supplierPrice (1.0 = best/lowest cost)
 * - Carbon Score: minCo2 / supplierCo2 (1.0 = best/lowest emissions)
 * - Delivery/Reliability Score: (minDays / supplierDays) * (supplierReliability / 100)
 */
export function scoreSuppliers(
  suppliers: Supplier[],
  weights: PriorityWeights
): ScoredSupplier[] {
  if (!suppliers || suppliers.length === 0) return [];

  const minPrice = Math.min(...suppliers.map(s => s.price));
  const maxPrice = Math.max(...suppliers.map(s => s.price));
  const minCo2 = Math.min(...suppliers.map(s => s.co2Tons));
  const maxCo2 = Math.max(...suppliers.map(s => s.co2Tons));
  const minDays = Math.min(...suppliers.map(s => s.deliveryDays));

  // Normalize weights so they always sum to 1.0 internally
  const totalWeight = (weights.cost + weights.carbon + weights.reliability) || 100;
  const wCost = weights.cost / totalWeight;
  const wCarbon = weights.carbon / totalWeight;
  const wReliability = weights.reliability / totalWeight;

  const scored = suppliers.map((supplier) => {
    // 1. Normalized Cost (1.0 for cheapest, proportional for others)
    const normalizedCost = supplier.price > 0 ? minPrice / supplier.price : 1.0;

    // 2. Normalized Carbon (1.0 for lowest emission, proportional for others)
    const normalizedCarbon = supplier.co2Tons > 0 ? minCo2 / supplier.co2Tons : 1.0;

    // 3. Normalized Delivery & Reliability
    const speedScore = supplier.deliveryDays > 0 ? minDays / supplier.deliveryDays : 1.0;
    const reliabilityFactor = (supplier.reliabilityScore || 90) / 100;
    // Blend transit speed (60%) with verified reliability track record (40%)
    const normalizedDelivery = (speedScore * 0.6) + (reliabilityFactor * 0.4);

    // Total weighted score (0 to 1)
    const totalScore = (wCost * normalizedCost) + (wCarbon * normalizedCarbon) + (wReliability * normalizedDelivery);

    // Delta calculations
    const priceDeltaVsCheapest = minPrice > 0 
      ? Number((((supplier.price - minPrice) / minPrice) * 100).toFixed(1))
      : 0;

    const costDeltaAmount = supplier.price - minPrice;

    const co2DeltaVsHighest = maxCo2 > 0
      ? Number((((maxCo2 - supplier.co2Tons) / maxCo2) * 100).toFixed(0))
      : 0;

    return {
      ...supplier,
      normalizedCost,
      normalizedCarbon,
      normalizedDelivery,
      totalScore,
      rank: 1,
      priceDeltaVsCheapest,
      co2DeltaVsHighest,
      costDeltaAmount
    };
  });

  // Sort descending by totalScore
  scored.sort((a, b) => b.totalScore - a.totalScore);

  // Assign ranks
  scored.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  return scored;
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatINRFull(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
