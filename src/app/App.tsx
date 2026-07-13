import { Global } from '@emotion/react'
import { AppProviders } from './providers'
import { AppRouter } from './router'
import { globalStyles } from './globalStyles'

export function App() {
  return (
    <AppProviders>
      <Global styles={globalStyles} />
      <AppRouter />
    </AppProviders>
  )
}
