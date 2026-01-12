---
slug: nextjs-hydration-and-rsc-interaction
title: Next.js 하이드레이션과 React Server Components 상호작용
---

- Server Components는 서버에서만 실행되며 클라이언트로 JS 번들이 전달되지 않음
- Client Components는 서버에서 초기 HTML을 렌더링한 후 브라우저에서 하이드레이션되어 상호작용을 담당

### 하이드레이션 과정

1. 서버 렌더링: Server Components와 Client Components 모두 서버에서 HTML로 렌더링
2. HTML 전송: 브라우저가 초기 HTML을 받아 화면에 표시
3. 하이드레이션: Client Components만 JavaScript가 로드되어 인터랙티브하게 전환

### Server Components

- 하이드레이션 없음
- DB 직접 접근 가능
- 리액트 훅 사용 불가

### Client Components

- 하이드레이션 발생
- 이벤트 핸들러, 상태 관리 가능
- JavaScript 번들 크기 증가

```js
// app/page.js - Server Component
async function Page() {
  const data = await fetchData();

  return (
    <div>
      <h1>{data.title}</h1>
      {/* Client Component를 Server Component 안에 */}
      <Counter initialCount={data.count} />
    </div>
  );
}

// components/Counter.js - Client Component
("use client");
export default function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  // 하이드레이션 후 인터랙티브
}
```
