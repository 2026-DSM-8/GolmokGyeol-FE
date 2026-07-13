import { LocationMap, ReviewEvidence, TastePositionMap } from '../restaurant-detail'
import { getReviewEvidence } from '../../mocks/restaurants'
import type { Restaurant } from '../../types/restaurant'

type RestaurantSidebarProps = {
  restaurant: Restaurant
  onBack: () => void
  onFindSimilar: () => void
}

export function RestaurantSidebar({ restaurant, onBack, onFindSimilar }: RestaurantSidebarProps) {
  const evidence = getReviewEvidence(restaurant)

  return (
    <div className="restaurant-sidebar">
      <button className="detail-back-button" onClick={onBack}><span>←</span> 추천 목록</button>
      <header className="detail-summary">
        <h1>{restaurant.name}</h1>
        <div className="detail-meta-row">
          <span>{restaurant.category} · 후기 {restaurant.reviews}건</span>
          {restaurant.hidden && <span className="hidden-badge">숨은 가게</span>}
        </div>
        <div className="detail-keywords">
          {restaurant.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
        </div>
      </header>
      <ReviewEvidence evidence={evidence} />
      <section className="detail-map-grid" aria-label="취향 및 위치 정보">
        <TastePositionMap restaurant={restaurant} />
        <LocationMap restaurant={restaurant} />
      </section>
      <div className="detail-actions">
        <button onClick={onFindSimilar}>여기랑 비슷한 집</button>
        <a href={`https://map.naver.com/p/search/${encodeURIComponent(`${restaurant.name} ${restaurant.address}`)}`} target="_blank" rel="noreferrer">길찾기</a>
      </div>
    </div>
  )
}
