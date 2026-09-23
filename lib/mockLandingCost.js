// Mock freight-rate model. Numbers are illustrative, not real market data —
// structured so a real forecasting API can replace this module later without
// the results screen changing shape.

import { seededRandom } from "./seededRandom";

const BASE_RATE_BY_PICKUP = {
  "Newcastle 🇦🇺": 24.5,
  "Hay Point 🇦🇺": 23.8,
  "Port Hedland 🇦🇺": 22.4,
  "RBCT 🇿🇦": 20.6,
  "Richards Bay 🇿🇦": 21.0,
  "Samarinda 🇮🇩": 15.4,
  "Balikpapan 🇮🇩": 16.1,
  "Beira 🇲🇿": 19.8,
  "Hampton Roads 🇺🇸": 27.8,
  "Vostochny 🇷🇺": 19.5,
};

// Ports with tighter draft/berth constraints carry a higher handling premium.
const HANDLING_BY_DROP = {
  "Paradip Port (Odisha)": 2.1,
  "Visakhapatnam / Vizag (Andhra Pradesh)": 1.6,
  "Gangavaram Port (Andhra Pradesh)": 1.8,
  "Haldia Dock Complex (West Bengal)": 3.4,
  "Dhamra Port (Odisha)": 1.2,
  "Gopalpur Port (Odisha)": 1.7,
};

// Denser or more schedule-sensitive cargo shifts freight economics even on
// the same lane — iron ore stows tighter and draws premium tonnage, coking
// coal needs tighter laycan discipline than thermal.
const COMMODITY_MULTIPLIER = {
  "Coking Coal": 1.05,
  "Thermal Coal": 1.0,
  "Iron Ore": 1.12,
};

export function computeLandingCost(query) {
  const { pickupPort, dropPort, startDate, endDate, weight, commodity } = query;
  const seed = `${pickupPort}|${dropPort}|${startDate}|${endDate}|${weight}|${commodity}`;

  const baseRate = BASE_RATE_BY_PICKUP[pickupPort] ?? 23;
  const handling = HANDLING_BY_DROP[dropPort] ?? 2;
  const commodityMultiplier = COMMODITY_MULTIPLIER[commodity] ?? 1.0;
  const dateVariance = (seededRandom(seed, "rate") - 0.5) * 0.08; // +/-4%
  const ratePerMT = Math.max(8, (baseRate + handling) * commodityMultiplier * (1 + dateVariance));
  const totalCost = ratePerMT * weight;

  const trendRoll = seededRandom(seed, "trend");
  const trend = trendRoll < 0.34 ? "down" : trendRoll < 0.67 ? "up" : "flat";
  const deltaPercent = 4 + Math.round(seededRandom(seed, "delta") * 8); // 4-12%
  const waitDays = 3 + Math.round(seededRandom(seed, "wait") * 4); // 3-7 days

  let insight;
  let recommendation;

  if (trend === "down") {
    const savings = totalCost * (deltaPercent / 100);
    insight = `Rates are trending down — waiting ${waitDays} days could save approximately $${formatWhole(
      savings
    )}. Ships booked this week are running about ${deltaPercent}% above the 30-day average.`;
    recommendation = { label: `Recommended: Wait ${waitDays} days`, action: "wait", days: waitDays };
  } else if (trend === "up") {
    const extraCost = totalCost * (deltaPercent / 100);
    insight = `Rates are trending up — booking now avoids an estimated $${formatWhole(
      extraCost
    )} in added cost. Rates have climbed roughly ${deltaPercent}% over the past two weeks.`;
    recommendation = { label: "Recommended: Book now", action: "book", days: 0 };
  } else {
    insight = `Rates are holding steady — waiting is unlikely to change your cost materially. Current pricing is within ${deltaPercent}% of the 30-day average.`;
    recommendation = { label: "Recommended: Book now", action: "book", days: 0 };
  }

  return { ratePerMT, totalCost, trend, deltaPercent, insight, recommendation };
}

function formatWhole(value) {
  return Math.round(value).toLocaleString("en-US");
}
