import { registerWindowHandlers } from "./window";
import { registerStoreHandlers } from "./store";
import { initDuaWidgetListeners } from "../services/dua-widget";

export function registerIpcHandlers() {
  registerWindowHandlers();
  registerStoreHandlers();
  initDuaWidgetListeners();
}
