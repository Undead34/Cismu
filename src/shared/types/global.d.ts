declare global {
  interface Window {
    CismuAPI: {
      send(channel: string, ...args: any[]): void;
      receive(channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => any): void;
      invoke<T>(channel: string, ...args: any[]): Promise<T>;
    };
  }
}

export {};
