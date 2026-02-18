export const IpcChannels = {
  OPEN_ADHAN_WIDGET: "open-adhan-widget",
  CLOSE_ADHAN_WIDGET: "close-adhan-widget",
  OPEN_DUA_WIDGET: "open-dua-widget",
  CLOSE_DUA_WIDGET: "close-dua-widget",
  GET_PRAYER_TIMES: "get-prayer-times",
  GET_SETTINGS: "get-settings",
  UPDATE_SETTINGS: "update-settings",
  PLAY_AUDIO: "play-audio",
  STOP_AUDIO: "stop-audio",
  WINDOW_MINIMIZE: "window-minimize",
  WINDOW_MAXIMIZE: "window-maximize",
  WINDOW_CLOSE: "window-close",
  OPEN_MINI_WIDGET: "open-mini-widget",
  CLOSE_MINI_WIDGET: "close-mini-widget",
  TOGGLE_ALWAYS_ON_TOP: "toggle-always-on-top",
  TOGGLE_RADIO_FROM_TRAY: "toggle-radio-from-tray",
  SYNC_RADIO_STATE: "sync-radio-state",
} as const;

export type IpcChannelType = (typeof IpcChannels)[keyof typeof IpcChannels];
