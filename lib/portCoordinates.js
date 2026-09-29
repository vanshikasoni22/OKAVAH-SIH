// [longitude, latitude] for every port in mockPortData.js, keyed by the same
// display strings used throughout the query/result data (flags and all) so
// this can look values up directly from query.pickupPort / query.dropPort
// without a second parallel identifier.

export const PORT_COORDINATES = {
  "Newcastle 🇦🇺": [151.78, -32.93],
  "Hay Point 🇦🇺": [149.28, -21.27],
  "Port Hedland 🇦🇺": [118.57, -20.31],
  "RBCT 🇿🇦": [32.09, -28.79],
  "Richards Bay 🇿🇦": [32.04, -28.78],
  "Samarinda 🇮🇩": [117.15, -0.5],
  "Balikpapan 🇮🇩": [116.83, -1.27],
  "Beira 🇲🇿": [34.84, -19.84],
  "Hampton Roads 🇺🇸": [-76.3, 36.95],
  "Vostochny 🇷🇺": [132.98, 42.75],

  "Paradip Port (Odisha)": [86.67, 20.32],
  "Visakhapatnam / Vizag (Andhra Pradesh)": [83.3, 17.68],
  "Gangavaram Port (Andhra Pradesh)": [83.23, 17.62],
  "Haldia Dock Complex (West Bengal)": [88.06, 22.03],
  "Dhamra Port (Odisha)": [86.99, 20.79],
  "Gopalpur Port (Odisha)": [84.92, 19.27],
};
