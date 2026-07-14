import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { MapQueryHeader, RecommendationCard, RestaurantSidebar, TasteMap } from '../components/taste-map'
import { useTasteStore } from '../store/useTasteStore'
import type { Restaurant } from '../types/restaurant'
import { getRecommendations } from '../utils/tasteMap'

export function TasteMapPage() {
  const navigate = useNavigate()
  const query = useTasteStore((state) => state.query)
  const taste = useTasteStore((state) => state.taste)
  const setTaste = useTasteStore((state) => state.setTaste)
  const searchScope = useTasteStore((state) => state.searchScope)
  const mapResult = useTasteStore((state) => state.mapResult)
  const recommendationIds = useTasteStore((state) => state.recommendationIds)
  const setRecommendationIds = useTasteStore((state) => state.setRecommendationIds)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  if (!mapResult) return <Navigate to="/search" replace />

  const nearbyRestaurants = getRecommendations(mapResult.restaurants, taste, 5)
  const prioritizedRestaurants = recommendationIds
    ?.map((id) => mapResult.restaurants.find((restaurant) => restaurant.id === id))
    .filter((restaurant): restaurant is Restaurant => Boolean(restaurant)) ?? []
  const recommendations = [
    ...prioritizedRestaurants,
    ...nearbyRestaurants.filter((restaurant) => !recommendationIds?.includes(restaurant.id)),
  ].slice(0, 5)

  const openRestaurant = (restaurant: Restaurant) => setSelectedRestaurant(restaurant)
  const moveTaste = (point: [number, number]) => {
    setTaste(point)
    setRecommendationIds(null)
  }
  const findSimilar = (restaurant: Restaurant) => {
    setTaste(restaurant.position)
    setRecommendationIds(null)
    setSelectedRestaurant(null)
  }

  return (
    <Page>
      <MapQueryHeader
        locationName={searchScope.neighborhood}
        query={query}
        onBack={() => navigate('/search')}
      />
      <ResultSummary>
        <p>{mapResult.banner.label} <strong>{mapResult.banner.count}곳</strong>을 찾았어요. 이 안에서도 갈려요 → <span>{mapResult.banner.axisText}</span></p>
      </ResultSummary>
      <Layout>
        <MapColumn>
          <TasteMap
            taste={taste}
            onTasteChange={moveTaste}
            recommendations={recommendations}
            restaurants={mapResult.restaurants}
            axes={mapResult.axes}
            quadrants={mapResult.quadrants}
            onOpenRestaurant={openRestaurant}
            onMapBackgroundClick={() => setSelectedRestaurant(null)}
          />
        </MapColumn>
        <RecommendationRail aria-label={selectedRestaurant ? `${selectedRestaurant.name} 상세 정보` : '취향과 가까운 추천 식당'}>
          {selectedRestaurant ? (
            <RestaurantSidebar
              restaurant={selectedRestaurant}
              onBack={() => setSelectedRestaurant(null)}
              onFindSimilar={() => findSimilar(selectedRestaurant)}
              quadrants={mapResult.quadrants}
            />
          ) : (
            <RecommendationOverview>
              <h2>이 자리에 가까운 곳</h2>
              <Help>노란 점을 옮기면 가까운 식당 5곳이 바뀌어요.</Help>
              <RecommendationList>{recommendations.map((restaurant, index) => <RecommendationCard key={restaurant.id} restaurant={restaurant} order={index + 1} query={query} onClick={() => openRestaurant(restaurant)} />)}</RecommendationList>
              <Note>별점도 랭킹도 없어요. 당신 자리에 가까운 순서일 뿐이에요.</Note>
            </RecommendationOverview>
          )}
        </RecommendationRail>
      </Layout>
    </Page>
  )
}

const Page = styled.main`
  display: flex; flex-direction: column; width: 100%; height: 100dvh; min-height: 640px; overflow: hidden;
  color: var(--ink); background: var(--background);
  @media (max-width: 900px) { height: auto; min-height: 100vh; overflow: visible; }
`
const ResultSummary = styled.div`
  display: flex; flex: none; align-items: center; min-height: 48px; padding: 12px 20px;
  border-bottom: 1px solid var(--line); background: var(--card);
  p { margin: 0; color: var(--sub); font-size: 15px; line-height: 1.5; letter-spacing: -.01em; }
  strong, span { color: var(--ink); font-weight: 400; }
  @media (max-width: 640px) { padding: 10px 14px; p { font-size: 13px; } }
`
const Layout = styled.section`
  display: grid; flex: 1; grid-template-columns: auto minmax(440px, 1fr); align-items: stretch; width: 100%; min-height: 0;
  @media (max-width: 900px) { display: flex; flex-direction: column; }
`
const MapColumn = styled.div`
  display: flex; align-items: flex-start; justify-content: flex-start; width: min(calc(100dvh - 104px), calc(100vw - 440px));
  min-width: 0; min-height: 0; overflow: hidden; background: var(--background);
  @media (max-width: 900px) { width: 100%; }
`
const RecommendationRail = styled.aside`
  min-width: 0; min-height: 0; height: 100%; overflow-y: auto; border-left: 1px solid var(--line);
  background: var(--background); scrollbar-width: thin; scrollbar-color: var(--line) transparent;
  @media (max-width: 900px) { width: 100%; height: auto; overflow: visible; border-top: 1px solid var(--line); border-left: 0; }
`
const RecommendationOverview = styled.div`
  min-height: 100%; padding: 32px 28px;
  h2 { margin: 0; font-size: 20px; font-weight: 500; line-height: 1.4; letter-spacing: -.01em; }
  @media (max-width: 640px) { padding: 24px 18px 32px; }
`
const Help = styled.p`margin: 8px 0 0; color: var(--muted); font-size: 13px; line-height: 1.5;`
const RecommendationList = styled.div`display: flex; flex-direction: column; gap: 10px; margin-top: 24px;`
const Note = styled.p`margin: 28px 0 0; padding-top: 20px; border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; line-height: 1.6;`
import styled from '@emotion/styled'
