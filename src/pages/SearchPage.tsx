import { Navigate, useNavigate } from 'react-router'
import { SearchExperience, TasteBackdrop } from '../components/landing'
import { useTasteStore } from '../store/useTasteStore'

export function SearchPage() {
  const navigate = useNavigate()
  const searchScope = useTasteStore((state) => state.searchScope)
  const setQuery = useTasteStore((state) => state.setQuery)

  if (!searchScope.neighborhood) {
    return <Navigate to="/" replace />
  }

  const search = (query: string) => {
    setQuery(query)
    navigate('/taste-map')
  }

  return (
    <div className="prototype-flow">
      <TasteBackdrop />
      <SearchExperience
        scope={searchScope}
        onChangeNeighborhood={() => navigate('/')}
        onSearch={search}
      />
    </div>
  )
}
