import styled from '@emotion/styled'
import { Navigate, useNavigate } from 'react-router'
import { api } from '../api/golmok'
import { SearchExperience, TasteBackdrop } from '../components/landing'
import { useTasteStore } from '../store/useTasteStore'
import { getCuisineFallbackQuery } from '../utils/searchIntent'

export function SearchPage() {
  const navigate = useNavigate()
  const searchScope = useTasteStore((state) => state.searchScope)
  const setQuery = useTasteStore((state) => state.setQuery)
  const setMapResult = useTasteStore((state) => state.setMapResult)

  if (!searchScope.neighborhood) {
    return <Navigate to="/" replace />
  }

  const search = async (query: string, force = false) => {
    const skipReask = force || query.includes('음식점')
    let response = await api.search(searchScope.neighborhood, query, skipReask)
    const fallbackQuery = getCuisineFallbackQuery(query)

    if (response.type === 'map' && response.restaurants.length < 5 && fallbackQuery) {
      const fallbackResponse = await api.search(searchScope.neighborhood, fallbackQuery, skipReask)
      if (fallbackResponse.type === 'map' && fallbackResponse.restaurants.length > response.restaurants.length) {
        response = {
          ...fallbackResponse,
          banner: { ...fallbackResponse.banner, label: response.banner.label },
        }
      }
    }

    if (response.type === 'map') {
      setQuery(query)
      setMapResult(response)
      navigate('/taste-map')
    }
    return response
  }

  return (
    <Flow>
      <TasteBackdrop />
      <SearchExperience
        scope={searchScope}
        onChangeNeighborhood={() => navigate('/')}
        onSearch={search}
      />
    </Flow>
  )
}

const Flow = styled.div`
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  background: var(--background);

  > :not(:first-of-type) {
    position: relative;
    z-index: 1;
  }
`
