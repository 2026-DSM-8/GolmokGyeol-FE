import { Navigate, Route, Routes } from 'react-router'
import { LandingPage } from '../pages/LandingPage'
import { RestaurantDetailPage } from '../pages/RestaurantDetailPage'
import { TasteMapPage } from '../pages/TasteMapPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/taste-map" element={<TasteMapPage />} />
      <Route path="/restaurants/:restaurantId" element={<RestaurantDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
