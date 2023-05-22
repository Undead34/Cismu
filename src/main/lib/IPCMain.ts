import { BrowserWindow, ipcMain } from "electron";
import Config from "./Config";
import MusicManager from "./MusicManager";

export class IPCMain {
  private mainWindow: BrowserWindow;
  private config: Config;
  private musicManager: MusicManager;

  constructor(mainWindow: BrowserWindow, config: Config, musicManager: MusicManager) {
    this.mainWindow = mainWindow;
    this.config = config;
    this.musicManager = musicManager;

    const webPlayerEvents = [
      {
        name: "cismu:webplayer:getmusic",
        handle: false,
        once: false,
        action: () => {
          this.musicManager.getMusics();
        },
      },
    ];

    for (let i = 0; i < webPlayerEvents.length; i++) {
      const event = webPlayerEvents[i];

      if (event.once) {
        event.handle ? ipcMain.handleOnce(event.name, event.action) : ipcMain.once(event.name, event.action);
      } else {
        event.handle ? ipcMain.handle(event.name, event.action) : ipcMain.on(event.name, event.action);
      }
    }
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

/*

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
    */
