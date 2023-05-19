import { app, BrowserWindow } from "electron";

async function kill(code = 0): Promise<void> {
  for (const window of BrowserWindow.getAllWindows()) {
    if (window && !window.isDestroyed()) {
      let whenWindowClosed: Promise<void>;
      if (window.webContents && !window.webContents.isDestroyed()) {
        whenWindowClosed = new Promise((resolve) => window.once("closed", resolve));
      } else {
        whenWindowClosed = Promise.resolve();
      }

      window.destroy();
      await whenWindowClosed;
    }
  }

  app.exit(code);
}

async function relaunch(options?: { addArgs?: string[]; removeArgs?: string[] }): Promise<void> {
  const args = process.argv.slice(1);

  if (options?.addArgs) {
    args.push(...options.addArgs);
  }

  if (options?.removeArgs) {
    for (const a of options.removeArgs) {
      const idx = args.indexOf(a);
      if (idx >= 0) {
        args.splice(idx, 1);
      }
    }
  }

  const quitListener = () => {
    // relaunch after we are sure there is no veto
    app.relaunch({ args });
  };

  app.once("quit", quitListener);
  app.quit();
}

export default {
  relaunch,
  kill,
  quit: app.quit,
};
