// Ranked vessel options for the results screen. Mock logic only — derives 2
// alternatives around the "natural fit" vessel class (the same one
// lib/mockVessel.js assigns for the confirm screen), each with an itemized
// cost breakdown that's guaranteed to sum to that option's total (the
// scale/deadfreight line is defined as whatever's left over after the other
// four components, not estimated separately, so the numbers can't drift out
// of sync with each other).

import { createRng } from "./seededRandom";

const CLASS_LADDER = [
  { name: "Handysize", dwt: "28,000–40,000 DWT class", typicalCapacity: 35000 },
  { name: "Supramax", dwt: "50,000–60,000 DWT class", typicalCapacity: 55000 },
  { name: "Panamax", dwt: "65,000–80,000 DWT class", typicalCapacity: 72000 },
  { name: "Capesize", dwt: "150,000–180,000 DWT class", typicalCapacity: 165000 },
  { name: "VLOC", dwt: "200,000+ DWT class", typicalCapacity: 250000 },
];

function optimalIndexForWeight(weight) {
  if (weight < 50000) return 1; // Supramax
  if (weight <= 80000) return 2; // Panamax
  return 3; // Capesize
}

function buildOption({ classInfo, rank, tag, insight, costMultiplier, congestionFactor, neutralTotal }) {
  const totalCost = neutralTotal * costMultiplier;
  const baseFreight = neutralTotal * 0.7;
  const portTariff = neutralTotal * 0.13;
  const idleDelay = neutralTotal * 0.09 * congestionFactor;
  const riskPremium = neutralTotal * 0.08;
  const scaleAdj = totalCost - baseFreight - portTariff - idleDelay - riskPremium;

  return {
    rank,
    vesselName: classInfo.name,
    dwt: classInfo.dwt,
    tag,
    totalCost,
    breakdown: { baseFreight, portTariff, idleDelay, riskPremium, scaleAdj },
    insight,
  };
}

export function generateVesselOptions({ query, ratePerMT }) {
  const { weight, pickupPort, dropPort, commodity } = query;
  const rng = createRng(`${pickupPort}|${dropPort}|${weight}|${commodity}|vessel-options`);
  const neutralTotal = ratePerMT * weight;

  const optimalIdx = optimalIndexForWeight(weight);
  const smallerIdx = optimalIdx > 0 ? optimalIdx - 1 : 0;
  const largerIdx = optimalIdx < CLASS_LADDER.length - 1 ? optimalIdx + 1 : CLASS_LADDER.length - 1;

  const optimal = buildOption({
    classInfo: CLASS_LADDER[optimalIdx],
    rank: 1,
    tag: "AI Optimal",
    costMultiplier: 0.965 - rng() * 0.015,
    congestionFactor: 0.9,
    neutralTotal,
    insight:
      "Optimal parcel match with full coastal draft flexibility — single voyage, minimal idle exposure.",
  });

  const smallerClass = CLASS_LADDER[smallerIdx];
  const voyages = Math.max(2, Math.ceil(weight / smallerClass.typicalCapacity));
  const smaller = buildOption({
    classInfo: smallerClass,
    rank: 2,
    tag: `Requires ${voyages} Voyages`,
    costMultiplier: 1.09 + rng() * 0.05,
    congestionFactor: 1.3,
    neutralTotal,
    insight: `Requires ${voyages} voyages to carry the full ${weight.toLocaleString(
      "en-IN"
    )} MT parcel — each extra port call adds idle time and tariff exposure.`,
  });

  const largerClass = CLASS_LADDER[largerIdx];
  const utilization = Math.min(99, Math.round((weight / largerClass.typicalCapacity) * 100));
  const larger = buildOption({
    classInfo: largerClass,
    rank: 3,
    tag: "Deadfreight Risk",
    costMultiplier: 1.06 + rng() * 0.06,
    congestionFactor: 1.0,
    neutralTotal,
    insight: `Vessel capacity exceeds cargo volume (~${utilization}% utilized) — deadfreight charges apply on the unused tonnage.`,
  });

  return [optimal, smaller, larger];
}
