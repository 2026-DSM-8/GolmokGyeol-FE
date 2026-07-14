import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { api } from '../api/golmok'
import { LocationMap, ReviewEvidence, TastePositionMap } from '../components/restaurant-detail'
import { RecommendationCard } from '../components/taste-map'
import { useTasteStore } from '../store/useTasteStore'
import type { Restaurant, TastePoint } from '../types/restaurant'
import { naverMapSearchUrl } from '../utils/restaurantDisplay'
import { getRelevantRestaurantKeywords } from '../utils/searchIntent'
import { getClosingPromotionalComment, getPromotionalComment, getRecommendations } from '../utils/tasteMap'

type SimilarView = {
  origin: TastePoint
  restaurants: Restaurant[]
}

export function RestaurantDetailPage() {
  const navigate = useNavigate()
  const { restaurantId } = useParams()
  const id = Number(restaurantId)
  const query = useTasteStore((state) => state.query)
  const mapResult = useTasteStore((state) => state.mapResult)
  const setTaste = useTasteStore((state) => state.setTaste)
  const setRecommendationIds = useTasteStore((state) => state.setRecommendationIds)
  const cachedRestaurant = mapResult?.restaurants.find((item) => item.id === id)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(cachedRestaurant ?? null)
  const [failed, setFailed] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [similarView, setSimilarView] = useState<SimilarView | null>(null)
  const [similarLoading, setSimilarLoading] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [id])

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setFailed(true)
      return
    }

    let active = true
    setRestaurant(cachedRestaurant ?? null)
    setSimilarView(null)
    setActionError(null)
    api.restaurant(id)
      .then((detail) => {
        if (!active) return
        setRestaurant(cachedRestaurant ? { ...detail, position: cachedRestaurant.position } : detail)
        setFailed(false)
      })
      .catch(() => {
        if (active) setFailed(true)
      })

    return () => { active = false }
  }, [cachedRestaurant, id])

  if (failed) return <Navigate to={mapResult ? '/taste-map' : '/'} replace />
  if (!restaurant) return <Page><Container>식당 정보를 불러오고 있어요.</Container></Page>

  const findSimilar = async () => {
    if (similarLoading) return
    setSimilarLoading(true)

    try {
      const response = await api.similar(restaurant.id)
      const origin: TastePoint = [response.origin.x, response.origin.y]
      const similarRestaurants = await Promise.all(response.top3.map(async (similarId) => {
        const detail = await api.restaurant(similarId)
        const cached = mapResult?.restaurants.find((item) => item.id === similarId)
        return cached ? { ...detail, position: cached.position } : detail
      }))

      setSimilarView({ origin, restaurants: similarRestaurants })
      setTaste(origin)
      if (mapResult) {
        const confirmedIds = response.top3.filter((similarId) =>
          mapResult.restaurants.some((item) => item.id === similarId),
        )
        const nearbyIds = getRecommendations(mapResult.restaurants, origin)
          .map((item) => item.id)
        setRecommendationIds(
          [...confirmedIds, ...nearbyIds.filter((similarId) => !confirmedIds.includes(similarId))].slice(0, 5),
        )
      }
      setActionError(null)
    } catch {
      setActionError('비슷한 식당을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setSimilarLoading(false)
    }
  }
  const evidence = [
    restaurant.matchedSnippet,
    ...restaurant.snippets.filter((snippet) => snippet.text !== restaurant.matchedSnippet.text),
  ]
  const promotionalComment = getPromotionalComment(restaurant)
  const closingPromotionalComment = getClosingPromotionalComment(restaurant)
  const displayKeywords = getRelevantRestaurantKeywords(restaurant, query, 6)

  return (
    <Page>
      <Container>
        <BackButton onClick={() => navigate(mapResult ? '/taste-map' : '/')}><span>←</span> 지도로 돌아가기</BackButton>
        <Summary>
          <h1>{restaurant.name}</h1>
          <MetaRow>
            <span>{restaurant.category} · 후기 {restaurant.reviews}건</span>
          </MetaRow>
          <PromoComment>{actionError ?? promotionalComment}</PromoComment>
          {displayKeywords.length > 0 && (
            <Keywords>
              {displayKeywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
            </Keywords>
          )}
        </Summary>
        <ReviewEvidence key={restaurant.id} evidence={evidence} />
        <MapGrid aria-label="취향 및 위치 정보">
          <TastePositionMap
            restaurant={restaurant}
            restaurants={mapResult?.restaurants}
            taste={similarView?.origin}
            highlightedRestaurantIds={similarView?.restaurants.map((item) => item.id)}
          />
          <LocationMap restaurant={restaurant} />
        </MapGrid>
        {similarView && (
          <SimilarSection aria-label={`${restaurant.name}과 비슷한 식당`}>
            <h2>{restaurant.name}과 비슷한 집</h2>
            <p>취향 지도에서 가장 가까운 곳들이에요.</p>
            <SimilarList>
              {similarView.restaurants.map((item, index) => (
                <RecommendationCard
                  key={item.id}
                  restaurant={item}
                  order={index + 1}
                  onClick={() => navigate(`/restaurants/${item.id}`)}
                />
              ))}
            </SimilarList>
          </SimilarSection>
        )}
        <ClosingPromo>
          <span>오늘의 골목 추천</span>
          <strong>{closingPromotionalComment}</strong>
        </ClosingPromo>
        <Actions>
          <button onClick={() => { void findSimilar() }} disabled={similarLoading}>
            {similarLoading ? '비슷한 집 찾는 중…' : '여기랑 비슷한 집'}
          </button>
          <a href={naverMapSearchUrl(restaurant)} target="_blank" rel="noreferrer">길찾기</a>
        </Actions>
      </Container>
    </Page>
  )
}

const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}`
const Page = styled.main`min-height: 100vh; color: var(--ink); background: var(--background); animation: ${fadeUp} 400ms cubic-bezier(.2,.6,.3,1) both;`
const Container = styled.div`width: 100%; max-width: 760px; margin: 0 auto; padding: 24px 24px 64px; @media(max-width:640px){padding:20px 18px 48px;}`
const BackButton = styled.button`
  display: flex; align-items: center; gap: 8px; padding: 4px 8px 4px 0; border: 0; color: var(--ink); background: transparent; cursor: pointer; font-size: 14px;
  span { font-size: 18px; line-height: 1; }
