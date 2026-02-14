export function TitleBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-8 z-50 flex items-center justify-between px-2 w-full select-none app-drag-region bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border/40">
      {/* Window Controls (Mac-style for aesthetic) */}
      <div className="flex items-center gap-2 px-2 no-drag">
        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer shadow-sm transition-transform hover:scale-110" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer shadow-sm transition-transform hover:scale-110" />
        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer shadow-sm transition-transform hover:scale-110" />
      </div>
      <div className="text-xs text-muted-foreground font-medium font-sans opacity-70">
        الريّان
      </div>
      <div className="w-16" /> {/* Spacer to balance the layout */}
    </div>
  );
}
