import { registerWindowHandlers } from "./window";
import { registerStoreHandlers } from "./store";
import { initDuaWidgetListeners } from "../services/dua-widget";
import { initAdhanWidgetListeners } from "../services/widget-manager";
import { initMiniWidgetListeners } from "../services/mini-widget-manager";
import { initZikrWidgetListeners } from "../services/zikr-widget";

export function registerIpcHandlers() {
  registerWindowHandlers();
  registerStoreHandlers();
  initDuaWidgetListeners();
  initAdhanWidgetListeners();
  initMiniWidgetListeners();
  initZikrWidgetListeners();
}
