import { contextBridge, ipcRenderer } from "electron";

const API = {
  send(channel: string, ...args: any[]) {
    const channels = ["cismu:get-musics"];

    if (typeof channel === "string" && channels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    }
  },

  receive(channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => any) {
    const channels = ["cismu:update-musics", "cismu:remove-music", "cismu:add-music"];

    if (typeof channel === "string" && channels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },

  async invoke(channel: string, ...args: any[]) {
    return await ipcRenderer.invoke(channel, ...args);
  },
};

contextBridge.exposeInMainWorld("CismuAPI", API);
