import type { ReviewEvidenceItem } from '../../mocks/restaurants'

export function ReviewEvidence({ evidence }: { evidence: ReviewEvidenceItem[] }) {
  return (
    <section className="review-evidence" aria-labelledby="review-evidence-title">
      <p className="section-kicker">왜 추천됐나</p>
      <h2 id="review-evidence-title">이 문장들 때문에 추천됐습니다</h2>
      <div className="review-quote-list">
        {evidence.map(({ quote, source }) => (
          <blockquote key={`${source}-${quote}`}>
            <p>“{quote}”</p>
            <a href={`https://${source}`} target="_blank" rel="noreferrer">{source} ↗</a>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
