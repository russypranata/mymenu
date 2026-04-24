/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or Upstash
 */

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  maxRequests: number // Max requests per interval
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

const cache = new Map<string, RateLimitEntry>()

/**
 * Rate limit a request by identifier (e.g., IP address, user ID)
 * 
 * @param identifier - Unique identifier for the requester
 * @param config - Rate limit configuration
 * @returns Object with success status and remaining requests
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { interval: 60000, maxRequests: 10 }
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = cache.get(identifier)

  // Clean up expired entries periodically
  if (cache.size > 10000) {
    for (const [key, value] of cache.entries()) {
      if (value.resetTime < now) {
        cache.delete(key)
      }
    }
  }

  // No entry or expired entry
  if (!entry || entry.resetTime < now) {
    const resetTime = now + config.interval
    cache.set(identifier, { count: 1, resetTime })
    return { success: true, remaining: config.maxRequests - 1, resetTime }
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    return { success: false, remaining: 0, resetTime: entry.resetTime }
  }

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Get rate limit headers for API responses
 */
export function getRateLimitHeaders(
  result: ReturnType<typeof rateLimit>,
  config: RateLimitConfig
) {
  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  }
}

/**
 * Example usage in API route:
 * 
 * const ip = request.headers.get('x-forwarded-for') || 'unknown'
 * const result = rateLimit(ip, { interval: 60000, maxRequests: 10 })
 * 
 * if (!result.success) {
 *   return new Response('Too many requests', {
 *     status: 429,
 *     headers: getRateLimitHeaders(result, config)
 *   })
 * }
 */
