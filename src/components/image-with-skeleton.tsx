'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  className?: string
  quality?: number
  priority?: boolean
  loading?: 'eager' | 'lazy'
  skeletonClassName?: string
}

export function ImageWithSkeleton({
  src, alt, fill, width, height, sizes, className, quality, priority, loading, skeletonClassName,
}: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full h-full">
      {/* Skeleton shimmer */}
      {!loaded && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse rounded-inherit ${skeletonClassName ?? ''}`} />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        className={`${className ?? ''} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        quality={quality}
        priority={priority}
        loading={loading}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
