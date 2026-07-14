# API layer

`golmok.ts`가 프론트엔드의 백엔드 게이트웨이 호출을 담당한다. 기본 주소는
`http://192.168.192.1:8000`이며 `VITE_API_BASE`로 바꿀 수 있다.

화면 컴포넌트는 mock 데이터를 직접 참조하지 않고 이 API와 zustand store에 저장된
검색 응답을 사용한다.

## 검색 응답 사용 계약

- 결과 요약은 `banner.count`, `banner.hidden`을 그대로 사용한다.
- 골목결 추천 비교는 `restaurants` 앞 5개와 `popularityTop`을 사용한다.
- `confidence`는 서버 값을 사용하며 후기 수로 다시 계산하지 않는다.
- `axes`, `quadrants`, `neighborhood`는 서버·사용자 입력 문자열을 그대로 사용한다.

## 이벤트

`POST /api/events`에 다음 camelCase payload를 비차단 방식으로 전송한다.

- `{ event: "recommendation_impression", sessionId, restaurantId, rank, confidence }`
- `{ event: "restaurant_open", sessionId, restaurantId }`
- `{ event: "directions_click", sessionId, restaurantId }`
- `{ event: "taste_changed", sessionId, x, y }`

이벤트 전송 실패는 검색, 상세 열람, 길찾기 같은 사용자 흐름을 중단시키지 않는다.
