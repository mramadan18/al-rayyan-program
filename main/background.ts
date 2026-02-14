import path from "path";
import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { registerIpcHandlers } from "./ipc";
import { setupWindowStateListeners } from "./ipc/window";

const isProd = process.env.NODE_ENV === "production";

let mainWindow: BrowserWindow | null = null;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // Logic for production/development
  if (isProd) {
    serve({ directory: "app" });
  } else {
    app.setPath("userData", `${app.getPath("userData")} (development)`);
  }

  const startApp = async () => {
    mainWindow = createWindow("main", {
      width: 1000,
      height: 600,
      frame: false, // Frameless window
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    // Setup window event listeners
    setupWindowStateListeners(mainWindow);

    if (isProd) {
      await mainWindow.loadURL("app://./home");
    } else {
      const port = process.argv[2];
      await mainWindow.loadURL(`http://localhost:${port}/home`);
      mainWindow.webContents.openDevTools();
    }
  };

  app.on("second-instance", () => {
    // Someone tried to run a second instance
    if (mainWindow) {
      if (!isProd) {
        // In development: Close old window and open a new one (effectively refreshing)
        mainWindow.close();
        startApp();
        return;
      }
      // In production: Focus existing window
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  (async () => {
    await app.whenReady();

    // Register all IPC handlers (Only once)
    registerIpcHandlers();

    await startApp();
  })();
}

app.on("window-all-closed", () => {
  app.quit();
});
