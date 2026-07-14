import styled from '@emotion/styled'
import { Navigate, useNavigate } from 'react-router'
import { useTasteStore } from '../store/useTasteStore'
import { getEvaluationComparison } from '../utils/evaluationComparison'

export function EvaluationComparisonPage() {
  const navigate = useNavigate()
  const query = useTasteStore((state) => state.query)
  const searchScope = useTasteStore((state) => state.searchScope)
  const mapResult = useTasteStore((state) => state.mapResult)

  if (!mapResult) return <Navigate to={searchScope.neighborhood ? '/search' : '/'} replace />

  const { golmokTop, popularityTop, popularityIds, newlyRecommendedCount } = getEvaluationComparison(mapResult)

  return (
    <Page>
      <Container>
        <Topbar>
          <div>
            <Eyebrow>심사위원용 비교</Eyebrow>
            <h1>인기순과 골목결 추천 비교</h1>
            <p>{searchScope.neighborhood} · “{query}”</p>
          </div>
          <BackButton type="button" onClick={() => navigate('/taste-map')}>취향 지도로 돌아가기</BackButton>
        </Topbar>

        <DiscoverySummary>
          기존 방식에서 안 보이던 <strong>{newlyRecommendedCount}곳</strong>이 새로 추천됐어요.
        </DiscoverySummary>

        <ComparisonGrid>
          <ComparisonSection>
            <SectionHeading>
              <span>골목결</span>
              <h2>취향 유사도순</h2>
            </SectionHeading>
            <RestaurantList>
              {golmokTop.map((restaurant) => (
                <RestaurantItem key={restaurant.id} $highlighted={!popularityIds.has(restaurant.id)}>
                  <div>
                    <strong>{restaurant.name}</strong>
                    <span>{restaurant.category}</span>
                  </div>
                  {restaurant.confidence === 'low' && <LowReviewBadge>후기 정보 적음</LowReviewBadge>}
                  {!popularityIds.has(restaurant.id) && <DiscoveryBadge>기존 인기순에 없음</DiscoveryBadge>}
                </RestaurantItem>
              ))}
            </RestaurantList>
          </ComparisonSection>

          <ComparisonSection>
            <SectionHeading>
              <span>기존 방식</span>
              <h2>후기 수 상위</h2>
            </SectionHeading>
            {popularityTop.length > 0 ? (
              <RestaurantList>
                {popularityTop.map((restaurant) => (
                  <RestaurantItem key={restaurant.id} $highlighted={false}>
                    <div>
                      <strong>{restaurant.name}</strong>
                      <span>{restaurant.category} · 후기 {restaurant.reviews}건</span>
                    </div>
                  </RestaurantItem>
                ))}
              </RestaurantList>
            ) : (
              <EmptyState>현재 검색 응답에 인기순 비교 데이터가 없습니다.</EmptyState>
            )}
          </ComparisonSection>
        </ComparisonGrid>

        <Footnote>두 목록은 동일한 검색 응답을 기준으로 비교합니다. 클릭이나 길찾기는 방문 및 매출이 아닌 관심·방문 의향 신호입니다.</Footnote>
      </Container>
    </Page>
  )
}

const Page = styled.main`min-height:100dvh;color:var(--ink);background:var(--background);`
const Container = styled.div`width:min(1120px,100%);margin:0 auto;padding:48px 24px 72px;@media(max-width:640px){padding:28px 16px 48px;}`
const Topbar = styled.header`
  display:flex;align-items:flex-start;justify-content:space-between;gap:24px;
  h1{margin:7px 0 0;font-size:32px;font-weight:500;line-height:1.3;letter-spacing:-.02em}
  p{margin:10px 0 0;color:var(--sub);font-size:14px}
  @media(max-width:640px){flex-direction:column;h1{font-size:27px}}
`
const Eyebrow = styled.span`color:var(--accent);font-size:12px;font-weight:600;letter-spacing:.08em;`
const BackButton = styled.button`flex:none;height:38px;padding:0 14px;border:1px solid var(--line);border-radius:8px;color:var(--sub);background:transparent;cursor:pointer;font-size:13px;&:hover{color:var(--ink);background:var(--quote);}`
const DiscoverySummary = styled.p`margin:36px 0 0;padding:20px 22px;border:1px solid rgba(255,159,67,.28);border-radius:12px;background:var(--halo);font-size:18px;line-height:1.5;strong{color:var(--accent);font-weight:600;}`
const ComparisonGrid = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:22px;@media(max-width:760px){grid-template-columns:1fr;}`
const ComparisonSection = styled.section`min-width:0;padding:22px;border:1px solid var(--line);border-radius:12px;background:var(--card);`
const SectionHeading = styled.header`span{color:var(--muted);font-size:12px}h2{margin:5px 0 0;font-size:19px;font-weight:500;}`
const RestaurantList = styled.ul`display:flex;flex-direction:column;gap:9px;margin:20px 0 0;padding:0;list-style:none;`
const RestaurantItem = styled.li<{ $highlighted: boolean }>`
  display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:14px;border:1px solid ${({$highlighted})=>$highlighted?'rgba(255,159,67,.3)':'var(--line)'};border-radius:9px;background:${({$highlighted})=>$highlighted?'var(--halo)':'var(--background)'};
  >div{flex:1;min-width:150px}strong{display:block;font-size:15px;font-weight:500}span{display:block;margin-top:4px;color:var(--muted);font-size:12px}
`
const LowReviewBadge = styled.span`flex:none!important;margin:0!important;padding:5px 7px;border-radius:999px;color:var(--accent)!important;background:var(--halo);font-size:10px!important;font-weight:600;`
const DiscoveryBadge = styled(LowReviewBadge)`color:var(--ink)!important;background:var(--quote);`
const EmptyState = styled.p`margin:20px 0 0;padding:24px;border:1px dashed var(--line);border-radius:9px;color:var(--muted);font-size:13px;text-align:center;`
const Footnote = styled.p`margin:24px 0 0;color:var(--muted);font-size:12px;line-height:1.7;`
