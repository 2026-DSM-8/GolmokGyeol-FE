# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-07-14
- Primary product surfaces: 동 선택, 자연어 검색, 취향 지도, 식당 상세, 심사위원용 추천 비교
- Evidence reviewed: `README.md`, `docs/prototype/골목결.dc.html`, `docs/prototype-v2/*.dc.html`, `src/app/globalStyles.ts`, `src/pages/*`, `src/components/taste-map/*`, `src/components/restaurant-detail/*`

## Brand
- Personality: 조용하고 탐색적인 골목 안내자. 점수보다 취향과 발견의 맥락을 설명한다.
- Trust signals: 후기 수와 근거 문장, 추정 정보의 명시, 외부 지도 연결.
- Avoid: 과장된 순위, 검증되지 않은 단정, 강한 세일즈 문구, 과도한 장식과 고채도 면적.

## Product goals
- Goals: 사용자가 동네 식당을 취향 좌표로 탐색하고, 후기 정보가 적은 가게까지 부담 없이 발견하게 한다.
- Non-goals: 별점 기반 랭킹, 예약·결제, 상세 지도 서비스 대체.
- Success signals: 지도 노드 선택 성공, 후기 상태 이해, 상세 확인 및 길찾기 전환.

## Personas and jobs
- Primary personas: 익숙한 동네에서 새로운 식당을 찾는 모바일·데스크톱 사용자.
- User jobs: 취향과 가까운 가게 찾기, 후기 신뢰도 파악, 기록이 적은 가게 발견, 방문 판단.
- Key contexts of use: 이동 중 한 손 터치, 데스크톱에서 지도 비교 탐색.

## Information architecture
- Primary navigation: 동 선택 → 검색 → 취향 지도 → 식당 상세/길찾기 또는 선택한 가게와 취향이 비슷한 다른 가게 탐색. 취향 지도와 별도 상세 페이지에서는 현재 동네를 유지한 채 재검색할 수 있다.
- Core routes/screens: `/`, `/search`, `/taste-map`, `/restaurants/:restaurantId`. `/review/comparison`은 일반 화면에서 노출하지 않는 심사위원 전용 비교 화면이다.
- Content hierarchy: 취향 위치와 식당명 → 후기 상태 → 추천 근거 → 위치/행동.

## Design principles
- 발견 가능성 우선: 작은 시각 노드와 별개로 실제 선택 영역은 터치하기 충분히 넓게 둔다.
- 불확실성을 숨기지 않기: `기록 없음`과 `후기 적음`을 형태·크기·문구로 분명히 구분한다.
- 희소 정보의 우선순위: 지도에서는 `기록 없음` > `후기 적음` > `후기 충분` 순으로 대비와 라벨 노출을 높인다.
- Tradeoffs: 희소 상태의 노드는 지도 밀도보다 발견성을 우선하되, 투명 히트 영역으로 시각적 혼잡은 늘리지 않는다.
- 추천 순서 표현: 추천 카드의 숫자는 현재 `취향 유사도순` 위치만 나타내며 점수·매칭률로 표현하지 않는다.

## Visual language
- Color: 배경 `#0d0c0b`, 본문 `#edeae4`, 강조 `#ff9f43`, 사분면 violet/orange/green/pink 토큰 재사용.
- Typography: Pretendard 중심, 상세 제목만 기존 serif 토큰 사용.
- Spacing/layout rhythm: 8px 계열 간격을 사용한다. 추천 목록은 카드의 세로 패딩을 2–4px로 줄이고 카드 사이를 28px 띄워 남은 높이를 5개 카드에 균등 분배한다. 카드 내부는 제목→위치·후기→최대 두 줄 설명→특징 태그를 3–6px 간격으로 묶고, 설명은 14–15px로 강조한다. 상세 섹션은 기존 26–36px 구분 간격을 유지한다.
- Shape/radius/elevation: 후기 충분은 원, 후기 적음은 마름모, 기록 없음은 별. 기존 얕은 테두리와 8–12px 반경 유지.
- Motion: 지도 이동과 짧은 호흡 애니메이션만 사용하며 핵심 정보가 애니메이션에 의존하지 않는다.
- Imagery/iconography: 별도 이미지 대신 지도 도형과 단순 선형 아이콘 사용.

## Components
- Existing components to reuse: `TasteMap`, `RestaurantSidebar`, `RestaurantDetailPage`, `ReviewEvidence`, `TastePositionMap`.
- New/changed components: `TasteMap`의 반응형 히트 영역과 후기 상태 변형, 모바일 `지도`/`추천 5곳` 전환 탭, 근거 후기 문장 아래에 특징 태그를 배치하는 압축형 `RecommendationCard`, 한 가게에서 취향이 가까운 다른 가게 5곳으로 이어지는 상세 행동, 상세 헤더의 짧은 프로모션 코멘트, 별도 상세 페이지 상단의 공용 `SearchAgainBar`, 심사위원 전용 `EvaluationComparisonPage`.
- Variants and states: 충분/high, 적음/low, 없음/none, 추천됨, hover, keyboard focus.
- Token/component ownership: 전역 색상·타입 토큰은 `src/app/globalStyles.ts`, 지도 상태 판정은 `TasteMap`의 기존 기준을 따른다.

