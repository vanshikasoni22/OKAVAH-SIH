// Risk & demurrage panel for the results screen. Congestion is looked up per
// destination port (consistent with the higher handling cost Haldia already
// carries in mockLandingCost.js); everything else is a seeded roll so it's
// stable per route/date instead of reshuffling on every render.

import { createRng } from "./seededRandom";

const CONGESTION_BY_DROP = {
  "Paradip Port (Odisha)": { days: 3, level: "Medium" },
  "Visakhapatnam / Vizag (Andhra Pradesh)": { days: 2, level: "Low" },
  "Gangavaram Port (Andhra Pradesh)": { days: 1, level: "Low" },
  "Haldia Dock Complex (West Bengal)": { days: 6, level: "High" },
  "Dhamra Port (Odisha)": { days: 2, level: "Low" },
  "Gopalpur Port (Odisha)": { days: 4, level: "Medium" },
};

function levelFromRoll(roll) {
  if (roll < 0.5) return "Low";
  if (roll < 0.85) return "Medium";
  return "High";
}

export function getRiskPanel({ pickupPort, dropPort, startDate, weight }) {
  const congestion = CONGESTION_BY_DROP[dropPort] ?? { days: 3, level: "Medium" };
  const rng = createRng(`${pickupPort}|${dropPort}|${startDate}|${weight}|risk`);

  const demurrageLow = 10000 + Math.round(rng() * 5000);
  const demurrageHigh = demurrageLow + 10000 + Math.round(rng() * 10000);

  const weatherLevel = levelFromRoll(rng());

  const volatilityZ = Number((rng() * 2.4 - 1.0).toFixed(1));
  const volatilityLevel =
    Math.abs(volatilityZ) < 0.5 ? "Low" : Math.abs(volatilityZ) < 1.2 ? "Medium" : "High";

  const demurrageBudget = congestion.days * demurrageHigh;
  const dispatchBonus = Math.round(demurrageLow * 0.4);

  return {
    congestion: { days: congestion.days, level: congestion.level },
    demurrage: { low: demurrageLow, high: demurrageHigh, level: congestion.level },
    weather: { level: weatherLevel },
    volatility: { z: volatilityZ, level: volatilityLevel },
    demurrageBudget,
    dispatchBonus,
  };
}
