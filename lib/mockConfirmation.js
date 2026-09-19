// Turns a Stage 3 chart selection into a short plain-English "why this is a
// good pick" line. Mock logic only — tied to the same seeded series and
// events the chart renders, so the reasoning always matches what's on screen.

function pct(value) {
  return `${Math.abs(Math.round(value))}%`;
}

export function explainSelection({ query, result, series, events, selectedPoint }) {
  // No explicit chart pick (or the user re-clicked today's own candle) — the
  // Stage 2 recommendation they're accepting already explains itself.
  if (!selectedPoint || selectedPoint.dayOffset === 0) {
    return result.insight;
  }

  const nearestEvent = events.reduce((closest, event) => {
    const dist = Math.abs(selectedPoint.dayOffset - event.dayOffset);
    return !closest || dist < closest.dist ? { event, dist } : closest;
  }, null);

  if (nearestEvent && nearestEvent.dist <= 1) {
    return `This date lines up with "${nearestEvent.event.label}" — pricing it in now, before the market fully reacts, locks in this rate rather than whatever follows.`;
  }

  if (
    nearestEvent &&
    selectedPoint.dayOffset > nearestEvent.event.dayOffset &&
    nearestEvent.dist <= 6
  ) {
    const isPortEvent = /congestion|monsoon/i.test(nearestEvent.event.label);
    const portRef = isPortEvent ? query.dropPort : "the route";
    return `This avoids the worst of the flagged "${nearestEvent.event.label.toLowerCase()}" window near ${portRef} a few days earlier — rates have had time to settle.`;
  }

  if (selectedPoint.isProjected) {
    const diffPct = ((result.ratePerMT - selectedPoint.close) / result.ratePerMT) * 100;
    if (diffPct > 1) {
      return `This date sits in a projected seasonal low before demand typically rises again — about ${pct(
        diffPct
      )} better than booking today.`;
    }
    return "This date is priced in line with where the market is projected to head — locking in the route and vessel now avoids re-shopping later.";
  }

  const historical = series.filter((point) => !point.isProjected);
  const average = historical.reduce((sum, point) => sum + point.close, 0) / historical.length;
  const diffFromAvgPct = ((average - selectedPoint.close) / average) * 100;

  if (diffFromAvgPct > 1) {
    return `This date priced ${pct(
      diffFromAvgPct
    )} below the 45-day average — a stronger entry than most of the window.`;
  }
  return "This date lands within the normal range of the past 45 days — a steady, unremarkable entry point for this route.";
}
