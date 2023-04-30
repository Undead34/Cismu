// import { Music } from "../../shared/types/cismu";
// import { scanMusicFiles } from "../../shared/lib/fs";
// import { getMetadata } from "./FFmpeg";
// import async from "async";
// import os from "os";

// async function getMusics(progressCallback: (completed: number, total: number) => void): Promise<Music[]> {
//   const fileList = await scanMusicFiles();

//   const musics: Music[] = await new Promise((resolve) => {
//     async.mapLimit(
//       fileList,
//       os.cpus().length, // Establecer el límite de operaciones en paralelo a 10
//       (filePath, callback) => {
//         getMetadata(filePath, (err, music) => {
//           if (err) {
//             callback(err, null);
//             progressCallback(fileList.indexOf(filePath) + 1, fileList.length);
//             return;
//           }

//           callback(null, music);
//           progressCallback(fileList.indexOf(filePath) + 1, fileList.length);
//         });
//       },
//       (err, musics: Music[]) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         resolve(musics);
//       }
//     );
//   });

//   return musics.filter((music) => music !== null);
// }

// export { getMetadata, getMusics };

// async function getMusics() {
//   const fileList = await scanMusicFiles();

//   const Musics = await new Promise((resolve) => {
//     async.mapLimit(
//       fileList,
//       10, // Establecer el límite de operaciones en paralelo a 10
//       async (filePath: string) => {
//         return new Promise((resolve, reject) => {
//           ffmpeg(filePath).ffprobe((err, metadata) => {
//             if (err) {
//               console.error(err);
//               reject(err);
//               return;
//             }

//             const music: Music = {
//               id: uuidv4(),
//               ...parseMetadata(metadata),
//               tags: ["Local"],
//             };
//             console.log(music)
//             resolve(music);
//           });
//         });
//       },
//       (err, Musics) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         resolve(Musics);
//       }
//     );
//   });

//   return Musics;
// }

// async function getMusics() {
//   const fileList = await scanMusicFiles();

//   const Musics = await Promise.all(
//     fileList.map(async (filePath): Promise<Music> => {
//       return new Promise((resolve, reject) => {
//         ffmpeg.ffprobe(filePath, (err, metadata) => {
//           if (err) {
//             console.error(err);
//             reject(err);
//             return;
//           }

//           const music: Music = {
//             id: uuidv4(),
//              ...parseMetadata(metadata),
//             tags: ["Local"],
//           };

//           resolve(music);
//         });
//       });
//     })
//   );

//   return Musics;
// }

// async function getMusics() {
//   const fileList = await scanMusicFiles();

//   const Musics = fileList.map((filePath): Music => {
//     let music: Music;

//     ffmpeg.ffprobe(filePath, (err, metadata) => {
//       if (err) {
//         console.error(err);
//         return;
//       }

//       music = {
//         id: uuidv4(),
//         ...parseMetadata(metadata),
//         tags: ["Local"],
//       };
//     });

//     return music;
//   });

//   return Musics;
// }

//  // Accede a los metadatos que te interesan
//  const title = metadata.format.tags.title;
//  const file = metadata.format.filename;
//  const genre = metadata.format.tags.genre;
//  const artist = metadata.format.tags.artist;
//  const album = metadata.format.tags.album;
//  const duration = metadata.format.duration;
//  const coverImage = metadata.format.tags.picture;
//  const year = metadata.format.tags.year;

//  // Haz lo que necesites con los metadatos
//  console.log("Título:", title);
//  console.log("Archivo:", file);
//  console.log("Género:", genre);
//  console.log("Artista:", artist);
//  console.log("Álbum:", album);
//  console.log("Duración:", duration);
//  console.log("Imagen de portada:", coverImage);
//  console.log("Año:", year);

// // let musics = await scanMusicFiles();

// // musics.map(async (filePath) => {
// //   ffmpeg.ffprobe(filePath, (err, data): Music => {
// //     return {
// //       id: uuidv4(),
// //       file: filePath,
// //       tags: data.format.tags,
// //     };
// //   });
// // });

// // const command = ffmpeg("C:\\Users\\Undead34\\Music\\Bim Bam toi.mp3");
// // command.format("flac");
// // command.output("C:\\Users\\Undead34\\Music\\Bim Bam toi.flac");
// // command.run();

// // return musics;
// class PlaylistManager {
//   private playlist: IPlaylist;

//   constructor(playlist: IPlaylist) {
//     this.playlist = playlist;
//   }

//   getPlaylist(): IPlaylist {
//     return this.playlist;
//   }

//   setPlaylist(playlist: IPlaylist): void {
//     this.playlist = playlist;
//   }

//   addSong(song: Music): void {
//     song.id = uuidv4();
//     this.playlist.songs.push(song);
//     this.playlist.total_songs++;
//   }

//   removeSong(id: string): void {
//     const index = this.playlist.songs.findIndex((song) => song.id === id);
//     if (index !== -1) {
//       this.playlist.songs.splice(index, 1);
//       this.playlist.total_songs--;
//     }
//   }

//   sortByTitle(order: "asc" | "desc"): void {
//     this.playlist.songs.sort((a, b) => {
//       if (a.title < b.title) return order === "asc" ? -1 : 1;
//       if (a.title > b.title) return order === "asc" ? 1 : -1;
//       return 0;
//     });
//   }

//   sortByArtist(order: "asc" | "desc"): void {
//     this.playlist.songs.sort((a, b) => {
//       if (a.artist < b.artist) return order === "asc" ? -1 : 1;
//       if (a.artist > b.artist) return order === "asc" ? 1 : -1;
//       return 0;
//     });
//   }

//   sortByAlbum(order: "asc" | "desc"): void {
//     this.playlist.songs.sort((a, b) => {
//       if (a.album < b.album) return order === "asc" ? -1 : 1;
//       if (a.album > b.album) return order === "asc" ? 1 : -1;
//       return 0;
//     });
//   }

//   formatDuration(duration: number) {
//     const hours = Math.floor(duration / 3600);
//     const minutes = Math.floor((duration - hours * 3600) / 60);
//     const seconds = duration % 60;
//     return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   }
// }

// function formatDuration(duration: number) {
//   const hours = Math.floor(duration / 3600);
//   const minutes = Math.floor((duration - hours * 3600) / 60);
//   const seconds = duration % 60;
//   return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
// }
