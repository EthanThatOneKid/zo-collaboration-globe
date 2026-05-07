export interface SpaceRecord {
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
}

export interface LinkRecord {
  id: number;
  from_handle: string;
  to_handle: string;
  link_type: LinkType;
}

export type LinkType = "friend" | "collab" | "alum" | "mentor" | "sponsor";

export const LINK_TYPES: LinkType[] = [
  "friend",   // mutual follows / co-creators
  "collab",   // active collaboration on a shared project
  "alum",     // same school, cohort, or organization
  "mentor",   // one-directional guidance
  "sponsor",  // funding, hosting, organizational support
];

export const SAMPLE_SPACES: SpaceRecord[] = [
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

export const SAMPLE_LINKS: LinkRecord[] = [
  { id: 1, from_handle: "globe", to_handle: "amity-square", link_type: "collab" },
  { id: 2, from_handle: "globe", to_handle: "gameboy-share", link_type: "friend" },
  { id: 3, from_handle: "globe", to_handle: "studio", link_type: "collab" },
  { id: 4, from_handle: "globe", to_handle: "creative-wall", link_type: "friend" },
  { id: 5, from_handle: "globe", to_handle: "place-canvas", link_type: "collab" },
  { id: 6, from_handle: "creative-wall", to_handle: "place-canvas", link_type: "friend" },
  { id: 7, from_handle: "amity-square", to_handle: "studio", link_type: "alum" },
  { id: 8, from_handle: "gameboy-share", to_handle: "creative-wall", link_type: "sponsor" },
];

export function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((tag) => tag.trim()).filter(Boolean);
  }
  if (typeof value !== "string") {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map(String).map((tag) => tag.trim()).filter(Boolean);
    }
  } catch {}

  return trimmed
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function serializeTags(tags: string[]): string {
  return JSON.stringify(
    tags.map((tag) => tag.trim()).filter(Boolean),
  );
}

export function normalizeLinkType(value: unknown): LinkType {
  const candidate = String(value ?? "").trim().toLowerCase() as LinkType;
  return LINK_TYPES.includes(candidate) ? candidate : "friend";
}

export function normalizeSpaceRecord(
  row: Record<string, unknown>,
): SpaceRecord | null {
  const url = typeof row.url === "string" ? row.url.trim() : "";
  const creatorHandle =
    typeof row.creator_handle === "string" ? row.creator_handle.trim() : "";

  if (!url || !creatorHandle) {
    return null;
  }

  return {
    id: Number(row.id ?? 0),
    handle: String(row.handle ?? ""),
    name: String(row.name ?? ""),
    location: String(row.location ?? ""),
    lat: Number(row.lat ?? 0),
    lng: Number(row.lng ?? 0),
    color: String(row.color ?? "#3b82f6"),
    bio: String(row.bio ?? ""),
    avatar: String(row.avatar ?? "🌐"),
    url,
    tags: parseTags(row.tags),
    creator_handle: creatorHandle,
    featured: Boolean(Number(row.featured ?? 0)),
    privacy_offset_applied: Boolean(Number(row.privacy_offset_applied ?? 0)),
  };
}
