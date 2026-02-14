import { ipcMain } from "electron";
import { registerWindowHandlers } from "./window";

export function registerIpcHandlers() {
  registerWindowHandlers();

  // Add more handlers here as they grow
  ipcMain.on("message", async (event, arg) => {
    event.reply("message", `${arg} World!`);
  });
}
