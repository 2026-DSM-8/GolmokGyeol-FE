import { Navigate, useNavigate, useParams } from 'react-router'
import { LocationMap, ReviewEvidence, TastePositionMap } from '../components/restaurant-detail'
import { getReviewEvidence, restaurants } from '../mocks/restaurants'
import { useTasteStore } from '../store/useTasteStore'
import { getClosingPromotionalComment, getPromotionalComment } from '../utils/tasteMap'

export function RestaurantDetailPage() {
  const navigate = useNavigate()
  const { restaurantId } = useParams()
  const setTaste = useTasteStore((state) => state.setTaste)
  const restaurant = restaurants.find((item) => item.id === Number(restaurantId))
  if (!restaurant) return <Navigate to="/taste-map" replace />
  const findSimilar = () => { setTaste(restaurant.position); navigate('/taste-map') }
  const evidence = getReviewEvidence(restaurant)
  const promotionalComment = getPromotionalComment(restaurant)
  const closingPromotionalComment = getClosingPromotionalComment(restaurant)

  return (
    <main className="detail-page">
      <div className="detail-container">
        <button className="detail-back-button" onClick={() => navigate('/taste-map')}><span>←</span> 지도로 돌아가기</button>
        <header className="detail-summary">
          <h1>{restaurant.name}</h1>
          <div className="detail-meta-row">
            <span>{restaurant.category} · 후기 {restaurant.reviews}건</span>
          </div>
          <p className="detail-promo-comment">{promotionalComment}</p>
          <div className="detail-keywords">
            {restaurant.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
          </div>
        </header>
        <ReviewEvidence evidence={evidence} />
        <section className="detail-map-grid" aria-label="취향 및 위치 정보">
          <TastePositionMap restaurant={restaurant} />
          <LocationMap restaurant={restaurant} />
        </section>
        <aside className="detail-closing-promo">
          <span>오늘의 골목 추천</span>
          <strong>{closingPromotionalComment}</strong>
        </aside>
        <div className="detail-actions">
          <button onClick={findSimilar}>여기랑 비슷한 집</button>
          <a href={`https://map.naver.com/p/search/${encodeURIComponent(`${restaurant.name} ${restaurant.address}`)}`} target="_blank" rel="noreferrer">길찾기</a>
        </div>
      </div>
    </main>
  )
}
