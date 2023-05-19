import path from "path";
import os from "os";

export const product = {
  version: "1.0.0",
  name: "Cismu",
  long_name: "Cismu Player",
  machine_name: "cismu-player",
  description: "Cismu: The customizable and versatile music player.",
  uuids: {
    namespace: "52340235-645f-4661-902b-b175fc399644",
    seed: "Cismu Player Desktop",
    uuid: "0d46bbc9-c453-5f6f-a6e9-dd49380bef3f",
    SHA512: "27b2d837372f539b21069190d59a3536526a4187916f072956b3a5c842b400a5", // Cismu\Player\Version\UUID
  },
};

export const root = getUserDataPath();
export const userDataPath = path.join(root, "UserData");
export const cache = path.join(userDataPath, "Cache");
export const databases = path.join(userDataPath, "Databases");
export const paths = {
  folders: {
    root,
    userDataPath,
    cache,
    databases,
  },
  files: {
    database: path.join(databases, `${product.machine_name}.db`),
    setting: path.join(userDataPath, "setting.json"),
    test: path.join(userDataPath, ".test"),
    repair: path.join(root, ".repair"),
  },
};

export const extensions = [
  // MP3 / MP4
  ".mp3",
  ".mp4",
  ".aac",
  ".m4a",
  ".3gp",
  ".wav",
  // Opus
  ".ogg",
  ".ogv",
  ".ogm",
  ".opus",
  // Flac
  ".flac",
  // web media
  ".webm",
];

export default {
  root,
  product,
  paths,
  extensions,
  databases,
  cache,
  userDataPath,
};

function getUserDataPath(): string {
  let appDataPath: string;

  // 1. Support portable mode
  const portablePath = process.env["CISMU_PORTABLE"];
  if (portablePath) {
    return path.join(portablePath, "user-data");
  }

  // 2. Support global CISMU_PORTABLE_APPDATA environment variable
  appDataPath = process.env["CISMU_APPDATA"];
  if (appDataPath) {
    return path.join(appDataPath, product.name);
  }

  // 3. Support explicit --user-data-dir
  const cliPathIndex = process.argv.indexOf("--user-data-dir");
  if (cliPathIndex !== -1 && process.argv.length > cliPathIndex + 1) {
    return process.argv[cliPathIndex + 1];
  }

  // 4. Otherwise check per platform
  switch (process.platform) {
    case "win32":
      appDataPath = process.env["APPDATA"];
      if (!appDataPath) {
        const userProfile = process.env["USERPROFILE"];
        if (typeof userProfile !== "string") {
          throw new Error("Windows: Unexpected undefined %USERPROFILE% environment variable");
        }
        appDataPath = path.join(userProfile, "AppData", "Roaming");
      }
      break;
    case "darwin":
      appDataPath = path.join(os.homedir(), "Library", "Application Support");
      break;
    case "linux":
      appDataPath = process.env["XDG_CONFIG_HOME"] || path.join(os.homedir(), ".config");
      break;
    default:
      throw new Error("Platform not supported");
  }

  return path.join(appDataPath, product.name);
}

export const SQL_CREATE_DATABASE = `
CREATE TABLE config (version TEXT, app TEXT);
CREATE TABLE musics (id TEXT PRIMARY KEY, title TEXT, author TEXT, img_src TEXT, id3_tags TEXT, metadata TEXT, path TEXT, duration INTEGER, favorite BOOLEAN);
`;
