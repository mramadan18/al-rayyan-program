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

  ipcMain.on(IpcChannels.WINDOW_ZOOM_IN, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      const currentZoom = win.webContents.getZoomLevel();
      const nextZoom = currentZoom + 0.1;
      const MAX_ZOOM = 1.5;
      if (nextZoom <= MAX_ZOOM) {
        win.webContents.setZoomLevel(nextZoom);
      }
    }
  });

  ipcMain.on(IpcChannels.WINDOW_ZOOM_OUT, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      const currentZoom = win.webContents.getZoomLevel();
      const nextZoom = currentZoom - 0.1;
      const MIN_ZOOM = -1; // Equivalent to ~0.79 zoom factor
      if (nextZoom >= MIN_ZOOM) {
        win.webContents.setZoomLevel(nextZoom);
      }
    }
  });

  ipcMain.on(IpcChannels.WINDOW_ZOOM_RESET, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.webContents.setZoomLevel(0);
    }
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
