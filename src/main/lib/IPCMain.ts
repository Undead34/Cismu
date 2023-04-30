import { BrowserWindow, ipcMain } from "electron";
import Config from "./Config";

export class IPCMain {
  private mainWindow: BrowserWindow;
  private config: Config;

  constructor(mainWindow: BrowserWindow, config: Config) {
    this.mainWindow = mainWindow;
    this.config = config;

    // escuchamos el evento de inicio normal
    ipcMain.on("normal-start", () => {
      // hacemos las pruebas de seguridad e integridad
      // ...
      // cambiamos el estado de la aplicación
      this.config.config.state = "normalstart";
      this.config.save();

      // enviamos un mensaje al proceso de renderizado para cambiar la vista
      this.mainWindow.webContents.send("change-view", "library");
    });

    // escuchamos el evento de inicio sospechoso
    ipcMain.on("suspicious-start", () => {
      // intentamos reparar la aplicación
      // ...
      // cambiamos el estado de la aplicación
      this.config.config.state = "suspiciousstart";
      this.config.save();
    });
  }
}

// import { BrowserWindow, ipcMain } from "electron";
// // import { getMusics } from "./FFmpeg";

// export default function ipcMainHandlers(mainWindow: BrowserWindow) {
//   ipcMain.on("cismu:get-musics", async (event) => {
//     console.time("getMusics width 10");
//     // const musics = await getMusics((completed: number, total: number) => {
//     //   // console.log(`${completed} of ${total} files are completed`);
//     // });
//     console.timeEnd("getMusics width 10");
//     // console.log(musics.length);
//     // event.sender.send("cismu:update-musics", musics);
//   });

//   // State Machine

//   ipcMain.handle("cismu:get-state", async (event) => {
//     return {
//       message: "Scanning songs, please wait...",
//     };
//   });
// }

// interface IState {
//   view: string; // view name
//   route: string; // route name
// }

// // ipcMain.on("send:get-music-list", async (event) => {
// //   event.sender.send("receive:update-music-list", await scanMusicFiles());
// // });
// // // Escucha el evento 'show-context-menu' desde la ventana secundaria
// // ipcMain.on("show-context-menu", (event, position) => {
// //   // Muestra el menú contextual en la posición específica
// //   contextMenu.popup({
// //     window: BrowserWindow.fromWebContents(event.sender),
// //     x: position.x,
// //     y: position.y,
// //   });
// // });
// // ipcMain.on("cismu:update-musics", () => {});
