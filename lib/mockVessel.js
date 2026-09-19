// Simple weight-based vessel class assignment. Real chartering would weigh
// port draft, laycan, and owner availability too — this is a first-pass mock.

export function assignVessel(weightTonnes) {
  if (weightTonnes < 50000) {
    return { name: "Supramax", dwt: "50,000–60,000 DWT class" };
  }
  if (weightTonnes <= 80000) {
    return { name: "Panamax", dwt: "65,000–80,000 DWT class" };
  }
  return { name: "Capesize", dwt: "150,000–180,000 DWT class" };
}
