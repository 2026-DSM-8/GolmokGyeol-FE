import styled from '@emotion/styled'
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
