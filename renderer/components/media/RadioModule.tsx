import { useRadioContext } from "@/contexts/radio-context";
import { RadioSearch } from "./radio/RadioSearch";
import { RadioGrid } from "./radio/RadioGrid";
import { RadioPlayerBar } from "./radio/RadioPlayerBar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function RadioModule() {
  const {
    radios,
    currentRadio,
    setCurrentRadio,
    isPlaying,
    searchTerm,
    setSearchTerm,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    selectedCategory,
    setSelectedCategory,
    togglePlay,
    filteredRadios,
  } = useRadioContext();

  const cairoRadio = radios.find((r) => r.id === "cairo_quran_fm");
  const gridRadios = filteredRadios.filter((r) => r.id !== "cairo_quran_fm");

  const categories = [
    { id: "all", name: "الكل" },
    { id: "reciters", name: "القراء" },
    { id: "tafsir", name: "التفسير والحديث" },
    { id: "azkar", name: "الأذكار والرقية" },
    { id: "general", name: "متنوعة" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full" dir="rtl">
      {/* Featured Station (Cairo Quran FM) */}
      {cairoRadio && (
        <div className="mb-6 animate-in slide-in-from-top duration-500">
          <div
            onClick={() => setCurrentRadio(cairoRadio)}
            className={`
              relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 group
              ${
                currentRadio?.id === cairoRadio.id
                  ? "border-amber-500/50 bg-amber-500/10 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]"
                  : "border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-amber-500/30"
              }
            `}
          >
            {/* Animated Background Gradient for Active State */}
            {currentRadio?.id === cairoRadio.id && isPlaying && (
              <div className="absolute inset-0 bg-linear-to-r from-amber-500/10 via-transparent to-amber-500/5 animate-pulse pointer-events-none" />
            )}

            <div className="flex items-center justify-between p-6 relative z-10">
              <div className="flex items-center gap-6">
                {/* Icon Container */}
                <div
                  className={`
                  w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                  ${
                    currentRadio?.id === cairoRadio.id
                      ? "bg-amber-500 text-slate-950 scale-110"
                      : "bg-slate-800 text-slate-400 group-hover:bg-amber-500/20 group-hover:text-amber-500"
                  }
                `}
                >
                  {currentRadio?.id === cairoRadio.id && isPlaying ? (
                    <div className="flex gap-1.5 h-6 items-end justify-center">
                      <span className="w-1.5 bg-current animate-bounce h-3"></span>
                      <span className="w-1.5 bg-current animate-[bounce_1.2s_infinite] h-6"></span>
                      <span className="w-1.5 bg-current animate-[bounce_0.8s_infinite] h-4"></span>
                    </div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-8 h-8"
                    >
                      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
                    </svg>
                  )}
                </div>

                {/* Text Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 flex items-center gap-1 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      بث مباشر
                    </span>
                    {currentRadio?.id === cairoRadio.id && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold border border-amber-500/30">
                        جاري التشغيل
                      </span>
                    )}
                  </div>
                  <h2
                    className={`text-2xl font-bold font-cairo ${
                      currentRadio?.id === cairoRadio.id
                        ? "text-amber-500"
                        : "text-white group-hover:text-amber-400"
                    }`}
                  >
                    {cairoRadio.name}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    إذاعة القرآن الكريم من القاهرة - بث حي ومباشر 24 ساعة
                  </p>
                </div>
              </div>

              {/* Play Button Visual (Optional) */}
              <div
                className={`
                w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${
                  currentRadio?.id === cairoRadio.id
                    ? "border-amber-500 text-amber-500 opacity-100"
                    : "border-slate-700 text-slate-700 opacity-0 group-hover:opacity-100 group-hover:border-amber-500/50 group-hover:text-amber-500/50"
                }
              `}
              >
                {currentRadio?.id === cairoRadio.id && isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 ml-1"
                  >
                    <path d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Categories Section */}
      <div className="space-y-4 mb-6">
        <RadioSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <Tabs
          defaultValue="all"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
          dir="rtl"
        >
          <TabsList className="bg-slate-900/50 border border-slate-800 p-1 h-auto flex flex-wrap justify-center gap-1 mx-auto">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="rounded-lg px-6 py-2 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 text-slate-400 hover:text-white transition-all"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Stations Grid */}
      <RadioGrid
        radios={gridRadios}
        currentRadio={currentRadio}
        isPlaying={isPlaying}
        onSelect={setCurrentRadio}
      />

      {/* Sticky Player Bar */}
      {currentRadio && (
        <RadioPlayerBar
          currentRadio={currentRadio}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          volume={volume}
          setVolume={setVolume}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      )}
    </div>
  );
}
