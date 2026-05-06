-- hubs table
CREATE TABLE IF NOT EXISTS hubs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  handle TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  bio TEXT NOT NULL DEFAULT '',
  avatar TEXT NOT NULL DEFAULT '🌐'
);

-- links table
CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_handle TEXT NOT NULL,
  to_handle TEXT NOT NULL,
  FOREIGN KEY (from_handle) REFERENCES hubs(handle),
  FOREIGN KEY (to_handle) REFERENCES hubs(handle)
);

-- seed initial data if empty
INSERT OR IGNORE INTO hubs (handle, name, location, lat, lng, color, bio, avatar) VALUES
  ('etok',     'Ethan',             'San Francisco, CA',  37.7749, -122.4194, '#6366f1', 'Maker, builder, Zo enthusiast',      '👨‍💻'),
  ('vangogh',  'Van Gogh',          'Arles, France',       43.9493,    4.8055, '#f59e0b', 'Painter of nights and sunflowers',  '🎨'),
  ('picasso',  'Picasso',           'Barcelona, Spain',    41.3874,    2.1686, '#ef4444', 'Cubist, sculptor, troublemaker',   '🖼️'),
  ('kahlo',    'Frida Kahlo',       'Coyoacán, Mexico',     19.3467,  -99.1617, '#10b981', 'Painter of self, pain, and flowers', '🌺'),
  ('okeeffe',  "Georgia O'Keeffe",  'Santa Fe, NM',         35.687,  -105.9378, '#8b5cf6', 'Desert flowers and animal bones',   '🏜️'),
  ('kusama',   'Yayoi Kusama',      'Tokyo, Japan',          35.6762,  139.6503, '#ec4899', 'Infinity, polka dots, mirrors',     '🔴');

INSERT OR IGNORE INTO links (from_handle, to_handle) VALUES
  ('etok',    'vangogh'),
  ('etok',    'picasso'),
  ('etok',    'kahlo'),
  ('etok',    'okeeffe'),
  ('etok',    'kusama'),
  ('vangogh', 'picasso'),
  ('picasso', 'kahlo'),
  ('kahlo',   'okeeffe'),
  ('okeeffe', 'kusama'),
  ('kusama',  'vangogh');
