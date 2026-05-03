import { useEffect, useState } from "react";
import { ArrowUpRight, Copy, Globe2, MapPin, Sparkles } from "lucide-react";

type Hub = {
  name: string;
  city: string;
  lat: number;
  lon: number;
  role: string;
  summary: string;
  thread: string;
  accent: string;
};

type Edge = {
  from: string;
  to: string;
  label: string;
};

type Point2D = {
  x: number;
  y: number;
  z: number;
  scale: number;
};

const HUBS: Hub[] = [
  {
    name: "Toronto Hub",
    city: "Toronto, Canada",
    lat: 43.6532,
    lon: -79.3832,
    role: "local coordination",
    summary: "Artist discovery, event planning, and bridge-building across the east side of the network.",
    thread: "Zo Day 2026",
    accent: "#6ee7ff",
  },
  {
    name: "Los Angeles Hub",
    city: "Los Angeles, USA",
    lat: 34.0522,
    lon: -118.2437,
    role: "venue research",
    summary: "West Coast launchpad for installations, demo nights, and creator meetups.",
    thread: "Venue pilots",
    accent: "#f59e0b",
  },
  {
    name: "New York Hub",
    city: "New York, USA",
    lat: 40.7128,
    lon: -74.006,
    role: "funding + review",
    summary: "Funding conversations, review loops, and high-density creative introductions.",
    thread: "Scholarship review",
    accent: "#f472b6",
  },
  {
    name: "Singapore Hub",
    city: "Singapore",
    lat: 1.3521,
    lon: 103.8198,
    role: "remote showcase",
    summary: "Asia-Pacific node for remote collaboration, livestreamed demos, and gallery moments.",
    thread: "Live showcase",
    accent: "#34d399",
  },
  {
    name: "London Hub",
    city: "London, UK",
    lat: 51.5072,
    lon: -0.1276,
    role: "cross-Atlantic bridge",
    summary: "A proof point for the network extending beyond a single city or social circle.",
    thread: "Bridge links",
    accent: "#a78bfa",
  },
];

const EDGES: Edge[] = [
  { from: "Toronto Hub", to: "Los Angeles Hub", label: "shared project" },
  { from: "Toronto Hub", to: "New York Hub", label: "introductions" },
  { from: "Los Angeles Hub", to: "Singapore Hub", label: "global showcase" },
  { from: "New York Hub", to: "Toronto Hub", label: "funding and review" },
  { from: "London Hub", to: "Toronto Hub", label: "cross-pollination" },
  { from: "London Hub", to: "Singapore Hub", label: "late-night bridge" },
];

const STAR_COUNT = 44;
const RING_COUNT = 5;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function projectHub(hub: Hub, spin: number, radius: number, cx: number, cy: number): Point2D {
  const lon = toRadians(hub.lon + spin);
  const lat = toRadians(hub.lat);
  const x = Math.cos(lat) * Math.sin(lon);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.cos(lon);
  return {
    x: cx + x * radius,
    y: cy - y * radius * 0.96,
    z,
    scale: 0.78 + ((z + 1) / 2) * 0.42,
  };
}

function edgePath(a: Point2D, b: Point2D) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  const lift = clamp(dist * 0.18, 28, 104);
  const nx = -dy / dist;
  const ny = dx / dist;
  const cx = (a.x + b.x) / 2 + nx * lift;
  const cy = (a.y + b.y) / 2 + ny * lift;
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

function starField() {
  const stars: Array<{ x: number; y: number; size: number; opacity: number }> = [];
  for (let i = 0; i < STAR_COUNT; i += 1) {
    const x = (i * 97) % 1000;
    const y = (i * 193) % 1000;
    const size = 0.8 + ((i * 17) % 9) / 10;
    const opacity = 0.14 + ((i * 11) % 8) / 20;
    stars.push({ x, y, size, opacity });
  }
  return stars;
}

