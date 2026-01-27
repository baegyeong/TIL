---
slug: controlled-component-uncontrolled-component
title: Controlled Component와 UnControlled Component
---

## Controlled Component

- 리액트 상태에 의해 값이 제어되는 컴포넌트
- 폼 요소의 값을 react가 완전히 관리하고, 모든 변경 사항이 state를 통해 이루어짐
- 값의 변경은 onChange 이벤트 핸들러를 통해 state 업데이트로 처리
- 실시간 유효성 검사, 조건부 렌더링 등이 용이

```jsx
import { useState } from "react";

function ControlledForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("제출된 값:", { username, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="사용자명"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <button type="submit">제출</button>
    </form>
  );
}
```

- 장점
  - 실시간 유효성 검사가 쉬움
  - 입력값 포맷팅에 용이
  - state를 추적 가능하기 때문에 디버깅이 쉬움

- 단점
  - 코드량이 많아질 수 있음
  - 모든 입력마다 리렌더링 발생

## Uncontrolled Component

- DOM 자체에서 값을 관리하는 컴포넌트
- 리액트 상태 없이 ref를 사용하여 필요할 때만 DOM에서 가져옴
- 리액트의 제어 밖에서 값이 관리됨

```jsx
import { useRef } from "react";

function UncontrolledForm() {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("제출된 값:", {
      username: usernameRef.current.value,
      email: emailRef.current.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        ref={usernameRef}
        defaultValue=""
        placeholder="사용자명"
      />
      <input type="email" ref={emailRef} defaultValue="" placeholder="이메일" />
      <button type="submit">제출</button>
    </form>
  );
}
```

- 장점
  - 코드가 간결함
  - 불필요한 리렌더링이 없음
- 단점
  - 실시간 유효성 검사가 어려움
  - 리액트 방식과 일관성이 떨어짐
  - 입력값을 제어하기 어려움

## 언제 사용해야할까?

- Controlled Component
  - 실시간 유효성 검사가 필요한 경우
  - 입력값에 따라 다른 UI를 조건부 렌더링해야 하는 경우
  - 입력값 포맷팅이 필요한 경우
  - 폼 데이터를 다른 컴포넌트와 공유해야 하는 경우
- Uncontrolled Component
  - 간단한 폼으로 제출 시에만 값이 필요한 경우
  - 파일 업로드
  - 성능이 중요하고 불필요한 리렌더링을 필하고 싶은 경우
