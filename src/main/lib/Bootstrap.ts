import { mkdirSync, exists, writeSync, readSync, removeSync, accessSync } from "../../shared/lib/fs";
import { paths, SQL_CREATE_DATABASE } from "./Constants";
import logger from "../../shared/lib/logger";
import { app, dialog } from "electron";
import lifecycle from "./Lifecycle";
import SQLite from "better-sqlite3";
import Config from "./Config";

async function setup() {
  logger.debug("Configuring the application for the first time.");
  try {
    if (!exists(paths.folders.userDataPath) || !exists(paths.folders.cache) || !exists(paths.folders.databases)) {
      logger.log("Creating folders...");
      mkdirSync(paths.folders.cache, { recursive: true });
      mkdirSync(paths.folders.userDataPath, { recursive: true });
      mkdirSync(paths.folders.databases, { recursive: true });
    }

    if (!exists(paths.files.database)) {
      logger.log("Creating databases...");
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
          logger.crit(
            "A critical error occurred while trying to configure the application on its first startup.",
            error
          );
          break;
        case 1:
          logger.debug("Repairing...");
          logger.crit(
            "A critical error occurred while trying to configure the application on its first startup.",
            error
          );
          lifecycle.relaunch();
          break;
        case 2:
          logger.debug("Leaving...");
          logger.crit(
            "A critical error occurred while trying to configure the application on its first startup.",
            error
          );
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

async function repair(config: Config): Promise<boolean> {
  logger.debug("Repairing...");

  try {
    // Make Dirs
    try {
      logger.debug("Try make folders");
      mkdirSync(paths.folders.cache, { recursive: true });
      mkdirSync(paths.folders.userDataPath, { recursive: true });
      mkdirSync(paths.folders.databases, { recursive: true });
    } catch (error) {
      logger.error(error);
    }

    try {
      const db = new SQLite(paths.files.database);
      db.close();
    } catch (DBError) {
      logger.error(DBError);
    }

    try {
      if (exists(paths.files.setting)) {
        let setting = readSync(paths.files.setting, "utf-8");

        try {
          JSON.parse(setting.toString());
        } catch (parseError) {
          logger.error(parseError);
        }
      }
    } catch (readError) {
      logger.error(readError);
    }

    config.config.state = "normalstart";
    await config.save();

    return true;
  } catch {}
}

function test(): boolean {
  logger.log("Initiating start-up tests...");
  const PERMISSION_READ = 4;
  const PERMISSION_WRITE = 2;
  const PERMISSION_EXECUTE = 1;
  const PERMISSION_ALL = 7;

  let allTestsPassed = true;

  // Checking folders
  if (exists(paths.folders.userDataPath) && exists(paths.folders.cache) && exists(paths.folders.databases)) {
    if (
      accessSync(paths.folders.userDataPath, PERMISSION_ALL) &&
      accessSync(paths.folders.databases, PERMISSION_ALL) &&
      accessSync(paths.folders.cache, PERMISSION_ALL)
    )
      allTestsPassed &&= true;
  }

  // Checking files
  if (exists(paths.files.database) && exists(paths.files.setting)) {
    if (accessSync(paths.files.database, PERMISSION_ALL) && accessSync(paths.files.setting, PERMISSION_ALL))
      allTestsPassed &&= true;
  }

  let permissions = 0;

  try {
    writeSync(paths.files.test, "Testing... it's no secret that the creator of Cismu likes Manga and Anime ;)", {
      atomic: true,
    });
    permissions |= PERMISSION_WRITE;
  } catch (error) {
    logger.error("Could not write to the root path, maybe you do not have permissions", error);
  }

  try {
    readSync(paths.files.test);
    permissions |= PERMISSION_READ;
  } catch (error) {
    logger.error("Could not read in the root path, maybe you do not have the permissions", error);
  }

  try {
    removeSync(paths.files.test);
    permissions |= PERMISSION_EXECUTE;
  } catch (error) {
    logger.error("Could not delete in the root path, maybe you do not have permissions", error);
  }

  if (permissions >= PERMISSION_ALL && allTestsPassed) {
    return true;
  } else {
    return false;
  }
}

export default async function bootstrap(callback: () => void, config: Config) {
  // boot app
  switch (config.config.state) {
    case "firststart":
      await setup();
      config.config.state = "normalstart";
      config.save();
      logger.log("Application configured launching...");
      callback();
      break;
    case "normalstart":
      if (test()) {
        callback();
      } else {
        config.config.state = "suspiciousstart";
        await config.save();
        lifecycle.relaunch();
      }
      break;
    case "suspiciousstart":
      const repared = await repair(config);
      if (repared) {
        lifecycle.relaunch();
      } else lifecycle.kill();
  }
}
