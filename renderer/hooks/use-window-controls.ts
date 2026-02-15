import { useState, useEffect } from "react";
import { IpcChannels } from "shared/constants";

export function useWindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Listen for state changes from main process
    if (!window.ipc) return;

    const removeListener = window.ipc.on(
      "window-state-change",
      (state: any) => {
        setIsMaximized(state === "maximized");
      },
    );

    return () => {
      removeListener();
    };
  }, []);

  const minimize = () => {
    window.ipc.send(IpcChannels.WINDOW_MINIMIZE, null);
  };

  const maximize = () => {
    window.ipc.send(IpcChannels.WINDOW_MAXIMIZE, null);
    // Note: The actual state will be updated via the IPC listener
  };

  const close = () => {
    window.ipc.send(IpcChannels.WINDOW_CLOSE, null);
  };

  return {
    isMaximized,
    minimize,
    maximize,
    close,
  };
}
