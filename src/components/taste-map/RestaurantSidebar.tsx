import { useEffect, useState } from 'react'
import { LocationMap, TastePositionMap } from '../restaurant-detail'
import type { Restaurant } from '../../types/restaurant'
import { formatQuadrantLabel, naverMapSearchUrl, sourceHref, sourceLabel } from '../../utils/restaurantDisplay'
import { getClosingPromotionalComment, getPromotionalComment } from '../../utils/tasteMap'

type RestaurantSidebarProps = {
  restaurant: Restaurant
  onBack: () => void
  onFindSimilar: () => void
  quadrants: [string, string, string, string]
}

const getPointColor = ([x, y]: Restaurant['position']) => (
  y >= 0 ? (x < 0 ? '#a99bf7' : '#f5946e') : (x < 0 ? '#63d5aa' : '#f28fb4')
)

const quadrantName = ([x, y]: Restaurant['position'], quadrants: [string, string, string, string]) => (
  formatQuadrantLabel(quadrants[y >= 0 ? (x < 0 ? 2 : 3) : (x < 0 ? 0 : 1)])
)

export function RestaurantSidebar({ restaurant, onBack, onFindSimilar, quadrants }: RestaurantSidebarProps) {
  const [reviewsExpanded, setReviewsExpanded] = useState(false)
  const evidence = [
    restaurant.matchedSnippet,
    ...restaurant.snippets.filter((snippet) => snippet.text !== restaurant.matchedSnippet.text),
  ]
  const visibleEvidence = reviewsExpanded ? evidence : evidence.slice(0, 5)
  const hiddenReviewCount = Math.max(0, evidence.length - 5)
  const pointColor = getPointColor(restaurant.position)
  const maxCount = Math.max(1, ...restaurant.mentions.map((mention) => mention.count))
  const promotionalComment = getPromotionalComment(restaurant)
  const closingPromotionalComment = getClosingPromotionalComment(restaurant)

  useEffect(() => {
    setReviewsExpanded(false)
  }, [restaurant.id])

  return (
    <Sidebar>
      <ScrollArea>
        <BackButton onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          추천 5곳으로
        </BackButton>

        <Heading>
          <div>
            <ColorDot $color={pointColor} />
            <h2>{restaurant.name}</h2>
          </div>
          <p>{restaurant.category} · 후기 {restaurant.reviews}건</p>
          <PromoComment>{promotionalComment}</PromoComment>
        </Heading>

        {restaurant.confidence === 'low' && (
          <Caution>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
            후기가 적어요. 취향 자리가 부정확할 수 있어요.
          </Caution>
        )}

        <PositionSection>
          <h3>이 골목에선 여기쯤이에요</h3>
          <MapPair>
            <MapPanel>
              <TastePositionMap restaurant={restaurant} />
              <QuadrantCaption $color={pointColor}>‘{quadrantName(restaurant.position, quadrants)}’ 자리</QuadrantCaption>
            </MapPanel>
            <LocationPanel>
              <LocationMap restaurant={restaurant} />
              <Address>{restaurant.address}</Address>
              {restaurant.locationDesc && <LocationNote>{restaurant.locationDesc}</LocationNote>}
            </LocationPanel>
          </MapPair>
        </PositionSection>

        {restaurant.mentions.length > 0 && (
          <Section>
            <h3>후기에서 자주 나온 말</h3>
            <MentionList>
              {restaurant.mentions.map((mention) => (
                <MentionItem key={mention.text}>
                  <p><span>{mention.text}</span><span>{mention.count}회</span></p>
                  <div><MentionBar $color={pointColor} $width={(mention.count / maxCount) * 100} /></div>
                </MentionItem>
              ))}
            </MentionList>
          </Section>
        )}

        <Section>
          <h3>추천에 참고한 후기 문장</h3>
          <Snippets id="sidebar-review-list">
            {visibleEvidence.map(({ text, source }) => <blockquote key={`${source}-${text}`}>“{text}”</blockquote>)}
          </Snippets>
          {hiddenReviewCount > 0 && (
            <ReviewMoreButton
              type="button"
              aria-expanded={reviewsExpanded}
              aria-controls="sidebar-review-list"
              onClick={() => setReviewsExpanded((current) => !current)}
            >
              {reviewsExpanded ? '후기 접기' : `후기 ${hiddenReviewCount}개 더보기`}
            </ReviewMoreButton>
          )}
          <SnippetSources>
            {[...new Set(visibleEvidence.map(({ source }) => source).filter(Boolean))].map((source) => (
              <a key={source} href={sourceHref(source)} target="_blank" rel="noreferrer">
                {sourceLabel(source)} ↗
              </a>
            ))}
          </SnippetSources>
        </Section>

        <ClosingPromo>
          <span>오늘의 골목 추천</span>
          <strong>{closingPromotionalComment}</strong>
        </ClosingPromo>
      </ScrollArea>

      <Actions>
        <button onClick={onFindSimilar}>여기랑 비슷한 집</button>
        <a href={naverMapSearchUrl(restaurant)} target="_blank" rel="noreferrer">길찾기</a>
      </Actions>
    </Sidebar>
  )
}

