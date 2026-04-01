export default function AdminOverviewLoading() {
  return (
    <div className="space-y-6 max-w-5xl animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-32 bg-gray-200 rounded-lg" />
        <div className="h-4 w-40 bg-gray-100 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg mb-3" />
            <div className="h-3 w-20 bg-gray-100 rounded mb-2" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
