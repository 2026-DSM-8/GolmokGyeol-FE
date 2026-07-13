import type { Restaurant } from '../types/restaurant'

export const defaultSearchQuery = '비 오는 날 혼자 조용히 밥 먹기 좋은 곳'

export const restaurants: Restaurant[] = [
  { id: 1, name: '소소한밥상', category: '한식', reviews: 142, keywords: ['창가 자리', '반찬 푸짐', '조용'], quote: '비 오는 날 창가에 혼자 앉았는데, 아무도 말을 걸지 않아서 좋았다.', source: 'blog.naver.com/daejeon_walk', address: '대전 중구 은행동 145-2', position: [-0.7, -0.55] },
  { id: 2, name: '골목국수', category: '국수', reviews: 38, keywords: ['멸치육수', '혼자서도', '여섯 테이블'], quote: '테이블이 여섯 개뿐. 국수 마는 소리가 다 들린다.', source: 'blog.naver.com/noodle_diary', address: '대전 중구 은행동 12-7', position: [-0.5, -0.8] },
  { id: 3, name: '혼밥식당', category: '백반', reviews: 88, keywords: ['1인석', '칸막이', '빠른 회전'], quote: '혼자 먹는 게 기본값인 식당. 이상하게 마음이 편하다.', source: 'blog.naver.com/honbob_map', address: '대전 중구 은행동 88-1', position: [-0.3, -0.9] },
  { id: 4, name: '조용한식탁', category: '덮밥', reviews: 64, keywords: ['낮은 음악', '덮밥', '혼자 한 시간'], quote: '음악 소리가 대화보다 작다. 책 읽으면서 먹었다.', source: 'brunch.co.kr/@quietseat', address: '대전 중구 은행동 31-5', position: [-0.85, -0.35] },
  { id: 6, name: '브런치가든', category: '브런치', reviews: 91, keywords: ['채광', '테라스', '브런치세트'], quote: '오전 11시의 채광이 좋다. 사진이 잘 나오는 집.', source: 'blog.naver.com/brunch_day', address: '대전 중구 은행동 55-3', position: [0.15, 0.4] },
  { id: 7, name: '루체', category: '양식', reviews: 210, keywords: ['코스', '기념일', '예약제'], quote: '기념일에 갔는데 조명이 딱 좋았다. 목소리가 낮아지는 곳.', source: 'blog.naver.com/date_course', address: '대전 중구 은행동 77-2', position: [-0.2, 0.55] },
  { id: 8, name: '비하인드', category: '와인바', reviews: 156, keywords: ['내추럴와인', '바 좌석', '늦은 밤'], quote: '간판이 없다. 문을 열면 다른 세계다.', source: 'blog.naver.com/wine_alley', address: '대전 중구 은행동 21-9', position: [-0.6, 0.3] },
  { id: 9, name: '온기', category: '카페', reviews: 73, keywords: ['핸드드립', '좌석 간격', '식사 되는 카페'], quote: '테이블 사이가 멀어서 대화가 섞이지 않는다.', source: 'blog.naver.com/cafe_hopper', address: '대전 중구 은행동 40-6', position: [-0.75, -0.1] },
  { id: 10, name: '청춘포차', category: '포차', reviews: 301, keywords: ['단체석', '새벽 2시', '안주 푸짐'], quote: '금요일 밤엔 자리가 없다. 그 시끌시끌함이 좋아서 간다.', source: 'blog.naver.com/night_alley', address: '대전 중구 은행동 99-1', position: [0.85, 0.7] },
  { id: 11, name: '밤골목', category: '호프', reviews: 188, keywords: ['수제맥주', '야장', '골목 안쪽'], quote: '골목 끝에서 노란 불빛이 새어 나온다. 그게 여기다.', source: 'blog.naver.com/beer_walk', address: '대전 중구 은행동 63-4', position: [0.65, 0.45] },
  { id: 12, name: '대폿집', category: '술집', reviews: 95, keywords: ['막걸리', '모둠전', '30년'], quote: '30년 된 집. 벽에 낙서가 연대기처럼 쌓여 있다.', source: 'blog.naver.com/oldhouse_log', address: '대전 중구 은행동 8-2', position: [0.5, 0.25] },
  { id: 13, name: '엄마손밥상', category: '백반', reviews: 110, keywords: ['반찬 8가지', '리필', '그날의 국'], quote: '밥 더 달라기 전에 먼저 물어봐주신다.', source: 'brunch.co.kr/@warmrice', address: '대전 중구 은행동 17-11', position: [0.05, -0.35] },
  { id: 14, name: '백반천국', category: '백반', reviews: 143, keywords: ['셀프바', '회전 빠름', '직장인'], quote: '든든하다는 말이 정확한 집.', source: 'brunch.co.kr/@tastewalk', address: '대전 중구 은행동 120-3', position: [0.35, -0.15] },
]

export type ReviewEvidenceItem = {
  quote: string
  source: string
}

const reviewEvidence: Record<number, ReviewEvidenceItem[]> = {
  1: [
    { quote: '비 오는 날 창가에 혼자 앉았는데, 아무도 말을 걸지 않아서 좋았다', source: 'blog.naver.com/daejeon_walk' },
    { quote: '반찬이 조용히 훌륭하다. 하나하나 집반찬 맛', source: 'blog.naver.com/bapsang_log' },
    { quote: '점심시간인데도 소란스럽지 않다. 숟가락 소리만 들리는 집', source: 'brunch.co.kr/@eunhaeng' },
  ],
  2: [
    { quote: '테이블이 여섯 개뿐. 국수 마는 소리가 다 들린다', source: 'blog.naver.com/noodle_diary' },
    { quote: '멸치육수가 말갛다. 혼자 후루룩 먹고 나오기 좋다', source: 'blog.naver.com/honbob_map' },
    { quote: '간판이 작아서 두 번 지나쳤다. 세 번째에 들어갔다', source: 'brunch.co.kr/@golmok' },
  ],
}

export const getReviewEvidence = (restaurant: Restaurant): ReviewEvidenceItem[] => (
  reviewEvidence[restaurant.id] ?? [
    { quote: restaurant.quote, source: restaurant.source },
    { quote: `${restaurant.keywords[0]}이 인상적이고 혼자 머물기에도 편안했다`, source: restaurant.source },
    { quote: `${restaurant.keywords[1]} 때문에 다음에도 다시 찾고 싶은 곳`, source: restaurant.source },
  ]
)
