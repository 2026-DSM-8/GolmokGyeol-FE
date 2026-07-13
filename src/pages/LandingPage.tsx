import styled from '@emotion/styled'
import { useNavigate } from 'react-router'
import { NeighborhoodSelector, TasteBackdrop } from '../components/landing'
import { useTasteStore } from '../store/useTasteStore'

export function LandingPage() {
  const navigate = useNavigate()
  const setSearchScope = useTasteStore((state) => state.setSearchScope)
  const selectNeighborhood = (scope: Parameters<typeof setSearchScope>[0]) => {
    setSearchScope(scope)
    navigate('/search')
  }

  return (
    <Flow>
      <TasteBackdrop />
      <NeighborhoodSelector onSelect={selectNeighborhood} />
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
