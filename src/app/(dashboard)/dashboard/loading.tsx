export default function DashboardLoading() {
  return (
    <div className="space-y-6 max-w-5xl animate-pulse">
      {/* Banner placeholder (trial / expire) */}
      <div className="h-16 bg-gray-100 rounded-2xl" />

      {/* Header */}
      <div className="space-y-2">
        <div className="h-4 w-36 bg-gray-100 rounded" />
        <div className="h-7 w-56 bg-gray-200 rounded-lg" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg mb-3" />
            <div className="h-3 w-20 bg-gray-100 rounded mb-2" />
            <div className="h-7 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Store list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-100 rounded" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-3 border-b border-gray-50 last:border-0">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            <div className="flex gap-1.5">
              <div className="w-16 h-7 bg-gray-100 rounded-lg" />
              <div className="w-8 h-7 bg-gray-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="h-20 bg-white rounded-2xl border border-gray-100" />
        <div className="h-20 bg-white rounded-2xl border border-gray-100" />
      </div>
    </div>
  )
}
