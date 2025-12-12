---
slug: react-server-component
title: 리액트 서버 컴포넌트
---

> 서버 컴포넌트는 번들링 전에 클라이언트 앱이나 SSR 서버와는 분리된 환경에서 미리 렌더링되는 새로운 유형의 컴포넌트

## 기존 CSR/SSR의 문제

### CSR

- 브라우저에서 JS를 실행하여 DOM을 생성하고 화면 표시하는 렌더링 방식
- 모든 컴포넌트 코드를 클라이언트로 전송하여 번들 크기가 커짐
- 첫 로드 시 React 애플리케이션 내의 코드가 실행되어야만 표시되기 때문에 느림
  - 첫 로드 이후에는 가상DOM을 사용하여 변경사항만 업데이트하기 때문에 빠름

### SSR

- 서버에서 정적 HTML을 생성하여 배포하는 렌더링 방식
- hydration을 통해 서버에서 렌더링 된 HTML과 번들링 된 JS파일을 클라이언트에 보내 서로 연결
- hydration이 끝나기 전까지 리액트는 사용자와 상호작용할 수 없음 (스트리밍 SSR로 해결 가능)
- JS 번들이 모두 다운되기 전까지 hydration이 진행되지 않음

## RSC

- 특정 컴포넌트를 서버에서만 실행하고 결과만 보내서 클라이언트에 불필요한 코드 전송을 하지 않음
- 배포 번들 크기 경량화 (처리 결과만 보냄)
- 비동기 렌더링 가능
- 백엔드에 직접 액세스 가능

```jsx
// app/page.js - Server Component (기본)
import db from "./db";
import ClientCounter from "./ClientCounter";

export default async function Page() {
  // 서버에서만 실행!
  const data = await db.query("SELECT * FROM posts");

  return (
    <div>
      <h1>Posts</h1>
      {data.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
      {/* Client Component */}
      <ClientCounter />
    </div>
  );
}
```

```jsx
"use client"; // 이 지시어로 구분!

import { useState } from "react";

export default function ClientCounter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

### RSC Payload

- 서버 컴포넌트 실행 후 RSC Payload가 생성된다.
- RSC Payload는 렌더링 결과를 직렬화한 데이터 포맷이다.
- 구성 요소

  - 서버 컴포넌트의 렌더링 결과
  - 클라이언트 컴포넌트가 어디에 렌더링 될지에 대한 정보 (placeholder)
  - 클라이언트 컴포넌트의 JS 참조 경로
  - 서버 컴포넌트가 클라이언트 컴포넌트에 전달해야 하는 props

```
1:HL["/_next/static/css/app.css","style"]
2:I{"id":"123","chunks":["client-button"]}
3:["$","div",null,{"children":[
["$","h1",null,{"children":"Welcome John"}],
["$","$L2",null,{}]
]}]
```

**해석:**

- `1:` CSS 로드 지시
- `2:` Client Component 정의
- `3:` 실제 컴포넌트 트리 구조
- `$L2`: Client Component 참조

## RSC 실행 흐름

1. 최초 페이지 로드 (URL 호출)

-- 서버 동작 --

2. Next.js 서버에서 RSC Payload 생성
3. RSC Payload, 클라이언트 코드, 초기 HTML을 브라우저에 전송

-- 클라이언트 --

4. RSC Payload 파싱
   - React가 이해할 수 있는 구조로 변환
5. 클라이언트 컴포넌트 실행
   - RSC Payload를 기반으로 클라이언트 컴포넌트 구성
   - placeholder에 클라이언트 컴포넌트를 채움
   - 인터렉션 가능한 부분만 hydrate
6. 화면 렌더링 완료
