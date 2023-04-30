import { mkdirSync, exists, writeSync, readSync, removeSync, accessSync } from "../../shared/lib/fs";
import logger from "../../shared/lib/logger";
import { app, dialog } from "electron";
import { paths, SQL_CREATE_DATABASE } from "./Constants";
import SQLite from "better-sqlite3";
import Config from "./Config";

async function setup() {
  logger.debug("Starting...");
  try {
    if (!exists(paths.folders.userDataPath) || !exists(paths.folders.cache) || !exists(paths.folders.databases)) {
      mkdirSync(paths.folders.cache, { recursive: true });
      mkdirSync(paths.folders.userDataPath, { recursive: true });
      mkdirSync(paths.folders.databases, { recursive: true });
    }

    if (!exists(paths.files.database)) {
      const db = new SQLite(paths.files.database);
      db.exec(SQL_CREATE_DATABASE);
      db.close();
    }
  } catch (error) {
    const showDialog = async () => {
      const option = await dialog.showMessageBox(null, {
        type: "error",
        message: error.message,
        detail:
          "The error occurred when trying to create the files necessary for the app to function. Try to run the application with administrator privileges or verify that the application has executed, read and write permissions on the following directory: " +
          paths.folders.userDataPath,
        buttons: ["Continue", "Try to repair", "Close"],
        title: "An error occurred when starting the application",
      });

      switch (option.response) {
        case 0:
          logger.debug("Continuing...");
          logger.error(error);
          break;
        case 1:
          logger.debug("Repairing...");
          logger.error(error);
          app.relaunch({ args: process.argv.slice(1).concat(["--suspiciousstart"]) });
          app.exit(0);
          break;
        case 2:
          logger.debug("Leaving...");
          logger.error(error);
          app.exit(1);
      }
    };

    if (app.isReady()) {
      showDialog();
    } else {
      app.once("ready", showDialog);
    }
  }
}

async function repair() {
  logger.debug("Repairing...");
  try {
    const showDialog = async () => {
      // show a success message
      await dialog.showMessageBox(null, {
        type: "info",
        message: "The application has been repaired successfully.",
        buttons: ["OK"],
        title: "Application Repair",
      });

      logger.debug("Application repaired successfully.");
    };

    if (app.isReady()) {
      showDialog();
    } else {
      app.once("ready", showDialog);
    }
  } catch (error) {
    const showDialog = async () => {
      // show an error message if the repair process failed
      await dialog.showMessageBox(null, {
        type: "error",
        message: "An error occurred when repairing the application.",
        detail: error.message,
        buttons: ["OK"],
        title: "Application Repair",
      });

      logger.error(error);
    };

    if (app.isReady()) {
      showDialog();
    } else {
      app.once("ready", showDialog);
    }
  }
}

function test(): boolean {
  logger.debug("Testing...");
  const PERMISSION_READ = 4;
  const PERMISSION_WRITE = 2;
  const PERMISSION_EXECUTE = 1;
  const PERMISSION_EXIST = 0;
  const PERMISSION_ALL = 7;

  let permissions = 0;
  let allTestsPassed = true;

  const fileTest = paths.files.test;

  // Folder check
  if (exists(paths.folders.userDataPath) && exists(paths.folders.cache) && exists(paths.folders.databases)) {
    permissions |= PERMISSION_EXIST;
    if (
      accessSync(paths.folders.userDataPath, PERMISSION_ALL) &&
      accessSync(paths.folders.databases, PERMISSION_ALL) &&
      accessSync(paths.folders.cache, PERMISSION_ALL)
    ) {
      permissions |= PERMISSION_ALL;
    } else {
      allTestsPassed = false;
    }
  } else {
    allTestsPassed = false;
  }

  // File check
  if (exists(paths.files.database) && exists(paths.files.setting)) {
    permissions |= PERMISSION_EXIST;
    if (accessSync(paths.files.database, PERMISSION_ALL) && accessSync(paths.files.setting, PERMISSION_ALL)) {
      permissions |= PERMISSION_ALL;
    } else {
      allTestsPassed = false;
    }
  } else {
    allTestsPassed = false;
  }

  try {
    writeSync(fileTest, "test", { atomic: true });
    permissions |= PERMISSION_WRITE;
  } catch (error) {
    logger.error(error);
    allTestsPassed = false;
  }

  try {
    readSync(fileTest);
    permissions |= PERMISSION_READ;
  } catch (error) {
    logger.error(error);
    allTestsPassed = false;
  }

  try {
    removeSync(fileTest);
    permissions |= PERMISSION_EXECUTE;
  } catch (error) {
    logger.error(error);
    allTestsPassed = false;
  }

  if (allTestsPassed && permissions >= PERMISSION_ALL) {
    return true;
  } else {
    return false;
  }
}

export default async function bootstrap(callback: () => void, config: Config) {
  if (process.argv.includes("--suspiciousstart")) {
    await repair();
    app.relaunch();
    app.exit(0);
  }

  // boot app
  switch (config.config.state) {
    case "firststart":
      await setup();
      config.config.state = "normalstart";
      config.save();
      callback();
      break;
    case "normalstart":
      test()
        ? callback()
        : (function () {
            app.relaunch({ args: process.argv.slice(1).concat(["--suspiciousstart"]) });
            app.exit(0);
          })();
      break;
    default:
      app.relaunch({ args: process.argv.slice(1).concat(["--suspiciousstart"]) });
      app.exit(0);
  }
}
