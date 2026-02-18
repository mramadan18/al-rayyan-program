import { autoUpdater, UpdateInfo, ProgressInfo } from "electron-updater";
import log from "electron-log";
import { BrowserWindow, ipcMain } from "electron";

// ─────────────────────────────────────────────
// Configure electron-log for auto-updater
// ─────────────────────────────────────────────
log.transports.file.level = "info";
autoUpdater.logger = log;

// Do NOT auto-download — we wait for user confirmation
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindowRef: BrowserWindow | null = null;

/**
 * Sends an IPC message to the renderer, guarded against destroyed windows.
 */
function sendToRenderer(channel: string, data?: unknown) {
  if (mainWindowRef && !mainWindowRef.isDestroyed()) {
    mainWindowRef.webContents.send(channel, data);
  }
}

/**
 * Registers all auto-updater event listeners and IPC handlers.
 * Call once after `app.whenReady()`.
 */
export function initAutoUpdater(mainWindow: BrowserWindow) {
  mainWindowRef = mainWindow;

  // ─── Updater Events ─────────────────────────

  autoUpdater.on("checking-for-update", () => {
    log.info("[AutoUpdater] Checking for update...");
    sendToRenderer("update:checking");
  });

  autoUpdater.on("update-available", (info: UpdateInfo) => {
    log.info("[AutoUpdater] Update available:", info.version);
    sendToRenderer("update:available", {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes,
    });
  });

  autoUpdater.on("update-not-available", (info: UpdateInfo) => {
    log.info("[AutoUpdater] No update available. Current:", info.version);
    sendToRenderer("update:not-available", {
      version: info.version,
    });
  });

  autoUpdater.on("download-progress", (progress: ProgressInfo) => {
    log.info(
      `[AutoUpdater] Download progress: ${progress.percent.toFixed(1)}%`,
    );
    sendToRenderer("update:download-progress", {
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total,
    });
  });

  autoUpdater.on("update-downloaded", (info: UpdateInfo) => {
    log.info("[AutoUpdater] Update downloaded:", info.version);
    sendToRenderer("update:downloaded", {
      version: info.version,
    });
  });

  autoUpdater.on("error", (error: Error) => {
    log.error("[AutoUpdater] Error:", error.message);
    sendToRenderer("update:error", {
      message: error.message,
    });
  });

  // ─── IPC Handlers (from Renderer) ───────────

  ipcMain.handle("update:check", async () => {
    log.info("[AutoUpdater] Manual check triggered.");
    try {
      const result = await autoUpdater.checkForUpdates();
      return result?.updateInfo;
    } catch (err) {
      log.error("[AutoUpdater] Check failed:", err);
      return null;
    }
  });

  ipcMain.handle("update:start-download", async () => {
    log.info("[AutoUpdater] Download started by user.");
    try {
      await autoUpdater.downloadUpdate();
    } catch (err) {
      log.error("[AutoUpdater] Download failed:", err);
    }
  });

  ipcMain.handle("update:restart-and-install", () => {
    log.info("[AutoUpdater] Quitting and installing update...");
    autoUpdater.quitAndInstall(false, true);
  });

  // ─── Initial Check on Startup ───────────────
  // Slight delay to let the window finish loading
  setTimeout(() => {
    log.info("[AutoUpdater] Startup check initiated.");
    autoUpdater.checkForUpdates().catch((err) => {
      log.error("[AutoUpdater] Startup check failed:", err);
    });
  }, 5000);
}
