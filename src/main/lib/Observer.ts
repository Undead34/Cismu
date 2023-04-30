import { BrowserWindow } from "electron";
import { getMetadata } from "./FFmpeg";
import chokidar from "chokidar";
import path from "path";

class Observer {
  initialScanCompleted: boolean;
  watcher: chokidar.FSWatcher;
  mainWindow: BrowserWindow;
  allowedExtensions: string[];

  constructor(paths: string | string[], mainWindow: BrowserWindow) {
    this.initialScanCompleted = false;
    this.watcher = chokidar.watch(paths, {
      ignored: /(^|[/\\])\../,
      persistent: true,
    });
    this.mainWindow = mainWindow;
    this.allowedExtensions = [".mp3", ".flac"]; // Extensiones permitidas
  }

  private async onAdd(filePath: string) {
    if (this.initialScanCompleted) {
      const fileExtension = path.extname(filePath).toLowerCase();
      if (this.allowedExtensions.includes(fileExtension)) {
        getMetadata(filePath, (err, music) => {
          if (err) throw err;

          this.mainWindow.webContents.send("cismu:add-music", music);
        });
      }
    }
  }

  private async onUnlink(filePath: string) {
    const fileExtension = path.extname(filePath).toLowerCase();
    if (this.allowedExtensions.includes(fileExtension)) {
      this.mainWindow.webContents.send("cismu:remove-music", filePath);
    }
  }

  start() {
    this.watcher.on("add", (filePath) => this.onAdd(filePath));
    this.watcher.on("unlink", (filePath) => this.onUnlink(filePath));

    // Inicia el monitoreo
    this.watcher.on("ready", () => {
      this.initialScanCompleted = true;
      console.log("Iniciando monitoreo...");
    });
  }

  stop() {
    this.watcher.close();
  }
}

export default Observer;

// // Inicializa chokidar y especifica el directorio a monitorear
// const watcher = chokidar.watch(app.getPath("music"), {
//   ignored: /(^|[/\\])\../, // Ignore dotfiles
//   persistent: true,
// });

// // Reacciona a eventos de "add" y "change" en el directorio
// watcher.on("add", (path: string) => {
//   if (initialScanCompleted) {
//     scanMusicFiles([app.getPath("music")]).then((musicFiles) => {
//       mainWindow.webContents.send("receive:update-music-list", musicFiles);
//     });
//   }
// });

// // Inicia el monitoreo
// watcher.on("ready", function () {
//   initialScanCompleted = true;
//   console.log("Iniciando monitoreo...");
// });
