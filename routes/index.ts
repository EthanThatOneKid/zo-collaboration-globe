import { useEffect, useRef, useState } from "react";

type SpaceRecord = {
  id: number;
  handle: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  color: string;
  bio: string;
  avatar: string;
  url: string;
  tags: string[];
  creator_handle: string;
  featured: boolean;
  privacy_offset_applied: boolean;
};

type LinkRecord = {
  id: number;
  from_handle: string;
  to_handle: string;
};

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
  pointsData: (value: SpaceRecord[]) => GlobeInstance;
  pointLat: (value: string) => GlobeInstance;
  pointLng: (value: string) => GlobeInstance;
  pointColor: (value: (space: SpaceRecord) => string) => GlobeInstance;
  pointAltitude: (value: (space: SpaceRecord) => number) => GlobeInstance;
  pointRadius: (value: (space: SpaceRecord) => number) => GlobeInstance;
  pointResolution: (value: number) => GlobeInstance;
  pointLabel: (value: (space: SpaceRecord) => string) => GlobeInstance;
  labelsData: (value: SpaceRecord[]) => GlobeInstance;
  labelLat: (value: string) => GlobeInstance;
  labelLng: (value: string) => GlobeInstance;
  labelText: (value: (space: SpaceRecord) => string) => GlobeInstance;
  labelColor: (value: (space: SpaceRecord) => string) => GlobeInstance;
  labelDotRadius: (value: number) => GlobeInstance;
  labelSize: (value: (space: SpaceRecord) => number) => GlobeInstance;
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
  ringsData: (value: SpaceRecord[]) => GlobeInstance;
  ringLat: (value: string) => GlobeInstance;
  ringLng: (value: string) => GlobeInstance;
  ringColor: (value: (space: SpaceRecord) => string[]) => GlobeInstance;
  ringMaxRadius: (value: number) => GlobeInstance;
  ringPropagationSpeed: (value: number) => GlobeInstance;
  ringRepeatPeriod: (value: number) => GlobeInstance;
  onPointClick: (value: (space: SpaceRecord) => void) => GlobeInstance;
  onPointHover: (value: (space: SpaceRecord | null) => void) => GlobeInstance;
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

type RegistryForm = {
  handle: string;
  name: string;
  url: string;
  creator_handle: string;
  location: string;
  lat: string;
  lng: string;
  tags: string;
  bio: string;
};

const GLOBE_SCRIPT_URL = "https://unpkg.com/globe.gl";
const EARTH_TEXTURE_URL =
  "https://unpkg.com/three-globe/example/img/earth-night.jpg";
const STARFIELD_TEXTURE_URL =
  "https://unpkg.com/three-globe/example/img/night-sky.png";

