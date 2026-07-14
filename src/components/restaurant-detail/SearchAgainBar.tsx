import styled from '@emotion/styled'
import { useState } from 'react'
import type { FormEvent } from 'react'

type SearchAgainBarProps = {
  initialQuery: string
  neighborhood: string
  onSearch: (query: string) => void
}

export function SearchAgainBar({ initialQuery, neighborhood, onSearch }: SearchAgainBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const trimmedQuery = query.trim()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (trimmedQuery) onSearch(trimmedQuery)
  }

  return (
    <SearchForm onSubmit={submit} role="search" aria-label={`${neighborhood}에서 다시 검색`}>
      <SearchIcon viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </SearchIcon>
      <Neighborhood>{neighborhood}</Neighborhood>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="다른 취향으로 다시 검색"
        aria-label="새 검색어"
      />
      <SubmitButton type="submit" disabled={!trimmedQuery}>다시 찾기</SubmitButton>
    </SearchForm>
  )
}

const SearchForm = styled.form`
  display: flex; align-items: center; gap: 10px; width: 100%; min-height: 52px; margin-bottom: 24px; padding: 7px 8px 7px 14px;
  border: 1px solid var(--line); border-radius: 12px; background: var(--card); transition: border-color 150ms ease, background 150ms ease;
  &:focus-within { border-color: var(--accent); background: var(--quote); }
  input { flex: 1; min-width: 0; padding: 0; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 14px; letter-spacing: -.01em; }
  input::placeholder { color: var(--muted); opacity: 1; }
  @media(max-width:640px){ gap: 8px; padding-left: 12px; }
`
const SearchIcon = styled.svg`
  flex: none; width: 18px; height: 18px; fill: none; stroke: var(--muted); stroke-width: 1.6; stroke-linecap: round;
`
const Neighborhood = styled.span`
  flex: none; padding-right: 10px; border-right: 1px solid var(--line); color: var(--sub); font-size: 12px; white-space: nowrap;
  @media(max-width:480px){ display:none; }
`
const SubmitButton = styled.button`
  flex: none; height: 36px; padding: 0 13px; border: 0; border-radius: 8px; color: var(--background); background: var(--ink);
  cursor: pointer; font-size: 12px; font-weight: 600; white-space: nowrap;
  &:hover:not(:disabled) { background: var(--accent); }
  &:disabled { cursor: default; opacity: .35; }
`
