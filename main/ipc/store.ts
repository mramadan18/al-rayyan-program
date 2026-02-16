import { ipcMain, app } from "electron";
import Store from "electron-store";

// Initialize store (create it outside handlers to persist across calls)
const store = new Store();

export function registerStoreHandlers() {
  console.log("Registering store handlers...");
  ipcMain.handle("store-get", (event, key) => {
    const val = store.get(key);
    console.log(`store-get: [${key}] =>`, val);
    return val;
  });

  ipcMain.handle("store-set", (event, key, val) => {
    console.log("store-set:", key, val);
    store.set(key, val);
  });

  ipcMain.handle("store-delete", (event, key) => {
    console.log("store-delete:", key);
    store.delete(key);
  });

  ipcMain.handle("set-startup", (event, enabled: boolean) => {
    console.log("Setting startup to:", enabled);
    app.setLoginItemSettings({
      openAtLogin: enabled,
      path: app.getPath("exe"),
    });
    store.set("start-at-login", enabled);
    return true;
  });
}
