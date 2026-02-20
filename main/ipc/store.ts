import { ipcMain, app } from "electron";
import Store from "electron-store";

// Initialize store (create it outside handlers to persist across calls)
const store = new Store();

export function registerStoreHandlers() {
  console.log("Registering store handlers...");
  ipcMain.handle("store-get", (event, key) => {
    const val = store.get(key);
    console.log(`store-get: [${key}] =>`, JSON.stringify(val, null, 2));
    return val;
  });

  ipcMain.handle("store-set", (event, key, val) => {
    console.log(`store-set: [${key}] =>`, JSON.stringify(val, null, 2));
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
      args: ["--hidden"],
    });
    store.set("start-at-login", enabled);
    return true;
  });
}
