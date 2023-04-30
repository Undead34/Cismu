DROP TABLE "config" CREATE TABLE config (version TEXT, app TEXT);
CREATE TABLE musics (
  id TEXT PRIMARY KEY,
  title TEXT,
  author TEXT,
  img_src TEXT,
  id3_tags TEXT,
  metadata TEXT,
  path TEXT,
  duration INTEGER,
  favorite BOOLEAN
);