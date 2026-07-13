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
    <main className="neighborhood-page">
      <div className="neighborhood-content">
        <p className="prototype-brand prototype-enter delay-0">골목결</p>
        <h1 className="prototype-enter delay-1">어느 동네를 볼까요?</h1>
        <p className="neighborhood-lede prototype-enter delay-2">그 안에 있는 식당들만 살펴볼게요.</p>

        <div className="neighborhood-search-wrap prototype-enter delay-3">
          <div className={`prototype-search-field ${focused ? 'is-focused' : ''}`}>
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
          </div>
        </div>

        <section className="frequent-neighborhoods prototype-enter delay-4">
          <h2>{query.trim() ? '검색 결과' : '자주 찾는 곳'}</h2>
          {results.length ? (
            <div className="neighborhood-grid">
              {results.map((option, index) => (
                <button key={`${option.city}-${option.district}-${option.neighborhood}-${index}`} onClick={() => pick(option)}>
                  <span className="neighborhood-name">{option.neighborhood}</span>
                  <span>{option.count}곳</span>
                  {query.trim() && <small>{option.city} · {option.district}</small>}
                </button>
              ))}
            </div>
          ) : (
            <p className="neighborhood-empty">그 이름의 동네는 아직 없어요.</p>
          )}
        </section>

        <button className="nearby-button prototype-enter delay-5" onClick={() => onSelect(popularScopes[0])}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          내 주변으로 찾기
        </button>
      </div>
    </main>
  )
}
