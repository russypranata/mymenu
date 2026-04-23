export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner placeholder */}
      <div className="h-16 bg-gray-100 rounded-2xl" />

      <div className="space-y-2">
        <div className="h-7 w-48 bg-gray-200 rounded-lg" />
        <div className="h-4 w-32 bg-gray-100 rounded-lg" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="space-y-3">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="space-y-1.5">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded-xl" />
        </div>
      ))}
    </div>
  )
}
