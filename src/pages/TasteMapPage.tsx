import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { MapQueryHeader, RecommendationCard, RestaurantSidebar, TasteMap } from '../components/taste-map'
import { useTasteStore } from '../store/useTasteStore'
import type { Restaurant } from '../types/restaurant'
import { trackEvent } from '../utils/analytics'
import { getRecommendations } from '../utils/tasteMap'

type SimilarOrigin = Pick<Restaurant, 'id' | 'name'>

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
  const [coachActive, setCoachActive] = useState(false)
  const [mobileView, setMobileView] = useState<'map' | 'recommendations'>('map')
  const [similarOrigin, setSimilarOrigin] = useState<SimilarOrigin | null>(null)
  const tasteEventStateRef = useRef<{ sessionId: string; taste: [number, number] } | null>(null)

  useEffect(() => {
    if (!mapResult) {
      tasteEventStateRef.current = null
      return
    }
    const previous = tasteEventStateRef.current
    if (!previous || previous.sessionId !== mapResult.sessionId) {
      tasteEventStateRef.current = { sessionId: mapResult.sessionId, taste }
      return
    }
    if (previous.taste[0] === taste[0] && previous.taste[1] === taste[1]) {
      return
    }

    const timer = window.setTimeout(() => {
      trackEvent({
        event: 'taste_changed',
        sessionId: mapResult.sessionId,
        x: taste[0],
        y: taste[1],
      })
      tasteEventStateRef.current = { sessionId: mapResult.sessionId, taste }
    }, 400)
    return () => window.clearTimeout(timer)
  }, [mapResult, taste])

  if (!mapResult) return <Navigate to="/search" replace />

  const recommendationPool = similarOrigin
    ? mapResult.restaurants.filter((restaurant) => restaurant.id !== similarOrigin.id)
    : mapResult.restaurants
  const nearbyRestaurants = getRecommendations(recommendationPool, taste, 5)
  const prioritizedRestaurants = recommendationIds
    ?.map((id) => mapResult.restaurants.find((restaurant) => restaurant.id === id))
    .filter((restaurant): restaurant is Restaurant => (
      restaurant !== undefined && restaurant.id !== similarOrigin?.id
    )) ?? []
  const recommendations = [
    ...prioritizedRestaurants,
    ...nearbyRestaurants.filter((restaurant) => !recommendationIds?.includes(restaurant.id)),
  ].slice(0, 5)
  const openRestaurant = (restaurant: Restaurant) => {
    trackEvent({
      event: 'restaurant_open',
      sessionId: mapResult.sessionId,
      restaurantId: restaurant.id,
    })
    setSelectedRestaurant(restaurant)
    setMobileView('recommendations')
  }
  const directionsClick = (restaurant: Restaurant) => trackEvent({
    event: 'directions_click',
    sessionId: mapResult.sessionId,
    restaurantId: restaurant.id,
  })
  const moveTaste = (point: [number, number]) => {
    setTaste(point)
    setRecommendationIds(null)
    setSimilarOrigin(null)
  }
  const findSimilar = (restaurant: Restaurant) => {
    setTaste(restaurant.position)
    setRecommendationIds(null)
    setSimilarOrigin({ id: restaurant.id, name: restaurant.name })
    setSelectedRestaurant(null)
    setMobileView('recommendations')
  }
  const searchAgain = (nextQuery: string) => {
    navigate('/search', { state: { autoSearchQuery: nextQuery } })
  }

  return (
    <Page>
      <MapQueryHeader
        locationName={searchScope.neighborhood}
        query={query}
        onBack={() => navigate('/search')}
        onSearch={searchAgain}
        onRestart={() => navigate('/')}
      />
      <ResultSummary>
        <p>
          취향에 맞는 <strong>{mapResult.banner.count}곳</strong>을 찾았어요.
          {mapResult.banner.hidden > 0 && <> 후기 정보가 적은 가게 <strong>{mapResult.banner.hidden}곳</strong>도 함께 살펴볼 수 있어요.</>}
        </p>
      </ResultSummary>
      <MobileViewTabs role="tablist" aria-label="지도 결과 보기">
        <MobileViewTab
          id="taste-map-tab"
          type="button"
          role="tab"
          aria-selected={mobileView === 'map'}
          aria-controls="taste-map-panel"
          $active={mobileView === 'map'}
          onClick={() => setMobileView('map')}
        >
          지도
        </MobileViewTab>
        <MobileViewTab
          id="recommendation-tab"
          type="button"
          role="tab"
          aria-selected={mobileView === 'recommendations'}
          aria-controls="recommendation-panel"
          $active={mobileView === 'recommendations'}
          onClick={() => setMobileView('recommendations')}
        >
          추천 5곳
        </MobileViewTab>
      </MobileViewTabs>
      <Layout>
        <MapColumn id="taste-map-panel" role="tabpanel" aria-labelledby="taste-map-tab" $mobileView={mobileView}>
          <TasteMap
            taste={taste}
            onTasteChange={moveTaste}
            recommendations={recommendations}
            restaurants={mapResult.restaurants}
            axes={mapResult.axes}
            quadrants={mapResult.quadrants}
            onOpenRestaurant={openRestaurant}
            onMapBackgroundClick={() => setSelectedRestaurant(null)}
            onCoachActiveChange={setCoachActive}
          />
        </MapColumn>
        <RecommendationRail
          id="recommendation-panel"
          role="tabpanel"
          aria-labelledby="recommendation-tab"
          $dimmed={coachActive}
          $mobileView={mobileView}
          aria-hidden={coachActive || undefined}
          inert={coachActive}
          aria-label={selectedRestaurant ? `${selectedRestaurant.name} 상세 정보` : '취향과 가까운 추천 식당'}
        >
          {selectedRestaurant ? (
            <RestaurantSidebar
              restaurant={selectedRestaurant}
              onBack={() => setSelectedRestaurant(null)}
              onFindSimilar={() => findSimilar(selectedRestaurant)}
              onDirectionsClick={() => directionsClick(selectedRestaurant)}
              quadrants={mapResult.quadrants}
            />
          ) : (
            <RecommendationOverview>
              <h2>{similarOrigin ? `${similarOrigin.name}과 비슷한 가게` : '이 자리에 가까운 곳'}</h2>
              <Help>
                {similarOrigin
                  ? '취향 지도에서 가까운 다른 가게를 보여드려요.'
                  : '노란 점을 옮기면 가까운 식당 5곳이 바뀌어요.'}
              </Help>
              <RecommendationList>{recommendations.map((restaurant, index) => <RecommendationCard key={restaurant.id} restaurant={restaurant} rank={index + 1} query={query} sessionId={mapResult.sessionId} onClick={() => openRestaurant(restaurant)} />)}</RecommendationList>
            </RecommendationOverview>
          )}
        </RecommendationRail>
      </Layout>
    </Page>
  )
}

