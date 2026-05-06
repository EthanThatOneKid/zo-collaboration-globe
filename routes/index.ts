import { useEffect, useRef, useState } from "react";

type Hub = {
  id: number;
  handle: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  color: string;
  bio: string;
  avatar: string;
};

type Link = {
  id: number;
  from_handle: string;
  to_handle: string;
};

const SAMPLE_HUBS: Hub[] = [
  {
    id: 1,
    handle: "etok",
    name: "Ethan",
    location: "San Francisco, CA",
    lat: 37.7749,
    lng: -122.4194,
    color: "#6366f1",
    bio: "Execution and stability lead bridging creative intent with technical delivery.",
    avatar: "👨‍💻",
  },
  {
    id: 2,
    handle: "vangogh",
    name: "Van Gogh",
    location: "Arles, France",
    lat: 43.9493,
    lng: 4.8055,
    color: "#f59e0b",
    bio: "Painter of nights and sunflowers.",
    avatar: "🎨",
  },
  {
    id: 3,
    handle: "picasso",
    name: "Picasso",
    location: "Barcelona, Spain",
    lat: 41.3874,
    lng: 2.1686,
    color: "#ef4444",
    bio: "Cubist, sculptor, troublemaker.",
    avatar: "🖼️",
  },
  {
    id: 4,
    handle: "kahlo",
    name: "Frida Kahlo",
    location: "Coyoacan, Mexico",
    lat: 19.3467,
    lng: -99.1617,
    color: "#10b981",
    bio: "Painter of self, pain, and flowers.",
    avatar: "🌺",
  },
  {
    id: 5,
    handle: "okeeffe",
    name: "Georgia O'Keeffe",
    location: "Santa Fe, NM",
    lat: 35.687,
    lng: -105.9378,
    color: "#8b5cf6",
    bio: "Desert flowers and animal bones.",
    avatar: "🏜️",
  },
  {
    id: 6,
    handle: "kusama",
    name: "Yayoi Kusama",
    location: "Tokyo, Japan",
    lat: 35.6762,
    lng: 139.6503,
    color: "#ec4899",
    bio: "Infinity, polka dots, mirrors.",
    avatar: "🔴",
  },
];

const SAMPLE_LINKS: Link[] = [
  { id: 1, from_handle: "etok", to_handle: "vangogh" },
  { id: 2, from_handle: "etok", to_handle: "picasso" },
  { id: 3, from_handle: "etok", to_handle: "kahlo" },
  { id: 4, from_handle: "etok", to_handle: "okeeffe" },
  { id: 5, from_handle: "etok", to_handle: "kusama" },
  { id: 6, from_handle: "vangogh", to_handle: "picasso" },
  { id: 7, from_handle: "picasso", to_handle: "kahlo" },
  { id: 8, from_handle: "kahlo", to_handle: "okeeffe" },
  { id: 9, from_handle: "okeeffe", to_handle: "kusama" },
  { id: 10, from_handle: "kusama", to_handle: "vangogh" },
];

type ArcDatum = {
  id: number;
  from_handle: string;
  to_handle: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  isActive: boolean;
};

