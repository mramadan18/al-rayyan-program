"use client";

import React from "react";
import { Download, RefreshCw, Sparkles, AlertCircle, X } from "lucide-react";
import { useAutoUpdater, type UpdateStatus } from "@/hooks/useAutoUpdater";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/**
 * Formats bytes to a human-readable string (e.g., 1.5 MB).
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 ب";
  const units = ["ب", "ك.ب", "م.ب", "ج.ب"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Auto-update modal component.
 * Renders as a dialog overlay following Al Rayyan dark/orange theme.
 */
export function UpdateModal() {
  const {
    status,
    updateInfo,
    progress,
    error,
    isModalOpen,
    startDownload,
    restartAndInstall,
    dismissModal,
  } = useAutoUpdater();

  // Don't render if nothing to show
  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && dismissModal()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md border-primary/20 bg-card/95 backdrop-blur-xl overflow-hidden"
      >
        {/* Decorative glow effect */}
        <div className="absolute -top-24 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button (only when not downloading) */}
        {status !== "downloading" && (
          <button
            onClick={dismissModal}
            className="absolute top-3 end-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors z-10"
          >
            <X className="size-4" />
          </button>
        )}

        <DialogHeader className="relative z-10 items-center gap-3 pt-2">
          <UpdateIcon status={status} />
          <DialogTitle className="text-xl font-bold">
            <UpdateTitle status={status} />
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            <UpdateDescription
              status={status}
              version={updateInfo?.version}
              error={error}
            />
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 flex flex-col gap-4 pt-2">
          {/* Download Progress */}
          {status === "downloading" && progress && (
            <div className="space-y-2">
              <Progress
                value={progress.percent}
                className="h-3 bg-primary/10"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progress.percent.toFixed(0)}%</span>
                <span>
                  {formatBytes(progress.transferred)} /{" "}
                  {formatBytes(progress.total)}
                </span>
                <span>{formatBytes(progress.bytesPerSecond)}/ث</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <UpdateActions
            status={status}
            onDownload={startDownload}
            onRestart={restartAndInstall}
            onDismiss={dismissModal}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Sub-components ────────────────────────────

function UpdateIcon({ status }: { status: UpdateStatus }) {
  const baseClasses = "size-14 p-3 rounded-2xl";

  switch (status) {
    case "available":
      return (
        <div
          className={`${baseClasses} bg-primary/10 text-primary animate-pulse`}
        >
          <Sparkles className="size-full" />
        </div>
      );
    case "downloading":
      return (
        <div className={`${baseClasses} bg-primary/10 text-primary`}>
          <Download className="size-full animate-bounce" />
        </div>
      );
    case "downloaded":
      return (
        <div className={`${baseClasses} bg-emerald-500/10 text-emerald-500`}>
          <RefreshCw className="size-full" />
        </div>
      );
    case "error":
      return (
        <div
          className={`${baseClasses} bg-destructive/10 text-destructive-foreground`}
        >
          <AlertCircle className="size-full" />
        </div>
      );
    default:
      return null;
  }
}

function UpdateTitle({ status }: { status: UpdateStatus }) {
  switch (status) {
    case "available":
      return <>تحديث جديد متاح! ✨</>;
    case "downloading":
      return <>جارٍ التحميل...</>;
    case "downloaded":
      return <>التحديث جاهز للتثبيت</>;
    case "error":
      return <>حدث خطأ</>;
    default:
      return null;
  }
}

function UpdateDescription({
  status,
  version,
  error,
}: {
  status: UpdateStatus;
  version?: string;
  error?: string | null;
}) {
  switch (status) {
    case "available":
      return (
        <>
          الإصدار <span className="text-primary font-bold">{version}</span> متاح
          الآن. هل تريد تحميله؟
        </>
      );
    case "downloading":
      return <>يتم تحميل التحديث، يرجى الانتظار...</>;
    case "downloaded":
      return (
        <>
          تم تحميل الإصدار{" "}
          <span className="text-primary font-bold">{version}</span> بنجاح. أعد
          تشغيل التطبيق لتطبيق التحديث.
        </>
      );
    case "error":
      return (
        <span className="text-destructive-foreground">
          {error || "حدث خطأ غير متوقع أثناء التحديث."}
        </span>
      );
    default:
      return null;
  }
}

function UpdateActions({
  status,
  onDownload,
  onRestart,
  onDismiss,
}: {
  status: UpdateStatus;
  onDownload: () => void;
  onRestart: () => void;
  onDismiss: () => void;
}) {
  switch (status) {
    case "available":
      return (
        <div className="flex gap-2">
          <Button
            onClick={onDownload}
            className="flex-1 gap-2 h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
          >
            <Download className="size-5" />
            تحميل الآن
          </Button>
          <Button variant="outline" onClick={onDismiss} className="h-11 px-5">
            لاحقاً
          </Button>
        </div>
      );
    case "downloaded":
      return (
        <div className="flex gap-2">
          <Button
            onClick={onRestart}
            className="flex-1 gap-2 h-11 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-shadow"
          >
            <RefreshCw className="size-5" />
            إعادة التشغيل والتثبيت
          </Button>
          <Button variant="outline" onClick={onDismiss} className="h-11 px-5">
            لاحقاً
          </Button>
        </div>
      );
    case "error":
      return (
        <Button variant="outline" onClick={onDismiss} className="w-full h-11">
          إغلاق
        </Button>
      );
    default:
      return null;
  }
}
