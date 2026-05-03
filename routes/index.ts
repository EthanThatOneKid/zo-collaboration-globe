import { useEffect, useRef, useState } from "react";

const SAMPLE_HUBS = [
  {
    name: "Ethan",
    handle: "etok",
    location: "San Francisco, CA",
    lat: 37.7749,
    lng: -122.4194,
    color: "#6366f1",
    bio: "Maker, builder, Zo enthusiast",
    avatar: "👨‍💻",
  },
  {
    name: "Van Gogh",
    handle: "vangogh",
    location: "Arles, France",
    lat: 43.9493,
    lng: 4.8055,
    color: "#f59e0b",
    bio: "Painter of nights and sunflowers",
    avatar: "🎨",
  },
  {
    name: "Picasso",
    handle: "picasso",
    location: "Barcelona, Spain",
    lat: 41.3874,
    lng: 2.1686,
    color: "#ef4444",
    bio: "Cubist, sculptor, troublemaker",
    avatar: "🖼️",
  },
  {
    name: "Frida Kahlo",
    handle: "kahlo",
    location: "Coyoacán, Mexico",
    lat: 19.3467,
    lng: -99.1617,
    color: "#10b981",
    bio: "Painter of self, pain, and flowers",
    avatar: "🌺",
  },
  {
    name: "Georgia O'Keeffe",
    handle: "okeeffe",
    location: "Santa Fe, NM",
    lat: 35.687,
    lng: -105.9378,
    color: "#8b5cf6",
    bio: "Desert flowers and animal bones",
    avatar: "🏜️",
  },
  {
    name: "Yayoi Kusama",
    handle: "kusama",
    location: "Tokyo, Japan",
    lat: 35.6762,
    lng: 139.6503,
    color: "#ec4899",
    bio: "Infinity, polka dots, mirrors",
    avatar: "🔴",
  },
];

const EDGES = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 1],
];

const CENTER_LNG = -30;
const WIDTH = 800;
const HEIGHT = 500;

function latLngToXY(lat: number, lng: number) {
  const x = ((lng - CENTER_LNG + 180 + 540) % 360) - 180;
  const y = 90 - lat;
  return {
    x: (x / 360) * WIDTH,
    y: (y / 180) * HEIGHT,
  };
}

export default function Globe() {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const points = SAMPLE_HUBS.map((h) => latLngToXY(h.lat, h.lng));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Zo × Future of Collaboration
      </h1>
      <p className="text-gray-400 mb-6 text-center text-sm max-w-md">
        A global map of creative hubs — each node is a person, each edge a shared intention.
      </p>

      <div className="relative" style={{ width: WIDTH, height: HEIGHT }}>
        <svg
          width={WIDTH}
          height={HEIGHT}
          className="absolute inset-0"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 1s" }}
        >
          {[-60, -30, 0, 30, 60].map((lat) => {
            const y = ((90 - lat) / 180) * HEIGHT;
            return (
              <line
                key={`lat-${lat}`}
                x1={0} y1={y} x2={WIDTH} y2={y}
                stroke="#1e293b" strokeWidth={0.5} strokeDasharray="4 4"
              />
            );
          })}
          {[-120, -60, 0, 60, 120].map((lng) => {
            const cx = WIDTH / 2;
            const cy = HEIGHT / 2;
            const R = 200;
            const px = Math.cos((lng * Math.PI) / 180) * R;
            return (
              <ellipse
                key={`lng-${lng}`}
                cx={cx} cy={cy}
                rx={Math.abs(px)} ry={R}
                fill="none"
                stroke="#1e293b"
                strokeWidth={0.5}
                strokeDasharray="4 4"
              />
            );
          })}

          {EDGES.map(([a, b], i) => {
            const p1 = points[a];
            const p2 = points[b];
            const isActive = hovered === a || hovered === b;
            return (
              <line
                key={`edge-${i}`}
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={isActive ? "#6366f1" : "#334155"}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isActive ? 1 : 0.4}
                style={{ transition: "all 0.3s" }}
              />
            );
          })}

          {points.map((p, i) => {
            const hub = SAMPLE_HUBS[i];
            const isSelected = selected === i;
            const isHov = hovered === i;
            const r = isSelected ? 10 : isHov ? 8 : 6;
            return (
              <g
                key={i}
                onClick={() => setSelected(isSelected ? null : i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                {(isSelected || isHov) && (
                  <circle cx={p.x} cy={p.y} r={r + 6} fill={hub.color} opacity={0.2} />
                )}
                <circle cx={p.x} cy={p.y} r={r} fill={hub.color} />
                <text
                  x={p.x}
                  y={p.y - r - 6}
                  textAnchor="middle"
                  fill={hub.color}
                  fontSize={10}
                  fontFamily="monospace"
                >
                  {hub.handle}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selected !== null && (
        <div
          className="mt-6 p-4 rounded-xl border text-center max-w-sm w-full"
          style={{
            borderColor: SAMPLE_HUBS[selected].color + "44",
            background: "#111827",
          }}
        >
          <div className="text-4xl mb-2">{SAMPLE_HUBS[selected].avatar}</div>
          <h2 className="text-xl font-bold">{SAMPLE_HUBS[selected].name}</h2>
          <p className="text-gray-400 text-sm">@{SAMPLE_HUBS[selected].handle}</p>
          <p className="text-gray-300 text-sm mt-2">{SAMPLE_HUBS[selected].bio}</p>
          <p className="text-xs text-gray-500 mt-1">{SAMPLE_HUBS[selected].location}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {SAMPLE_HUBS.map((h, i) => (
          <button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-all"
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

      <p className="text-gray-600 text-xs mt-8">
        Zo × Future of Collaboration — Interactive Globe Demo
      </p>
    </div>
  );
}
