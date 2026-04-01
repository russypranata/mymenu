export default function MenuLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-10 w-32 bg-gray-200 rounded-xl" />
        <div className="h-10 w-32 bg-gray-200 rounded-xl" />
      </div>
      <div className="flex gap-3">
        <div className="flex-1 h-11 bg-gray-200 rounded-xl" />
        <div className="w-32 h-11 bg-gray-200 rounded-xl" />
        <div className="w-20 h-11 bg-gray-200 rounded-xl" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
            <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
