import { LocationMap, TastePositionMap } from '../restaurant-detail'
import { getReviewEvidence } from '../../mocks/restaurants'
import type { Restaurant } from '../../types/restaurant'
import { getClosingPromotionalComment, getPromotionalComment } from '../../utils/tasteMap'

type RestaurantSidebarProps = {
  restaurant: Restaurant
  onBack: () => void
  onFindSimilar: () => void
}

const getPointClass = ([x, y]: Restaurant['position']) => (
  y >= 0 ? (x < 0 ? 'point-violet' : 'point-orange') : (x < 0 ? 'point-green' : 'point-pink')
)

const getPointColor = ([x, y]: Restaurant['position']) => (
  y >= 0 ? (x < 0 ? '#a99bf7' : '#f5946e') : (x < 0 ? '#63d5aa' : '#f28fb4')
)

const quadrantName = ([x, y]: Restaurant['position']) => (
  y >= 0 ? (x < 0 ? '느긋한 밥집' : '카페 같은 곳') : (x < 0 ? '가성비 혼밥' : '퀄리티 혼밥')
)

export function RestaurantSidebar({ restaurant, onBack, onFindSimilar }: RestaurantSidebarProps) {
  const evidence = getReviewEvidence(restaurant)
  const pointClass = getPointClass(restaurant.position)
  const pointColor = getPointColor(restaurant.position)
  const maxCount = Math.max(1, restaurant.keywords.length * 5)
  const promotionalComment = getPromotionalComment(restaurant)
  const closingPromotionalComment = getClosingPromotionalComment(restaurant)

  return (
    <div className="restaurant-sidebar">
      <div className="sidebar-scroll">
        <button className="sidebar-back" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          추천 5곳으로
        </button>

        <header className="sidebar-heading">
          <div>
            <span className={`sidebar-color-dot ${pointClass}`} />
            <h2>{restaurant.name}</h2>
          </div>
          <p>{restaurant.category} · 후기 {restaurant.reviews}건</p>
          <p className="detail-promo-comment">{promotionalComment}</p>
        </header>

        {restaurant.reviews < 40 && (
          <div className="sidebar-caution">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
            후기가 적어요. 취향 자리가 부정확할 수 있어요.
          </div>
        )}

        <section className="sidebar-section sidebar-position">
          <h3>이 골목에선 여기쯤이에요</h3>
          <div className="sidebar-map-pair">
            <div className="sidebar-map-panel">
              <TastePositionMap restaurant={restaurant} />
              <p className="quadrant-caption" style={{ color: pointColor }}>‘{quadrantName(restaurant.position)}’ 자리</p>
            </div>
            <div className="sidebar-map-panel sidebar-location-panel">
              <LocationMap restaurant={restaurant} />
              <p className="sidebar-address">{restaurant.address}</p>
              <p className="sidebar-location-note">골목 안쪽, 도보로 찾아가기 좋아요</p>
            </div>
          </div>
        </section>

        <section className="sidebar-section">
          <h3>이런 말이 자주 나와요</h3>
          <div className="mention-list">
            {restaurant.keywords.map((keyword, index) => {
              const count = Math.max(2, maxCount - index * 4)
              return (
                <div key={keyword} className="mention-item">
                  <p><span>{keyword}</span><span>{count}</span></p>
                  <div><i className={pointClass} style={{ width: `${Math.max(34, 100 - index * 24)}%` }} /></div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="sidebar-section">
          <h3>이 문장들 때문에 여기 있어요</h3>
          <div className="sidebar-snippets">
            {evidence.map(({ quote }) => <blockquote key={quote}>“{quote}”</blockquote>)}
          </div>
          <p className="snippet-source">네이버 블로그 후기</p>
        </section>

        <aside className="detail-closing-promo">
          <span>오늘의 골목 추천</span>
          <strong>{closingPromotionalComment}</strong>
        </aside>
      </div>

      <footer className="sidebar-actions">
        <button onClick={onFindSimilar}>여기랑 비슷한 집</button>
        <a href={`https://map.naver.com/p/search/${encodeURIComponent(`${restaurant.name} ${restaurant.address}`)}`} target="_blank" rel="noreferrer">길찾기</a>
      </footer>
    </div>
  )
}
