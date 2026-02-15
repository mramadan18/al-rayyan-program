import { registerWindowHandlers } from "./window";
import { registerStoreHandlers } from "./store";
import { initDuaWidgetListeners } from "../services/dua-widget";
import { initAdhanWidgetListeners } from "../services/widget-manager";

export function registerIpcHandlers() {
  registerWindowHandlers();
  registerStoreHandlers();
  initDuaWidgetListeners();
  initAdhanWidgetListeners();
}
