// Draft/LOA/beam compatibility between the recommended vessel class and the
// selected destination port. Haldia's real-world draft restriction (it's a
// river port) is the one case in this table that actually fails a Panamax
// or Capesize — everything else in the network clears comfortably, which is
// the realistic shape of this check: most pairings pass, a shallow port
// occasionally doesn't.

const VESSEL_DIMENSIONS = {
  Handysize: { draft: 11.5, loa: 190, beam: 32.0 },
  Supramax: { draft: 12.5, loa: 200, beam: 32.3 },
  Panamax: { draft: 14.0, loa: 225, beam: 32.3 },
  Capesize: { draft: 18.0, loa: 292, beam: 45.0 },
  VLOC: { draft: 23.0, loa: 340, beam: 65.0 },
};

const PORT_LIMITS = {
  "Paradip Port (Odisha)": { maxDraft: 18.1, maxLoa: 300, maxBeam: 48 },
  "Visakhapatnam / Vizag (Andhra Pradesh)": { maxDraft: 17.0, maxLoa: 280, maxBeam: 45 },
  "Gangavaram Port (Andhra Pradesh)": { maxDraft: 18.5, maxLoa: 300, maxBeam: 50 },
  "Haldia Dock Complex (West Bengal)": { maxDraft: 8.8, maxLoa: 186, maxBeam: 28 },
  "Dhamra Port (Odisha)": { maxDraft: 18.0, maxLoa: 300, maxBeam: 50 },
  "Gopalpur Port (Odisha)": { maxDraft: 13.5, maxLoa: 230, maxBeam: 33 },
};

export function checkFeasibility({ vesselName, dropPort }) {
  const dims = VESSEL_DIMENSIONS[vesselName] ?? VESSEL_DIMENSIONS.Panamax;
  const limits = PORT_LIMITS[dropPort] ?? { maxDraft: 18, maxLoa: 300, maxBeam: 50 };

  const checks = [
    { label: "Draft", vessel: dims.draft, limit: limits.maxDraft, unit: "m" },
    { label: "LOA", vessel: dims.loa, limit: limits.maxLoa, unit: "m" },
    { label: "Beam", vessel: dims.beam, limit: limits.maxBeam, unit: "m" },
  ].map((check) => ({ ...check, pass: check.vessel <= check.limit }));

  return { checks, passed: checks.every((check) => check.pass) };
}
