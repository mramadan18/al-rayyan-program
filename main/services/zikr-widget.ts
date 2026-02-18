import { BrowserWindow, screen, ipcMain } from "electron";
import path from "path";
import { IpcChannels } from "../shared/constants";

let zikrWidgetWindow: BrowserWindow | null = null;
let zikrInterval: NodeJS.Timeout | null = null;
const isProd = process.env.NODE_ENV === "production";
const ZIKR_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

export const createZikrWidget = async () => {
  if (zikrWidgetWindow) {
    if (!zikrWidgetWindow.isDestroyed()) {
      zikrWidgetWindow.focus();
      return;
    }
    zikrWidgetWindow = null;
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const widgetWidth = 400;
  const widgetHeight = 280;

  // Position: Start off-screen to the right
  const targetX = width - widgetWidth - 20;
  const startX = width;
  const targetY = height - widgetHeight - 20;

  zikrWidgetWindow = new BrowserWindow({
    width: widgetWidth,
    height: widgetHeight,
    x: startX,
    y: targetY,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    show: false, // Don't show immediately
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const url = isProd
    ? `app://./widgets/zikr`
    : `http://localhost:${process.argv[2]}/widgets/zikr`;

  await zikrWidgetWindow.loadURL(url);

  // Show and Animate
  zikrWidgetWindow.showInactive(); // Show without taking focus

  let currentX = startX;
  const step = 15; // Animation speed
  const animate = () => {
    if (!zikrWidgetWindow || zikrWidgetWindow.isDestroyed()) return;

    if (currentX > targetX) {
      currentX -= step;
      if (currentX < targetX) currentX = targetX;
      zikrWidgetWindow.setPosition(Math.round(currentX), targetY);
      setTimeout(animate, 10); // ~60fps
    }
  };

  animate();

  // Handle move logic same as other widgets to keep it on screen
  zikrWidgetWindow.on("moved", () => {
    if (zikrWidgetWindow) {
      const bounds = zikrWidgetWindow.getBounds();
      const display = screen.getDisplayMatching(bounds);
      const { x: scrX, y: scrY, width: scrW, height: scrH } = display.bounds;

      let newX = bounds.x;
      let newY = bounds.y;

      if (newX < scrX) newX = scrX;
      if (newX + bounds.width > scrX + scrW) newX = scrX + scrW - bounds.width;
      if (newY < scrY) newY = scrY;
      if (newY + bounds.height > scrY + scrH)
        newY = scrY + scrH - bounds.height;

      if (newX !== bounds.x || newY !== bounds.y) {
        zikrWidgetWindow.setPosition(newX, newY);
      }
    }
  });

  zikrWidgetWindow.on("closed", () => {
    zikrWidgetWindow = null;
  });
};

export const closeZikrWidget = () => {
  if (zikrWidgetWindow && !zikrWidgetWindow.isDestroyed()) {
    zikrWidgetWindow.close();
  }
  zikrWidgetWindow = null;
};

export const initZikrWidgetListeners = () => {
  ipcMain.on(IpcChannels.OPEN_ZIKR_WIDGET, () => {
    createZikrWidget();
  });

  ipcMain.on(IpcChannels.CLOSE_ZIKR_WIDGET, () => {
    closeZikrWidget();
  });

  // Start Scheduler
  if (zikrInterval) clearInterval(zikrInterval);
  zikrInterval = setInterval(() => {
    createZikrWidget();
  }, ZIKR_INTERVAL_MS);
};
