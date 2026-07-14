import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type MapQueryHeaderProps = {
  locationName: string
  query: string
  onBack: () => void
  onSearch: (query: string) => void
  onRestart: () => void
}

export function MapQueryHeader({ locationName, query: initialQuery, onBack, onSearch, onRestart }: MapQueryHeaderProps) {
  const [query, setQuery] = useState(initialQuery)
  const trimmedQuery = query.trim()

  useEffect(() => setQuery(initialQuery), [initialQuery])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (trimmedQuery) onSearch(trimmedQuery)
  }

  return (
    <Header>
      <BackButton type="button" onClick={onBack} aria-label="검색 화면으로 돌아가기">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
      </BackButton>
      <LocationName>{locationName}</LocationName>
      <SearchForm onSubmit={submit} role="search" aria-label={`${locationName} 검색어 수정`}>
        <SearchIcon viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </SearchIcon>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="다른 취향으로 검색"
          aria-label="검색어"
        />
        <SearchButton type="submit" disabled={!trimmedQuery}>
          <DesktopButtonLabel>다시 찾기</DesktopButtonLabel>
          <MobileButtonLabel>찾기</MobileButtonLabel>
        </SearchButton>
      </SearchForm>
      <RestartButton type="button" onClick={onRestart}>처음부터 다시</RestartButton>
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
const SearchForm = styled.form`
  display: flex; flex: 0 1 680px; align-items: center; gap: 9px; min-width: 0; height: 38px; padding: 3px 4px 3px 12px;
  border: 1px solid var(--line); border-radius: 10px; background: var(--card); transition: border-color 150ms ease, background 150ms ease;
  &:focus-within { border-color: var(--accent); background: var(--quote); }
  input { flex: 1; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 14px; letter-spacing: -.01em; }
  input::placeholder { color: var(--muted); opacity: 1; }
`
const SearchIcon = styled.svg`
  flex: none; width: 17px; height: 17px; fill: none; stroke: var(--muted); stroke-width: 1.6; stroke-linecap: round;
`
const SearchButton = styled.button`
  flex: none; height: 30px; padding: 0 12px; border: 0; border-radius: 7px; color: var(--background); background: var(--ink);
  cursor: pointer; font-size: 12px; font-weight: 600; white-space: nowrap;
  &:hover:not(:disabled) { background: var(--accent); }
  &:disabled { cursor: default; opacity: .35; }
  @media (max-width: 480px) { padding: 0 10px; }
`
const DesktopButtonLabel = styled.span`
  @media (max-width: 480px) { display: none; }
`
const MobileButtonLabel = styled.span`
  display: none;
  @media (max-width: 480px) { display: inline; }
`
const RestartButton = styled.button`
  flex: none; height: 34px; margin-left: auto; padding: 0 13px; border: 1px solid var(--line); border-radius: 8px;
  color: var(--sub); background: transparent; cursor: pointer; font-size: 12px; white-space: nowrap;
  &:hover { color: var(--ink); border-color: #3a3733; background: var(--quote); }
  @media (max-width: 480px) { padding: 0 9px; }
`
