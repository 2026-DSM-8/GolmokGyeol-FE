import type { Restaurant } from '../types/restaurant'

const restaurantIntentPattern = /맛집|맛있|식당|음식점|밥|먹|식사|한\s*끼|메뉴|요리|안주|술집|주점|포차|카페|커피|베이커리|빵집|디저트|브런치|조식|야식|아침|점심|저녁|회식|외식|배달|포장|배고|한식|중식|일식|양식|분식|고기|삼겹살|갈비|곱창|막창|닭갈비|닭똥집|국밥|파스타|초밥|스시|횟집|냉면|피자|치킨|쌀국수|김밥|라멘|라면|돈까스|돈가스|보쌈|족발|찌개|감자탕|전골|샤브|떡볶이|순대|해산물|곰탕|설렁탕|칼국수|우동|짜장|짬뽕|마라|햄버거|버거|샌드위치|샐러드|맥주|소주|와인|케이크|빙수/

const diningPreferencePattern = /혼자|혼밥|친구|같이|함께|수다|떠들|여럿|모임|단체|데이트|가족|아이|조용|차분|고요|시끄|시끌|왁자|북적|활기|후딱|빨리|빠른|간단|오래|느긋|여유|가성비|분위기|특별|기념일|비\s*오는|눈\s*오는|따뜻|시원|매운|맵게|담백|든든|배부|건강|채식|비건|넓은|아늑|야외|테라스|늦게|새벽|웨이팅|예약|주차/

const genericRestaurantQueryPattern = /^(?:(?:추천|근처|유명한?|인기|베스트|best)\s*)+$/i

const inappropriateQueryPattern = /(?<!닭)똥(?!집)|오줌|소변|대변|엿\s*먹|시발|씨발|개새끼|병신|ㅅㅂ|凸/

const unsupportedPlaceIntents: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /볼링\s*(?:장|을|치|하)/, label: '볼링장' },
  { pattern: /당구\s*(?:장|를|치|하)/, label: '당구장' },
  { pattern: /노래방|코인\s*노래/, label: '노래방' },
  { pattern: /(?:PC|피시)\s*방/i, label: 'PC방' },
  { pattern: /영화관|극장/, label: '영화관' },
  { pattern: /방\s*탈출/, label: '방탈출 카페' },
  { pattern: /헬스장|피트니스/, label: '헬스장' },
  { pattern: /스크린\s*골프|골프장/, label: '골프장' },
  { pattern: /호텔|모텔|펜션|숙소/, label: '숙박 시설' },
  { pattern: /미용실|네일숍|네일샵|세탁소|은행|병원|약국/, label: '생활 시설' },
  { pattern: /공원|박물관|미술관|놀이공원|동물원|도서관/, label: '문화·여가 시설' },
  { pattern: /옷\s*가게|서점|문구점|마트|편의점/, label: '상점' },
]

export const getUnsupportedPlaceCategory = (query: string) => {
  if (restaurantIntentPattern.test(query)) return null
  return unsupportedPlaceIntents.find(({ pattern }) => pattern.test(query))?.label ?? null
}

export const getSearchQueryError = (query: string) => {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) return null

  if (inappropriateQueryPattern.test(normalizedQuery)) {
    return '음식점과 관련된 검색어를 입력해주세요. 예: 혼자 조용히 밥 먹을 곳'
  }

  const unsupportedPlace = getUnsupportedPlaceCategory(normalizedQuery)
  if (unsupportedPlace) {
    return `골목결은 음식점만 추천할 수 있어요. ${unsupportedPlace} 같은 비음식 장소는 아직 찾을 수 없어요.`
  }

  const hasSupportedIntent = restaurantIntentPattern.test(normalizedQuery)
    || diningPreferencePattern.test(normalizedQuery)
    || genericRestaurantQueryPattern.test(normalizedQuery)

  if (!hasSupportedIntent) {
    return '음식이나 원하는 식사 분위기를 입력해주세요. 예: 친구랑 수다 떨기 좋은 곳'
  }

  return null
}

const cuisineFallbacks: Array<{ pattern: RegExp; query: string }> = [
  { pattern: /고깃?집|고기\s*(?:구이)?/, query: '삼겹살 갈비 고기 구이집' },
  { pattern: /삼겹살/, query: '삼겹살 고기 구이집' },
  { pattern: /갈비/, query: '갈비 고기 구이집' },
  { pattern: /곱창|막창/, query: '곱창 막창 구이집' },
  { pattern: /닭갈비/, query: '닭갈비집' },
  { pattern: /국밥/, query: '국밥집' },
  { pattern: /파스타/, query: '파스타집' },
  { pattern: /초밥|스시/, query: '초밥 스시집' },
  { pattern: /냉면/, query: '냉면집' },
  { pattern: /피자/, query: '피자집' },
  { pattern: /치킨/, query: '치킨집' },
  { pattern: /쌀국수/, query: '쌀국수집' },
  { pattern: /김밥/, query: '김밥집' },
  { pattern: /라멘|라면/, query: '라멘 라면집' },
  { pattern: /돈까스|돈가스/, query: '돈까스 돈가스집' },
  { pattern: /보쌈/, query: '보쌈집' },
]

const displayIntents: Array<{ query: RegExp; evidence: RegExp; label: string }> = [
  {
    query: /고깃?집|고기|삼겹살|갈비|곱창|막창|구이/,
    evidence: /고깃?집|고기|삼겹살|갈비|곱창|막창|목살|항정살|구이|돼지고기|소고기/,
    label: '고깃집',
  },
  {
    query: /친구|같이|함께|여럿|모임|회식|단체/,
    evidence: /친구|같이|함께|여럿|모임|회식|단체|사촌|일행|명(?:이|과|에서)/,
    label: '친구 모임',
  },
  {
    query: /떠들|수다|왁자|시끄|시끌|북적|활기/,
    evidence: /떠들|수다|왁자|시끄|시끌|북적|활기|손님이 많|사람이 많|웨이팅/,
    label: '활기찬 분위기',
  },
  {
    query: /조용|차분|고요/, evidence: /조용|차분|고요|잔잔|말소리가 작/, label: '조용한 분위기',
  },
  {
    query: /혼자|혼밥|1인/, evidence: /혼자|혼밥|1인|바 자리|카운터석/, label: '혼밥',
  },
  {
    query: /후딱|빨리|빠른|간단/, evidence: /후딱|빨리|빠른|회전|분 안|금방/, label: '빠른 식사',
  },
  {
    query: /오래|느긋|여유/, evidence: /오래|느긋|여유|천천히|머물/, label: '여유로운 식사',
  },
]

export const getCuisineFallbackQuery = (query: string) =>
  cuisineFallbacks.find(({ pattern }) => pattern.test(query))?.query ?? null

const restaurantEvidence = (restaurant: Restaurant) => [
  restaurant.name,
  restaurant.category,
  restaurant.quote,
  restaurant.matchedSnippet.text,
  ...restaurant.keywords,
  ...restaurant.mentions.map(({ text }) => text),
  ...restaurant.snippets.map(({ text }) => text),
].join(' ')

export const getRelevantRestaurantKeywords = (
  restaurant: Restaurant,
  query?: string,
  limit = 2,
) => {
  if (!query) return restaurant.keywords.slice(0, limit)

  const matchingIntents = displayIntents.filter((intent) => intent.query.test(query))
  if (matchingIntents.length === 0) return restaurant.keywords.slice(0, limit)

  const evidence = restaurantEvidence(restaurant)
  return matchingIntents
    .filter((intent) => intent.evidence.test(evidence))
    .map((intent) => intent.label)
    .slice(0, limit)
}
