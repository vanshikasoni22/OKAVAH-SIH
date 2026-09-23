// Route data for the booking form. Kept as flat display strings (rather than
// {name, flag} objects) so every screen that already interpolates
// query.pickupPort / query.dropPort into a sentence keeps working unchanged.

export const PICKUP_PORTS = [
  "Newcastle 🇦🇺",
  "Hay Point 🇦🇺",
  "Port Hedland 🇦🇺",
  "RBCT 🇿🇦",
  "Richards Bay 🇿🇦",
  "Samarinda 🇮🇩",
  "Balikpapan 🇮🇩",
  "Beira 🇲🇿",
  "Hampton Roads 🇺🇸",
  "Vostochny 🇷🇺",
];

export const DROP_PORTS = [
  "Paradip Port (Odisha)",
  "Visakhapatnam / Vizag (Andhra Pradesh)",
  "Gangavaram Port (Andhra Pradesh)",
  "Haldia Dock Complex (West Bengal)",
  "Dhamra Port (Odisha)",
  "Gopalpur Port (Odisha)",
];

export const COMMODITIES = ["Coking Coal", "Thermal Coal", "Iron Ore"];
