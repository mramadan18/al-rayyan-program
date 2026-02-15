import { BrowserWindow, screen, ipcMain } from "electron";
import path from "path";
import Store from "electron-store";
import { IpcChannels } from "../shared/constants";

const store = new Store();
const isProd = process.env.NODE_ENV === "production";

let duaWidgetWindow: BrowserWindow | null = null;

export const createDuaWidget = async (volume: number = 1) => {
  if (duaWidgetWindow) {
    if (!duaWidgetWindow.isDestroyed()) {
      duaWidgetWindow.focus();
      return;
    }
    duaWidgetWindow = null;
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const widgetWidth = 450;
  const widgetHeight = 250;

  // Position: Bottom-right corner with 20px margin
  const x = width - widgetWidth - 20;
  const y = height - widgetHeight - 20;

  duaWidgetWindow = new BrowserWindow({
    width: widgetWidth,
    height: widgetHeight,
    x,
    y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const url = isProd
    ? `app://./widgets/dua?volume=${volume}`
    : `http://localhost:${process.argv[2]}/widgets/dua?volume=${volume}`;

  await duaWidgetWindow.loadURL(url);

  duaWidgetWindow.on("closed", () => {
    duaWidgetWindow = null;
  });
};

export const closeDuaWidget = () => {
  if (duaWidgetWindow && !duaWidgetWindow.isDestroyed()) {
    duaWidgetWindow.close();
  }
  duaWidgetWindow = null;
};

export const initDuaWidgetListeners = () => {
  ipcMain.on(IpcChannels.OPEN_DUA_WIDGET, () => {
    console.log("Received show-dua-widget IPC message in Main process");
    // Get volume from store, default to 1 (100%)
    const volume = (store.get("settings.volume") as number) ?? 1;
    createDuaWidget(volume);
  });

  ipcMain.on(IpcChannels.CLOSE_DUA_WIDGET, () => {
    closeDuaWidget();
  });
};
