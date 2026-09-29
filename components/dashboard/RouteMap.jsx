"use client";

import { useMemo, useState } from "react";
import { geoEqualEarth } from "d3-geo";
import { ComposableMap, Geographies, Geography, Line, Marker, Sphere } from "react-simple-maps";
import worldAtlas from "world-atlas/countries-110m.json";
import { PORT_COORDINATES } from "@/lib/portCoordinates";
import { getGreatCirclePoints, getGreatCircleDistanceKm, estimateTransitDays } from "@/lib/routeGeo";
import { rateFormatter } from "@/lib/format";

const MAP_WIDTH = 800;
const MAP_HEIGHT = 420;
const PADDING = 56;

function PortDot({ coordinates, label }) {
  return (
    <Marker coordinates={coordinates}>
      <circle r={9} className="fill-accent/20" />
      <circle r={9} className="fill-accent/40 animate-ping motion-reduce:animate-none" />
      <circle r={3.5} className="fill-accent-soft stroke-bg" strokeWidth={1} />
      <title>{label}</title>
    </Marker>
  );
}

export default function RouteMap({ query, ratePerMT }) {
  const [hovered, setHovered] = useState(false);
  const { pickupPort, dropPort } = query;

  const origin = PORT_COORDINATES[pickupPort];
  const destination = PORT_COORDINATES[dropPort];

  const projection = useMemo(() => {
    const base = geoEqualEarth();
    if (!origin || !destination) return base.translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
    return base.fitExtent(
      [
        [PADDING, PADDING],
        [MAP_WIDTH - PADDING, MAP_HEIGHT - PADDING],
      ],
      { type: "LineString", coordinates: [origin, destination] }
    );
  }, [origin, destination]);

  const routePoints = useMemo(
    () => (origin && destination ? getGreatCirclePoints(origin, destination) : []),
    [origin, destination]
  );

  const midpoint = routePoints[Math.floor(routePoints.length / 2)];

  const { distanceKm, transitDays } = useMemo(() => {
    if (!origin || !destination) return { distanceKm: null, transitDays: null };
    const km = getGreatCircleDistanceKm(origin, destination);
    return { distanceKm: km, transitDays: estimateTransitDays(km) };
  }, [origin, destination]);

  if (!origin || !destination) return null;

  const midX = projection(midpoint)?.[0] ?? MAP_WIDTH / 2;
  const midY = projection(midpoint)?.[1] ?? MAP_HEIGHT / 2;

  return (
    <div className="sheen w-full rounded-3xl border border-hairline bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            Trade route
          </p>
          <p className="mt-1 text-sm text-text-muted">
            {pickupPort} <span className="text-accent">→</span> {dropPort}
          </p>
        </div>
        {distanceKm != null && (
          <p className="font-mono text-xs text-text-muted">
            {Math.round(distanceKm).toLocaleString("en-US")} km · ~{Math.round(transitDays)}d transit
          </p>
        )}
      </div>

      <div className="relative mt-4 w-full overflow-hidden rounded-2xl border border-hairline bg-bg aspect-[20/9]">
        <ComposableMap
          projection={projection}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          style={{ width: "100%", height: "100%" }}
        >
          <Sphere id="route-map-sphere" fill="var(--color-bg)" stroke="var(--color-hairline)" strokeWidth={0.5} />

          <Geographies geography={worldAtlas}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="var(--color-surface-2)"
                  stroke="var(--color-hairline)"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          <g
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ cursor: "pointer" }}
          >
            <Line
              coordinates={routePoints}
              stroke="transparent"
              strokeWidth={14}
              fill="none"
            />
            <Line
              coordinates={routePoints}
              stroke="var(--color-accent)"
              strokeWidth={2}
              fill="none"
              className="route-line-flow"
              strokeLinecap="round"
            />
          </g>

          <PortDot coordinates={origin} label={pickupPort} />
          <PortDot coordinates={destination} label={dropPort} />

          {hovered && (
            <foreignObject
              x={Math.min(Math.max(midX - 90, 4), MAP_WIDTH - 184)}
              y={Math.max(midY - 74, 4)}
              width={180}
              height={64}
              style={{ overflow: "visible", pointerEvents: "none" }}
            >
              <div className="rounded-xl border border-accent/30 bg-surface-2 px-3 py-2 text-xs leading-relaxed shadow-xl">
                <p className="font-mono font-semibold text-accent-soft">
                  {rateFormatter.format(ratePerMT)} / MT
                </p>
                <p className="mt-0.5 text-text-muted">~{Math.round(transitDays)} day transit</p>
              </div>
            </foreignObject>
          )}
        </ComposableMap>
      </div>
    </div>
  );
}
