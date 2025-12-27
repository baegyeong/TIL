---
slug: manipulate-dom-with-ref
title: Ref로 DOM 조작하기
---

특정 노드에 포커스를 옮기거나, 스크롤 위치를 옮기거나, 위치와 크기를 측정 등 DOM 노드에 접근하기 위해 Ref를 활용하기

## ref로 노드 가져오기

- useRef 훅은 `current`라는 단일 속성을 가진 객체 반환
- 초기에는 current가 null이고, DOM 노드 생성 후에는 이 노드에 대한 참조를 current에 넣음
- 이후 이 DOM 노드를 이벤트 핸들러에서 접근하거나 노드에 정의된 내장 브라우저 API를 사용할 수 있음

```jsx
import { useRef } from "react";

const Component = () => {
  const myRef = useRef(null);

  return(
    <div ref={myRef}>
  );
};
```

```jsx
myRef.current.scrollIntoView();
```

## 다른 컴포넌트의 DOM 노드 접근하기

- 부모 컴포넌트에서 자식 컴포넌트로 ref를 prop처럼 전달할 수 있음

```jsx
import { useRef } from "react";

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />;
}
```

## ref로 DOM을 조작하는 모범 사례

- ref는 react에서 벗어나야 할 때만 사용해야 함 (포커스 혹은 스크롤 위치 관리, react가 노출하지 않는 브라우저 API 호출 등)
- react가 관리하는 DOM 노드를 직접 바꾸려 하면 안됨
- 아래의 코드는 useState로 DOM을 관리하는 로직과 DOM API로 React의 제어 밖에서 강제 삭제하는 로직이 충돌하는 예시

```jsx
import { useState, useRef } from "react";

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}
      >
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}
      >
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

<br/>

**레퍼런스**

[Ref로 DOM 조작하기](https://ko.react.dev/learn/manipulating-the-dom-with-refs)
