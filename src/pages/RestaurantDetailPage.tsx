import { Navigate, useNavigate, useParams } from 'react-router'
import { LocationMap, ReviewEvidence, TastePositionMap } from '../components/restaurant-detail'
import { getReviewEvidence, restaurants } from '../mocks/restaurants'
import { useTasteStore } from '../store/useTasteStore'
import { getPromotionalComment } from '../utils/tasteMap'

export function RestaurantDetailPage() {
  const navigate = useNavigate()
  const { restaurantId } = useParams()
  const setTaste = useTasteStore((state) => state.setTaste)
  const restaurant = restaurants.find((item) => item.id === Number(restaurantId))
  if (!restaurant) return <Navigate to="/taste-map" replace />
  const findSimilar = () => { setTaste(restaurant.position); navigate('/taste-map') }
  const evidence = getReviewEvidence(restaurant)
  const promotionalComment = getPromotionalComment(restaurant)

  return (
    <main className="detail-page">
      <div className="detail-container">
        <button className="detail-back-button" onClick={() => navigate('/taste-map')}><span>←</span> 지도로 돌아가기</button>
        <header className="detail-summary">
          <h1>{restaurant.name}</h1>
          <div className="detail-meta-row">
            <span>{restaurant.category} · {restaurant.hidden ? '기록 없음' : `후기 ${restaurant.reviews}건`}</span>
            {restaurant.hidden && <span className="hidden-badge">숨은 가게</span>}
          </div>
          <p className="detail-promo-comment">{promotionalComment}</p>
          <div className="detail-keywords">
            {restaurant.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
          </div>
        </header>
        {restaurant.hidden ? (
          <section className="detail-unrecorded-callout" aria-labelledby="detail-unrecorded-title">
            <p className="section-kicker">아직 기록 없음</p>
            <h2 id="detail-unrecorded-title">첫 번째 발견이 될 수 있어요</h2>
            <p>쌓인 후기가 없어 업종과 위치 정보를 바탕으로 지도에 표시했어요. 실제 경험은 직접 확인해 주세요.</p>
          </section>
        ) : (
          <ReviewEvidence evidence={evidence} />
        )}
        <section className="detail-map-grid" aria-label="취향 및 위치 정보">
          <TastePositionMap restaurant={restaurant} />
          <LocationMap restaurant={restaurant} />
        </section>
        <div className="detail-actions">
          <button onClick={findSimilar}>여기랑 비슷한 집</button>
          <a href={`https://map.naver.com/p/search/${encodeURIComponent(`${restaurant.name} ${restaurant.address}`)}`} target="_blank" rel="noreferrer">길찾기</a>
        </div>
      </div>
    </main>
  )
}
