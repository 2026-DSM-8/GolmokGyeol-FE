import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useMemo, useState } from 'react'
import { KOREAN_ADMINISTRATIVE_DISTRICTS } from '../../data/koreanAdministrativeDistricts'
import type { SearchScope } from '../../store/useTasteStore'

type NeighborhoodSelectorProps = {
  onSelect: (scope: SearchScope) => void
}

type NeighborhoodOption = SearchScope & {
  count: number
}

const countFor = (value: string) => 48 + [...value].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 184

const allNeighborhoods: NeighborhoodOption[] = Object.entries(KOREAN_ADMINISTRATIVE_DISTRICTS).flatMap(([city, districts]) => (
  Object.entries(districts).flatMap(([district, neighborhoods]) => (
    neighborhoods.map((neighborhood) => ({ city, district, neighborhood, count: countFor(`${city}${district}${neighborhood}`) }))
  ))
))

const popularScopes: SearchScope[] = [
  { city: '대전광역시', district: '중구', neighborhood: '은행동' },
  { city: '대전광역시', district: '유성구', neighborhood: '궁동' },
  { city: '대전광역시', district: '서구', neighborhood: '둔산동' },
  { city: '대전광역시', district: '유성구', neighborhood: '봉명동' },
  { city: '대전광역시', district: '유성구', neighborhood: '봉명동' },
  { city: '대전광역시', district: '중구', neighborhood: '대흥동' },
]

const popularLabels = ['은행동', '궁동', '둔산동', '유성온천', '봉명동', '대흥동']

export function NeighborhoodSelector({ onSelect }: NeighborhoodSelectorProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const results = useMemo(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      return popularScopes.map((scope, index) => ({ ...scope, neighborhood: popularLabels[index], count: countFor(popularLabels[index]) }))
    }
    return allNeighborhoods
      .filter(({ city, district, neighborhood }) => `${city} ${district} ${neighborhood}`.includes(trimmed))
      .slice(0, 6)
  }, [query])

  const pick = (option: NeighborhoodOption) => {
    const actualNeighborhood = option.neighborhood === '유성온천' ? '봉명동' : option.neighborhood
    onSelect({ city: option.city, district: option.district, neighborhood: actualNeighborhood })
  }

  return (
    <Page>
      <Content>
        <Brand $delay={0}>골목결</Brand>
        <Heading $delay={80}>어느 동네를 볼까요?</Heading>
        <Lede $delay={160}>그 안에 있는 식당들만 살펴볼게요.</Lede>

        <SearchWrap $delay={240}>
          <SearchField $focused={focused}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="동 이름을 입력하세요"
              aria-label="전국 읍면동 검색"
            />
          </SearchField>
        </SearchWrap>

        <FrequentNeighborhoods $delay={320}>
          <h2>{query.trim() ? '검색 결과' : '자주 찾는 곳'}</h2>
          {results.length ? (
            <NeighborhoodGrid>
              {results.map((option, index) => (
                <button key={`${option.city}-${option.district}-${option.neighborhood}-${index}`} onClick={() => pick(option)}>
                  <NeighborhoodName>{option.neighborhood}</NeighborhoodName>
                  <span>{option.count}곳</span>
                  {query.trim() && <small>{option.city} · {option.district}</small>}
                </button>
              ))}
            </NeighborhoodGrid>
          ) : (
            <NeighborhoodEmpty>그 이름의 동네는 아직 없어요.</NeighborhoodEmpty>
          )}
        </FrequentNeighborhoods>

        <NearbyButton $delay={520} onClick={() => onSelect(popularScopes[0])}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          내 주변으로 찾기
        </NearbyButton>
      </Content>
    </Page>
  )
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
`

const Page = styled.main`
  min-height: 100dvh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: var(--ink);
`

const Content = styled.div`
  width: 100%;
  max-width: 680px;
  padding: 88px 24px;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) { padding-top: 72px; }
  @media (max-width: 640px) { padding: 56px 18px 40px; }
`

const enter = (delay: number) => css`
  opacity: 0;
  animation: ${fadeUp} 460ms cubic-bezier(.4, 0, .2, 1) ${delay}ms forwards;
`

const Brand = styled.p<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: .18em;
  text-align: center;
`

const Heading = styled.h1<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin: 48px 0 0;
  font-size: 40px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -.02em;
  text-align: center;

  @media (max-width: 640px) { margin-top: 36px; font-size: 34px; }
`

const Lede = styled.p<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin: 14px 0 0;
  color: var(--sub);
  font-size: 18px;
  line-height: 1.7;
  letter-spacing: -.01em;
  text-align: center;
`

const SearchWrap = styled.div<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin-top: 52px;
  @media (max-width: 640px) { margin-top: 36px; }
`

const SearchField = styled.div<{ $focused: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  height: 64px;
  padding: 0 24px;
  border: 1px solid ${({ $focused }) => $focused ? 'var(--accent)' : 'var(--line)'};
  border-radius: 999px;
  color: var(--muted);
  background: var(--card);
  transition: border-color 150ms cubic-bezier(.4, 0, .2, 1);

  > svg { flex: none; width: 24px; height: 24px; }
  input { flex: 1; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 18px; letter-spacing: -.01em; }
  input::placeholder { color: var(--muted); opacity: 1; }
`

const FrequentNeighborhoods = styled.section<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  margin-top: 28px;
  h2 { margin: 0; color: var(--sub); font-size: 15px; font-weight: 400; line-height: 1.5; }
`

const NeighborhoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 14px;

  button { position: relative; height: 88px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 4px; min-width: 0; padding: 0 20px; border: 1px solid var(--line); border-radius: 12px; color: var(--muted); background: var(--card); cursor: pointer; text-align: left; transition: all 150ms cubic-bezier(.4, 0, .2, 1); }
  button:hover { border-color: #3a3733; background: var(--quote); transform: translateY(-1px); }
  button:active { transform: scale(.98); }
  button > span:not(:first-of-type) { color: var(--muted); font-size: 14px; }
  small { position: absolute; right: 11px; bottom: 8px; max-width: calc(100% - 22px); overflow: hidden; color: var(--muted); font-size: 11px; font-weight: 400; text-overflow: ellipsis; white-space: nowrap; opacity: .8; }

  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); gap: 10px; }
`

const NeighborhoodName = styled.span`
  max-width: 100%;
  overflow: hidden;
  color: var(--ink);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const NeighborhoodEmpty = styled.p`
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 13px;
  text-align: center;
`

const NearbyButton = styled.button<{ $delay: number }>`
  ${({ $delay }) => enter($delay)}
  width: 100%;
  height: 60px;
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--sub);
  background: transparent;
  cursor: pointer;
  font-size: 17px;
  letter-spacing: -.01em;
  transition: all 150ms cubic-bezier(.4, 0, .2, 1);

  &:hover { border-color: #3a3733; color: var(--ink); background: var(--quote); }
  &:active { transform: scale(.98); }
`
