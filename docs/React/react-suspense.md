---
slug: react-suspense
title: React Suspense
---

## Suspense

- 컴포넌트의 로딩 상태를 선언적으로 처리
- 컴포넌트가 렌더링되기 전에 무언가를 기다릴 수 있게 해줌

### 사용법

1. 콘텐츠를 로딩하는 동안 대체 UI 보여주기

- children에 필요한 모든 코드와 데이터를 로딩할 때까지 loading fallback을 보여줌
- Suspense가 가능한 데이터만이 Suspense 컴포넌트를 활성화

```jsx
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

2. 콘텐츠를 한꺼번에 함께 보여주기

- Suspense 내부의 전체 트리는 하나의 단위로 취급됨
- 구성 요소 중 하나라도 어떤 데이터에 의해 지연되더라도 모든 구성 요소가 함께 로딩 표시로 대체됨

```jsx
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

3. 중첩된 콘텐츠가 로딩될 때 보여주기

- 아래의 코드 예시에서,
  - Biography가 아직 로딩되지 않은 경우, 전체 콘텐츠 영역 대신 BigSpinner 표시
  - Biography의 로딩이 완료되면 BigSpinner가 콘텐츠로 대체
  - Albums가 아직 로딩되지 않은 경우, Albums와 그 상위 Panel 대신 AlbumsGlimmer가 표시
  - 마지막으로 Albums가 로딩을 완료하면 AlbumsGlimmer를 대체
    - 즉, Biography를 보여줄 때 Albums가 로딩될 때까지 기다릴 필요가 없음

```jsx
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

4. 새 콘텐츠가 로딩되는 동안 이전 콘텐츠 보여주기

- useDeferredValue 훅을 사용하면 쿼리의 지연된 버전을 아래로 전달할 수 있음
- query는 즉시 업데이트되므로 입력에 새 값이 표시되나, deferredQuery는 데이터가 로딩될 때까지 이전 값을 유지하므로 `SearchResults`는 잠시 동안 이전 결과를 보여줌

```jsx
export default function App() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

- 시각적 표시 적용한 버전
  ```jsx
  <div
    style={{
      opacity: query !== deferredQuery ? 0.5 : 1,
    }}
  >
    <SearchResults query={deferredQuery} />
  </div>
  ```

5. 이미 보인 콘텐츠가 숨겨지지 않도록 방지

- 컴포넌트가 지연되면 가장 가까운 상위 Suspense가 Fallback을 보여주도록 전환하는데, 이미 일부 콘텐츠가 보이는 경우 사용자 경험이 끊길 수 있음
- `startTransition` 사용하여 Navigation State 업데이트를 Transition으로 처리
- State 전환이 급하지 않고, 이미 공개된 콘텐츠를 숨기는 대신 이전 페이지를 계속 표시하는 것이 좋다는 것을 리액트에게 알려줌

```jsx
import { Suspense, startTransition, useState } from "react";
import IndexPage from "./IndexPage.js";
import ArtistPage from "./ArtistPage.js";
import Layout from "./Layout.js";

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState("/");

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === "/") {
    content = <IndexPage navigate={navigate} />;
  } else if (page === "/the-beatles") {
    content = (
      <ArtistPage
        artist={{
          id: "the-beatles",
          name: "The Beatles",
        }}
      />
    );
  }
  return <Layout>{content}</Layout>;
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

6. Transition이 발생하고 있음을 보여주기

- Transition이 발생하고 있음을 보여주기 위해 `isPending`을 제공하는 `useTransition` 사용
- 아래의 코드는 isPending으로 헤더 스타일을 변경하는 예시

```jsx
//...

function Router() {
  const [page, setPage] = useState("/");
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === "/") {
    content = <IndexPage navigate={navigate} />;
  } else if (page === "/the-beatles") {
    content = (
      <ArtistPage
        artist={{
          id: "the-beatles",
          name: "The Beatles",
        }}
      />
    );
  }
  return <Layout isPending={isPending}>{content}</Layout>;
}
```

7. Navigation에서 Suspense 재설정하기

- Transition이 진행되는 동안 다른 매개변수가 있는 경로로 이동하는 경우에 key로 표현
- Navigation 중 Suspense의 로딩 상태를 다시 보여주고 싶으면 key를 바꿔서 React에게 다른 화면임을 알리기

```jsx
<ProfilePage key={queryParams.id} />
```

8. 서버 에러 및 클라이언트 전용 콘텐츠에 대한 Fallback 제공

- 컴포넌트가 서버에서 에러를 발생시키면 가까운 `<Suspense>` 컴포넌트를 찾아서 Fallback을 생성된 서버 HTML에 포함
- 클라이언트에서 다시 한 번 렌더링을 시도하는데, 이때 에러가 안나면 컴포넌트가 정상 렌더링 되고 에러가 나면 `ErrorBoundary`의 에러 UI 표시

- 일부 컴포넌트를 서버에서 렌더링하지 않도록 선택하려면

  - 서버 환경에서 에러를 발생시킨 다음 `<Suspense>`로 경계로 감싸서 해당 HTML을 fallback으로 대체

  ```jsx
  <Suspense fallback={<Loading />}>
    <Chat />
  </Suspense>;

  function Chat() {
    if (typeof window === "undefined") {
      throw Error("Chat should only render on the client.");
    }
    // ...
  }
  ```

<br/>

**레퍼런스**

[Suspense](https://ko.react.dev/reference/react/Suspense)
