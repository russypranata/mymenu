export default function GuideLoading() {
  return (
    <div className="max-w-3xl space-y-8 animate-pulse">
      {/* Banner placeholder */}
      <div className="h-16 bg-gray-100 rounded-2xl" />

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-2xl flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-7 w-56 bg-gray-200 rounded-lg" />
          <div className="h-4 w-full bg-gray-100 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
            <div className="h-3 w-12 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-200 rounded-xl" />
            <div className="h-5 w-40 bg-gray-200 rounded" />
          </div>
          {[...Array(2)].map((_, j) => (
            <div key={j} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-3/4 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
