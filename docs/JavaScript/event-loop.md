---
slug: event-loop
title: 이벤트 루프
---

자바스크립트는 싱글 스레드 언어이지만, 비동기 작업을 처리할 수 있다. 이를 가능하게 하는 핵심 메커니즘은 바로 이벤트 루프이다.

## 주요 구성 요소

- Call Stack: 현재 실행 중인 함수들이 쌓이는 곳
- Web APIs: 브라우저가 제공하는 비동기 API들
- Macrotask Queue: setTimeout, setInterval, I/O 작업 등의 콜백이 대기하는 곳
- Microtask Queue: Promise의 then/catch/finally, queueMicrotask, MutationObserver 등의 콜백이 대기하는 곳
  - Macrotask Queueqhek 우선순위가 높음
  - 이벤트 루프는 콜 스택이 비어있는 시점에 매크로태스크를 실행하기 이전에 마이크로태스크 큐에 있는 모든 작업들을 먼저 처리

## 동작 방식

1. Call Stack에서 코드가 순차적으로 실행
2. 비동기 함수를 만나면 Web API로 넘김
3. 비동기 작업이 완료되면 콜백이 해당 Queue에 들어감
4. Call Stack이 비어있을 때 이벤트 루프가 동작
5. Microtask Queue를 먼저 완전히 비움 (모든 마이크로태스크 실행)
6. 그 다음 Macrotask Queue에서 하나만 꺼내 실행
7. 다시 Microtask Queue를 확인하고 비움 (반복)

**[예시 1]**

```js
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

setTimeout(() => {
  console.log("4");
}, 0);

Promise.resolve().then(() => {
  console.log("5");
});

console.log("6");

// 출력 순서: 1 → 6 → 3 → 5 → 2 → 4
```

- 동기 코드 실행 후 -> 모든 Microtask 실행 -> Macrotask 하나씩 실행

**[예시2]**

`setTimeout(callback, 0)`을 호출

1. 웹 API에 의해 타이머 설정
2. 타이머가 0밀리초 후에 만료되면 콜백 함수가 태스크 큐에 추가
3. 콜 스택이 비어 있는 시점에 이벤트 루프가 태스크 큐에 대기 중인 callback을 꺼내서 실행
