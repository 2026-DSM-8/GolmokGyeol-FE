type MapQueryHeaderProps = {
  locationName: string
  query: string
  onBack: () => void
}

export function MapQueryHeader({ locationName, query, onBack }: MapQueryHeaderProps) {
  return (
    <Header>
      <BackButton onClick={onBack} aria-label="검색 화면으로 돌아가기">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
      </BackButton>
      <LocationName>{locationName}</LocationName>
      <CurrentQuery>“{query}”</CurrentQuery>
      <EditButton onClick={onBack}>수정</EditButton>
    </Header>
  )
}

const Header = styled.header`
  display: flex; flex: none; align-items: center; gap: 14px; height: 56px; padding: 0 20px;
  border-bottom: 1px solid var(--line); background: var(--background);
  @media (max-width: 640px) { gap: 9px; padding: 0 12px; }
`
const BackButton = styled.button`
  display: flex; flex: none; align-items: center; justify-content: center; width: 32px; height: 32px;
  padding: 0; border: 1px solid var(--line); border-radius: 8px; color: var(--sub); background: transparent; cursor: pointer;
  &:hover { color: var(--ink); border-color: #3a3733; background: var(--quote); }
`
const LocationName = styled.span`
  flex: none; color: var(--sub); font-size: 13px; letter-spacing: .14em;
  @media (max-width: 640px) { display: none; }
`
const CurrentQuery = styled.span`
  flex: 1; min-width: 0; overflow: hidden; color: var(--ink); font-size: 15px; letter-spacing: -.01em;
  text-overflow: ellipsis; white-space: nowrap;
`
const EditButton = styled.button`
  flex: none; height: 32px; padding: 0 14px; border: 1px solid var(--line); border-radius: 8px;
  color: var(--sub); background: transparent; cursor: pointer; font-size: 13px;
  &:hover { color: var(--ink); border-color: #3a3733; background: var(--quote); }
`
import styled from '@emotion/styled'
