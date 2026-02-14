import path from "path";
import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { registerIpcHandlers } from "./ipc";
import { setupWindowStateListeners } from "./ipc/window";
import {
  createTray,
  handleWindowEvents,
  getIsQuitting,
} from "./services/tray-manager";
import { initPrayerScheduler } from "./services/prayer-scheduler";

const isProd = process.env.NODE_ENV === "production";

// Allow audio autoplay without user interaction (crucial for background alerts)
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

let mainWindow: BrowserWindow | null = null;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // Logic for production/development
  if (isProd) {
    serve({ directory: "app" });
  } else {
    const userDataPath = app.getPath("userData");
    app.setPath("userData", userDataPath + " (development)");
  }

  const startApp = async () => {
    mainWindow = createWindow("main", {
      width: 1000,
      height: 600,
      frame: false, // Frameless window
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        backgroundThrottling: false, // Ensure timers/audio run in background
      },
    });

    // Setup window event listeners (persistence)
    setupWindowStateListeners(mainWindow);

    // Setup Tray and Window Close prevention
    createTray(mainWindow);
    handleWindowEvents(mainWindow);

    // Setup Prayer Scheduler
    initPrayerScheduler(mainWindow);

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
      if (!mainWindow.isVisible()) mainWindow.show();
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

// prevent app from quitting when all windows are closed
app.on("window-all-closed", () => {
  // We keep the app running in the tray
  if (process.platform !== "darwin" && getIsQuitting()) {
    app.quit();
  }
});