type GlobeInstance = {
  globeImageUrl: (value: string) => GlobeInstance;
  backgroundImageUrl: (value: string) => GlobeInstance;
  backgroundColor: (value: string) => GlobeInstance;
  atmosphereColor: (value: string) => GlobeInstance;
  atmosphereAltitude: (value: number) => GlobeInstance;
  pointsData: (value: Hub[]) => GlobeInstance;
  pointLat: (value: string) => GlobeInstance;
  pointLng: (value: string) => GlobeInstance;
  pointColor: (value: (hub: Hub) => string) => GlobeInstance;
  pointAltitude: (value: (hub: Hub) => number) => GlobeInstance;
  pointRadius: (value: (hub: Hub) => number) => GlobeInstance;
  pointResolution: (value: number) => GlobeInstance;
  pointLabel: (value: (hub: Hub) => string) => GlobeInstance;
  labelsData: (value: Hub[]) => GlobeInstance;
  labelLat: (value: string) => GlobeInstance;
  labelLng: (value: string) => GlobeInstance;
  labelText: (value: (hub: Hub) => string) => GlobeInstance;
  labelColor: (value: (hub: Hub) => string) => GlobeInstance;
  labelDotRadius: (value: number) => GlobeInstance;
  labelSize: (value: (hub: Hub) => number) => GlobeInstance;
  labelAltitude: (value: number) => GlobeInstance;
  arcsData: (value: ArcDatum[]) => GlobeInstance;
  arcStartLat: (value: string) => GlobeInstance;
  arcStartLng: (value: string) => GlobeInstance;
  arcEndLat: (value: string) => GlobeInstance;
  arcEndLng: (value: string) => GlobeInstance;
  arcColor: (value: (arc: ArcDatum) => string | string[]) => GlobeInstance;
  arcAltitude: (value: (arc: ArcDatum) => number) => GlobeInstance;
  arcStroke: (value: number) => GlobeInstance;
  arcDashLength: (value: number) => GlobeInstance;
  arcDashGap: (value: number) => GlobeInstance;
  arcDashInitialGap: (value: (arc: ArcDatum, index: number) => number) => GlobeInstance;
  arcDashAnimateTime: (value: (arc: ArcDatum) => number) => GlobeInstance;
  ringsData: (value: Hub[]) => GlobeInstance;
  ringLat: (value: string) => GlobeInstance;
  ringLng: (value: string) => GlobeInstance;
  ringColor: (value: (hub: Hub) => string[]) => GlobeInstance;
  ringMaxRadius: (value: number) => GlobeInstance;
  ringPropagationSpeed: (value: number) => GlobeInstance;
  ringRepeatPeriod: (value: number) => GlobeInstance;
  onPointClick: (value: (hub: Hub) => void) => GlobeInstance;
  onPointHover: (value: (hub: Hub | null) => void) => GlobeInstance;
  enablePointerInteraction: (value: boolean) => GlobeInstance;
  width: (value: number) => GlobeInstance;
  height: (value: number) => GlobeInstance;
  pointOfView: (
    value: { lat: number; lng: number; altitude: number },
    durationMs?: number,
  ) => GlobeInstance;
  controls: () => {
    autoRotate: boolean;
    autoRotateSpeed: number;
    enablePan: boolean;
    minDistance: number;
    maxDistance: number;
  };
  renderer: () => { dispose?: () => void };
  scene: () => { clear?: () => void };
};

declare global {
  interface Window {
    Globe?: () => (container: HTMLDivElement) => GlobeInstance;
  }
}

const GLOBE_SCRIPT_URL = "https://unpkg.com/globe.gl";
const EARTH_TEXTURE_URL =
  "https://unpkg.com/three-globe/example/img/earth-night.jpg";
const STARFIELD_TEXTURE_URL =
  "https://unpkg.com/three-globe/example/img/night-sky.png";

function hubGlow(color: string) {
  return `${color}55`;
}

function buildArcData(
  hubs: Hub[],
  links: Link[],
  activeHandle: string | null,
) {
  return links.flatMap((link) => {
    const from = hubs.find((hub) => hub.handle === link.from_handle);
    const to = hubs.find((hub) => hub.handle === link.to_handle);
    if (!from || !to) {
      return [];
    }

    const isActive =
      activeHandle === null ||
      from.handle === activeHandle ||
      to.handle === activeHandle;

    return [
      {
        id: link.id,
        from_handle: from.handle,
        to_handle: to.handle,
        startLat: from.lat,
        startLng: from.lng,
        endLat: to.lat,
        endLng: to.lng,
        color: from.color,
        isActive,
      },
    ];
  });
}

function loadGlobeScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.Globe) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GLOBE_SCRIPT_URL}"]`,
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load globe.gl")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = GLOBE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load globe.gl"));
    document.head.appendChild(script);
  });
}

