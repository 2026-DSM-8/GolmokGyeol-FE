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
    <Page>
      <Container>
        <BackButton onClick={() => navigate('/taste-map')}><span>←</span> 지도로 돌아가기</BackButton>
        <Summary>
          <h1>{restaurant.name}</h1>
          <MetaRow>
            <span>{restaurant.category} · 후기 {restaurant.reviews}건</span>
          </MetaRow>
          <PromoComment>{promotionalComment}</PromoComment>
          <Keywords>
            {restaurant.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
          </Keywords>
        </Summary>
        <ReviewEvidence evidence={evidence} />
        <MapGrid aria-label="취향 및 위치 정보">
          <TastePositionMap restaurant={restaurant} />
          <LocationMap restaurant={restaurant} />
        </MapGrid>
        <ClosingPromo>
          <span>오늘의 골목 추천</span>
          <strong>{closingPromotionalComment}</strong>
        </ClosingPromo>
        <Actions>
          <button onClick={findSimilar}>여기랑 비슷한 집</button>
          <a href={`https://map.naver.com/p/search/${encodeURIComponent(`${restaurant.name} ${restaurant.address}`)}`} target="_blank" rel="noreferrer">길찾기</a>
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
const ClosingPromo = styled.aside`
  margin-top:36px;padding:22px;border:1px solid rgba(255,159,67,.24);border-radius:12px;background:linear-gradient(135deg,var(--halo),var(--card));
  span{color:var(--accent);font-size:11px;font-weight:600;letter-spacing:.08em}strong{display:block;margin-top:8px;color:var(--ink);font-family:var(--serif);font-size:18px;font-weight:500;line-height:1.6}
`
const Actions = styled.div`
  display:flex;gap:10px;max-width:480px;margin-top:32px;
  button,a{flex:1;padding:12px 16px;border-radius:999px;cursor:pointer;font-size:14px;font-weight:500;text-align:center;text-decoration:none}
  button{border:0;color:var(--background);background:var(--ink)}a{border:1px solid var(--line);color:var(--ink);background:transparent}
  @media(max-width:640px){max-width:none;}
`
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
