export default function StoreLoading() {
  return (
    <div className="space-y-6 max-w-4xl animate-pulse">
      {/* Banner placeholder */}
      <div className="h-16 bg-gray-100 rounded-2xl" />

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 bg-gray-200 rounded-lg" />
          <div className="h-4 w-24 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-xl" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-3.5 border-b border-gray-50 bg-gray-50/50">
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
            <div className="w-7 h-7 rounded-full bg-gray-100" />
            <div className="w-12 h-12 rounded-xl bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="w-8 h-8 rounded-lg bg-gray-100" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
