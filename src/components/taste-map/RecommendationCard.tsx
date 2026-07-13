import type { CSSProperties } from 'react'
import type { Restaurant } from '../../types/restaurant'

type RecommendationCardProps = {
  restaurant: Restaurant
  order: number
  onClick: () => void
}

const getPointClass = ([x, y]: Restaurant['position']) => (
  y > 0 ? (x < 0 ? 'point-violet' : 'point-orange') : (x < 0 ? 'point-green' : 'point-pink')
)

export function RecommendationCard({ restaurant, order, onClick }: RecommendationCardProps) {
  return (
    <button
      className="recommendation-card"
      onClick={onClick}
      style={{ '--card-delay': `${order * 55}ms` } as CSSProperties}
    >
      <span className={`card-order ${getPointClass(restaurant.position)}`}>{order}</span>
      <div className="card-content">
        <div className="card-title-row">
          <h3>{restaurant.name}</h3>
          {restaurant.hidden && <span className="hidden-badge">기록 없음</span>}
        </div>
        <span className="card-meta">
          {restaurant.category}{!restaurant.hidden && ` · 후기 ${restaurant.reviews}건`}
        </span>
        <p className="card-summary">“{restaurant.quote}”</p>
        <div className="card-keywords" aria-label="대표 특징">
          {restaurant.keywords.slice(0, 2).map((keyword) => <span key={keyword}>{keyword}</span>)}
        </div>
      </div>
      <svg className="card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
    </button>
  )
}
