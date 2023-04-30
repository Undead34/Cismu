export interface Music {
  id: string;
  title: string;
  file: string;
  tags: string[];
  artist?: string;
  album?: string;
  duration?: number;
  genre?: string;
  cover_image?: string;
  year?: number | string;
  position?: number;
  notes?: string;
}

type AppState = "firststart" | "normalstart" | "suspiciousstart";

export interface IPlaylist {
  name: string;
  author?: string;
  order?: "asc" | "desc";
  description?: string;
  total_songs: number;
  songs: Music[];
}

export interface IAttributes {
  archive?: boolean;
  hidden?: boolean;
  readonly?: boolean;
  system?: boolean;
}

export interface IAttributeKeys {
  archive: string;
  hidden: string;
  readonly: string;
  system: string;
}

export type FormatedMetadata = {
  file: string;
  artist: string;
  album: string;
  title: string;
  year: string | number;
  genre: string;
};

export type IBounds = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export interface IConfig {
  musicFolders: string[];
  hardwareAcceleration: boolean;
  bounds: IBounds;
  state: AppState;
}
