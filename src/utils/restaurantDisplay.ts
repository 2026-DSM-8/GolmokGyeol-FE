import type { Restaurant } from '../types/restaurant'

export const formatQuadrantLabel = (label: string) =>
  label.replace(/\s*\([^)]*\)\s*$/, '').trim()

export const naverMapSearchUrl = (
  restaurant: Pick<Restaurant, 'name' | 'address' | 'locationDesc'>,
) => {
  const name = restaurant.name.trim()
  const address = restaurant.address.trim()
  const query = [name, address].filter(Boolean).join(' ')
    || restaurant.locationDesc.trim()

  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`
}

export const sourceHref = (source: string) =>
  /^https?:\/\//i.test(source) ? source : `https://${source}`

export const sourceLabel = (source: string) => {
  try {
    const url = new URL(sourceHref(source))
    const hostname = url.hostname.replace(/^www\./, '')
    const author = url.pathname.split('/').filter(Boolean)[0]

    if (hostname === 'blog.naver.com' || hostname === 'm.blog.naver.com') {
      return author ? `네이버 블로그 · ${author}` : '네이버 블로그'
    }
    if (hostname.endsWith('.tistory.com')) {
      return `티스토리 · ${hostname.replace('.tistory.com', '')}`
    }
    return hostname
  } catch {
    return '블로그 출처'
  }
}
