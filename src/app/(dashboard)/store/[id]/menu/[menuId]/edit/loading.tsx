export default function EditMenuLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-16 bg-gray-100 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-7 w-32 bg-gray-200 rounded-lg" />
        <div className="h-4 w-48 bg-gray-100 rounded" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-24 bg-gray-100 rounded" />
            <div className="h-11 bg-gray-100 rounded-xl" />
          </div>
        ))}
        <div className="h-10 w-28 bg-gray-200 rounded-xl ml-auto" />
      </div>
    </div>
  )
}
