import { ipcMain, clipboard } from "electron";

export function registerClipboardHandlers() {
  ipcMain.on("clipboard-write", (_event, text: string) => {
    clipboard.writeText(text);
  });
}