const Page = styled.main`
  display: flex; flex-direction: column; width: 100%; height: 100dvh; min-height: 0; overflow: hidden;
  color: var(--ink); background: var(--background); overscroll-behavior: none;
`
const ResultSummary = styled.div`
  display: flex; flex: none; align-items: center; min-height: 48px; padding: 12px 20px;
  border-bottom: 1px solid var(--line); background: var(--card);
  p { margin: 0; color: var(--sub); font-size: 15px; line-height: 1.5; letter-spacing: -.01em; }
  strong, span { color: var(--ink); font-weight: 400; }
  @media (max-width: 640px) { padding: 10px 14px; p { font-size: 13px; } }
`
const MobileViewTabs = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: grid; flex: none; grid-template-columns: repeat(2, minmax(0, 1fr)); height: 44px;
    border-bottom: 1px solid var(--line); background: var(--card);
  }
`
const MobileViewTab = styled.button<{ $active: boolean }>`
  position: relative; border: 0; color: ${({ $active }) => $active ? 'var(--ink)' : 'var(--muted)'};
  background: transparent; font: inherit; font-size: 13px; cursor: pointer;
  &::after {
    content: ''; position: absolute; right: 18px; bottom: 0; left: 18px; height: 2px;
    border-radius: 2px 2px 0 0; background: var(--accent); opacity: ${({ $active }) => $active ? 1 : 0};
  }
  &:focus-visible { outline: 2px solid var(--accent); outline-offset: -3px; }
`
const Layout = styled.section`
  display: grid; flex: 1; grid-template-columns: auto minmax(440px, 1fr); align-items: stretch; width: 100%; min-height: 0;
  @media (max-width: 900px) { display: flex; flex-direction: column; min-height: 0; overflow: hidden; }
`
const MapColumn = styled.div<{ $mobileView: 'map' | 'recommendations' }>`
  display: flex; align-items: flex-start; justify-content: flex-start; width: min(calc(100dvh - 104px), calc(100vw - 440px));
  min-width: 0; min-height: 0; overflow: hidden; background: var(--background);
  @media (max-width: 900px) {
    display: ${({ $mobileView }) => $mobileView === 'map' ? 'flex' : 'none'};
    flex: 1; align-items: center; justify-content: center; width: 100%;
    > div { width: min(100%, calc(100dvh - 148px)); max-height: 100%; }
  }
`
const RecommendationRail = styled.aside<{ $dimmed: boolean; $mobileView: 'map' | 'recommendations' }>`
  position: relative; min-width: 0; min-height: 0; height: 100%; overflow: hidden; border-left: 1px solid var(--line);
  background: var(--background); overscroll-behavior-y: none; scrollbar-width: thin; scrollbar-color: var(--line) transparent;
  &::after {
    content: ''; position: absolute; inset: 0; z-index: 50; background: var(--background);
    opacity: ${({ $dimmed }) => $dimmed ? .76 : 0}; pointer-events: ${({ $dimmed }) => $dimmed ? 'auto' : 'none'};
    transition: opacity 150ms ease;
  }
  @media (max-width: 900px) {
    display: ${({ $mobileView }) => $mobileView === 'recommendations' ? 'block' : 'none'};
    flex: 1; width: 100%; height: auto; border-top: 0; border-left: 0;
  }
`
const RecommendationOverview = styled.div`
  display: flex; flex-direction: column; height: 100%; min-height: 0; overflow: hidden; padding: 18px 22px;
  h2 { flex: none; margin: 0; font-size: 18px; font-weight: 500; line-height: 1.35; letter-spacing: -.01em; }
  @media (max-width: 640px) { padding: 14px 12px; }
`
const Help = styled.p`flex: none; margin: 5px 0 0; color: var(--muted); font-size: 12px; line-height: 1.4;`
const RecommendationList = styled.div`
  display: grid; flex: 1; grid-template-rows: repeat(5, minmax(0, 1fr)); gap: 28px; min-height: 0; margin-top: 10px;
`
import styled from '@emotion/styled'
