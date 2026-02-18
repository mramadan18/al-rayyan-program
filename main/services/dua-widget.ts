import { BrowserWindow, screen, ipcMain } from "electron";
import path from "path";
import Store from "electron-store";
import { IpcChannels } from "../shared/constants";

const WIDGET_WIDTH = 450;
const WIDGET_HEIGHT = 300;
const PADDING = 20;
const ANIMATION_STEP = 20;
const ANIMATION_INTERVAL = 10;

let duaWidgetWindow: BrowserWindow | null = null;
const isProd = process.env.NODE_ENV === "production";
const store = new Store();

/**
 * Calculates the target and start positions for the Dua widget based on user settings.
 */
const getWidgetPosition = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const { x: offsetX, y: offsetY } = primaryDisplay.workArea;
  const position = store.get("dua-position", "bottom-right") as string;

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
 * Cleans up and closes the Dua widget window.
 */
export const closeDuaWidget = () => {
  if (duaWidgetWindow && !duaWidgetWindow.isDestroyed()) {
    duaWidgetWindow.close();
  }
  duaWidgetWindow = null;
};

/**
 * Creates and animates the Dua widget window.
 */
export const createDuaWidget = async (volume: number = 1) => {
  // Ensure only one instance is active
  closeDuaWidget();

  const { targetX, targetY, startX } = getWidgetPosition();
  const isSilent = store.get("dua-silent", false) as boolean;

  duaWidgetWindow = new BrowserWindow({
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
    ? `app://./widgets/dua`
    : `http://localhost:${process.argv[2]}/widgets/dua`;

  await duaWidgetWindow.loadURL(
    `${baseUrl}?volume=${volume}&silent=${isSilent}`,
  );

  if (duaWidgetWindow.isDestroyed()) return;

  duaWidgetWindow.showInactive();

  // Animation Logic
  if (startX !== targetX) {
    let currentX = startX;
    const animate = () => {
      if (!duaWidgetWindow || duaWidgetWindow.isDestroyed()) return;

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

      duaWidgetWindow.setPosition(Math.round(currentX), Math.round(targetY));

      if (shouldContinue) {
        setTimeout(animate, ANIMATION_INTERVAL);
      }
    };
    animate();
  } else {
    duaWidgetWindow.setPosition(Math.round(targetX), Math.round(targetY));
  }

  duaWidgetWindow.on("closed", () => {
    duaWidgetWindow = null;
  });

  // Keep window within screen bounds when moved/dragged
  duaWidgetWindow.on("moved", () => {
    if (duaWidgetWindow) {
      const bounds = duaWidgetWindow.getBounds();
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
        duaWidgetWindow.setPosition(Math.round(newX), Math.round(newY));
      }
    }
  });
};

/**
 * Initializes IPC listeners for the Dua widget.
 */
export const initDuaWidgetListeners = () => {
  ipcMain.on(IpcChannels.OPEN_DUA_WIDGET, () => {
    console.log("Received show-dua-widget IPC message in Main process");
    const volume = (store.get("settings.volume") as number) ?? 1;
    createDuaWidget(volume);
  });

  ipcMain.on(IpcChannels.CLOSE_DUA_WIDGET, () => {
    closeDuaWidget();
  });

  ipcMain.on(IpcChannels.PIN_DUA_WIDGET, () => {
    // Pin is handled in the renderer — this just keeps the window alive
    // No action needed on main side; the renderer controls its own timer
  });
};
