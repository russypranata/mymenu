export default function PublicMenuLoading() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] animate-pulse">

      {/* Floating navbar skeleton — matches fixed top-3 sm:top-4 with px-3 sm:px-4 lg:px-6 */}
      <div className="fixed top-3 sm:top-4 left-0 right-0 z-[100] px-3 sm:px-4 lg:px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto h-14 sm:h-16 bg-white/95 border border-slate-200/80 rounded-xl sm:rounded-2xl" />
      </div>

      {/* Hero skeleton — same px-3 sm:px-4 lg:px-6 + pt-20 sm:pt-24 as real hero */}
      <div className="px-3 sm:px-4 lg:px-6 pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto h-[260px] sm:h-[360px] bg-slate-200 rounded-2xl sm:rounded-3xl" />
      </div>

      {/* Content skeleton — same max-w-7xl + px as menu section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* Section title */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-slate-200 rounded-full" />
            <div className="h-6 w-32 bg-slate-200 rounded-lg" />
          </div>
          <div className="h-4 w-48 bg-slate-100 rounded-lg ml-4" />
        </div>

        {/* Search + filter row */}
        <div className="flex flex-col lg:flex-row gap-5 mb-10">
          <div className="h-12 w-full lg:max-w-sm bg-slate-200 rounded-2xl" />
          <div className="flex gap-2.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 w-20 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Menu items skeleton — list layout (default) */}
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-row rounded-xl border border-slate-100 overflow-hidden bg-white">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-200 flex-shrink-0" />
              <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-3">
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
                <div className="h-3 w-1/2 bg-slate-100 rounded" />
                <div className="h-4 w-20 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
