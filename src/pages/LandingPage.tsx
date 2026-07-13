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
    <div className="prototype-flow">
      <TasteBackdrop />
      <NeighborhoodSelector onSelect={selectNeighborhood} />
    </div>
  )
}
