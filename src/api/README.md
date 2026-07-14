# API layer

`golmok.ts`가 프론트엔드의 백엔드 게이트웨이 호출을 담당한다. 기본 주소는
`http://192.168.192.1:8000`이며 `VITE_API_BASE`로 바꿀 수 있다.

화면 컴포넌트는 mock 데이터를 직접 참조하지 않고 이 API와 zustand store에 저장된
검색 응답을 사용한다.
