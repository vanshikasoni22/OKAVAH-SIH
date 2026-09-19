// Mock freight-rate time series for the trend chart. A seeded random walk
// pinned to the current landing-cost figure, so the chart and the cost card
// above always agree on "today's" price instead of showing two disconnected
// numbers.

import { createRng } from "./seededRandom";

const HISTORY_DAYS = 45; // includes "today" as the last historical day
const PROJECTION_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

// Hardcoded relative to "today" (negative = days in the past). All three
// fall inside the historical window above.
const EVENT_TEMPLATES = [
  {
    dayOffset: -29,
    label: "Port congestion reported",
    detail:
      "Anchorage queues at destination ports stretched past a week, adding waiting-time risk to near-term bookings.",
  },
  {
    dayOffset: -17,
    label: "Geopolitical tension — Red Sea route",
    detail:
      "Rerouting away from the Red Sea lengthened voyage times on this lane, tightening capacity and lifting rates.",
  },
  {
    dayOffset: -6,
    label: "Monsoon advisory issued",
    detail:
      "Weather routing around the advisory is adding transit days, squeezing capacity over the short term.",
  },
];

function round2(value) {
  return Math.round(value * 100) / 100;
}

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

export function generatePriceSeries({ pickupPort, dropPort, baseRate, today = new Date() }) {
  const rng = createRng(`${pickupPort}|${dropPort}`);

  const anchor = new Date(today);
  anchor.setHours(0, 0, 0, 0);

  const totalDays = HISTORY_DAYS + PROJECTION_DAYS;
  const todayIndex = HISTORY_DAYS - 1;

  const closes = new Array(totalDays);
  closes[todayIndex] = baseRate;

  // Walk backward from today's known rate to build a believable history.
  for (let i = todayIndex - 1; i >= 0; i -= 1) {
    const step = (rng() - 0.5) * 0.05; // ~+/-2.5% day-over-day
    closes[i] = closes[i + 1] / (1 + step);
  }

  // Walk forward with a small persistent drift for the projection band, so
  // the forecast reads as a trend rather than pure noise.
  const trendBias = (rng() - 0.48) * 0.01;
  for (let i = todayIndex + 1; i < totalDays; i += 1) {
    const step = trendBias + (rng() - 0.5) * 0.03;
    closes[i] = closes[i - 1] * (1 + step);
  }

  const series = [];
  for (let i = 0; i < totalDays; i += 1) {
    const prevClose = i === 0 ? closes[i] * (1 + (rng() - 0.5) * 0.02) : closes[i - 1];
    const close = closes[i];
    const open = prevClose;
    const spread = Math.abs(close - open) + Math.max(0.15, close * 0.01) * (0.5 + rng());
    const high = Math.max(open, close) + spread * rng() * 0.6;
    const low = Math.max(0.5, Math.min(open, close) - spread * rng() * 0.6);
    const date = new Date(anchor.getTime() + (i - todayIndex) * DAY_MS);

    series.push({
      date: toISODate(date),
      dayOffset: i - todayIndex,
      open: round2(open),
      high: round2(Math.max(high, open, close)),
      low: round2(Math.min(low, open, close)),
      close: round2(close),
      isProjected: i > todayIndex,
      isToday: i === todayIndex,
    });
  }

  const events = EVENT_TEMPLATES.map((template) => {
    const point = series[todayIndex + template.dayOffset];
    return point ? { ...template, date: point.date, price: point.close } : null;
  }).filter(Boolean);

  return { series, events, todayIndex };
}
