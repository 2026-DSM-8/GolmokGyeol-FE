import type { FormEvent } from 'react'

type MapQueryHeaderProps = {
  query: string
  draft: string
  editing: boolean
  suggestions: string[]
  onBack: () => void
  onDraftChange: (value: string) => void
  onEdit: () => void
  onCancelEdit: () => void
  onSubmit: (event: FormEvent) => void
  onSuggestion: (suggestion: string) => void
}

export function MapQueryHeader({
  query,
  draft,
  editing,
  suggestions,
  onBack,
  onDraftChange,
  onEdit,
  onCancelEdit,
  onSubmit,
  onSuggestion,
}: MapQueryHeaderProps) {
  return (
    <header className="map-query-header">
      <div className="map-query-row">
        <button className="map-back-button" onClick={onBack} aria-label="메인으로 돌아가기">←</button>
        {editing ? (
          <form className="map-query-form" onSubmit={onSubmit}>
            <input
              autoFocus
              value={draft}
              aria-label="검색 문장 수정"
              onChange={(event) => onDraftChange(event.target.value)}
              onBlur={onCancelEdit}
            />
          </form>
        ) : (
          <button className="map-query-pill" onClick={onEdit}>{query}</button>
        )}
      </div>
      <div className="map-query-chips" aria-label="다른 검색 예시">
        {suggestions.map((suggestion) => (
          <button key={suggestion} onClick={() => onSuggestion(suggestion)}>{suggestion}</button>
        ))}
      </div>
    </header>
  )
}