## Accessibility
- Target standard: WCAG 2.2 AA 수준의 대비와 조작 가능성을 지향한다.
- Keyboard/focus behavior: 노드는 Enter/Space로 열리며 시각적 포커스 링을 제공한다.
- Contrast/readability: 추천 카드는 `quote` 표면 위에 제목·설명은 밝은 본문색, 위치·후기는 `sub`, 특징 태그는 밝은 주황색과 진한 테두리를 사용한다. 희소 상태 라벨은 배경 외곽선을 사용하고, 기록 없음은 낮은 불투명도로 축소하지 않는다.
- Screen-reader semantics: 식당명과 후기 상태, 동작을 노드 접근성 이름에 포함한다.
- Reduced motion and sensory considerations: 기존 `prefers-reduced-motion` 전역 규칙을 유지한다.

## Responsive behavior
- Supported breakpoints/devices: 최소 320px, 기존 640px/900px 전환점.
- Layout adaptations: 지도 크기에 반비례해 SVG 히트 반경을 조정하여 화면상 약 48px 선택 영역을 유지한다. 추천 목록은 남은 패널 높이를 5등분해 별도 스크롤 없이 모든 카드를 노출한다. 900px 이하에서는 `지도`와 `추천 5곳`을 탭으로 한 화면씩 전환하며, 긴 상세 내용만 독립적으로 스크롤한다. 지도 노드를 열면 추천 탭의 상세로 이동한다.
- Touch/hover differences: 터치 선택 영역은 시각 도형보다 크고 투명하며, hover는 보조 피드백으로만 사용한다. 추천·상세 영역의 스크롤은 경계에서 상위 페이지로 체이닝되지 않아야 한다.

## Interaction states
- Loading: 기존 단계별 지도 로딩 문구 유지.
- Empty: 기록 없음 노드는 별, 상시 이름, `기록 없음` 보조 라벨로 강조한다.
- Error: 현재 별도 지도 오류 상태 없음.
- Success: 노드 선택 시 우측 상세 패널 노출.
- Persistence: 현재 동네·검색어·검색 응답은 탭 세션 동안 유지해 새로고침 후 같은 화면을 복원한다.
- Tutorial: 안내 단계 전환은 사용자의 최초 취향 좌표를 변경하지 않는다. 튜토리얼 중 지도 밖 추천·상세 패널도 같은 암막으로 비활성화한다.
- Disabled: 로딩 중 지도 조작 비활성화.
- Offline/slow network, if applicable: 현재 목 데이터 기반으로 별도 상태 없음.

## Content voice
- Tone: 짧고 다정하지만 근거를 과장하지 않는 안내 문장.
- Terminology: 지도에서는 `기록 없음`, `후기 적음`, `후기 충분`을 일관되게 사용하고, 추천 카드 배지는 `후기 정보 적음`으로 간결하게 표시한다. 위치 권한을 사용하지 않는 고정 동네 진입은 `내 주변`이라 부르지 않고 실제 동네 이름을 쓴다. 서버 순서로 보여주는 초기 동네 목록은 이용 빈도를 추정하지 않고 `추천 동네`로 안내한다.
- Microcopy rules: 첫 화면은 후기 수만 반복하지 않고 동네의 다양한 식당을 취향으로 탐색한다는 차별점을 직접 설명한다. 홍보 코멘트는 한두 문장으로 제한하고 실제 키워드를 활용하며 최고·유일·보장 같은 단정 표현은 쓰지 않는다. `후기 적음`은 정보량과 좌표 불확실성만 뜻하며 맛, 인지도, 매출을 추정하는 근거로 사용하지 않는다. `popularityTop`과 실제 비교하지 않은 일반 결과에서는 인기순에서 놓쳤다는 표현을 쓰지 않는다. 물리적 골목 동일성을 판정할 데이터가 없으므로 상세의 후속 행동은 취향 좌표가 가까운 `비슷한 가게`로 안내한다.

## Implementation constraints
- Framework/styling system: React 19, TypeScript, Emotion 전역 스타일, SVG 지도.
- Design-token constraints: 기존 CSS 변수와 사분면 색상을 재사용하고 새 디자인 시스템이나 의존성을 추가하지 않는다.
- Performance constraints: 리사이즈 관찰은 지도 컨테이너 하나에만 적용하고 노드별 DOM을 최소로 유지한다. 카드 노출 이벤트는 가시 영역 진입 시 한 번만 전송한다.
- Compatibility constraints: 포인터·키보드 입력과 320px 이상 반응형 레이아웃 지원.
- Test/screenshot expectations: `npm run lint`, `npm run build`; 시각 변경은 지도 상태별 노드와 모바일 클릭 영역을 확인한다.

## Open questions
- [ ] 홍보 코멘트를 운영 데이터 필드로 받을지 현재 키워드 기반 생성 문구를 유지할지 결정 / 콘텐츠 담당 / 카피 품질
