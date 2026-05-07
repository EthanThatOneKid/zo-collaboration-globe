CREATE TABLE IF NOT EXISTS hubs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  handle TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  bio TEXT NOT NULL DEFAULT '',
  avatar TEXT NOT NULL DEFAULT '🌐',
  url TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '[]',
  creator_handle TEXT NOT NULL DEFAULT '',
  featured INTEGER NOT NULL DEFAULT 0,
  privacy_offset_applied INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_handle TEXT NOT NULL,
  to_handle TEXT NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'friend'
    CHECK (link_type IN (
      'friend',      -- mutual follows / co-creators
      'collab',      -- active collaboration on a shared project
      'alum',        -- same school, cohort, or organization
      'mentor',      -- one-directional guidance
      'sponsor'      -- funding, hosting, organizational support
    )),
  FOREIGN KEY (from_handle) REFERENCES hubs(handle),
  FOREIGN KEY (to_handle) REFERENCES hubs(handle)
);

CREATE UNIQUE INDEX IF NOT EXISTS links_unique_pair
ON links(from_handle, to_handle);
