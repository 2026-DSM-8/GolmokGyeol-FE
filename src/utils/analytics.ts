import { api } from '../api/golmok'
import type { AnalyticsEvent } from '../types/restaurant'

export const trackEvent = (event: AnalyticsEvent) => {
  void api.event(event).catch(() => undefined)
}