const SAMPLE_SPACES: SpaceRecord[] = [
  {
    id: 1,
    handle: "globe",
    name: "Zo Collaboration Globe",
    location: "Brooklyn, NY",
    lat: 40.6782,
    lng: -73.9442,
    color: "#3b82f6",
    bio: "A public map of how Zo Spaces relate to one another across cities.",
    avatar: "🌐",
    url: "https://etok.zo.space/globe",
    tags: ["network", "registry", "community"],
    creator_handle: "etok",
    featured: true,
    privacy_offset_applied: true,
  },
  {
    id: 2,
    handle: "amity-square",
    name: "Amity Square",
    location: "Los Angeles, CA",
    lat: 34.0522,
    lng: -118.2437,
    color: "#22c55e",
    bio: "An explorable pixel-world showing how Zo Spaces can host playful environments.",
    avatar: "🌳",
    url: "https://etok.zo.space/amity-square",
    tags: ["game", "world", "interactive"],
    creator_handle: "etok",
    featured: true,
    privacy_offset_applied: true,
  },
  {
    id: 3,
    handle: "gameboy-share",
    name: "Gameboy Share",
    location: "Toronto, ON",
    lat: 43.6532,
    lng: -79.3832,
    color: "#f59e0b",
    bio: "A shared control surface that turns a Zo Space into a multiplayer ritual.",
    avatar: "🎮",
    url: "https://etok.zo.space/gameboy-share",
    tags: ["play", "multiplayer", "ritual"],
    creator_handle: "etok",
    featured: true,
    privacy_offset_applied: true,
  },
  {
    id: 4,
    handle: "studio",
    name: "Studio",
    location: "London, UK",
    lat: 51.5072,
    lng: -0.1276,
    color: "#ec4899",
    bio: "A 3D calling card that shows personal sites can feel spatial and cinematic.",
    avatar: "🪩",
    url: "https://etok.zo.space/studio",
    tags: ["3d", "portfolio", "design"],
    creator_handle: "etok",
    featured: false,
    privacy_offset_applied: true,
  },
  {
    id: 5,
    handle: "creative-wall",
    name: "Creative Wall",
    location: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    color: "#8b5cf6",
    bio: "A social canvas for showing how many small creative acts can live together.",
    avatar: "🧱",
    url: "https://etok.zo.space/new-place",
    tags: ["social", "feed", "canvas"],
    creator_handle: "etok",
    featured: false,
    privacy_offset_applied: true,
  },
  {
    id: 6,
    handle: "place-canvas",
    name: "Place Canvas",
    location: "Warsaw, Poland",
    lat: 52.2297,
    lng: 21.0122,
    color: "#ef4444",
    bio: "A mosaic surface for many contributors, useful as the registry's gallery-wall twin.",
    avatar: "🟦",
    url: "https://etok.zo.space/place",
    tags: ["mosaic", "canvas", "collective"],
    creator_handle: "etok",
    featured: false,
    privacy_offset_applied: true,
  },
];

const SAMPLE_LINKS: LinkRecord[] = [
  { id: 1, from_handle: "globe", to_handle: "amity-square" },
  { id: 2, from_handle: "globe", to_handle: "gameboy-share" },
  { id: 3, from_handle: "globe", to_handle: "studio" },
  { id: 4, from_handle: "globe", to_handle: "creative-wall" },
  { id: 5, from_handle: "globe", to_handle: "place-canvas" },
  { id: 6, from_handle: "creative-wall", to_handle: "place-canvas" },
  { id: 7, from_handle: "amity-square", to_handle: "studio" },
  { id: 8, from_handle: "gameboy-share", to_handle: "creative-wall" },
];

const DEFAULT_FORM: RegistryForm = {
  handle: "",
  name: "",
  url: "",
  creator_handle: "",
  location: "",
  lat: "",
  lng: "",
  tags: "",
  bio: "",
};

function hubGlow(color: string) {
  return `${color}55`;
}

function offsetCoordinates(lat: number, lng: number, maxMiles = 10) {
  const radiusMiles = Math.sqrt(Math.random()) * maxMiles;
  const bearing = Math.random() * Math.PI * 2;
  const milesPerLat = 69;
  const milesPerLng = 69 * Math.cos((lat * Math.PI) / 180) || 1;

  return {
    lat: Number((lat + (radiusMiles * Math.cos(bearing)) / milesPerLat).toFixed(4)),
    lng: Number((lng + (radiusMiles * Math.sin(bearing)) / milesPerLng).toFixed(4)),
  };
}

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseTagInput(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 6);
}

function normalizeIncomingSpace(space: Partial<SpaceRecord>): SpaceRecord {
  const tags = Array.isArray(space.tags)
    ? space.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : typeof space.tags === "string"
      ? parseTagInput(space.tags.replaceAll("[", "").replaceAll("]", "").replaceAll('\"', ""))
      : [];
  const featuredValue = space.featured;
  const privacyValue = space.privacy_offset_applied;

  return {
    id: Number(space.id ?? 0),
    handle: String(space.handle ?? ""),
    name: String(space.name ?? ""),
    location: String(space.location ?? ""),
    lat: Number(space.lat ?? 0),
    lng: Number(space.lng ?? 0),
    color: String(space.color ?? "#3b82f6"),
    bio: String(space.bio ?? ""),
    avatar: String(space.avatar ?? "🌐"),
    url: String(space.url ?? ""),
    tags,
    creator_handle: String(space.creator_handle ?? ""),
    featured:
      featuredValue === true ||
      featuredValue === 1 ||
      featuredValue === "1",
    privacy_offset_applied:
      privacyValue === undefined ||
      privacyValue === true ||
      privacyValue === 1 ||
      privacyValue === "1",
  };
}

