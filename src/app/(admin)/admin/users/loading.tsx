export default function AdminUsersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-24 bg-gray-200 rounded-lg" />
        <div className="h-4 w-36 bg-gray-100 rounded-lg" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 w-64 bg-gray-100 rounded-xl" />
        <div className="h-10 w-36 bg-gray-100 rounded-xl" />
        <div className="h-10 w-36 bg-gray-100 rounded-xl" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex gap-8">
          {['Email', 'Nama', 'Status', 'Role', 'Bergabung', 'Aksi'].map(h => (
            <div key={h} className="h-3 w-16 bg-gray-100 rounded" />
          ))}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-8 border-b border-gray-50 last:border-0">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-100 rounded" />
            <div className="h-5 w-16 bg-gray-100 rounded-full" />
            <div className="h-5 w-12 bg-gray-100 rounded-full" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
            <div className="h-7 w-20 bg-gray-100 rounded-lg ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