function FallbackMap({
  activeHandle,
  hoveredHandle,
  hubs,
  links,
  onSelect,
}: {
  activeHandle: string | null;
  hoveredHandle: string | null;
  hubs: Hub[];
  links: Link[];
  onSelect: (handle: string) => void;
}) {
  const width = 860;
  const height = 420;

  function project(lat: number, lng: number) {
    return {
      x: ((lng + 180) / 360) * width,
      y: ((90 - lat) / 180) * height,
    };
  }

  const arcData = buildArcData(hubs, links, activeHandle);

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#050816]">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <defs>
          <radialGradient id="fallback-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={width} height={height} fill="#050816" />
        <rect width={width} height={height} fill="url(#fallback-glow)" />
        {[0.18, 0.34, 0.5, 0.66, 0.82].map((ratio) => (
          <line
            key={ratio}
            x1="0"
            x2={width}
            y1={height * ratio}
            y2={height * ratio}
            stroke="#22304f"
            strokeDasharray="4 12"
            strokeOpacity="0.6"
          />
        ))}
        {[0.24, 0.5, 0.76].map((ratio) => (
          <ellipse
            key={ratio}
            cx={width / 2}
            cy={height / 2}
            rx={width * ratio * 0.24}
            ry={height * 0.45}
            fill="none"
            stroke="#1e2a44"
            strokeDasharray="6 10"
            strokeOpacity="0.6"
          />
        ))}
        {arcData.map((arc) => {
          const start = project(arc.startLat, arc.startLng);
          const end = project(arc.endLat, arc.endLng);
          const curveHeight = Math.max(40, Math.abs(end.x - start.x) * 0.12);
          const midX = (start.x + end.x) / 2;
          const midY = Math.min(start.y, end.y) - curveHeight;
          return (
            <path
              key={arc.id}
              d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
              fill="none"
              stroke={arc.isActive ? arc.color : "#334155"}
              strokeOpacity={arc.isActive ? 0.75 : 0.18}
              strokeWidth={arc.isActive ? 2.4 : 1.2}
            />
          );
        })}
        {hubs.map((hub) => {
          const point = project(hub.lat, hub.lng);
          const isActive = activeHandle === hub.handle;
          const isHovered = hoveredHandle === hub.handle;
          const radius = isActive ? 7 : isHovered ? 6 : 5;
          return (
            <g
              key={hub.handle}
              onClick={() => onSelect(hub.handle)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={point.x} cy={point.y} r={radius + 9} fill={hub.color} opacity="0.14" />
              <circle cx={point.x} cy={point.y} r={radius} fill={hub.color} />
              <text
                x={point.x}
                y={point.y - radius - 8}
                textAnchor="middle"
                fill={hub.color}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontSize="12"
                fontWeight="700"
              >
                {hub.handle}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function GlobePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [hubs, setHubs] = useState<Hub[]>(SAMPLE_HUBS);
  const [links, setLinks] = useState<Link[]>(SAMPLE_LINKS);
  const [activeHandle, setActiveHandle] = useState<string>("etok");
  const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const activeHub = hubs.find((hub) => hub.handle === activeHandle) ?? hubs[0];
  const activeLinks = links.filter(
    (link) =>
      link.from_handle === activeHub.handle || link.to_handle === activeHub.handle,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [hubsResponse, linksResponse] = await Promise.all([
          fetch("/api/hubs", { headers: { Accept: "application/json" } }),
          fetch("/api/links", { headers: { Accept: "application/json" } }),
        ]);

        if (!hubsResponse.ok || !linksResponse.ok) {
          return;
        }

        const hubsPayload = await hubsResponse.json();
        const linksPayload = await linksResponse.json();

        if (cancelled) {
          return;
        }

        if (Array.isArray(hubsPayload.hubs) && hubsPayload.hubs.length > 0) {
          setHubs(hubsPayload.hubs as Hub[]);
        }
        if (Array.isArray(linksPayload.links) && linksPayload.links.length > 0) {
          setLinks(linksPayload.links as Link[]);
        }
      } catch {
        return;
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadGlobeScript()
      .then(() => {
        if (!cancelled) {
          setIsReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !containerRef.current || !window.Globe) {
      return;
    }

    const container = containerRef.current;
    container.innerHTML = "";

    const globe = window.Globe()(container)
      .globeImageUrl(EARTH_TEXTURE_URL)
      .backgroundImageUrl(STARFIELD_TEXTURE_URL)
      .backgroundColor("rgba(0,0,0,0)")
      .atmosphereColor("#60a5fa")
      .atmosphereAltitude(0.16)
      .pointsData(hubs)
      .pointLat("lat")
      .pointLng("lng")
      .pointColor((hub) => hub.color)
      .pointAltitude((hub) => (hub.handle === activeHandle ? 0.22 : 0.16))
      .pointRadius((hub) => (hub.handle === activeHandle ? 1.2 : 0.82))
      .pointResolution(24)
      .pointLabel(
        (hub) =>
          `<div style="padding:8px 10px;border:1px solid rgba(148,163,184,.25);border-radius:14px;background:rgba(2,6,23,.88);color:#e2e8f0;font-family:ui-sans-serif,system-ui,sans-serif;">
            <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${hub.color};font-weight:700;">@${hub.handle}</div>
            <div style="margin-top:2px;font-size:14px;font-weight:700;">${hub.name}</div>
            <div style="margin-top:2px;font-size:12px;color:#94a3b8;">${hub.location}</div>
          </div>`,
      )
      .labelsData(hubs)
      .labelLat("lat")
      .labelLng("lng")
      .labelText((hub) => hub.handle)
      .labelColor((hub) => (hub.handle === activeHandle ? hub.color : "#94a3b8"))
      .labelDotRadius(0.3)
      .labelSize((hub) => (hub.handle === activeHandle ? 1.9 : 1.45))
      .labelAltitude(0.02)
      .arcsData(buildArcData(hubs, links, activeHandle))
      .arcStartLat("startLat")
      .arcStartLng("startLng")
      .arcEndLat("endLat")
      .arcEndLng("endLng")
      .arcColor((arc) =>
        arc.isActive
          ? [hubGlow(arc.color), arc.color]
          : ["rgba(51,65,85,0.05)", "rgba(51,65,85,0.25)"],
      )
      .arcAltitude((arc) => (arc.isActive ? 0.24 : 0.15))
      .arcStroke(0.85)
      .arcDashLength(0.35)
      .arcDashGap(1.4)
      .arcDashInitialGap((_, index) => index * 0.16)
      .arcDashAnimateTime((arc) => (arc.isActive ? 1700 : 2800))
      .ringsData([activeHub])
      .ringLat("lat")
      .ringLng("lng")
      .ringColor((hub) => [hubGlow(hub.color), `${hub.color}00`])
      .ringMaxRadius(4.8)
      .ringPropagationSpeed(2.3)
      .ringRepeatPeriod(850)
      .onPointHover((hub) => setHoveredHandle(hub?.handle ?? null))
      .onPointClick((hub) => setActiveHandle(hub.handle))
      .enablePointerInteraction(true);

    globe.width(container.clientWidth).height(container.clientHeight);
    globe.pointOfView(
      { lat: activeHub.lat, lng: activeHub.lng, altitude: 1.85 },
      0,
    );

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;
    controls.enablePan = false;
    controls.minDistance = 190;
    controls.maxDistance = 420;

    const resize = () => {
      if (!containerRef.current || !globeRef.current) {
        return;
      }
      globeRef.current
        .width(containerRef.current.clientWidth)
        .height(containerRef.current.clientHeight);
    };

    globeRef.current = globe;
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      globe.renderer().dispose?.();
      globe.scene().clear?.();
      container.innerHTML = "";
      globeRef.current = null;
    };
  }, [isReady]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) {
      return;
    }

    globe
      .pointsData(hubs)
      .labelsData(hubs)
      .arcsData(buildArcData(hubs, links, activeHandle))
      .ringsData([activeHub])
      .pointOfView(
        { lat: activeHub.lat, lng: activeHub.lng, altitude: 1.85 },
        900,
      );
  }, [activeHandle, activeHub, hubs, links]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-10 pt-8 sm:px-8 lg:px-10">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.42em] text-cyan-300/80">
            Live pilot
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Zo × Future of Collaboration
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-6 text-slate-300 sm:text-base">
            A real globe scene for creative hubs, shared intention, and cross-city
            execution. Click a node to orbit into its local context and trace the
            active collaboration paths.
          </p>
        </header>

        <section className="mt-8 grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_360px]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,#0f1f4b,transparent_38%),linear-gradient(180deg,#08101f_0%,#030712_65%)] p-3 shadow-[0_30px_120px_rgba(2,6,23,0.85)] sm:p-5">
            <div className="pointer-events-none absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
            <div
              ref={containerRef}
              className={`relative h-[460px] w-full overflow-hidden rounded-[1.6rem] ${
                loadFailed ? "hidden" : "block"
              }`}
            />
            {!isReady && !loadFailed ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full border border-cyan-300/20 bg-slate-950/80 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
                  Loading globe
                </div>
              </div>
            ) : null}
            {loadFailed ? (
              <FallbackMap
                activeHandle={activeHandle}
                hoveredHandle={hoveredHandle}
                hubs={hubs}
                links={links}
                onSelect={setActiveHandle}
              />
            ) : null}
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.32em]"
                    style={{ color: activeHub.color }}
                  >
                    Active hub
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {activeHub.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">@{activeHub.handle}</p>
                </div>
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border text-3xl"
                  style={{
                    borderColor: hubGlow(activeHub.color),
                    backgroundColor: `${activeHub.color}18`,
                  }}
                >
                  {activeHub.avatar}
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{activeHub.bio}</p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  Location
                </div>
                <div className="mt-1 font-medium text-white">{activeHub.location}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MetricCard label="Hubs" value={String(hubs.length)} />
              <MetricCard label="Links" value={String(links.length)} />
              <MetricCard label="Active" value={String(activeLinks.length)} />
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">
                Connected paths
              </div>
              <div className="mt-4 space-y-3">
                {activeLinks.map((link) => {
                  const peerHandle =
                    link.from_handle === activeHub.handle
                      ? link.to_handle
                      : link.from_handle;
                  const peer =
                    hubs.find((hub) => hub.handle === peerHandle) ?? activeHub;
                  return (
                    <button
                      key={link.id}
                      onClick={() => setActiveHandle(peer.handle)}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-left transition hover:border-white/20 hover:bg-slate-950/70"
                    >
                      <div>
                        <div className="text-sm font-medium text-white">{peer.name}</div>
                        <div className="mt-1 text-xs text-slate-400">{peer.location}</div>
                      </div>
                      <div
                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                        style={{
                          color: peer.color,
                          backgroundColor: `${peer.color}18`,
                        }}
                      >
                        @{peer.handle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {hubs.map((hub) => {
            const isActive = hub.handle === activeHandle;
            return (
              <button
                key={hub.handle}
                onClick={() => setActiveHandle(hub.handle)}
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition"
                style={{
                  borderColor: isActive ? `${hub.color}66` : "rgba(148,163,184,0.18)",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  backgroundColor: isActive ? `${hub.color}20` : "rgba(15,23,42,0.5)",
                  boxShadow: isActive ? `0 0 0 1px ${hubGlow(hub.color)}` : "none",
                }}
              >
                <span>{hub.avatar}</span>
                <span>{hub.name}</span>
              </button>
            );
          })}
        </footer>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4 text-center">
      <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}
