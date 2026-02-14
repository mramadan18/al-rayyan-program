import { ipcMain, BrowserWindow } from "electron";

export function registerWindowHandlers() {
  ipcMain.on("window-minimize", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.minimize();
  });

  ipcMain.on("window-maximize", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win?.isMaximized()) {
      win.unmaximize();
    } else {
      win?.maximize();
    }
  });

  ipcMain.on("window-close", (event) => {
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
