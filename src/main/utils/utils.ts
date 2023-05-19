import { app } from "electron";

function relaunch(exitCode: number = 0) {
  app.relaunch();
  app.exit(exitCode);
}

export { relaunch };
