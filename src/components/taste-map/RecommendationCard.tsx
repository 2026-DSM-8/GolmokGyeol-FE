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
      <div className="card-title-row">
        <span className={`card-swatch ${getPointClass(restaurant.position)}`} />
        <h3>{restaurant.name}</h3>
        <span className="card-meta">{restaurant.category} · 후기 {restaurant.reviews}건</span>
        {restaurant.hidden && <span className="hidden-badge">숨은 가게</span>}
      </div>
      <blockquote>“{restaurant.quote}”</blockquote>
    </button>
  )
}
