type MapQueryHeaderProps = {
  locationName: string
  query: string
  onBack: () => void
}

export function MapQueryHeader({ locationName, query, onBack }: MapQueryHeaderProps) {
  return (
    <header className="map-query-header">
      <button className="map-back-button" onClick={onBack} aria-label="검색 화면으로 돌아가기">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <span className="map-location-name">{locationName}</span>
      <span className="map-current-query">“{query}”</span>
      <button className="map-edit-button" onClick={onBack}>수정</button>
    </header>
  )
}
