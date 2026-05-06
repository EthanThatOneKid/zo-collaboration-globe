export interface Hub {
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

export interface Link {
  id: number;
  from_handle: string;
  to_handle: string;
}

export const SAMPLE_HUBS: Hub[] = [
  {
    id: 1,
    handle: "etok",
    name: "Ethan",
    location: "San Francisco, CA",
    lat: 37.7749,
    lng: -122.4194,
    color: "#6366f1",
    bio: "Maker, builder, Zo enthusiast",
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
    bio: "Painter of nights and sunflowers",
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
    bio: "Cubist, sculptor, troublemaker",
    avatar: "🖼️",
  },
  {
    id: 4,
    handle: "kahlo",
    name: "Frida Kahlo",
    location: "Coyoacán, Mexico",
    lat: 19.3467,
    lng: -99.1617,
    color: "#10b981",
    bio: "Painter of self, pain, and flowers",
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
    bio: "Desert flowers and animal bones",
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
    bio: "Infinity, polka dots, mirrors",
    avatar: "🔴",
  },
];

export const SAMPLE_LINKS: Link[] = [
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
