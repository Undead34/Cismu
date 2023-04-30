import { IPlaylist, Music } from "../../shared/types/cismu";
import { v4 as uuidv4 } from "uuid";

class PlaylistManager {
  private playlist: IPlaylist;

  constructor(playlist: IPlaylist) {
    this.playlist = playlist;
  }

  getPlaylist(): IPlaylist {
    return this.playlist;
  }

  setPlaylist(playlist: IPlaylist): void {
    this.playlist = playlist;
  }

  addSong(song: Music): void {
    song.id = uuidv4();
    this.playlist.songs.push(song);
    this.playlist.total_songs++;
  }

  removeSong(id: string): void {
    const index = this.playlist.songs.findIndex((song) => song.id === id);
    if (index !== -1) {
      this.playlist.songs.splice(index, 1);
      this.playlist.total_songs--;
    }
  }

  sortByTitle(order: "asc" | "desc"): void {
    this.playlist.songs.sort((a, b) => {
      if (a.title < b.title) return order === "asc" ? -1 : 1;
      if (a.title > b.title) return order === "asc" ? 1 : -1;
      return 0;
    });
  }

  sortByArtist(order: "asc" | "desc"): void {
    this.playlist.songs.sort((a, b) => {
      if (a.artist < b.artist) return order === "asc" ? -1 : 1;
      if (a.artist > b.artist) return order === "asc" ? 1 : -1;
      return 0;
    });
  }

  sortByAlbum(order: "asc" | "desc"): void {
    this.playlist.songs.sort((a, b) => {
      if (a.album < b.album) return order === "asc" ? -1 : 1;
      if (a.album > b.album) return order === "asc" ? 1 : -1;
      return 0;
    });
  }

  formatDuration(duration: number) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration - hours * 3600) / 60);
    const seconds = duration % 60;
    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
}

export default PlaylistManager;
