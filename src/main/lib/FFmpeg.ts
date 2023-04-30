import { paths, bins } from "ffmpeg-static-electron-forge";
import { v4 as uuidv4 } from "uuid";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

import { FormatedMetadata, Music } from "../../shared/types/cismu";

let ffmpegPath: string, ffprobePath: string;

if (process.env.NODE_ENV !== "development") {
  ffmpegPath = paths.ffmpegPath.replace("app.asar", "app.asar.unpacked");
  ffprobePath = paths.ffprobePath.replace("app.asar", "app.asar.unpacked");
} else {
  let ffmpegBinPaths = path.dirname(require.resolve("ffmpeg-static-electron-forge"));
  ffmpegBinPaths = path.resolve(process.cwd(), ffmpegBinPaths, "bin");
  ffmpegPath = path.join(ffmpegBinPaths, bins.ffmpegPath);
  ffprobePath = path.join(ffmpegBinPaths, bins.ffprobePath);
}

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

function parseMetadata(metadata: ffmpeg.FfprobeData): FormatedMetadata {
  const format = metadata.format;
  const tags = format.tags;

  return {
    file: format.filename ?? "N/A",
    artist: ((tags?.artist || tags?.ARTIST) ?? "N/A").toString(),
    album: ((tags?.album || tags?.ALBUM) ?? "N/A").toString(),
    title: ((tags?.title || tags?.TITLE) ?? path.basename(format.filename, path.extname(format.filename))).toString(),
    year: (tags?.year || tags?.DATE || tags?.date) ?? "N/A",
    genre: ((tags?.genre || tags?.GENRE) ?? "N/A").toString(),
  };
}

function getMetadata(filePath: string, callback: (error: Error, music: Music | null) => void): void {
  ffmpeg(filePath).ffprobe((err, metadata) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Excluir música si la duración es menor a 30 segundos
    if (metadata.format.duration < 30) {
      callback(null, null);
      return;
    }

    callback(null, {
      id: uuidv4(),
      ...parseMetadata(metadata),
      tags: ["Local"],
    });
  });
}

export default ffmpeg;
export { getMetadata };

// async function scanMusicFiles(paths: string[] = [app.getPath("music"), "E:\\Games\\osu!\\Songs"]): Promise<string[]> {
//   const extensions = ["mp3", "flac"];
//   const pattern = `@(${extensions.join("|")})`;

//   const results = await Promise.all(paths.map((path) => promisify(glob)(`${path}/**/*.${pattern}`, { nodir: true })));

//   // Flatten the array of results
//   return results.flat();
// }

// function fileToStream(inputFile: string) {
//   getMetadata(inputFile, (error, metadata) => {
//     if (error) console.log(error);

//     const outputFile = path.join(path.dirname(inputFile), uuidv4());

//     const inputStream = fs.createReadStream(inputFile);

//     const outputStream = new stream.PassThrough();

//     const writeStream = fs.createWriteStream(outputFile); // Crear un stream de escritura para el archivo de salida

//     outputStream.pipe(writeStream);

//     const command = ffmpeg(inputStream)
//       .outputOptions(["-c:a flac"]) // Utilizar el códec flac para la salida
//       .output(outputStream, { end: true })
//       .on("end", () => {
//         console.log("Transcodificación completada");
//       })
//       .on("error", (err) => {
//         console.error("Error en la transcodificación:", err);
//       });

//     command.run();

//     // Obtener la información de duración usando ffprobe
//     // ffmpeg.ffprobe(outputFile, (err, metadata) => {
//     //   if (err) {
//     //     console.error("Error al obtener información de duración:", err);
//     //     return;
//     //   }

//     //   // Acceder a la duración del archivo en segundos
//     //   const duration = metadata.format.duration;
//     //   console.log(`Duración del archivo: ${duration} segundos`);
//     // });
//   });
// }

// function fileToStream(inputFile: string) {
//   getMetadata(inputFile, (error, metadata) => {
//     if (error) console.log(error);

//     const outputFile = path.join(path.dirname(inputFile), `${uuidv4()}.flac`); // Generar nombre de archivo de salida con extensión .flac

//     const outputStream = new stream.PassThrough(); // Crear un stream PassThrough

//     const writeStream = fs.createWriteStream(outputFile); // Crear un stream de escritura para el archivo de salida

//     // Redirigir la salida del stream.PassThrough al stream de escritura
//     outputStream.pipe(writeStream);

//     const command = ffmpeg(inputFile)
//       .outputOptions(["-c:a flac"]) // Copiar todos los metadatos al archivo de salida FLAC
//       .format("flac")
//       .output(outputStream, { end: true }) // Redirigir la salida de ffmpeg al stream.PassThrough
//       .on("end", () => {
//         console.log("Transcodificación completada");
//       })
//       .on("error", (err) => {
//         console.error("Error en la transcodificación:", err);
//       });

//     command.run();

//     // Escuchar el evento "finish" del stream de escritura para saber cuándo se ha completado la escritura en disco
//     writeStream.on("finish", () => {
//       console.log(`Archivo de salida guardado en: ${outputFile}`);

//       // Obtener la información de duración usando ffprobe
//       ffmpeg.ffprobe(outputFile, (err, metadata) => {
//         if (err) {
//           console.error("Error al obtener información de duración:", err);
//           return;
//         }

//         // Acceder a la duración del archivo en segundos
//         const duration = metadata.format.duration;
//         console.log(`Duración del archivo: ${duration} segundos`);
//       });
//     });
//   });
// }
