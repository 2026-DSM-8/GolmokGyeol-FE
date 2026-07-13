import { useState } from 'react'
import type { FormEvent } from 'react'
import { KOREAN_ADMINISTRATIVE_DISTRICTS } from '../../data/koreanAdministrativeDistricts'
import type { SearchScope } from '../../store/useTasteStore'

type SearchFormProps = {
  defaultQuery: string
  scope: SearchScope
  error: string
  onSubmit: (query: string) => void
  onScopeChange: (scope: SearchScope) => void
}

export function SearchForm({ defaultQuery, scope, error, onSubmit, onScopeChange }: SearchFormProps) {
  const [value, setValue] = useState('')
  const cities = Object.keys(KOREAN_ADMINISTRATIVE_DISTRICTS)
  const districts = scope.city ? Object.keys(KOREAN_ADMINISTRATIVE_DISTRICTS[scope.city] ?? {}) : []
  const neighborhoods = scope.city && scope.district
    ? KOREAN_ADMINISTRATIVE_DISTRICTS[scope.city]?.[scope.district] ?? []
    : []

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit(value.trim() || defaultQuery)
  }

  return (
    <div className="landing-search">
      <div className="location-filter" aria-label="검색 범위 설정">
        <label>
          <span>시·도</span>
          <select
            value={scope.city}
            onChange={(event) => onScopeChange({ city: event.target.value, district: '', neighborhood: '' })}
          >
            <option value="">시·도 선택</option>
            {cities.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </label>
        <span className="location-divider" aria-hidden="true">›</span>
        <label>
          <span>시·군·구</span>
          <select
            value={scope.district}
            disabled={!scope.city}
            onChange={(event) => onScopeChange({ ...scope, district: event.target.value, neighborhood: '' })}
          >
            <option value="">시·군·구 선택</option>
            {districts.map((district) => <option key={district} value={district}>{district}</option>)}
          </select>
        </label>
        <span className="location-divider" aria-hidden="true">›</span>
        <label>
          <span>읍·면·동</span>
          <select
            value={scope.neighborhood}
            disabled={!scope.district}
            aria-invalid={Boolean(error)}
            onChange={(event) => onScopeChange({ ...scope, neighborhood: event.target.value })}
          >
            <option value="">읍·면·동 선택</option>
            {neighborhoods.map((neighborhood) => <option key={neighborhood} value={neighborhood}>{neighborhood}</option>)}
          </select>
        </label>
      </div>
      <form className="search-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="main-search">원하는 식당을 문장으로 검색</label>
        <input
          id="main-search"
          value={value}
          placeholder="원하는 분위기나 상황을 입력하세요"
          aria-describedby={error ? 'search-scope-error' : undefined}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="submit">찾기</button>
      </form>
      {error && <p className="search-error" id="search-scope-error" role="alert">{error}</p>}
    </div>
  )
}
