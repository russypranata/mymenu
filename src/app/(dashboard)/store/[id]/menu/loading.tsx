export default function MenuLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner placeholder */}
      <div className="h-16 bg-gray-100 rounded-2xl" />

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-24 bg-gray-200 rounded-lg" />
          <div className="h-4 w-40 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-xl" />
      </div>
      <div className="flex gap-2.5">
        <div className="h-10 flex-1 bg-gray-100 rounded-xl" />
        <div className="h-10 w-24 bg-gray-100 rounded-xl" />
        <div className="h-10 w-16 bg-gray-100 rounded-xl" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-100" />
              <div className="w-8 h-8 rounded-lg bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
