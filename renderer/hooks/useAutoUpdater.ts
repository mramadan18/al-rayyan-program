import { useState, useEffect, useCallback } from "react";

export type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "not-available"
  | "downloading"
  | "downloaded"
  | "error";

export interface UpdateInfo {
  version: string;
  releaseDate?: string;
  releaseNotes?: string;
}

export interface DownloadProgress {
  percent: number;
  bytesPerSecond: number;
  transferred: number;
  total: number;
}

export function useAutoUpdater() {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    // Checking
    cleanups.push(
      window.ipc.on("update:checking", () => {
        setStatus("checking");
        setError(null);
      }),
    );

    // Available
    cleanups.push(
      window.ipc.on("update:available", (data: UpdateInfo) => {
        setStatus("available");
        setUpdateInfo(data);
        setIsModalOpen(true);
      }),
    );

    // Not available
    cleanups.push(
      window.ipc.on("update:not-available", () => {
        setStatus("not-available");
      }),
    );

    // Download progress
    cleanups.push(
      window.ipc.on("update:download-progress", (data: DownloadProgress) => {
        setStatus("downloading");
        setProgress(data);
      }),
    );

    // Downloaded
    cleanups.push(
      window.ipc.on("update:downloaded", (data: { version: string }) => {
        setStatus("downloaded");
        setUpdateInfo((prev) =>
          prev ? { ...prev, version: data.version } : { version: data.version },
        );
        setProgress(null);
      }),
    );

    // Error
    cleanups.push(
      window.ipc.on("update:error", (data: { message: string }) => {
        setStatus("error");
        setError(data.message);
      }),
    );

    // Manual check from Tray
    cleanups.push(
      window.ipc.on("update:check-from-tray", () => {
        window.ipc.invoke("update:check");
      }),
    );

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  const checkForUpdate = useCallback(() => {
    window.ipc.invoke("update:check");
  }, []);

  const startDownload = useCallback(() => {
    setStatus("downloading");
    setProgress({ percent: 0, bytesPerSecond: 0, transferred: 0, total: 0 });
    window.ipc.invoke("update:start-download");
  }, []);

  const restartAndInstall = useCallback(() => {
    window.ipc.invoke("update:restart-and-install");
  }, []);

  const dismissModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    status,
    updateInfo,
    progress,
    error,
    isModalOpen,
    checkForUpdate,
    startDownload,
    restartAndInstall,
    dismissModal,
  };
}
