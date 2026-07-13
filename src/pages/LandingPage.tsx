import { useNavigate } from 'react-router'
import { SearchForm, TasteBackdrop } from '../components/landing'
import { searchSuggestions } from '../mocks/restaurants'
import { useTasteStore } from '../store/useTasteStore'

export function LandingPage() {
  const navigate = useNavigate()
  const query = useTasteStore((state) => state.query)
  const setQuery = useTasteStore((state) => state.setQuery)
  const search = (nextQuery: string) => { setQuery(nextQuery); navigate('/taste-map') }
  return (
    <main className="landing-page">
      <TasteBackdrop />
      <section className="landing-content" aria-labelledby="landing-title">
        <p className="landing-brand">골목결</p>
        <h1 id="landing-title">오늘, 어떤 자리에 앉고 싶으세요</h1>
        <p className="landing-lede">문장으로 말해보세요. 골목이 다시 그려집니다.</p>
        <SearchForm placeholder={query} onSubmit={search} />
        <div className="search-examples"><div>{searchSuggestions.map((suggestion) => <button key={suggestion} onClick={() => search(suggestion)}>{suggestion}</button>)}</div></div>
        <footer className="landing-footer">대전 은행동 · 식당 52곳</footer>
      </section>
    </main>
  )
}