function matchesQuery(space: SpaceRecord, query: string) {
  const haystack = [
    space.name,
    space.handle,
    space.creator_handle,
    space.location,
    space.bio,
    space.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function buildArcData(
  spaces: SpaceRecord[],
  links: LinkRecord[],
  activeHandle: string | null,
) {
  return links.flatMap((link) => {
    const from = spaces.find((space) => space.handle === link.from_handle);
    const to = spaces.find((space) => space.handle === link.to_handle);
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
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load globe.gl")),
        { once: true },
      );
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
  spaces,
  links,
  onSelect,
}: {
  activeHandle: string | null;
  hoveredHandle: string | null;
  spaces: SpaceRecord[];
  links: LinkRecord[];
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

  const arcData = buildArcData(spaces, links, activeHandle);

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#050816]">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <defs>
          <radialGradient id="fallback-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.22" />
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
        {spaces.map((space) => {
          const point = project(space.lat, space.lng);
          const isActive = activeHandle === space.handle;
          const isHovered = hoveredHandle === space.handle;
          const radius = isActive ? 7 : isHovered ? 6 : 5;
          return (
            <g
              key={space.handle}
              onClick={() => onSelect(space.handle)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={point.x} cy={point.y} r={radius + 9} fill={space.color} opacity="0.14" />
              <circle cx={point.x} cy={point.y} r={radius} fill={space.color} />
              <text
                x={point.x}
                y={point.y - radius - 8}
                textAnchor="middle"
                fill={space.color}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontSize="12"
                fontWeight="700"
              >
                {space.handle}
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
  const [spaces, setSpaces] = useState<SpaceRecord[]>(SAMPLE_SPACES);
  const [links, setLinks] = useState<LinkRecord[]>(SAMPLE_LINKS);
  const [activeHandle, setActiveHandle] = useState<string>(SAMPLE_SPACES[0]?.handle ?? "");
  const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [view, setView] = useState<"globe" | "registry" | "showcase">("globe");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<RegistryForm>(DEFAULT_FORM);
  const [connectFrom, setConnectFrom] = useState(SAMPLE_SPACES[0]?.handle ?? "");
  const [connectTo, setConnectTo] = useState(SAMPLE_SPACES[1]?.handle ?? "");
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [linkState, setLinkState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const activeSpace =
    spaces.find((space) => space.handle === activeHandle) ?? spaces[0] ?? SAMPLE_SPACES[0];
  const activeLinks = links.filter(
    (link) =>
      link.from_handle === activeSpace?.handle || link.to_handle === activeSpace?.handle,
  );
  const filteredSpaces = spaces.filter((space) => matchesQuery(space, search));
  const featuredSpaces = spaces.filter((space) => space.featured);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [spacesResponse, linksResponse] = await Promise.all([
          fetch("/api/hubs", { headers: { Accept: "application/json" } }),
          fetch("/api/links", { headers: { Accept: "application/json" } }),
        ]);

        if (!spacesResponse.ok || !linksResponse.ok) {
          return;
        }

        const spacesPayload = await spacesResponse.json();
        const linksPayload = await linksResponse.json();

        if (cancelled) {
          return;
        }

        const nextSpaces = Array.isArray(spacesPayload.spaces)
          ? (spacesPayload.spaces as Partial<SpaceRecord>[]).map(normalizeIncomingSpace)
          : Array.isArray(spacesPayload.hubs)
            ? (spacesPayload.hubs as Partial<SpaceRecord>[]).map(normalizeIncomingSpace)
            : [];

        if (nextSpaces.length > 0) {
          setSpaces(nextSpaces);
          setActiveHandle((current) =>
            nextSpaces.some((space) => space.handle === current)
              ? current
              : nextSpaces[0].handle,
          );
          setConnectFrom((current) =>
            nextSpaces.some((space) => space.handle === current)
              ? current
              : nextSpaces[0].handle,
          );
          setConnectTo((current) => {
            if (nextSpaces.length < 2) {
              return nextSpaces[0].handle;
            }
            return nextSpaces.some((space) => space.handle === current)
              ? current
              : nextSpaces[1].handle;
          });
        }

        if (Array.isArray(linksPayload.links) && linksPayload.links.length > 0) {
          setLinks(linksPayload.links as LinkRecord[]);
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
    if (!isReady || !containerRef.current || !window.Globe || !activeSpace) {
      return;
    }

    const container = containerRef.current;
    container.innerHTML = "";

    const globe = window.Globe()(container)
      .globeImageUrl(EARTH_TEXTURE_URL)
      .backgroundImageUrl(STARFIELD_TEXTURE_URL)
      .backgroundColor("rgba(0,0,0,0)")
      .atmosphereColor("#60a5fa")
      .atmosphereAltitude(0.17)
      .pointsData(spaces)
      .pointLat("lat")
      .pointLng("lng")
      .pointColor((space) => space.color)
      .pointAltitude((space) => (space.handle === activeHandle ? 0.24 : 0.16))
      .pointRadius((space) => (space.handle === activeHandle ? 1.3 : 0.86))
      .pointResolution(24)
      .pointLabel(
        (space) =>
          `<div style="padding:10px 12px;border:1px solid rgba(148,163,184,.25);border-radius:14px;background:rgba(2,6,23,.88);color:#e2e8f0;font-family:ui-sans-serif,system-ui,sans-serif;max-width:220px;">
            <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${space.color};font-weight:700;">@${space.creator_handle}</div>
            <div style="margin-top:4px;font-size:14px;font-weight:700;">${space.name}</div>
            <div style="margin-top:4px;font-size:12px;color:#94a3b8;">${space.location}</div>
            <div style="margin-top:6px;font-size:12px;color:#cbd5e1;">${space.bio}</div>
          </div>`,
      )
      .labelsData(spaces)
      .labelLat("lat")
      .labelLng("lng")
      .labelText((space) => space.handle)
      .labelColor((space) => (space.handle === activeHandle ? space.color : "#94a3b8"))
      .labelDotRadius(0.32)
      .labelSize((space) => (space.handle === activeHandle ? 1.95 : 1.45))
      .labelAltitude(0.03)
      .arcsData(buildArcData(spaces, links, activeHandle))
      .arcStartLat("startLat")
      .arcStartLng("startLng")
      .arcEndLat("endLat")
      .arcEndLng("endLng")
      .arcColor((arc) =>
        arc.isActive
          ? [hubGlow(arc.color), arc.color]
          : ["rgba(51,65,85,0.05)", "rgba(51,65,85,0.25)"],
      )
      .arcAltitude((arc) => (arc.isActive ? 0.26 : 0.15))
      .arcStroke(0.85)
      .arcDashLength(0.35)
      .arcDashGap(1.35)
      .arcDashInitialGap((_, index) => index * 0.16)
      .arcDashAnimateTime((arc) => (arc.isActive ? 1600 : 2600))
      .ringsData(activeSpace ? [activeSpace] : [])
      .ringLat("lat")
      .ringLng("lng")
      .ringColor((space) => [hubGlow(space.color), `${space.color}00`])
      .ringMaxRadius(4.8)
      .ringPropagationSpeed(2.4)
      .ringRepeatPeriod(850)
      .onPointHover((space) => setHoveredHandle(space?.handle ?? null))
      .onPointClick((space) => setActiveHandle(space.handle))
      .enablePointerInteraction(true);

    globe.width(container.clientWidth).height(container.clientHeight);
    globe.pointOfView(
      { lat: activeSpace.lat, lng: activeSpace.lng, altitude: 1.85 },
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
  }, [activeHandle, activeSpace, isReady, links, spaces]);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("saving");

    const lat = Number(form.lat);
    const lng = Number(form.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setSubmitState("error");
      return;
    }

    const handle = toSlug(form.handle || form.name);
    const creatorHandle = toSlug(form.creator_handle);
    const shifted = offsetCoordinates(lat, lng);

    try {
      const response = await fetch("/api/hubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          handle,
          name: form.name.trim(),
          url: form.url.trim(),
          creator_handle: creatorHandle,
          location: form.location.trim(),
          lat: shifted.lat,
          lng: shifted.lng,
          bio: form.bio.trim(),
          tags: parseTagInput(form.tags),
          color: activeSpace?.color ?? "#3b82f6",
          avatar: "🌐",
          privacy_offset_applied: true,
        }),
      });

      if (!response.ok) {
        setSubmitState("error");
        return;
      }

      const payload = await response.json();
      const nextSpace = payload.space || payload.hub
        ? normalizeIncomingSpace((payload.space ?? payload.hub) as Partial<SpaceRecord>)
        : undefined;

      if (!nextSpace) {
        setSubmitState("error");
        return;
      }

      setSpaces((current) => {
        const existing = current.findIndex((space) => space.handle === nextSpace.handle);
        if (existing === -1) {
          return [nextSpace, ...current];
        }
        const clone = [...current];
        clone[existing] = nextSpace;
        return clone;
      });
      setActiveHandle(nextSpace.handle);
      setConnectFrom(nextSpace.handle);
      setForm(DEFAULT_FORM);
      setSubmitState("saved");
      setView("globe");
    } catch {
      setSubmitState("error");
    }
  }

  async function handleConnect(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!connectFrom || !connectTo || connectFrom === connectTo) {
      setLinkState("error");
      return;
    }

    setLinkState("saving");

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          from_handle: connectFrom,
          to_handle: connectTo,
        }),
      });

      if (!response.ok) {
        setLinkState("error");
        return;
      }

      const payload = await response.json();
      const nextLink = payload.link as LinkRecord | undefined;
      if (!nextLink) {
        setLinkState("error");
        return;
      }

      setLinks((current) =>
        current.some((link) => link.id === nextLink.id)
          ? current
          : [...current, nextLink],
      );
      setLinkState("saved");
      setView("globe");
    } catch {
      setLinkState("error");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-12 pt-8 sm:px-8 lg:px-10">
        <header className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,#164e63,transparent_28%),radial-gradient(circle_at_top_right,#312e81,transparent_35%),linear-gradient(180deg,#08101f_0%,#030712_80%)] px-6 py-8 shadow-[0_30px_120px_rgba(2,6,23,0.7)] sm:px-8">
          <div className="max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-cyan-300/85">
              Zo Space registry
            </p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              A public map of how Zo Spaces connect across cities
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-sm leading-6 text-slate-300 sm:text-base">
              Register a Zo Space, place it with a privacy-safe location offset,
              trace how it links to other spaces, and browse the network as both a
              globe and a gallery wall.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <TabButton
              active={view === "globe"}
              label="Globe"
              onClick={() => setView("globe")}
            />
            <TabButton
              active={view === "registry"}
              label="Registry"
              onClick={() => setView("registry")}
            />
            <TabButton
              active={view === "showcase"}
              label="Showcase"
              onClick={() => setView("showcase")}
            />
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <MetricCard label="Registered spaces" value={String(spaces.length)} />
          <MetricCard label="Connections" value={String(links.length)} />
          <MetricCard
            label="Featured spaces"
            value={String(featuredSpaces.length || spaces.length)}
          />
        </section>

        <section className="mt-6 grid flex-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_390px]">
          <div className="flex min-h-[680px] flex-col rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_top,#0f1f4b,transparent_38%),linear-gradient(180deg,#08101f_0%,#030712_65%)] p-4 shadow-[0_30px_120px_rgba(2,6,23,0.85)] sm:p-5">
            {view === "globe" ? (
              <div className="relative flex-1 overflow-hidden rounded-[1.8rem]">
                <div className="pointer-events-none absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
                <div
                  ref={containerRef}
                  className={`relative h-[500px] w-full overflow-hidden rounded-[1.7rem] ${
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
                    spaces={spaces}
                    links={links}
                    onSelect={setActiveHandle}
                  />
                ) : null}
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <GlobeFact
                    title="Privacy-safe pins"
                    text="Registration shifts the visible pin by up to 10 miles so the map stays useful without exposing the exact venue."
                  />
                  <GlobeFact
                    title="Meaningful arcs"
                    text="Connections represent inspiration, remixing, direct references, or shared contribution pathways between spaces."
                  />
                  <GlobeFact
                    title="One registry, two views"
                    text="The same dataset powers the globe overview and the showcase wall, so discovery and spectacle stay aligned."
                  />
                </div>
              </div>
            ) : null}

            {view === "registry" ? (
              <div className="grid flex-1 gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
                <section className="rounded-[1.8rem] border border-white/10 bg-slate-950/40 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-300/85">
                        Search registry
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        Browse the network
                      </h2>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-slate-400">
                      {filteredSpaces.length} visible
                    </div>
                  </div>

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, tag, creator, or city"
                    className="mt-4 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                  />

                  <div className="mt-4 grid gap-3">
                    {filteredSpaces.map((space) => (
                      <button
                        key={space.handle}
                        onClick={() => {
                          setActiveHandle(space.handle);
                          setView("globe");
                        }}
                        className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/20 hover:bg-white/[0.07]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-base font-semibold text-white">
                              {space.name}
                            </div>
                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                              @{space.creator_handle} · {space.location}
                            </div>
                          </div>
                          <div
                            className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                            style={{
                              color: space.color,
                              backgroundColor: `${space.color}18`,
                            }}
                          >
                            {space.handle}
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          {space.bio}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {space.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="rounded-[1.8rem] border border-white/10 bg-slate-950/40 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-300/85">
                    Register a space
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Add a Zo Space to the map
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enter the real venue or city, then this page stores a jittered
                    pin instead of the exact coordinates.
                  </p>

                  <form onSubmit={handleRegister} className="mt-5 space-y-3">
                    <Field
                      label="Space title"
                      value={form.name}
                      onChange={(value) => setForm((current) => ({ ...current, name: value }))}
                      placeholder="Zo Space name"
                    />
                    <Field
                      label="Space slug"
                      value={form.handle}
                      onChange={(value) => setForm((current) => ({ ...current, handle: value }))}
                      placeholder="my-space"
                    />
                    <Field
                      label="Zo Space URL"
                      value={form.url}
                      onChange={(value) => setForm((current) => ({ ...current, url: value }))}
                      placeholder="https://yourname.zo.space/route"
                    />
                    <Field
                      label="Creator handle"
                      value={form.creator_handle}
                      onChange={(value) =>
                        setForm((current) => ({ ...current, creator_handle: value }))
                      }
                      placeholder="etok"
                    />
                    <Field
                      label="Location"
                      value={form.location}
                      onChange={(value) => setForm((current) => ({ ...current, location: value }))}
                      placeholder="Brooklyn, NY"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field
                        label="Latitude"
                        value={form.lat}
                        onChange={(value) => setForm((current) => ({ ...current, lat: value }))}
                        placeholder="40.6782"
                      />
                      <Field
                        label="Longitude"
                        value={form.lng}
                        onChange={(value) => setForm((current) => ({ ...current, lng: value }))}
                        placeholder="-73.9442"
                      />
                    </div>
                    <Field
                      label="Tags"
                      value={form.tags}
                      onChange={(value) => setForm((current) => ({ ...current, tags: value }))}
                      placeholder="network, art, experimental"
                    />
                    <TextareaField
                      label="Description"
                      value={form.bio}
                      onChange={(value) => setForm((current) => ({ ...current, bio: value }))}
                      placeholder="What makes this Zo Space worth visiting?"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                    >
                      {submitState === "saving" ? "Registering..." : "Register space"}
                    </button>
                    <p className="text-xs leading-5 text-slate-400">
                      Status:{" "}
                      {submitState === "saved"
                        ? "Space registered with an approximate pin."
                        : submitState === "error"
                          ? "Check the coordinates and required fields, then try again."
                          : "The submitted location is offset before it becomes public."}
                    </p>
                  </form>
                </section>
              </div>
            ) : null}

            {view === "showcase" ? (
              <section className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {spaces.map((space, index) => (
                  <a
                    key={space.handle}
                    href={space.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]"
                    style={{
                      backgroundImage: `radial-gradient(circle at ${index % 2 === 0 ? "top left" : "bottom right"}, ${space.color}26, transparent 42%)`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl"
                        style={{
                          borderColor: `${space.color}55`,
                          backgroundColor: `${space.color}18`,
                        }}
                      >
                        {space.avatar}
                      </div>
                      <div
                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                        style={{
                          color: space.color,
                          backgroundColor: `${space.color}18`,
                        }}
                      >
                        {space.location}
                      </div>
                    </div>
                    <div className="mt-5">
                      <div className="text-xl font-semibold text-white">
                        {space.name}
                      </div>
                      <div className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                        @{space.creator_handle} · {space.handle}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      {space.bio}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {space.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 text-sm font-medium text-cyan-200 transition group-hover:text-cyan-100">
                      Open space →
                    </div>
                  </a>
                ))}
              </section>
            ) : null}
          </div>

          <aside className="flex flex-col gap-4">
            {activeSpace ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.32em]"
                      style={{ color: activeSpace.color }}
                    >
                      Selected space
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      {activeSpace.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      @{activeSpace.creator_handle} · {activeSpace.location}
                    </p>
                  </div>
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border text-3xl"
                    style={{
                      borderColor: hubGlow(activeSpace.color),
                      backgroundColor: `${activeSpace.color}18`,
                    }}
                  >
                    {activeSpace.avatar}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  {activeSpace.bio}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {activeSpace.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={activeSpace.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-300/12 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/18"
                >
                  Open Zo Space
                </a>
                <p className="mt-3 text-xs leading-5 text-slate-400">
                  Public pin uses an approximate position.
                  {activeSpace.privacy_offset_applied ? " Privacy offset applied." : ""}
                </p>
              </div>
            ) : null}

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">
                Connected spaces
              </div>
              <div className="mt-4 space-y-3">
                {activeLinks.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-400">
                    No links yet. Use the connector below to define how this space
                    relates to another one.
                  </div>
                ) : (
                  activeLinks.map((link) => {
                    const peerHandle =
                      link.from_handle === activeSpace?.handle
                        ? link.to_handle
                        : link.from_handle;
                    const peer =
                      spaces.find((space) => space.handle === peerHandle) ?? activeSpace;
                    return (
                      <button
                        key={link.id}
                        onClick={() => setActiveHandle(peer.handle)}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-left transition hover:border-white/20 hover:bg-slate-950/70"
                      >
                        <div>
                          <div className="text-sm font-medium text-white">{peer.name}</div>
                          <div className="mt-1 text-xs text-slate-400">
                            {peer.location}
                          </div>
                        </div>
                        <div
                          className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                          style={{
                            color: peer.color,
                            backgroundColor: `${peer.color}18`,
                          }}
                        >
                          {peer.handle}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-300/85">
                Create a connection
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Use arcs to show which spaces remix, reference, inspire, or extend one
                another.
              </p>
              <form onSubmit={handleConnect} className="mt-4 space-y-3">
                <SelectField
                  label="From"
                  value={connectFrom}
                  onChange={setConnectFrom}
                  options={spaces}
                />
                <SelectField
                  label="To"
                  value={connectTo}
                  onChange={setConnectTo}
                  options={spaces}
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  {linkState === "saving" ? "Connecting..." : "Add connection"}
                </button>
                <p className="text-xs leading-5 text-slate-400">
                  {linkState === "saved"
                    ? "Connection added to the network."
                    : linkState === "error"
                      ? "Choose two different spaces and try again."
                      : "Links become animated arcs on the globe."}
                </p>
              </form>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/5 px-4 py-4 text-center">
      <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function GlobeFact({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-4 py-2 text-sm transition"
      style={{
        borderColor: active ? "rgba(103,232,249,0.4)" : "rgba(148,163,184,0.18)",
        color: active ? "#cffafe" : "#94a3b8",
        backgroundColor: active ? "rgba(8,145,178,0.16)" : "rgba(15,23,42,0.45)",
      }}
    >
      {label}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SpaceRecord[];
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
      >
        {options.map((space) => (
          <option key={space.handle} value={space.handle}>
            {space.name}
          </option>
        ))}
      </select>
    </label>
  );
}
