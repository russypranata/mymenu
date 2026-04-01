export default function AdminStoresLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-24 bg-gray-200 rounded-lg" />
        <div className="h-4 w-36 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-10 w-72 bg-gray-100 rounded-xl" />
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex gap-8">
          {['Nama Toko', 'Slug', 'Pemilik', 'Dibuat'].map(h => (
            <div key={h} className="h-3 w-20 bg-gray-100 rounded" />
          ))}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-8 border-b border-gray-50 last:border-0">
            <div className="h-4 w-36 bg-gray-200 rounded" />
            <div className="h-5 w-24 bg-gray-100 rounded-lg" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
