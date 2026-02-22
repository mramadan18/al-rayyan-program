import { ipcMain, BrowserWindow } from "electron";
import { showAdhanWidget } from "./widget-manager";
import { IpcChannels } from "../shared/constants";
import Store from "electron-store";

const store = new Store();

// Timings stored as "HH:mm" string
let prayerTimes: Record<string, string> = {};
let selectedAdhanPath = "/audio/adhan/adhan-1.mp3";
let prayerNotificationsEnabled = true;
let showPreAdhanEnabled = true;
let preAdhanMinutesVal = 15;
let mainWindow: BrowserWindow | null = null;
let checkInterval: NodeJS.Timeout | null = null;
let lastProcessedMinute = -1;

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const initPrayerScheduler = (win: BrowserWindow) => {
  mainWindow = win;

  // Initialize from store
  prayerNotificationsEnabled = store.get(
    "prayer-notifications-enabled",
    true,
  ) as boolean;
  showPreAdhanEnabled = store.get("show-pre-adhan", true) as boolean;
  preAdhanMinutesVal = store.get("pre-adhan-minutes", 15) as number;
  selectedAdhanPath = store.get(
    "selected-adhan",
    "/audio/adhan/adhan-1.mp3",
  ) as string;

  // Listen for updates from Renderer keying on "update-prayer-times"
  ipcMain.on("update-prayer-times", (event, data) => {
    // data structure: { timings: { Fajr: "...", ... }, adhan: "path" }
    if (data.timings) {
      prayerTimes = data.timings;
      // console.log("Background updated prayer times:", prayerTimes);
    }
    if (data.adhan) {
      selectedAdhanPath = data.adhan;
    }
    if (data.prayerNotifications !== undefined) {
      prayerNotificationsEnabled = data.prayerNotifications;
    }
    if (data.showPreAdhan !== undefined) {
      showPreAdhanEnabled = data.showPreAdhan;
    }
    if (data.preAdhanMinutes !== undefined) {
      preAdhanMinutesVal = data.preAdhanMinutes;
    }

    // Broadcast update to all other windows (like mini-widget)
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach((win) => {
      if (win.webContents !== event.sender) {
        win.webContents.send("prayer-times-changed", data);
      }
    });
  });

  ipcMain.on(IpcChannels.OPEN_ADHAN_WIDGET, () => {
    showAdhanWidget("Test Prayer", selectedAdhanPath);
  });

  ipcMain.on(IpcChannels.STOP_AUDIO, () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("stop-audio");
    }
  });

  ipcMain.on(IpcChannels.MUTE_AUDIO, (event, muted: boolean) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("mute-audio", muted);
    }
  });

  ipcMain.on("test-pre-adhan", () => {
    console.log("Received test-pre-adhan IPC in main process");
    // Show widget with 15 minutes remaining (simulated)
    const now = Date.now();
    const target = now + 15 * 60 * 1000;

    // Pass empty string for audio so widget doesn't play Adhan sound during Pre-Adhan check
    showAdhanWidget("Test Prayer", "", target, 30000);

    if (mainWindow) {
      mainWindow.webContents.send("play-audio", "/audio/before-adhan.mp3");
    }
  });

  ipcMain.on("test-iqamah", () => {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach((win) => {
      win.webContents.send("test-iqamah");
    });
  });

  startScheduler();
};

const startScheduler = () => {
  if (checkInterval) clearInterval(checkInterval);

  // Check every 10 seconds to ensure we catch the minute change
  checkInterval = setInterval(checkPrayers, 10 * 1000);
  checkPrayers(); // Initial check
};

const checkPrayers = () => {
  if (!mainWindow || mainWindow.isDestroyed() || !prayerNotificationsEnabled)
    return;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Prevent running multiple times in the same minute
  if (currentMinutes === lastProcessedMinute) return;
  lastProcessedMinute = currentMinutes;

  // Iterate through prayers
  for (const [name, time] of Object.entries(prayerTimes)) {
    if (!time || name === "Sunrise") continue;

    const prayerMinutes = toMinutes(time);

    // Distance to prayer in minutes
    const diff = (prayerMinutes - currentMinutes + 1440) % 1440;

    if (diff === 0) {
      // It is NOW prayer time
      console.log(`Triggering Adhan for ${name}`);
      showAdhanWidget(name, selectedAdhanPath);
    } else if (showPreAdhanEnabled && diff === preAdhanMinutesVal) {
      // User-defined minutes before
      console.log(`Triggering Pre-Adhan for ${name} (${diff} mins before)`);

      const targetTime = new Date();
      const [hours, mins] = time.split(":").map(Number);
      targetTime.setHours(hours, mins, 0, 0);

      // If the target is earlier than now, it must be for tomorrow
      if (targetTime.getTime() < now.getTime()) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      // Show widget with 15 minutes remaining
      showAdhanWidget(name, "", targetTime.getTime(), 30000);

      // Use specific pre-adhan file
      mainWindow.webContents.send("play-audio", "/audio/before-adhan.mp3");
    }
  }
};
