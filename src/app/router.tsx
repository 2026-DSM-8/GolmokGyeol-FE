import { Navigate, Route, Routes } from 'react-router'
import { LandingPage } from '../pages/LandingPage'
import { EvaluationComparisonPage } from '../pages/EvaluationComparisonPage'
import { RestaurantDetailPage } from '../pages/RestaurantDetailPage'
import { SearchPage } from '../pages/SearchPage'
import { TasteMapPage } from '../pages/TasteMapPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/taste-map" element={<TasteMapPage />} />
      <Route path="/restaurants/:restaurantId" element={<RestaurantDetailPage />} />
      <Route path="/review/comparison" element={<EvaluationComparisonPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