const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}`
const Sidebar = styled.div`display:flex;flex-direction:column;height:100%;min-height:0;padding:0;animation:${fadeUp} 420ms cubic-bezier(.4,0,.2,1) both;`
const ScrollArea = styled.div`flex:1;min-height:0;overflow-y:auto;padding:32px 28px;scrollbar-width:thin;scrollbar-color:var(--line) transparent;@media(max-width:640px){padding:24px 18px 32px;}`
const BackButton = styled.button`display:flex;align-items:center;gap:7px;margin:0 0 28px;padding:0;border:0;color:var(--muted);background:transparent;cursor:pointer;font-size:15px;&:hover{color:var(--sub);}`
const Heading = styled.header`
  > div{display:flex;align-items:center;gap:8px}h2{margin:0;font-size:26px;font-weight:500;line-height:1.35;letter-spacing:-.01em}
  > p{margin:8px 0 0;color:var(--muted);font-size:15px}
`
const ColorDot = styled.span<{ $color: string }>`flex:none;width:8px;height:8px;border-radius:50%;background:${({$color})=>$color};`
const PromoComment = styled.p`max-width:620px!important;margin-top:16px!important;padding-left:14px;border-left:2px solid var(--accent);color:var(--sub)!important;font-size:14px!important;line-height:1.7;letter-spacing:-.01em;`
const Caution = styled.div`display:flex;gap:10px;margin-top:18px;padding:12px 14px;border:1px solid var(--line);border-radius:8px;color:var(--sub);background:var(--quote);font-size:14px;line-height:1.55;`
const Section = styled.section`margin-top:36px;padding-top:36px;border-top:1px solid var(--line);h3{margin:0 0 18px;color:var(--sub);font-size:15px;font-weight:400;letter-spacing:-.01em}`
const PositionSection = styled(Section)`
  h3{margin-bottom:14px}
`
const MapPair = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start;@media(max-width:640px){grid-template-columns:1fr;gap:24px;}`
const MapPanel = styled.div`
  min-width:0;
  > div{width:100%;overflow:hidden;border:1px solid var(--line);border-radius:10px;background:var(--background)}
  > div svg{width:100%;height:auto;margin:0;aspect-ratio:7/4;border-radius:0}
  > div > p{display:none}
`
const LocationPanel = styled(MapPanel)`> div > div{width:100%;height:auto;aspect-ratio:7/4;border:0;border-radius:0;background:var(--background)}`
const QuadrantCaption = styled.p<{ $color:string }>`margin:12px 0 0;color:${({$color})=>$color};font-size:14px;line-height:1.5;`
const Address = styled.p`margin:12px 0 0;font-size:15px;line-height:1.45;`
const LocationNote = styled.p`margin:5px 0 0;color:var(--muted);font-size:13px;line-height:1.5;`
const MentionList = styled.div`display:flex;flex-direction:column;gap:16px;`
const MentionItem = styled.div`
  > p{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin:0;font-size:17px}
  > p span:last-child{color:var(--muted);font-size:14px}
  > div{height:5px;margin-top:9px;overflow:hidden;border-radius:3px;background:var(--quote)}
`
const MentionBar = styled.i<{ $color:string;$width:number }>`display:block;width:${({$width})=>$width}%;height:100%;border-radius:2px;background:${({$color})=>$color};`
const Snippets = styled.div`display:flex;flex-direction:column;gap:10px;blockquote{margin:0;padding:16px 18px;border-left:3px solid var(--accent);border-radius:10px;color:var(--ink);background:var(--quote);font-size:17px;line-height:1.7;letter-spacing:-.01em}`
const SnippetSources = styled.div`
  display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px 12px;margin-top:14px;font-size:13px;
  a{color:var(--muted);text-decoration:none}a:hover{color:var(--ink);text-decoration:underline}
`
const ReviewMoreButton = styled.button`
  width:100%;margin-top:14px;padding:11px 14px;border:1px solid var(--line);border-radius:9px;
  color:var(--sub);background:transparent;cursor:pointer;font-size:13px;
  &:hover{border-color:#3a3733;color:var(--ink);background:var(--quote)}
`
const ClosingPromo = styled.aside`
  margin-top:36px;padding:22px;border:1px solid rgba(255,159,67,.24);border-radius:12px;background:linear-gradient(135deg,var(--halo),var(--card));
  span{color:var(--accent);font-size:11px;font-weight:600;letter-spacing:.08em}strong{display:block;margin-top:8px;color:var(--ink);font-family:var(--serif);font-size:18px;font-weight:500;line-height:1.6}
`
const Actions = styled.footer`
  display:flex;flex:none;gap:12px;padding:18px 22px;border-top:1px solid var(--line);background:var(--background);
  button,a{display:flex;flex:1;align-items:center;justify-content:center;height:50px;padding:0;border:1px solid var(--line);border-radius:9px;color:var(--ink);background:var(--card);cursor:pointer;font-size:15px;font-weight:400;text-decoration:none}
  button:hover,a:hover{border-color:#3a3733;background:var(--quote)}
`
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
