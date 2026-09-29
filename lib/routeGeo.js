import { geoInterpolate, geoDistance } from "d3-geo";

const EARTH_RADIUS_KM = 6371;
// Typical laden bulk-carrier service speed — used only to turn the route's
// real great-circle distance into a transit-time estimate, not to invent an
// unrelated number.
const ASSUMED_SPEED_KNOTS = 13;
const KM_PER_NAUTICAL_MILE = 1.852;

// Samples along the great-circle path between two [lon, lat] points, for
// react-simple-maps' <Line coordinates={...}> to render as a curve rather
// than a straight chord.
export function getGreatCirclePoints(origin, destination, steps = 64) {
  const interpolate = geoInterpolate(origin, destination);
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    points.push(interpolate(i / steps));
  }
  return points;
}

export function getGreatCircleDistanceKm(origin, destination) {
  return geoDistance(origin, destination) * EARTH_RADIUS_KM;
}

export function estimateTransitDays(distanceKm) {
  const speedKmh = ASSUMED_SPEED_KNOTS * KM_PER_NAUTICAL_MILE;
  return distanceKm / speedKmh / 24;
}
