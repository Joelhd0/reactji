import { useEffect, useRef } from 'react'
import './LoadMore.css'

export default function LoadMore({ onLoadMore, hasMore, loading }) {
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) onLoadMore()
      },
      { threshold: 0.1, rootMargin: '200px' }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore])

  if (!hasMore && !loading) return null

  return (
    <div className="load-more-area" ref={sentinelRef}>
      {loading && <div className="spinner" />}
    </div>
  )
}
