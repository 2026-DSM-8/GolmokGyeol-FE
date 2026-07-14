import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useEffect, useRef } from 'react'
import type { Restaurant } from '../../types/restaurant'
import { trackEvent } from '../../utils/analytics'
import { getRelevantRestaurantKeywords } from '../../utils/searchIntent'

type RecommendationCardProps = {
  restaurant: Restaurant
  rank: number
  onClick: () => void
  query?: string
  sessionId?: string
}

const getPointColor = ([x, y]: Restaurant['position']) => (
  y >= 0 ? (x < 0 ? 'var(--violet)' : 'var(--orange)') : (x < 0 ? 'var(--green)' : 'var(--pink)')
)

export function RecommendationCard({ restaurant, rank, onClick, query, sessionId }: RecommendationCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null)
  const impressionKeyRef = useRef<string | null>(null)
  const displayKeywords = getRelevantRestaurantKeywords(restaurant, query)

  useEffect(() => {
    if (!sessionId || !cardRef.current) return

    const card = cardRef.current
    const impressionKey = `${sessionId}:${restaurant.id}:${rank}`
    const sendImpression = () => {
      if (impressionKeyRef.current === impressionKey) return
      impressionKeyRef.current = impressionKey
      trackEvent({
        event: 'recommendation_impression',
        sessionId,
        restaurantId: restaurant.id,
        rank,
        confidence: restaurant.confidence,
      })
    }

    if (!('IntersectionObserver' in window)) {
      sendImpression()
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      sendImpression()
      observer.disconnect()
    }, { threshold: .5 })

    observer.observe(card)
    return () => observer.disconnect()
  }, [rank, restaurant.confidence, restaurant.id, sessionId])

  return (
    <Card ref={cardRef} onClick={onClick} $delay={rank * 55}>
      <Rank $color={getPointColor(restaurant.position)} aria-label={`추천 순서 ${rank}`}>{rank}</Rank>
      <Content>
        <TitleRow>
          <h3>{restaurant.name}</h3>
          {restaurant.confidence === 'low' && <LowReviewBadge>후기 정보 적음</LowReviewBadge>}
        </TitleRow>
        <MetaRow>
          <Meta>{restaurant.category} · 후기 {restaurant.reviews}건</Meta>
          {restaurant.locationDesc && <LocationContext title={restaurant.locationDesc}>{restaurant.locationDesc}</LocationContext>}
        </MetaRow>
        <CompactDetails>
          <Summary title={restaurant.matchedSnippet.text}>“{restaurant.matchedSnippet.text}”</Summary>
          {displayKeywords.length > 0 && (
            <Keywords aria-label="검색 조건과 관련된 특징">
              {displayKeywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
            </Keywords>
          )}
        </CompactDetails>
      </Content>
      <Chevron width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></Chevron>
    </Card>
  )
}

const cardIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; }`
const Card = styled.button<{ $delay: number }>`
  display: flex; align-items: center; gap: 10px; width: 100%; height: 100%; min-height: 0; overflow: hidden;
  padding: clamp(2px, .4dvh, 4px) 12px; border: 1px solid var(--line);
  border-radius: 12px; color: var(--ink); background: var(--quote); cursor: pointer; text-align: left;
  animation: ${cardIn} 240ms cubic-bezier(.4, 0, .2, 1) ${({ $delay }) => $delay}ms both;
  transition: border-color 150ms ease, background 150ms ease;
  &:hover { border-color: #5a5349; background: #28251f; }
`
const Rank = styled.span<{ $color: string }>`
  display: flex; flex: none; align-items: center; justify-content: center; width: 22px; height: 22px;
  border: 1px solid currentColor; border-radius: 50%; color: ${({ $color }) => $color};
  background: transparent; font-size: 12px; font-weight: 500;
`
const Content = styled.div`
  display: flex; flex: 1; flex-direction: column; justify-content: center; height: 100%; min-width: 0; overflow: hidden;
`
const TitleRow = styled.div`
  display: flex; align-items: center; gap: 7px; min-width: 0;
  h3 { margin: 0; overflow: hidden; color: #fffdf8; font-size: clamp(15px, 1.75dvh, 17px); font-weight: 600; line-height: 1.2; letter-spacing: -.01em; text-overflow: ellipsis; white-space: nowrap; }
`
const LowReviewBadge = styled.span`
  display: inline-flex; flex: none; align-items: center; height: 18px; padding: 0 6px; border: 1px solid rgba(255,159,67,.35);
  border-radius: 999px; color: var(--accent); background: var(--halo); font-size: 10px; font-weight: 600; line-height: 1; white-space: nowrap;
`
const MetaRow = styled.div`
  display: flex; align-items: center; gap: 9px; min-width: 0; margin-top: 4px; color: var(--sub);
  font-size: clamp(11px, 1.25dvh, 12px); line-height: 1.3;
`
const Meta = styled.span`flex: none; white-space: nowrap;`
const LocationContext = styled.span`
  min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  &::before { content: '· '; }
`
const CompactDetails = styled.div`
  display: flex; flex-direction: column; align-items: flex-start; gap: clamp(3px, .5dvh, 5px); width: 100%; min-width: 0; margin-top: clamp(4px, .6dvh, 6px);
`
const Keywords = styled.div`
  display: flex; flex: none; gap: 4px;
  span {
    padding: 4px 9px; border: 1px solid rgba(255,159,67,.62); border-radius: 999px;
    color: #ffc078; background: rgba(255,159,67,.2); font-size: clamp(10px, 1.15dvh, 11px); font-weight: 700; line-height: 1.15; white-space: nowrap;
  }
`
const Summary = styled.p`
  display: -webkit-box; width: 100%; min-width: 0; margin: 0; overflow: hidden; color: var(--ink);
  font-size: clamp(14px, 1.65dvh, 15px); font-weight: 450; line-height: 1.25; letter-spacing: -.01em; overflow-wrap: anywhere;
  -webkit-box-orient: vertical; -webkit-line-clamp: 2;
`
const Chevron = styled.svg`align-self: center; flex: none; width: 14px; height: 14px; color: var(--sub);`