export default function GlobeDemo() {
  const [spin, setSpin] = useState(0);
  const [activeHubName, setActiveHubName] = useState(HUBS[0].name);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let frame = 0;
    let last = 0;
    const step = (now: number) => {
      if (now - last > 33) {
        setSpin((value) => (value + 0.55) % 360);
        last = now;
      }
      frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const activeHub = HUBS.find((hub) => hub.name === activeHubName) ?? HUBS[0];
  const activeEdges = EDGES.filter((edge) => edge.from === activeHub.name || edge.to === activeHub.name);
  const points = HUBS.map((hub) => ({ hub, point: projectHub(hub, spin, 265, 500, 470) }));
  const selectedPoint = points.find(({ hub }) => hub.name === activeHub.name) ?? points[0];

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const stars = starField();
  const connectionMap = new Map<string, string[]>();
  for (const edge of EDGES) {
    const nextFrom = connectionMap.get(edge.from) ?? [];
    nextFrom.push(edge.to);
    connectionMap.set(edge.from, nextFrom);
    const nextTo = connectionMap.get(edge.to) ?? [];
    nextTo.push(edge.from);
    connectionMap.set(edge.to, nextTo);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#06111d] text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(110,231,255,0.22),transparent_24%),radial-gradient(circle_at_15%_20%,rgba(244,114,182,0.16),transparent_22%),radial-gradient(circle_at_85%_18%,rgba(52,211,153,0.14),transparent_20%),linear-gradient(180deg,rgba(7,11,24,0.2),rgba(7,17,29,0.9))]" />
      <div className="pointer-events-none absolute inset-0 opacity-35">
        {stars.map((star) => (
          <span
            key={`${star.x}-${star.y}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x / 10}%`,
              top: `${star.y / 10}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:flex-row lg:items-stretch lg:px-10 lg:py-8">
        <section className="relative flex min-h-[640px] flex-1 flex-col overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200/90">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              public demo
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <Globe2 className="h-3.5 w-3.5" />
              collaboration globe
            </span>
          </div>

          <div className="mt-5 grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] xl:items-start">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="max-w-2xl text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl xl:text-7xl">
                  A globe that makes the network feel real.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                  This is the simplest version of the vision: a small set of hubs, explicit relationships, and one shared map that makes it obvious how people and cities connect.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  onClick={() => setActiveHubName("Toronto Hub")}
                  className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-left text-sm font-semibold text-cyan-50 transition hover:-translate-y-0.5 hover:bg-cyan-300/20"
                >
                  Start in Toronto
                  <span className="mt-1 block text-xs font-normal text-cyan-100/70">Launch point for the demo</span>
                </button>
                <button
                  onClick={() => setActiveHubName("Los Angeles Hub")}
                  className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-left text-sm font-semibold text-amber-50 transition hover:-translate-y-0.5 hover:bg-amber-300/20"
                >
                  Jump to LA
                  <span className="mt-1 block text-xs font-normal text-amber-100/70">Venue + activation thread</span>
                </button>
                <button
                  onClick={copyShareLink}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-left text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  {copied ? "Copied" : "Copy link"}
                  <span className="mt-1 block text-xs font-normal text-slate-300">Share this page directly</span>
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">visible hubs</div>
                  <div className="mt-2 text-3xl font-black">{HUBS.length}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">sample edges</div>
                  <div className="mt-2 text-3xl font-black">{EDGES.length}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">thread</div>
                  <div className="mt-2 text-lg font-bold leading-tight">{activeHub.thread}</div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]">
                <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.12),rgba(255,255,255,0.04)_40%,rgba(255,255,255,0.02)_100%)] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">selected hub</div>
                      <div className="mt-1 text-2xl font-black">{activeHub.name}</div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                      {activeHub.role}
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-3 text-sm leading-6 text-slate-300">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span>{activeHub.city}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{activeHub.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(connectionMap.get(activeHub.name) ?? []).map((label) => (
                      <span key={label} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">connection story</div>
                  <div className="mt-3 space-y-3">
                    {activeEdges.map((edge) => {
                      const other = edge.from === activeHub.name ? edge.to : edge.from;
                      return (
                        <div key={`${edge.from}-${edge.to}`} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-semibold text-white">{other}</div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{edge.label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(110,231,255,0.22),rgba(10,18,33,0.96)_60%,rgba(4,9,18,1)_100%)] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
                <div className="absolute inset-x-8 top-8 h-28 rounded-full bg-cyan-300/10 blur-3xl" />
                <svg viewBox="0 0 1000 1000" className="relative aspect-square w-full">
                  <defs>
                    <radialGradient id="globeFill" cx="50%" cy="42%" r="58%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
                      <stop offset="24%" stopColor="rgba(98,221,255,0.86)" />
                      <stop offset="58%" stopColor="rgba(11,68,105,0.94)" />
                      <stop offset="100%" stopColor="rgba(5,12,22,1)" />
                    </radialGradient>
                    <radialGradient id="globeGlow" cx="50%" cy="35%" r="60%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                  </defs>

                  <g opacity="0.9">
                    {stars.slice(0, 16).map((star) => (
                      <circle key={`${star.x}-${star.y}-g`} cx={star.x} cy={star.y} r={star.size / 2 + 0.4} fill="white" opacity={star.opacity} />
                    ))}
                  </g>

                  <circle cx="500" cy="470" r="300" fill="url(#globeFill)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  <circle cx="500" cy="470" r="300" fill="url(#globeGlow)" opacity="0.22" />
                  <circle cx="500" cy="470" r="280" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.2" />
                  <circle cx="500" cy="470" r="210" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                  <circle cx="500" cy="470" r="142" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

                  {Array.from({ length: RING_COUNT }, (_, index) => {
                    const ring = 70 + index * 54;
                    return (
                      <ellipse
                        key={`ring-${ring}`}
                        cx="500"
                        cy="470"
                        rx={ring * 1.08}
                        ry={ring * 0.34}
                        fill="none"
                        stroke="rgba(255,255,255,0.07)"
                        strokeWidth="1"
                        transform={`rotate(${spin * 0.4} 500 470)`}
                      />
                    );
                  })}

                  {EDGES.map((edge) => {
                    const from = points.find(({ hub }) => hub.name === edge.from)?.point;
                    const to = points.find(({ hub }) => hub.name === edge.to)?.point;
                    if (!from || !to) return null;
                    const highlight = edge.from === activeHub.name || edge.to === activeHub.name;
                    const depth = clamp((from.z + to.z + 1.2) / 2.2, 0.15, 1);
                    return (
                      <path
                        key={`${edge.from}-${edge.to}`}
                        d={edgePath(from, to)}
                        fill="none"
                        stroke={highlight ? "rgba(110,231,255,0.9)" : "rgba(255,255,255,0.26)"}
                        strokeWidth={highlight ? 3.2 : 1.8}
                        strokeLinecap="round"
                        strokeDasharray={highlight ? "0" : "6 8"}
                        opacity={highlight ? 0.95 : depth * 0.5}
                      />
                    );
                  })}

                  {points.map(({ hub, point }) => {
                    const active = hub.name === activeHub.name;
                    const visible = point.z > -0.08;
                    const nodeOpacity = clamp((point.z + 1) / 2, 0.16, 1);
                    return (
                      <g key={hub.name} opacity={visible ? 1 : 0.28}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={active ? 21 * point.scale : 15 * point.scale}
                          fill={hub.accent}
                          opacity={active ? 0.96 : nodeOpacity * 0.66}
                          onClick={() => setActiveHubName(hub.name)}
                          style={{ cursor: "pointer" }}
                        />
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={active ? 34 * point.scale : 24 * point.scale}
                          fill="none"
                          stroke={hub.accent}
                          strokeWidth={active ? 3 : 1.5}
                          opacity={active ? 0.4 : nodeOpacity * 0.24}
                        />
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={active ? 6 : 4}
                          fill="white"
                          opacity={active ? 0.98 : 0.74}
                        />
                        {active || visible ? (
                          <text
                            x={point.x}
                            y={point.y - 30}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.92)"
                            fontSize="18"
                            fontWeight="700"
                            style={{ letterSpacing: "-0.03em" }}
                          >
                            {hub.name}
                          </text>
                        ) : null}
                      </g>
                    );
                  })}
                </svg>

                <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">current focus</div>
                      <div className="mt-1 text-lg font-bold">{activeHub.name}</div>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                      <div>{selectedPoint.point.z > 0 ? "front hemisphere" : "back hemisphere"}</div>
                      <div className="mt-1">{activeHub.thread}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">sample network</div>
                    <div className="mt-1 text-xl font-bold">Five hubs, one shared story.</div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-300" />
                </div>
                <div className="mt-4 space-y-3">
                  {HUBS.map((hub) => {
                    const isActive = hub.name === activeHub.name;
                    return (
                      <button
                        key={hub.name}
                        onClick={() => setActiveHubName(hub.name)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                          isActive ? "border-white/20 bg-white/10" : "border-white/10 bg-black/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-semibold text-white">{hub.name}</div>
                          <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.24em] text-slate-300">
                            {hub.role}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-slate-300">{hub.city}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-cyan-300" />
              <span>Designed to make the network feel legible in one glance.</span>
            </div>
            <div className="flex items-center gap-2">
              <Copy className="h-4 w-4 text-cyan-300" />
              <span>{copied ? "Link copied to clipboard" : "Use the same link to show it to anyone"}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
