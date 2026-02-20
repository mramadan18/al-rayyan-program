import { useEffect } from "react";
import { IpcChannels } from "shared/constants";

export function useWindowZoom() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "=":
          case "+":
            e.preventDefault();
            window.ipc.send(IpcChannels.WINDOW_ZOOM_IN);
            break;
          case "-":
            e.preventDefault();
            window.ipc.send(IpcChannels.WINDOW_ZOOM_OUT);
            break;
          case "0":
            e.preventDefault();
            window.ipc.send(IpcChannels.WINDOW_ZOOM_RESET);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
