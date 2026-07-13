import { useState } from 'react'
import type { FormEvent } from 'react'
import type { SearchScope } from '../../store/useTasteStore'

type SearchExperienceProps = {
  scope: SearchScope
  onChangeNeighborhood: () => void
  onSearch: (query: string) => void
}

type Reask = {
  query: string
  headline: string
  subline: string
  placeholder: string
  options: string[]
  showAll?: boolean
}

const examples = ['혼자 조용히', '친구랑 수다', '후딱 한 끼', '오래 앉아있기']
const cuisines = ['닭갈비', '삼겹살', '국밥', '파스타', '초밥', '냉면', '피자', '치킨', '쌀국수', '곱창', '김밥', '라멘', '돈까스', '막창', '갈비', '보쌈']
const genericWords = ['맛집', '추천', '근처', '유명', '인기', '베스트', 'best']

export function SearchExperience({ scope, onChangeNeighborhood, onSearch }: SearchExperienceProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [reask, setReask] = useState<Reask | null>(null)

  const routeQuery = (raw: string) => {
    const nextQuery = raw.trim()
    if (!nextQuery) return
    const cuisine = cuisines.find((item) => nextQuery.includes(item))
    if (cuisine) {
      setReask({
        query: nextQuery,
        headline: `${scope.neighborhood}에 ${cuisine}집이\n8곳 있어요.`,
        subline: '그런데 다 다른 집이에요.\n어떤 자리를 찾으세요?',
        placeholder: `예: “회식용 ${cuisine}집”`,
        options: ['혼자 조용히', '여럿이 왁자지껄', '가성비 좋게', '분위기 있게'],
        showAll: true,
      })
      return
    }
    if (genericWords.some((word) => nextQuery.toLowerCase().includes(word.toLowerCase()))) {
      setReask({
        query: nextQuery,
        headline: '맛있는 집은\n네이버가 더 잘 알아요.',
        subline: '저희는 다른 걸 알려드릴게요.\n어떤 자리를 원하세요?',
        placeholder: '예: 비 오는 날 혼자 앉기 좋은 곳',
        options: ['혼자 조용히', '친구랑 수다', '후딱 한 끼', '오래 앉아있기', '가성비 좋게', '특별한 날'],
      })
      return
    }
    onSearch(nextQuery)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    routeQuery(query)
  }

  return (
    <main className={`prototype-search-page ${focused || reask ? 'is-sharp' : ''}`}>
      <header className="prototype-topbar">
        <span className="prototype-wordmark">골목결</span>
        <div>
          <span>{scope.neighborhood} · 식당 187곳</span>
          <button onClick={onChangeNeighborhood}>바꾸기</button>
        </div>
      </header>

      <div className="prototype-search-stage">
        {reask ? (
          <section className="reask-view prototype-enter">
            <button className="reask-query" onClick={() => setReask(null)} aria-label="검색 화면으로 돌아가기">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11" />
              </svg>
              “{reask.query}”
            </button>
            <div className="reask-divider" />
            <h1>{reask.headline}</h1>
            <p>{reask.subline}</p>
            <div className="reask-grid">
              {reask.options.map((option, index) => <button key={option} className={`reask-option option-${index % 4}`} onClick={() => onSearch(option)}>{option}</button>)}
            </div>
            <span className="reask-direct-label">또는 직접 말해보세요</span>
            <form className={`reask-input ${focused ? 'is-focused' : ''}`} onSubmit={submit}>
              <input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={reask.placeholder} />
            </form>
            {reask.showAll && <button className="show-all-button" onClick={() => onSearch(reask.query)}>8곳 그냥 다 보기</button>}
          </section>
        ) : (
          <section className="search-view">
            <h1 className="prototype-enter delay-0">오늘은 어떤 자리에<br />앉고 싶어요?</h1>
            <p className="search-view-lede prototype-enter delay-1">편하게 말해보세요.<br />골목이 다시 그려질 거예요.</p>
            <form className="prototype-query-form prototype-enter delay-2" onSubmit={submit}>
              <div className={`prototype-search-field ${focused ? 'is-focused' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="혼자 조용히 밥 먹고 싶어" />
                <button type="submit" className={query.trim() ? 'is-ready' : ''} aria-label="찾기">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
              </div>
            </form>
            <div className="prototype-example-grid prototype-enter delay-3">
              {examples.map((example) => <button key={example} onClick={() => onSearch(example)}>{example}</button>)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
