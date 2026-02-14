import { registerWindowHandlers } from "./window";
import { registerStoreHandlers } from "./store";

export function registerIpcHandlers() {
  registerWindowHandlers();
  registerStoreHandlers();
}
