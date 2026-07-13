import type { ReviewEvidenceItem } from '../../mocks/restaurants'

export function ReviewEvidence({ evidence }: { evidence: ReviewEvidenceItem[] }) {
  return (
    <EvidenceSection aria-labelledby="review-evidence-title">
      <Kicker>왜 추천됐나</Kicker>
      <h2 id="review-evidence-title">이 문장들 때문에 추천됐습니다</h2>
      <QuoteList>
        {evidence.map(({ quote, source }) => (
          <blockquote key={`${source}-${quote}`}>
            <p>“{quote}”</p>
            <a href={`https://${source}`} target="_blank" rel="noreferrer">{source} ↗</a>
          </blockquote>
        ))}
      </QuoteList>
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
import styled from '@emotion/styled'
