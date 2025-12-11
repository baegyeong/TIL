---
slug: managing-memory-in-javascript
title: JavaScript의 메모리 관리
tags: [memory]
---

## 메모리 생존주기

- 자바스크립트와 같은 고수준 언어는 메모리의 할당과 해제가 암묵적으로 작동한다.

- 메모리 할당
  - 자바스크립트는 값을 선언할 때 자동으로 메모리를 할당한다.
- 메모리 해제
  - 저수준 언어에서는 개발자가 직접 해제
  - 고수준 언어에서는 `가비지 콜렉션`이라는 자동 메모리 관리 방법 사용

## 가비지 컬렉션

- 가비지 컬렉션의 핵심 개념은 `참조`이다.

### 참조-세기(Reference-counting) 가비지 컬렉션

> 어떤 다른 객체도 참조하지 않는 객체를 더 이상 필요하지 않는 객체라고 여김

- 참조하는 다른 객체가 하나도 없는 경우 수집 가능
- 순환참조의 한계

  - 두 객체가 서로 참조하는 속성으로 생성되어 순환 참조 생성
  - 함수 호출이 완료되면 이 두 객체는 스코프를 벗어나게 되고, 할당된 메모리는 회수되어야 함
  - 그러나 두 객체가 서로를 참조하고 있으므로 참조-세기 알고리즘은 둘 다 가비지 컬렉션의 대상으로 표시하지 않음
  - 메모리 누수의 원인

  ```js
  function f() {
    const x = {};
    const y = {};
    x.a = y; // x는 y를 참조합니다.
    y.a = x; // y는 x를 참조합니다.

    return "azerty";
  }
  f();
  ```

### 표시하고-쓸기(Mark-and-sweep) 알고리즘

> 더 이상 필요없는 객체를 도달할 수 없는 객체로 정의

- 가비지 콜렉터는 주기적으로 roots라는 전역 객체부터 시작하여 roots가 참조하는 객체들, roots가 참조하는 객체가 참조하는 객체들 등을 찾음
- roots로부터 시작하여 가비지 콜렉터는 모든 도달할 수 있는 객체들을 찾고, 도달할 수 없는 모든 객체들을 수집

## 엔진의 메모리 모델 설정하기

- JavaScript 엔진은 주로 메모리 모델을 노출하는 플래그 제공

  - Node.js는 설정과 메모리 문제 디버깅을 위해 내부를 구성하는 V8 메커니즘을 노출하는 추가적인 옵션과 도구 제공

- 가용한 힙 메모리의 최대량 올리기

  ```bash
  node --max-old-space-size=6000 index.js
  ```

- 메모리 문제를 디버깅하기 위한 가비지 컬렉터 정보 보여주기

  ```bash
  node --expose-gc --inspect index.js
  ```

  ```js
  // 사용 예시
  if (global.gc) {
    console.log("메모리 사용량:", process.memoryUsage().heapUsed);
    global.gc(); // 강제 가비지 컬렉션
    console.log("GC 후:", process.memoryUsage().heapUsed);
  }
  ```

## 메모리 관리를 돕는 데이터 구조 - WeakMap과 WeakSet

> Map/Set과 달리 약한 참조 사용

### WeakMap

- 키로 오직 객체만 사용 할 수 있음
- 키 객체가 다른 곳에서 참조되지 않으면 가비지 컬렉션 대상
- get, set, delete, has 메서드 사용 가능 / keys, values, entries 사용 불가
- 캐싱에도 사용할 수 있음

- 예시1

  ```js
  let john = { name: "John" };

  let weakMap = new WeakMap();
  weakMap.set(john, "...");

  john = null; // 참조를 덮어씀

  // john을 나타내는 객체는 이제 메모리에서 지워집니다!
  ```

- 예시2

  - 각 유저별 방문 횟수를 저장한다고 하는 상황
  - Map() 사용
    - user 객체가 null로 덮어씌워도 visitsCountMap의 키로 사용되고 있어서 메모리에서 삭제되지 않음
    - 유저 객체가 메모리에서 사라지면 방문횟수도 직접 지워줘야 하며, 그렇지 않으면 visitsCountMap이 차지하는 메모리 공간이 한없이 커짐
  - WeakMap() 사용: 유저 객체가 도달 가능하지 않은 상태가 되면 자동으로 메모리에서 삭제됨

  ```js
  // 📁 visitsCount.js
  let visitsCountMap = new WeakMap(); // 위크맵에 사용자의 방문 횟수를 저장함

  // 사용자가 방문하면 방문 횟수를 늘려줍니다.
  function countUser(user) {
    let count = visitsCountMap.get(user) || 0;
    visitsCountMap.set(user, count + 1);
  }

  countUser(john);

  john = null; // john에 해당하는 visitsCountMap 삭제
  ```

### WeakSet

- 오직 객체만 저장할 수 있고, 객체에 대한 참조가 약함
- add, has, delete 메서드 사용 가능 / size, keys나 반복 작업 관련 메서드 사용 불가

### 공통 특징

- 순회 불가
- size 프로퍼티 없음
- 가비지 컬렉션의 동작 시점을 정확히 알 수 없음

<br/>

**레퍼런스**

- [JavaScript의 메모리 관리](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Memory_management)
- [위크맵과 위크셋](https://ko.javascript.info/weakmap-weakset)
