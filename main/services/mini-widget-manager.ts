import { BrowserWindow, screen, ipcMain, Menu } from "electron";
import path from "path";
import Store from "electron-store";
import { IpcChannels } from "../shared/constants";

const store = new Store();

let miniWidgetWindow: BrowserWindow | null = null;

export const openMiniWidget = async () => {
  if (miniWidgetWindow && !miniWidgetWindow.isDestroyed()) {
    miniWidgetWindow.focus();
    return;
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const baseWidth = 300;
  const baseHeight = 150;

  const savedSize = store.get("mini-widget-size", 1) as number;
  const widgetWidth = Math.round(baseWidth * savedSize);
  const widgetHeight = Math.round(baseHeight * savedSize);

  // Load saved position or default to bottom-right
  const savedBounds = store.get("mini-widget-bounds") as
    | { x: number; y: number }
    | undefined;

  let x = width - widgetWidth - 20;
  let y = height - widgetHeight - 20;

  if (savedBounds) {
    x = savedBounds.x;
    y = savedBounds.y;
  }

  const isAlwaysOnTop = store.get("mini-widget-always-on-top", true) as boolean;

  miniWidgetWindow = new BrowserWindow({
    width: widgetWidth,
    height: widgetHeight,
    x,
    y,
    frame: false,
    transparent: true,
    alwaysOnTop: isAlwaysOnTop,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const isProd = process.env.NODE_ENV === "production";
  const url = isProd
    ? `app://./widgets/mini-prayer`
    : `http://localhost:${process.argv[2]}/widgets/mini-prayer`;

  await miniWidgetWindow.loadURL(url);

  // Set initial zoom factor
  miniWidgetWindow.webContents.on("did-finish-load", () => {
    if (miniWidgetWindow && !miniWidgetWindow.isDestroyed()) {
      miniWidgetWindow.webContents.send("apply-mini-widget-zoom", savedSize);
    }
  });

  // Save position on move and clamp to screen
  miniWidgetWindow.on("moved", () => {
    if (miniWidgetWindow) {
      const bounds = miniWidgetWindow.getBounds();
      const display = screen.getDisplayMatching(bounds);
      const { x: scrX, y: scrY, width: scrW, height: scrH } = display.bounds;

      let newX = bounds.x;
      let newY = bounds.y;

      // Clamp X
      if (newX < scrX) newX = scrX;
      if (newX + bounds.width > scrX + scrW) newX = scrX + scrW - bounds.width;

      // Clamp Y
      if (newY < scrY) newY = scrY;
      if (newY + bounds.height > scrY + scrH)
        newY = scrY + scrH - bounds.height;

      if (newX !== bounds.x || newY !== bounds.y) {
        miniWidgetWindow.setPosition(newX, newY);
      }

      store.set("mini-widget-bounds", { x: newX, y: newY });
    }
  });

  miniWidgetWindow.on("closed", () => {
    miniWidgetWindow = null;
  });
};

export const closeMiniWidget = () => {
  if (miniWidgetWindow && !miniWidgetWindow.isDestroyed()) {
    miniWidgetWindow.close();
  }
  miniWidgetWindow = null;
};

export const toggleMiniWidget = () => {
  if (miniWidgetWindow && !miniWidgetWindow.isDestroyed()) {
    closeMiniWidget();
    store.set("show-mini-widget", false);
  } else {
    openMiniWidget();
    store.set("show-mini-widget", true);
  }
};

export const toggleAlwaysOnTop = () => {
  if (miniWidgetWindow && !miniWidgetWindow.isDestroyed()) {
    const currentState = miniWidgetWindow.isAlwaysOnTop();
    const newState = !currentState;
    miniWidgetWindow.setAlwaysOnTop(newState);
    store.set("mini-widget-always-on-top", newState);
    return newState;
  }
  return null;
};

export const initMiniWidgetListeners = () => {
  ipcMain.on(IpcChannels.OPEN_MINI_WIDGET, () => {
    openMiniWidget();
  });

  ipcMain.on(IpcChannels.CLOSE_MINI_WIDGET, () => {
    closeMiniWidget();
  });

  ipcMain.on("update-mini-widget-size", (event, scale: number) => {
    if (miniWidgetWindow && !miniWidgetWindow.isDestroyed()) {
      const baseWidth = 300;
      const baseHeight = 150;
      const newWidth = Math.round(baseWidth * scale);
      const newHeight = Math.round(baseHeight * scale);

      const bounds = miniWidgetWindow.getBounds();
      miniWidgetWindow.setBounds({
        x: bounds.x,
        y: bounds.y,
        width: newWidth,
        height: newHeight,
      });

      // Apply zoom factor
      miniWidgetWindow.webContents.send("apply-mini-widget-zoom", scale);
    }
  });

  ipcMain.handle(IpcChannels.TOGGLE_ALWAYS_ON_TOP, () => {
    return toggleAlwaysOnTop();
  });

  ipcMain.on(IpcChannels.SHOW_MINI_WIDGET_MENU, () => {
    if (!miniWidgetWindow || miniWidgetWindow.isDestroyed()) return;

    const currentSize = store.get("mini-widget-size", 1) as number;

    const menu = Menu.buildFromTemplate([
      {
        label: "تكبير (Zoom In)",
        click: () => {
          const newSize = Math.min(currentSize + 0.1, 1.5);
          store.set("mini-widget-size", newSize);

          // Send update back to main listener logic
          const baseWidth = 300;
          const baseHeight = 150;
          const newWidth = Math.round(baseWidth * newSize);
          const newHeight = Math.round(baseHeight * newSize);

          const bounds = miniWidgetWindow!.getBounds();
          miniWidgetWindow!.setBounds({
            x: bounds.x,
            y: bounds.y,
            width: newWidth,
            height: newHeight,
          });

          miniWidgetWindow!.webContents.send("apply-mini-widget-zoom", newSize);
        },
      },
      {
        label: "تصغير (Zoom Out)",
        click: () => {
          const newSize = Math.max(currentSize - 0.1, 0.7);
          store.set("mini-widget-size", newSize);

          const baseWidth = 300;
          const baseHeight = 150;
          const newWidth = Math.round(baseWidth * newSize);
          const newHeight = Math.round(baseHeight * newSize);

          const bounds = miniWidgetWindow!.getBounds();
          miniWidgetWindow!.setBounds({
            x: bounds.x,
            y: bounds.y,
            width: newWidth,
            height: newHeight,
          });

          miniWidgetWindow!.webContents.send("apply-mini-widget-zoom", newSize);
        },
      },
      { type: "separator" },
      {
        label: "إعادة تعيين (Reset)",
        click: () => {
          const newSize = 1.0;
          store.set("mini-widget-size", newSize);

          const baseWidth = 300;
          const baseHeight = 150;
          const newWidth = 300;
          const newHeight = 150;

          const bounds = miniWidgetWindow!.getBounds();
          miniWidgetWindow!.setBounds({
            x: bounds.x,
            y: bounds.y,
            width: newWidth,
            height: newHeight,
          });

          miniWidgetWindow!.webContents.send("apply-mini-widget-zoom", newSize);
        },
      },
    ]);

    menu.popup({ window: miniWidgetWindow });
  });
};
