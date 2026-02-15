import { ipcMain, BrowserWindow } from "electron";
import { IpcChannels } from "../shared/constants";

export function registerWindowHandlers() {
  ipcMain.on(IpcChannels.WINDOW_MINIMIZE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.minimize();
  });

  ipcMain.on(IpcChannels.WINDOW_MAXIMIZE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win?.isMaximized()) {
      win.unmaximize();
    } else {
      win?.maximize();
    }
  });

  ipcMain.on(IpcChannels.WINDOW_CLOSE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.close();
  });
}

export function setupWindowStateListeners(mainWindow: BrowserWindow) {
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("window-state-change", "maximized");
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("window-state-change", "normal");
  });
}
