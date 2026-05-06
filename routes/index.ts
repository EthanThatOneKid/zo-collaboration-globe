import { useEffect, useRef, useState } from "react";
import { SAMPLE_HUBS, SAMPLE_LINKS } from "../lib/data";

const HUB_COLORS = SAMPLE_HUBS.map((h) => h.color);

// Declare three-globe for TypeScript (loaded from CDN)
declare const Globe: {
  new (): {
    globeImageUrl(img: string): unknown;
    pointsData(data: unknown[]): unknown;
    pointLat("lat"): unknown;
    pointLng("lng"): unknown;
    pointColor(color: string): unknown;
    pointLabel(label: string): unknown;
    linksData(data: unknown[]): unknown;
    linkStartLat("lat"): unknown;
    linkStartLng("lng"): unknown;
    linkEndLat("lat"): unknown;
    linkEndLng("lng"): unknown;
    linkColor(() => string): unknown;
    linkDirection("arrow"): unknown;
    linkWidth(1): unknown;
    linkLabel(label: string): unknown;
    onPointClick(cb: (point: unknown) => void): unknown;
    onPointHover(cb: (point: unknown) => void): unknown;
    enablePointerInteraction(true): unknown;
    pointRadius(0.5): unknown;
    pointsMerge(false): unknown;
    backgroundImageUrl(imgUrl: string): unknown;
  } & unknown;
};

const THREE_GLOBE_URL =
  "https://unpkg.com/three-globe@2.45.2/globe.gl.js";

interface Point {
  id: number;
  handle: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  color: string;
  bio: string;
  avatar: string;
}

export default function GlobePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<unknown>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [threeError, setThreeError] = useState(false);

  useEffect(() => {
    // Dynamically load three-globe from CDN
    const script = document.createElement("script");
    script.src = THREE_GLOBE_URL;
    script.onload = () => setThreeLoaded(true);
    script.onerror = () => setThreeError(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!threeLoaded || !containerRef.current || !window.THREE) return;

    const container = containerRef.current;
    const GlobeClass = (window as unknown as { Globe: typeof Globe }).Globe;

    const myGlobe = GlobeClass()
      .globeImageUrl("//unpkg.com/three-globe@2.45.2/example/img/earth-blue-marble.jpg")
      .backgroundImageUrl("//unpkg.com/three-globe@2.45.2/example/img/night-sky.png")
      .pointsData(SAMPLE_HUBS)
      .pointLat("lat")
      .pointLng("lng")
      .pointColor((d: unknown) => {
        const p = d as Point;
        return p.color || "#6366f1";
      })
      .pointRadius(0.5)
      .pointLabel(
        (d: unknown) => {
          const p = d as Point;
          return `<div style="font-family:sans-serif;padding:4px 8px;background:rgba(0,0,0,0.7);border-radius:4px;color:white;">
            <b>${p.name}</b> (@${p.handle})<br/>
            <span style="font-size:12px;color:#aaa">${p.location}</span>
          </div>`;
        }
      )
      .linksData(SAMPLE_LINKS.map((l) => {
        const from = SAMPLE_HUBS.find((h) => h.handle === l.from_handle)!;
        const to = SAMPLE_HUBS.find((h) => h.handle === l.to_handle)!;
        return { lat1: from.lat, lng1: from.lng, lat2: to.lat, lng2: to.lng };
      }))
      .linkStartLat("lat1")
      .linkStartLng("lng1")
      .linkEndLat("lat2")
      .linkEndLng("lng2")
      .linkColor(() => "rgba(99,102,241,0.6)")
      .linkWidth(1)
      .linkDirection(1)
      .onPointClick((d: unknown) => {
        const p = d as Point;
        const idx = SAMPLE_HUBS.findIndex((h) => h.handle === p.handle);
        setSelected(idx);
      })
      .onPointHover((d: unknown) => {
        if (!d) { setHovered(null); return; }
        const p = d as Point;
        const idx = SAMPLE_HUBS.findIndex((h) => h.handle === p.handle);
        setHovered(idx);
      })
      .enablePointerInteraction(true);

    (container as unknown as { appendChild: (el: unknown) => void }).appendChild(myGlobe as unknown as Node);
    globeRef.current = myGlobe;

    // Size the canvas
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      (myGlobe as unknown as { width(w: number): unknown; height(h: number): unknown }).width(w).height(h);
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [threeLoaded]);

  const selectedHub = selected !== null ? SAMPLE_HUBS[selected] : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-1 text-center">Zo × Future of Collaboration</h1>
      <p className="text-gray-400 mb-4 text-center text-xs max-w-md">
        A global map of creative hubs — each node is a person, each edge a shared intention.
        {threeError && (
            <span className="text-yellow-500 ml-2"> (3D unavailable — showing fallback)</span>
        )}
      </p>

      {/* Globe container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl"
        style={{ height: "400px" }}
      />

      {/* Fallback SVG when three-globe not available */}
      {!threeLoaded && !threeError && (
        <div className="text-gray-500 text-sm mb-2">Loading 3D globe…</div>
      )}
      {threeError && <FallbackSVG selected={selected} hovered={hovered} onSelect={setSelected} />}

      {/* Bio panel */}
      {selectedHub && (
        <div
          className="mt-4 p-4 rounded-xl border text-center max-w-sm w-full"
          style={{
            borderColor: selectedHub.color + "44",
            background: "#111827",
          }}
        >
          <div className="text-4xl mb-2">{selectedHub.avatar}</div>
          <h2 className="text-xl font-bold">{selectedHub.name}</h2>
          <p className="text-gray-400 text-sm">@{selectedHub.handle}</p>
          <p className="text-gray-300 text-sm mt-2">{selectedHub.bio}</p>
          <p className="text-xs text-gray-500 mt-1">{selectedHub.location}</p>
        </div>
      )}

      {/* Hub picker */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {SAMPLE_HUBS.map((h, i) => (
          <button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-all"
            style={{
              borderColor: selected === i ? h.color : "#334155",
              background: selected === i ? h.color + "22" : "transparent",
              color: selected === i ? h.color : "#94a3b8",
            }}
          >
            <span>{h.avatar}</span>
            <span>{h.name}</span>
          </button>
        ))}
      </div>

      <p className="text-gray-600 text-xs mt-6">Zo × Future of Collaboration — Interactive Globe Demo</p>
    </div>
  );
}

