import { app, Tray, Menu, nativeImage, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { IpcChannels } from "../shared/constants";

let tray: Tray | null = null;
let isQuitting = false;
let contextMenu: Menu | null = null;
let isRadioPlaying = false;

export const createTray = (mainWindow: BrowserWindow) => {
  const icon = nativeImage
    .createFromPath(path.join(__dirname, "../renderer/public/images/logo.png"))
    .resize({ width: 16, height: 16 });

  tray = new Tray(icon);
  tray.setToolTip("Al-Rayyan");

  const buildContextMenu = () => {
    contextMenu = Menu.buildFromTemplate([
      {
        label: "إظهار الريّان",
        click: () => {
          mainWindow.show();
          mainWindow.focus();
        },
      },
      {
        id: "radio-toggle",
        label: isRadioPlaying ? "⏸ إيقاف الإذاعة" : "▶ تشغيل الإذاعة",
        click: () => {
          mainWindow.webContents.send(IpcChannels.TOGGLE_RADIO_FROM_TRAY);
        },
      },
      {
        label: "إظهار / إخفاء مواقيت الصلاة",
        click: () => {
          const { toggleMiniWidget } = require("./mini-widget-manager");
          toggleMiniWidget();
        },
      },
      { type: "separator" },
      {
        label: "إغلاق البرنامج",
        click: () => {
          isQuitting = true;
          app.quit();
        },
      },
    ]);

    tray?.setContextMenu(contextMenu);
  };

  buildContextMenu();

  // Sync radio state from renderer to update tray label
  ipcMain.on(IpcChannels.SYNC_RADIO_STATE, (_event, playing: boolean) => {
    isRadioPlaying = playing;
    buildContextMenu();
  });

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
