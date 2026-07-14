import { useState } from 'react'
import type { Snippet } from '../../types/restaurant'
import { sourceHref, sourceLabel } from '../../utils/restaurantDisplay'

export function ReviewEvidence({ evidence }: { evidence: Snippet[] }) {
  const [expanded, setExpanded] = useState(false)
  const visibleEvidence = expanded ? evidence : evidence.slice(0, 5)
  const hiddenCount = Math.max(0, evidence.length - 5)

  return (
    <EvidenceSection aria-labelledby="review-evidence-title">
      <Kicker>왜 추천됐나</Kicker>
      <h2 id="review-evidence-title">이 문장들 때문에 추천됐습니다</h2>
      <QuoteList id="review-evidence-list">
        {visibleEvidence.map(({ text, source }) => (
          <blockquote key={`${source}-${text}`}>
            <p>“{text}”</p>
            {source && <a href={sourceHref(source)} target="_blank" rel="noreferrer">{sourceLabel(source)} ↗</a>}
          </blockquote>
        ))}
      </QuoteList>
      {hiddenCount > 0 && (
        <MoreButton
          type="button"
          aria-expanded={expanded}
          aria-controls="review-evidence-list"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? '후기 접기' : `후기 ${hiddenCount}개 더보기`}
        </MoreButton>
      )}
    </EvidenceSection>
  )
}

const EvidenceSection = styled.section`
  margin-top: 28px;
  h2 { margin: 6px 0 0; font-family: var(--serif); font-size: 17px; font-weight: 500; }
`
const Kicker = styled.p`margin: 0; color: var(--sub); font-size: 11.5px; letter-spacing: .12em;`
const QuoteList = styled.div`
  display: flex; flex-direction: column; gap: 10px; margin-top: 14px;
  blockquote { margin: 0; padding: 14px 16px; border-radius: 12px; background: var(--quote); }
  p { margin: 0; font-size: 14px; line-height: 1.7; }
  a { display: inline-block; margin-top: 6px; color: var(--sub); font-size: 11.5px; text-decoration: none; white-space: nowrap; }
  a:hover { color: var(--ink); text-decoration: underline; }
`
const MoreButton = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 11px 16px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--sub);
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  transition: border-color 150ms ease, color 150ms ease, background 150ms ease;
  &:hover { border-color: #3a3733; color: var(--ink); background: var(--quote); }
`
import styled from '@emotion/styled'
