import { useState, useEffect } from "react";

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
    window.ipc.send("window-minimize", null);
  };

  const maximize = () => {
    window.ipc.send("window-maximize", null);
    // Note: The actual state will be updated via the IPC listener
  };

  const close = () => {
    window.ipc.send("window-close", null);
  };

  return {
    isMaximized,
    minimize,
    maximize,
    close,
  };
}
