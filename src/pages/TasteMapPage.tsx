import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { MapQueryHeader, RecommendationCard, RestaurantSidebar, TasteMap } from '../components/taste-map'
import { useTasteRecommendations } from '../hooks/useTasteRecommendations'
import { searchSuggestions } from '../mocks/restaurants'
import { useTasteStore } from '../store/useTasteStore'
import type { Restaurant } from '../types/restaurant'

export function TasteMapPage() {
  const navigate = useNavigate()
  const query = useTasteStore((state) => state.query)
  const setQuery = useTasteStore((state) => state.setQuery)
  const taste = useTasteStore((state) => state.taste)
  const setTaste = useTasteStore((state) => state.setTaste)
  const recommendations = useTasteRecommendations(taste)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(query)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const openRestaurant = (restaurant: Restaurant) => setSelectedRestaurant(restaurant)
  const findSimilar = (restaurant: Restaurant) => { setTaste(restaurant.position); setSelectedRestaurant(null) }
  const saveQuery = (event: FormEvent) => { event.preventDefault(); if (!draft.trim()) return; setQuery(draft.trim()); setEditing(false) }
  const applySuggestion = (suggestion: string) => { setQuery(suggestion); setDraft(suggestion) }
  const tasteWords = `${taste[0] < 0 ? '조용함' : '활기참'} · ${taste[1] < 0 ? '혼자' : '여럿이'} · ${taste[0] < -0.2 ? '작은 공간' : '열린 자리'}`

  return (
    <main className="map-page">
      <MapQueryHeader
        query={query}
        draft={draft}
        editing={editing}
        suggestions={searchSuggestions.filter((suggestion) => suggestion !== query)}
        onBack={() => navigate('/')}
        onDraftChange={setDraft}
        onEdit={() => setEditing(true)}
        onCancelEdit={() => setEditing(false)}
        onSubmit={saveQuery}
        onSuggestion={applySuggestion}
      />
      <section className="map-layout">
        <div className="map-column">
          <TasteMap taste={taste} onTasteChange={setTaste} recommendations={recommendations} onOpenRestaurant={openRestaurant} />
        </div>
        <aside className="recommendation-rail" aria-label={selectedRestaurant ? `${selectedRestaurant.name} 상세 정보` : '취향과 가까운 추천 식당'}>
          {selectedRestaurant ? (
            <RestaurantSidebar
              restaurant={selectedRestaurant}
              onBack={() => setSelectedRestaurant(null)}
              onFindSimilar={() => findSimilar(selectedRestaurant)}
            />
          ) : (
            <>
              <p className="taste-traits"><span />{tasteWords}</p>
              <div className="recommendation-list">{recommendations.map((restaurant, index) => <RecommendationCard key={restaurant.id} restaurant={restaurant} order={index + 1} onClick={() => openRestaurant(restaurant)} />)}</div>
            </>
          )}
        </aside>
      </section>
    </main>
  )
}
