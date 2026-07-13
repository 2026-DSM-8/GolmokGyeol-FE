import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { MapQueryHeader, RecommendationCard, RestaurantSidebar, TasteMap } from '../components/taste-map'
import { useTasteRecommendations } from '../hooks/useTasteRecommendations'
import { useTasteStore } from '../store/useTasteStore'
import type { Restaurant } from '../types/restaurant'

export function TasteMapPage() {
  const navigate = useNavigate()
  const query = useTasteStore((state) => state.query)
  const taste = useTasteStore((state) => state.taste)
  const setTaste = useTasteStore((state) => state.setTaste)
  const searchScope = useTasteStore((state) => state.searchScope)
  const recommendations = useTasteRecommendations(taste)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1200)
    return () => window.clearTimeout(timer)
  }, [])
  const openRestaurant = (restaurant: Restaurant) => setSelectedRestaurant(restaurant)
  const findSimilar = (restaurant: Restaurant) => { setTaste(restaurant.position); setSelectedRestaurant(null) }
  const locationName = searchScope.neighborhood || '태평동'

  return (
    <main className="map-page">
      <MapQueryHeader
        locationName={locationName}
        query={query}
        onBack={() => navigate('/search')}
      />
      <div className="map-result-summary">
        <p>조용히 혼자 먹기 좋은 집 <strong>23곳</strong>을 찾았어요. 이 안에서도 갈려요 → <span>후딱 먹기 ↔ 오래 머물기</span></p>
      </div>
      <section className="map-layout">
        <div className="map-column">
          <TasteMap taste={taste} onTasteChange={setTaste} recommendations={recommendations} onOpenRestaurant={openRestaurant} loading={loading} />
        </div>
        <aside className="recommendation-rail" aria-label={selectedRestaurant ? `${selectedRestaurant.name} 상세 정보` : '취향과 가까운 추천 식당'}>
          {selectedRestaurant ? (
            <RestaurantSidebar
              restaurant={selectedRestaurant}
              onBack={() => setSelectedRestaurant(null)}
              onFindSimilar={() => findSimilar(selectedRestaurant)}
            />
          ) : (
            <div className="recommendation-overview">
              <h2>이 자리에 가까운 곳</h2>
              <p className="recommendation-help">점을 살살 밀어보세요. 순서가 바뀌어요.</p>
              <div className="recommendation-list">{recommendations.map((restaurant, index) => <RecommendationCard key={restaurant.id} restaurant={restaurant} order={index + 1} onClick={() => openRestaurant(restaurant)} />)}</div>
              <p className="recommendation-note">별점도 랭킹도 없어요. 당신 자리에 가까운 순서일 뿐이에요.</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  )
}
