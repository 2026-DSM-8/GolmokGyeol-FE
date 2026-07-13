import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import type { Restaurant } from '../../types/restaurant'

type RecommendationCardProps = {
  restaurant: Restaurant
  order: number
  onClick: () => void
}

const getPointColor = ([x, y]: Restaurant['position']) => (
  y > 0 ? (x < 0 ? 'var(--violet)' : 'var(--orange)') : (x < 0 ? 'var(--green)' : 'var(--pink)')
)

export function RecommendationCard({ restaurant, order, onClick }: RecommendationCardProps) {
  return (
    <Card onClick={onClick} $delay={order * 55}>
      <Order $color={getPointColor(restaurant.position)}>{order}</Order>
      <Content>
        <TitleRow>
          <h3>{restaurant.name}</h3>
          {restaurant.reviews < 40 && <LowReviewBadge>후기 적음</LowReviewBadge>}
        </TitleRow>
        <Meta>
          {restaurant.category} · 후기 {restaurant.reviews}건
        </Meta>
        <Summary>“{restaurant.quote}”</Summary>
        <Keywords aria-label="대표 특징">
          {restaurant.keywords.slice(0, 2).map((keyword) => <span key={keyword}>{keyword}</span>)}
        </Keywords>
      </Content>
      <Chevron width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></Chevron>
    </Card>
  )
}

const cardIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; }`
const Card = styled.button<{ $delay: number }>`
  display: flex; align-items: center; gap: 14px; width: 100%; padding: 16px; border: 1px solid var(--line);
  border-radius: 12px; color: var(--ink); background: var(--card); cursor: pointer; text-align: left;
  animation: ${cardIn} 240ms cubic-bezier(.4, 0, .2, 1) ${({ $delay }) => $delay}ms both;
  transition: border-color 150ms ease;
  &:hover { border-color: #3a3733; background: var(--quote); }
`
const Order = styled.span<{ $color: string }>`
  display: flex; flex: none; align-items: center; justify-content: center; width: 24px; height: 24px;
  border: 1px solid currentColor; border-radius: 50%; color: ${({ $color }) => $color};
  background: transparent; font-size: 12px; font-weight: 500;
`
const Content = styled.div`flex: 1; min-width: 0;`
const TitleRow = styled.div`
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
  h3 { margin: 0; font-size: 15px; font-weight: 500; line-height: 1.25; letter-spacing: -.01em; }
`
const LowReviewBadge = styled.span`
  display: inline-flex; align-items: center; height: 18px; padding: 0 7px; border: 1px solid rgba(255,159,67,.35);
  border-radius: 999px; color: var(--accent); background: var(--halo); font-size: 10px; font-weight: 600; line-height: 1; white-space: nowrap;
`
const Meta = styled.span`display: block; margin-top: 2px; color: var(--muted); font-size: 12px; white-space: nowrap;`
const Summary = styled.p`
  display: -webkit-box; margin: 9px 0 0; overflow: hidden; color: var(--sub); font-size: 13px; line-height: 1.55;
  letter-spacing: -.01em; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
`
const Keywords = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;
  span { padding: 4px 8px; border-radius: 6px; color: var(--muted); background: var(--quote); font-size: 11px; }
`
const Chevron = styled.svg`align-self: center; flex: none; width: 16px; height: 16px; color: var(--muted);`
