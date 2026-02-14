import { app, Tray, Menu, nativeImage, BrowserWindow } from "electron";
import path from "path";

let tray: Tray | null = null;
let isQuitting = false;

export const createTray = (mainWindow: BrowserWindow) => {
  const iconPath = path.join(__dirname, "../renderer/public/images/logo.png"); // Fallback to logo
  // In production, resources might be packed differently. usually extraResources.
  // But for dev, let's try to resolve it.

  // Actually, we should check if tray-icon.png exists.
  // const trayIcon = nativeImage.createFromPath(path.join(__dirname, '../../public/icons/tray-icon.png'));

  // Let's use a safe path resolution.
  // In many nextron setups, static assets are in 'renderer/public' during dev, and 'resources' in prod.
  // But nativeImage.createFromPath handles loading.

  const icon = nativeImage
    .createFromPath(path.join(__dirname, "../renderer/public/images/logo.png"))
    .resize({ width: 16, height: 16 });

  tray = new Tray(icon);
  tray.setToolTip("Al-Rayyan");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "فتح الريّان",
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: "إغلاق",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  return tray;
};

export const handleWindowEvents = (mainWindow: BrowserWindow) => {
  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
};

export const setQuitting = (quitting: boolean) => {
  isQuitting = quitting;
};

// Export to use in background.ts
export const getIsQuitting = () => isQuitting;