// Simple SVG fallback when three-globe fails
function FallbackSVG({ selected, hovered, onSelect }: {
  selected: number | null;
  hovered: number | null;
  onSelect: (i: number | null) => void;
}) {
  const WIDTH = 600;
  const HEIGHT = 300;
  const CENTER_LNG = -30;

  function latLngToXY(lat: number, lng: number) {
    const x = ((lng - CENTER_LNG + 180 + 540) % 360) - 180;
    const y = 90 - lat;
    return { x: (x / 360) * WIDTH, y: (y / 180) * HEIGHT };
  }

  const points = SAMPLE_HUBS.map((h) => latLngToXY(h.lat, h.lng));
  const EDGES = SAMPLE_LINKS.map((l) => [
    SAMPLE_HUBS.findIndex((h) => h.handle === l.from_handle),
    SAMPLE_HUBS.findIndex((h) => h.handle === l.to_handle),
  ]);

  return (
    <div className="relative w-full max-w-2xl" style={{ height: "400px" }}>
      <svg width={WIDTH} height={HEIGHT} className="w-full h-full">
        {EDGES.map(([a, b], i) => {
          const p1 = points[a];
          const p2 = points[b];
          const isActive = hovered === a || hovered === b;
          return (
            <line
              key={i}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={isActive ? "#6366f1" : "#334155"}
              strokeWidth={isActive ? 2 : 1}
              strokeOpacity={isActive ? 1 : 0.4}
            />
          );
        })}
        {points.map((p, i) => {
          const hub = SAMPLE_HUBS[i];
          const isSelected = selected === i;
          const isHov = hovered === i;
          const r = isSelected ? 8 : isHov ? 7 : 5;
          return (
            <g key={i} onClick={() => onSelect(isSelected ? null : i)} style={{ cursor: "pointer" }}>
              <circle cx={p.x} cy={p.y} r={r + 4} fill={hub.color} opacity={0.2} />
              <circle cx={p.x} cy={p.y} r={r} fill={hub.color} />
              <text x={p.x} y={p.y - r - 4} textAnchor="middle" fill={hub.color} fontSize={9} fontFamily="monospace">
                {hub.handle}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}