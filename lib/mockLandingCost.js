// Mock freight-rate model. Numbers are illustrative, not real market data —
// structured so a real forecasting API can replace this module later without
// the results screen changing shape.

const BASE_RATE_BY_PICKUP = {
  "Newcastle (Australia)": 24.5,
  "Richards Bay (South Africa)": 21.0,
  "Hampton Roads (US)": 27.8,
  "Vostochny (Russia)": 19.5,
};

// Ports with tighter draft/berth constraints carry a higher handling premium.
const HANDLING_BY_DROP = {
  Paradip: 2.1,
  Visakhapatnam: 1.6,
  Gangavaram: 1.8,
  Haldia: 3.4,
  Dhamra: 1.2,
};

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Deterministic 0..1 "random" value so the same query always resolves to the
// same mock insight instead of flickering on every render/refresh.
function seededRandom(seed, salt) {
  return (hashString(`${seed}::${salt}`) % 10000) / 10000;
}

export function computeLandingCost(query) {
  const { pickupPort, dropPort, startDate, endDate, weight } = query;
  const seed = `${pickupPort}|${dropPort}|${startDate}|${endDate}|${weight}`;

  const baseRate = BASE_RATE_BY_PICKUP[pickupPort] ?? 23;
  const handling = HANDLING_BY_DROP[dropPort] ?? 2;
  const dateVariance = (seededRandom(seed, "rate") - 0.5) * 0.08; // +/-4%
  const ratePerMT = Math.max(8, (baseRate + handling) * (1 + dateVariance));
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
