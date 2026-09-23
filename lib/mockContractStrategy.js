// Contract-type recommendation shown next to the vessel options. This
// directly answers the underlying goal — moving off single spot fixtures and
// onto a laddered, multi-voyage procurement approach — so it's static
// guidance rather than a per-query calculation, with just enough dynamic
// detail (the actual tonnage) to feel tied to the query on screen.

export function getContractStrategies({ weight }) {
  const laddered = Math.round((weight * 0.7) / 1000) * 1000;
  const spot = weight - laddered;

  return [
    {
      id: "coa",
      title: "Contract of Affreightment (CoA) Ladder",
      tag: "Recommended",
      description:
        "Locks in volume across multiple voyages to hedge against congestion and rate peaks, instead of re-tendering every parcel on the spot market.",
      detail: `Ladder ${laddered.toLocaleString("en-IN")} MT (~70% of this parcel) across staggered voyages at today's rate, leaving the balance open for opportunistic buys.`,
    },
    {
      id: "spot",
      title: "Spot Market Tender",
      tag: "Opportunistic",
      description:
        "Procures the remaining volume during identified rate dips, using the forecast below to time the tender rather than booking blind.",
      detail: `Best suited to the residual ${spot.toLocaleString("en-IN")} MT once the CoA ladder is placed — capture short-term dips without full spot exposure.`,
    },
  ];
}
