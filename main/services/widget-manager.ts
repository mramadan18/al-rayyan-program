import { BrowserWindow, screen, ipcMain } from "electron";
import path from "path";
import Store from "electron-store";
import { IpcChannels } from "../shared/constants";

const store = new Store();

let widgetWindow: BrowserWindow | null = null;

export const showAdhanWidget = async (
  prayerName: string,
  audioPath: string,
  targetTime?: number,
  autoCloseTimeout?: number,
) => {
  if (widgetWindow) {
    console.log("Closing existing widget window");
    if (!widgetWindow.isDestroyed()) {
      widgetWindow.close();
    }
    widgetWindow = null;
  }

  console.log("Creating Adhan Widget Window...");

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const widgetWidth = 400;
  const widgetHeight = 300;

  // Load saved position or default to bottom-right
  const savedBounds = store.get("widget-bounds") as
    | { x: number; y: number }
    | undefined;

  let x = width - widgetWidth - 20;
  let y = height - widgetHeight - 20;

  if (savedBounds) {
    x = savedBounds.x;
    y = savedBounds.y;
  }

  widgetWindow = new BrowserWindow({
    width: widgetWidth,
    height: widgetHeight,
    x,
    y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false, // Let React/CSS handle shadow
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const isProd = process.env.NODE_ENV === "production";
  const query = `prayer=${encodeURIComponent(prayerName)}&audio=${encodeURIComponent(audioPath)}${targetTime ? `&targetTime=${targetTime}` : ""}`;

  // Updated path to /widgets/adhan
  const url = isProd
    ? `app://./widgets/adhan?${query}`
    : `http://localhost:${process.argv[2]}/widgets/adhan?${query}`;

  console.log("Loading Widget URL:", url);
  await widgetWindow.loadURL(url);

  if (autoCloseTimeout) {
    setTimeout(() => {
      console.log(`Auto-closing widget after ${autoCloseTimeout}ms`);
      closeAdhanWidget();
    }, autoCloseTimeout);
  }

  // Save position on move
  widgetWindow.on("moved", () => {
    if (widgetWindow) {
      const bounds = widgetWindow.getBounds();
      store.set("widget-bounds", { x: bounds.x, y: bounds.y });
    }
  });

  widgetWindow.on("closed", () => {
    widgetWindow = null;
  });
};

export const closeAdhanWidget = () => {
  if (widgetWindow && !widgetWindow.isDestroyed()) {
    widgetWindow.close();
  }
  widgetWindow = null;
};

// Register IPC handler for closing
export const initAdhanWidgetListeners = () => {
  ipcMain.on(IpcChannels.CLOSE_ADHAN_WIDGET, () => {
    closeAdhanWidget();
  });
};
