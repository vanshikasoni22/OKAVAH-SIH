"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

function formatChartDate(value) {
  if (!value) return value;
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

function Candle({ x, y, width, height, payload, selectedDate }) {
  const { open, close, high, low, isProjected, date } = payload;
  const isUp = close >= open;
  const color = isUp ? "var(--color-accent)" : "var(--color-down)";
  const range = high - low || 0.0001;
  const yFor = (price) => y + (height * (high - price)) / range;

  const bodyTop = Math.min(yFor(open), yFor(close));
  const bodyHeight = Math.max(1.5, Math.abs(yFor(close) - yFor(open)));
  const bodyWidth = Math.max(2, width * 0.6);
  const bodyX = x + (width - bodyWidth) / 2;
  const wickX = x + width / 2;
  const isSelected = date === selectedDate;

  return (
    <g opacity={isProjected ? 0.7 : 1}>
      <line
        x1={wickX}
        x2={wickX}
        y1={y}
        y2={y + height}
        stroke={color}
        strokeWidth={1.4}
        strokeDasharray={isProjected ? "2 2" : undefined}
      />
      <rect
        x={bodyX}
        y={bodyTop}
        width={bodyWidth}
        height={bodyHeight}
        fill={isProjected ? "transparent" : color}
        stroke={color}
        strokeWidth={isProjected ? 1.3 : 0}
        strokeDasharray={isProjected ? "2 2" : undefined}
        rx={1}
      />
      {isSelected && (
        <rect
          x={bodyX - 2.5}
          y={bodyTop - 2.5}
          width={bodyWidth + 5}
          height={bodyHeight + 5}
          fill="none"
          stroke="var(--color-text)"
          strokeWidth={1}
          rx={2.5}
          opacity={0.85}
        />
      )}
    </g>
  );
}

function OhlcTooltip({ active, payload, suppressed }) {
  if (suppressed || !active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="rounded-xl border border-hairline bg-surface-2/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
      <p className="font-semibold text-text">
        {formatChartDate(point.date)}
        {point.isProjected && <span className="text-text-muted"> · forecast</span>}
      </p>
      <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5 text-text-muted">
        <span>
          O <span className="text-text">${point.open.toFixed(2)}</span>
        </span>
        <span>
          H <span className="text-text">${point.high.toFixed(2)}</span>
        </span>
        <span>
          L <span className="text-text">${point.low.toFixed(2)}</span>
        </span>
        <span>
          C <span className="text-text">${point.close.toFixed(2)}</span>
        </span>
      </div>
    </div>
  );
}

function FlagMarker({ cx, cy, event, eventKey, activeEvent, setActiveEvent, onSelectDate }) {
  const isActive = activeEvent === eventKey;

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <g
        onClick={(e) => {
          e.stopPropagation();
          setActiveEvent(isActive ? null : eventKey);
          onSelectDate(event.date);
        }}
        onMouseEnter={() => setActiveEvent(eventKey)}
        onMouseLeave={() => setActiveEvent(null)}
        style={{ cursor: "pointer" }}
      >
        <circle r={10} fill="transparent" />
        <circle r={5} fill="var(--color-bg)" stroke="var(--color-accent)" strokeWidth={1.5} />
        <circle r={2} fill="var(--color-accent)" />
      </g>
      {isActive && (
        <foreignObject x={-115} y={-132} width={230} height={124} style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="rounded-xl border border-accent/30 bg-surface-2 px-3 py-2.5 text-xs leading-relaxed shadow-xl"
            style={{ overflow: "visible" }}
          >
            <p className="font-semibold text-accent-soft">{event.label}</p>
            <p className="mt-1 text-text-muted">{event.detail}</p>
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export default function PriceTrendChart({ series, events, todayIndex, selectedDate, onSelectDate }) {
  const reduced = usePrefersReducedMotion();
  const [activeEvent, setActiveEvent] = useState(null);

  const { yDomain, markerY } = useMemo(() => {
    const prices = series.flatMap((d) => [d.low, d.high]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const pad = (max - min) * 0.15 || 1;
    return {
      yDomain: [Math.max(0, min - pad * 0.4), max + pad * 1.6],
      markerY: max + pad * 0.9,
    };
  }, [series]);

  const todayDate = series[todayIndex]?.date;
  const lastDate = series[series.length - 1]?.date;

  function handleChartClick(state) {
    if (state?.activeLabel) {
      setActiveEvent(null);
      onSelectDate(state.activeLabel);
    }
  }

  return (
    <div className="rounded-3xl border border-hairline bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            Freight rate trend
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Past 45 days · next 14 days projected — tap a date to price it.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-accent" /> Up
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-down" /> Down
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm border border-dashed border-text-muted" /> Forecast
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border border-accent" /> Event
          </span>
        </div>
      </div>

      <div className="mt-6 h-[340px] w-full [&_.recharts-surface]:overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={series}
            margin={{ top: 28, right: 8, bottom: 4, left: 4 }}
            onClick={handleChartClick}
          >
            <CartesianGrid vertical={false} stroke="var(--color-hairline)" strokeDasharray="3 6" />
            <XAxis
              dataKey="date"
              tickFormatter={formatChartDate}
              tick={{ fill: "var(--color-text-muted)", fontSize: 12, fontFamily: "var(--font-inter)" }}
              axisLine={{ stroke: "var(--color-hairline)" }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={28}
            />
            <YAxis
              orientation="right"
              domain={yDomain}
              tick={{ fill: "var(--color-text-muted)", fontSize: 12, fontFamily: "var(--font-inter)" }}
              tickFormatter={(v) => `$${Math.round(v)}`}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              content={(props) => <OhlcTooltip {...props} suppressed={Boolean(activeEvent)} />}
              cursor={{ stroke: "var(--color-hairline)" }}
            />

            {todayDate && lastDate && (
              <ReferenceArea
                x1={todayDate}
                x2={lastDate}
                fill="var(--color-accent)"
                fillOpacity={0.05}
                stroke="none"
              />
            )}
            {todayDate && (
              <ReferenceLine x={todayDate} stroke="var(--color-hairline)" strokeDasharray="4 4" />
            )}
            {selectedDate && selectedDate !== todayDate && (
              <ReferenceLine x={selectedDate} stroke="var(--color-accent)" strokeOpacity={0.5} />
            )}

            <Bar
              dataKey={(d) => [d.low, d.high]}
              isAnimationActive={!reduced}
              animationDuration={450}
              shape={(props) => <Candle {...props} selectedDate={selectedDate} />}
            />

            {events.map((event) => {
              const key = `${event.date}-${event.label}`;
              return (
                <ReferenceDot
                  key={key}
                  x={event.date}
                  y={markerY}
                  r={0}
                  isFront
                  shape={(props) => (
                    <FlagMarker
                      {...props}
                      event={event}
                      eventKey={key}
                      activeEvent={activeEvent}
                      setActiveEvent={setActiveEvent}
                      onSelectDate={onSelectDate}
                    />
                  )}
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
