import { BrowserWindow, screen, ipcMain } from "electron";
import path from "path";
import { IpcChannels } from "../shared/constants";
import Store from "electron-store";

const WIDGET_WIDTH = 450;
const WIDGET_HEIGHT = 280;
const PADDING = 20;
const ANIMATION_STEP = 20;
const ANIMATION_INTERVAL = 10;

let zikrWidgetWindow: BrowserWindow | null = null;
let zikrInterval: NodeJS.Timeout | null = null;
const isProd = process.env.NODE_ENV === "production";
const store = new Store();

/**
 * Calculates the target and start positions for the Zikr widget based on user settings.
 */
const getWidgetPosition = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const { x: offsetX, y: offsetY } = primaryDisplay.workArea;
  const position = store.get("zikr-position", "bottom-right") as string;

  let targetX: number;
  let targetY: number;
  let startX: number;

  switch (position) {
    case "top-left":
      targetX = offsetX + PADDING;
      targetY = offsetY + PADDING;
      startX = offsetX - WIDGET_WIDTH;
      break;
    case "top-right":
      targetX = offsetX + width - WIDGET_WIDTH - PADDING;
      targetY = offsetY + PADDING;
      startX = offsetX + width;
      break;
    case "bottom-left":
      targetX = offsetX + PADDING;
      targetY = offsetY + height - WIDGET_HEIGHT - PADDING;
      startX = offsetX - WIDGET_WIDTH;
      break;
    case "center":
      targetX = offsetX + (width - WIDGET_WIDTH) / 2;
      targetY = offsetY + (height - WIDGET_HEIGHT) / 2;
      startX = targetX;
      break;
    case "bottom-right":
    default:
      targetX = offsetX + width - WIDGET_WIDTH - PADDING;
      targetY = offsetY + height - WIDGET_HEIGHT - PADDING;
      startX = offsetX + width;
      break;
  }

  return { targetX, targetY, startX };
};

/**
 * Cleans up and closes the Zikr widget window.
 */
export const closeZikrWidget = () => {
  if (zikrWidgetWindow && !zikrWidgetWindow.isDestroyed()) {
    zikrWidgetWindow.close();
  }
  zikrWidgetWindow = null;
};

/**
 * Creates and animates the Zikr widget window.
 */
export const createZikrWidget = async () => {
  // Ensure only one instance is active
  closeZikrWidget();

  const { targetX, targetY, startX } = getWidgetPosition();
  const isSilent = store.get("zikr-silent", false) as boolean;
  const duration = store.get("zikr-duration", 30) as number;

  zikrWidgetWindow = new BrowserWindow({
    width: WIDGET_WIDTH,
    height: WIDGET_HEIGHT,
    x: Math.round(startX),
    y: Math.round(targetY),
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const baseUrl = isProd
    ? `app://./widgets/zikr`
    : `http://localhost:${process.argv[2]}/widgets/zikr`;

  // Pass duration in seconds to the renderer
  await zikrWidgetWindow.loadURL(
    `${baseUrl}?silent=${isSilent}&duration=${duration}`,
  );

  if (zikrWidgetWindow.isDestroyed()) return;

  zikrWidgetWindow.showInactive();

  // Animation Logic
  if (startX !== targetX) {
    let currentX = startX;
    const animate = () => {
      if (!zikrWidgetWindow || zikrWidgetWindow.isDestroyed()) return;

      let shouldContinue = false;
      if (startX > targetX) {
        // Slide from right
        currentX -= ANIMATION_STEP;
        if (currentX < targetX) currentX = targetX;
        else shouldContinue = true;
      } else if (startX < targetX) {
        // Slide from left
        currentX += ANIMATION_STEP;
        if (currentX > targetX) currentX = targetX;
        else shouldContinue = true;
      }

      zikrWidgetWindow.setPosition(Math.round(currentX), Math.round(targetY));

      if (shouldContinue) {
        setTimeout(animate, ANIMATION_INTERVAL);
      }
    };
    animate();
  } else {
    zikrWidgetWindow.setPosition(Math.round(targetX), Math.round(targetY));
  }

  zikrWidgetWindow.on("closed", () => {
    zikrWidgetWindow = null;
  });

  // Keep window within screen bounds when moved/dragged
  zikrWidgetWindow.on("moved", () => {
    if (zikrWidgetWindow) {
      const bounds = zikrWidgetWindow.getBounds();
      const display = screen.getDisplayMatching(bounds);
      const { x: scrX, y: scrY, width: scrW, height: scrH } = display.workArea;

      let newX = bounds.x;
      let newY = bounds.y;

      // Constrain X
      if (newX < scrX) newX = scrX;
      if (newX + bounds.width > scrX + scrW) newX = scrX + scrW - bounds.width;

      // Constrain Y
      if (newY < scrY) newY = scrY;
      if (newY + bounds.height > scrY + scrH)
        newY = scrY + scrH - bounds.height;

      if (newX !== bounds.x || newY !== bounds.y) {
        zikrWidgetWindow.setPosition(Math.round(newX), Math.round(newY));
      }
    }
  });
};

/**
 * Starts or restarts the interval scheduler for Zikr.
 */
const startZikrScheduler = () => {
  const isEnabled = store.get("azkar-widget-enabled", true) as boolean;
  if (!isEnabled) return;

  const intervalMinutes = store.get("zikr-interval", 15) as number;
  const intervalMS = intervalMinutes * 60 * 1000;

  if (zikrInterval) clearInterval(zikrInterval);
  zikrInterval = setInterval(() => {
    const stillEnabled = store.get("azkar-widget-enabled", true) as boolean;
    if (stillEnabled) createZikrWidget();
  }, intervalMS);
};

/**
 * Stops the Zikr scheduler and closes any open widget.
 */
const stopZikrScheduler = () => {
  if (zikrInterval) {
    clearInterval(zikrInterval);
    zikrInterval = null;
  }
  closeZikrWidget();
};

/**
 * Initializes IPC listeners for the Zikr widget.
 */
export const initZikrWidgetListeners = () => {
  ipcMain.on(IpcChannels.OPEN_ZIKR_WIDGET, () => createZikrWidget());
  ipcMain.on(IpcChannels.CLOSE_ZIKR_WIDGET, () => closeZikrWidget());

  // Listen for settings changes to restart scheduler
  ipcMain.on("update-zikr-settings", () => startZikrScheduler());

  // Enable / disable azkar widget from settings
  ipcMain.on(IpcChannels.ENABLE_AZKAR_WIDGET, () => startZikrScheduler());
  ipcMain.on(IpcChannels.DISABLE_AZKAR_WIDGET, () => stopZikrScheduler());

  // Initial start (only if enabled)
  startZikrScheduler();
};
