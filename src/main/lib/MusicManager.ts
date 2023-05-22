import si from "systeminformation";

import logger from "../../shared/lib/logger";
import { extensions } from "./Constants";
import { scanFolder } from "../../shared/lib/fs";
import Config from "./Config";
import Cache from "./Cache";
import async from "async";
import { getMetadata } from "./FFmpeg";
import { Music } from "../../shared/types/cismu";

class MusicManager {
  private musics: Music[];
  private config: Config;

  constructor(config: Config) {
    this.config = config;
    this.musics = [];
  }

  private async getMaxConcurrentOperations(): Promise<number> {
    const cpuInfo = await si.currentLoad();
    let numMaximumOperations = 0;

    for (const cpu of cpuInfo.cpus) {
      if (cpu.load < 60) {
        numMaximumOperations++;
      }
    }

    return Math.max(numMaximumOperations, 1);
  }

  async getMusics() {
    let maxConcurrency = await this.getMaxConcurrentOperations();
    console.time("TIME");

    const extensions = [
      ".mp3",
      ".mp4",
      ".aac",
      ".m4a",
      ".3gp",
      ".wav",
      ".ogg",
      ".ogv",
      ".ogm",
      ".opus",
      ".flac",
      ".webm",
    ];

    let items = scanFolder("E:\\Games\\osu!\\Songs", extensions);

    const queue = async.queue(async (task: any, callback) => {
      const music: Music = await new Promise((resolve) => {
        getMetadata(task, (err, music) => {
          if (err) {
            console.log(err);
          }
          resolve(music);
        });
      });

      await callback();
    }, maxConcurrency);

    const updateConcurrencyLimit = async () => {
      const currentMaxConcurrency = await this.getMaxConcurrentOperations();
      if (currentMaxConcurrency !== maxConcurrency) {
        maxConcurrency = currentMaxConcurrency;
        queue.pause();
        queue.concurrency = currentMaxConcurrency;
        queue.resume();
        console.log("Concurrency changed: ", currentMaxConcurrency);
      }
    };

    const intervalID = setInterval(updateConcurrencyLimit, 1000);

    queue.drain(function () {
      console.log("All items have been processed");
      clearInterval(intervalID);
      console.timeEnd("TIME");
    });

    queue.error(function (err, task) {
      console.error("Task experienced an error");
    });

    queue.push(items);
  }

  getMusicList() {
    return this.musics;
  }
}

export default MusicManager;

// class MusicManager {
//   private p_musics: [];
//   private p_config: Config;

//   constructor(config: Config) {
//     this.p_config = config;
//     this.p_musics = [];
//   }

//   private async getMaxConcurrentOperations(): Promise<number> {
//     const cpuInfo = await si.currentLoad();
//     let numMaximumOperations = 0;

//     for (const cpu of cpuInfo.cpus) {
//       if (cpu.load < 60) {
//         numMaximumOperations++;
//       }
//     }

//     if (numMaximumOperations <= 0) {
//       return 1;
//     } else {
//       return numMaximumOperations;
//     }
//   }

//   async getMusics() {
//     let maxConcurrency = await this.getMaxConcurrentOperations();
//     console.time("TIEMPO");
//     // Uso de la función
//     const extensions = [
//       ".mp3",
//       ".mp4",
//       ".aac",
//       ".m4a",
//       ".3gp",
//       ".wav",
//       ".ogg",
//       ".ogv",
//       ".ogm",
//       ".opus",
//       ".flac",
//       ".webm",
//     ];

//     let items = scanFolder("E:\\Games\\osu!\\Songs", extensions);

//     // create a queue object with concurrency 2
//     const queue = async.queue(async (task: any, callback) => {
//       const music: Music = await new Promise((resolve) => {
//         getMetadata(task, (err, music) => {
//           if (err) {
//             console.log(err);
//           }
//           resolve(music);
//         });
//       });

//       await callback();
//     }, maxConcurrency);

//     const actualizarLimite = async () => {
//       const maxConcurrenciaActual = await this.getMaxConcurrentOperations();
//       if (maxConcurrenciaActual !== maxConcurrency) {
//         maxConcurrency = maxConcurrenciaActual;
//         queue.pause();
//         queue.concurrency = maxConcurrenciaActual;
//         queue.resume();
//         console.log("La concurrency cambio: ", maxConcurrenciaActual);
//       }
//     };

//     const intervalID = setInterval(actualizarLimite, 1000); // Guarda el ID del setInterval

//     // assign a callback
//     queue.drain(function () {
//       console.log("all items have been processed");
//       clearInterval(intervalID);
//       console.timeEnd("TIEMPO");
//     });

//     // assign an error callback
//     queue.error(function (err, task) {
//       console.error("task experienced an error");
//     });

//     // add some items to the queue (batch-wise)
//     queue.push(items);
//   }

//   get musics() {
//     return "HOla";
//   }
// }
// let maxConcurrencia = await this.getMaxConcurrentOperations();
// let items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Ejemplo de array de items

// let contador = 0;

// async function procesarItem(item: any) {
//   contador++;
//   console.log(`Llamada a procesarItem - Contador: ${contador}`);
//   console.log(item);
//   // Lógica de procesamiento para cada elemento
//   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación de una operación asincrónica
//   contador--;
// }

// const queue = async.queue(async (item, callback) => {
//   // Procesa el elemento actual
//   await procesarItem(item);
//   callback();
// }, maxConcurrencia);

// const actualizarLimite = async () => {
//   const maxConcurrenciaActual = await this.getMaxConcurrentOperations();
//   if (maxConcurrenciaActual !== maxConcurrencia) {
//     maxConcurrencia = maxConcurrenciaActual;
//     queue.concurrency = maxConcurrenciaActual;
//   }
// };

// const intervalID = setInterval(actualizarLimite, 1000); // Guarda el ID del setInterval

// queue.drain(() => {
//   // Se ejecuta cuando se completa todo el procesamiento
//   console.log("Procesamiento completo");
//   clearInterval(intervalID);
// });

// queue.push(items, (error) => {
//   if (error) {
//     console.error("Error al agregar elementos a la cola", error);
//   }
// });

// // Agrega los elementos a la cola en bucles hasta alcanzar el número máximo de concurrencia
// for (let i = 0; i < maxConcurrencia; i++) {
//   queue.push(items);
// }

//  // Ejemplo de uso
//  obtenerNumeroOperacionesMaximas()
//  .then((numOperaciones) => {
//    console.log(`Número máximo de operaciones simultáneas: ${numOperaciones}`);
//  })
//  .catch((error) => {
//    console.error(error);
//  });

// import { Music } from "../../shared/types/cismu";
// import { scanMusicFiles } from "../../shared/lib/fs";
// import { getMetadata } from "./FFmpeg";
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
