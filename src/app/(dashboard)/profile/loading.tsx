function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      {children}
    </div>
  )
}

function SkeletonBox({ className }: { className: string }) {
  return <div className={`bg-gray-100 rounded-lg animate-pulse ${className}`} />
}

export default function ProfileLoading() {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Banner placeholder */}
      <div className="h-16 bg-gray-100 rounded-2xl animate-pulse" />

        {/* Avatar form skeleton */}
        <SkeletonCard>
          <div className="space-y-1">
            <SkeletonBox className="w-32 h-5" />
            <SkeletonBox className="w-56 h-4" />
          </div>
          <div className="flex items-center gap-5">
            <SkeletonBox className="w-20 h-20 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBox className="w-24 h-4" />
              <SkeletonBox className="w-full h-10 rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <SkeletonBox className="w-28 h-10 rounded-xl" />
          </div>
        </SkeletonCard>

        {/* Profile form skeleton */}
        <SkeletonCard>
          <div className="space-y-1">
            <SkeletonBox className="w-36 h-5" />
            <SkeletonBox className="w-64 h-4" />
          </div>
          <div className="space-y-2">
            <SkeletonBox className="w-28 h-4" />
            <SkeletonBox className="w-full h-11 rounded-xl" />
            <SkeletonBox className="w-20 h-3" />
          </div>
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <SkeletonBox className="w-36 h-10 rounded-xl" />
          </div>
        </SkeletonCard>

        {/* Email form skeleton */}
        <SkeletonCard>
          <div className="space-y-1">
            <SkeletonBox className="w-32 h-5" />
            <SkeletonBox className="w-72 h-4" />
          </div>
          <div className="space-y-2">
            <SkeletonBox className="w-28 h-4" />
            <SkeletonBox className="w-full h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <SkeletonBox className="w-20 h-4" />
            <SkeletonBox className="w-full h-11 rounded-xl" />
          </div>
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <SkeletonBox className="w-28 h-10 rounded-xl" />
          </div>
        </SkeletonCard>

        {/* Password form skeleton */}
        <SkeletonCard>
          <div className="space-y-1">
            <SkeletonBox className="w-32 h-5" />
            <SkeletonBox className="w-48 h-4" />
          </div>
          <div className="space-y-2">
            <SkeletonBox className="w-28 h-4" />
            <SkeletonBox className="w-full h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <SkeletonBox className="w-36 h-4" />
            <SkeletonBox className="w-full h-11 rounded-xl" />
          </div>
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <SkeletonBox className="w-32 h-10 rounded-xl" />
          </div>
        </SkeletonCard>

        {/* Delete account skeleton */}
        <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
          <div className="flex items-start gap-4">
            <SkeletonBox className="w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBox className="w-24 h-5" />
              <SkeletonBox className="w-full h-4" />
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-red-50">
            <SkeletonBox className="w-28 h-10 rounded-xl" />
          </div>
        </div>

    </div>
  )
}
