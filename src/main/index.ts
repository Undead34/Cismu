import { BrowserWindow, app } from "electron";
import { product, root } from "./lib/Constants";
import logger from "../shared/lib/logger";
import bootstrap from "./lib/Bootstrap";
import Config from "./lib/Config";
import { IPCMain } from "./lib/IPCMain";
import MusicManager from "./lib/MusicManager";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
let mainWindow: BrowserWindow;
let config: Config;
let ipcMain: IPCMain;
let musicManager: MusicManager;

app.name = product.name;
app.setPath("userData", root);

// TODO: Remove in production and check before release
if (process.env.NODE_ENV !== "production") {
  process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = async (): Promise<void> => {
  logger.log("Creating main window...");

  const bounds = config.bounds;
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    title: "Cismu",
    height: bounds.height,
    width: bounds.width,
    x: bounds.x,
    y: bounds.y,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: process.env.NODE_ENV === "production",
      autoplayPolicy: "no-user-gesture-required",
    },
  });

  // and load the index.html of the app.
  logger.log("Main window created successfully, loading view...");
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  logger.log("Initializing MusicManager...");
  musicManager = new MusicManager(config);

  logger.log("Listening to IPCMain events...");
  ipcMain = new IPCMain(mainWindow, config, musicManager);

  // Open the DevTools.
  if (process.env.NODE_ENV === "development" || process.argv.includes("--devtools")) {
    // #region devtools
    // This is disabled until the [ReactDevTools, ReduxDevTools] extensions update the manifest to version 3 because it will no longer be supported.
    // const ReduxDevTools = path.join(process.env.LOCALAPPDATA, "/Google/Chrome/User Data/Default/Extensions", "/lmhkpmbekcpmknklioeibfkpmmfibljd")
    // const ReactDevTools = path.join(process.env.LOCALAPPDATA, "/Google/Chrome/User Data/Default/Extensions", "/fmkadmapgofadopljbjfkapdkoienihi")

    // if (exists(ReduxDevTools) && exists(ReactDevTools)) {
    //   console.log("Loading Redux DevTools and React DevTools...")

    //   try {
    //     await session.defaultSession.loadExtension(ReactDevTools, { allowFileAccess: true });
    //     await session.defaultSession.loadExtension(ReduxDevTools, { allowFileAccess: true });
    //   } catch (error) {
    //     console.log(error)
    //   }
    // } else {
    //   console.log(ReduxDevTools, ReactDevTools)
    //   console.log(exists(ReduxDevTools), exists(ReactDevTools))
    // }
    // #endregion

    logger.log("Opening Developer Tools");
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.show();
  });

  logger.log("Successful application start!");
};

function main() {
  if (app.isReady()) {
    createWindow();
  } else {
    app.once("ready", createWindow);
  }

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}

// Init Config
logger.log("Loading the configuration.");

try {
  config = new Config();
  config.load();

  config.config ?? config.createConfig();

  if (config.config && !config.config.hardwareAcceleration) {
    app.disableHardwareAcceleration();
  }

  logger.log("Configuration successfully loaded.");
  logger.log("Initiating start-up.");
  bootstrap(main, config);
} catch (error) {
  logger.error("An error occurred while loading the configuration.", error);
}
