import { ipcMain } from "electron";
import Store from "electron-store";

// Initialize store (create it outside handlers to persist across calls)
const store = new Store();

export function registerStoreHandlers() {
  console.log("Registering store handlers...");
  ipcMain.handle("store-get", (event, key) => {
    console.log("store-get:", key);
    return store.get(key);
  });

  ipcMain.handle("store-set", (event, key, val) => {
    console.log("store-set:", key, val);
    store.set(key, val);
  });

  ipcMain.handle("store-delete", (event, key) => {
    console.log("store-delete:", key);
    store.delete(key);
  });
}