`
const Summary = styled.header`
  margin-top: 28px;
  h1 { margin: 0; font-family: var(--serif); font-size: 34px; font-weight: 500; line-height: 1.4; }
  @media(max-width:640px){h1{font-size:30px;}}
`
const MetaRow = styled.div`display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 8px; color: var(--sub); font-size: 13px;`
const PromoComment = styled.p`max-width: 620px; margin: 16px 0 0; padding-left: 14px; border-left: 2px solid var(--accent); color: var(--sub); font-size: 15px; line-height: 1.7; letter-spacing: -.01em;`
const Keywords = styled.div`display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;span{padding:5px 13px;border-radius:999px;background:var(--quote);font-size:12.5px;white-space:nowrap;}`
const MapGrid = styled.section`display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:26px;@media(max-width:640px){gap:8px;}`
const SimilarSection = styled.section`
  margin-top:32px;
  h2{margin:0;font-size:20px;font-weight:500;line-height:1.4;}
  >p{margin:6px 0 0;color:var(--muted);font-size:13px;line-height:1.5;}
`
const SimilarList = styled.div`display:flex;flex-direction:column;gap:10px;margin-top:16px;`
const ClosingPromo = styled.aside`
  margin-top:36px;padding:22px;border:1px solid rgba(255,159,67,.24);border-radius:12px;background:linear-gradient(135deg,var(--halo),var(--card));
  span{color:var(--accent);font-size:11px;font-weight:600;letter-spacing:.08em}strong{display:block;margin-top:8px;color:var(--ink);font-family:var(--serif);font-size:18px;font-weight:500;line-height:1.6}
`
const Actions = styled.div`
  display:flex;gap:10px;max-width:480px;margin-top:32px;
  button,a{flex:1;padding:12px 16px;border-radius:999px;cursor:pointer;font-size:14px;font-weight:500;text-align:center;text-decoration:none}
  button{border:0;color:var(--background);background:var(--ink)}a{border:1px solid var(--line);color:var(--ink);background:transparent}
  button:disabled{cursor:wait;opacity:.65;}
  @media(max-width:640px){max-width:none;}
`
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
