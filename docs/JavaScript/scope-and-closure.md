---
slug: scope-and-closure
title: 스코프와 클로저
---

## 스코프

```
변수나 함수에 접근할 수 있는 범위
```

- 전역 스코프: 코드 어디서든 접근 가능한 범위
- 함수 스코프: 함수 몸체에 선언한 변수는 해당 몸체 안에서만 접근
- 블록 스코프: let, const 는 `{}` 블록 안에서만 유효
  - var는 블록 스코프를 무시하고 함수 스코프를 따름 -> `let`/`const` 사용 권장

### 스코프 체인

변수를 참조할 때 현재 스코프 -> 상위 스코프 -> 전역 스코프 순으로 탐색

- 탐색에 실패하면 `ReferenceError` 발생

```js
const x = "전역";

function outer() {
  const x = "outer";

  function inner() {
    console.log(x); // "outer" — 가장 가까운 스코프에서 찾음
  }

  inner();
}

outer();
```

### 렉시컬 스코프

- 자바스크립트는 렉시컬 스코프(정적 스코프)를 따름
- 함수가 호출된 위치가 아니라, **정의된 위치를 기준으로 스코프 결정**

```js
const name = "전역";

function printName() {
  console.log(name); // 정의된 시점의 스코프 기준
}

function wrapper() {
  const name = "wrapper 내부";
  printName(); // "전역" 출력 (호출 위치가 아닌 정의 위치 기준)
}

wrapper();
```

## 클로저

```
함수가 자신이 선언된 환경의 변수를 기억하고 접근할 수 있는 것
클로저 = 함수 + 그 함수가 선언된 환경(스코프)
```

- 함수가 외부 스코프의 변수를 참조할 때, 그 외부 함수가 실행을 종료한 이후에도 변수가 유지됨

```js
function makeCounter() {
  let count = 0; // 외부 함수의 변수

  return function () {
    // 내부 함수 (클로저)
    count++;
    console.log(count);
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3
```

### 클로저 활용

1. 데이터 은닉(캡슐화)

- 객체에 프로퍼티로 된 것은 외부에서 접근 가능
- 이 경우에는 스코프에만 존재하여 외부 접근 불가 (private과 같은 효과)

```js
function createUser(name) {
  let _name = name; // 외부 접근 불가

  return {
    getName: () => _name,
    setName: (newName) => {
      _name = newName;
    },
  };
}

const user = createUser("Alice");
console.log(user.getName()); // "Alice"
user.setName("Bob");
console.log(user.getName()); // "Bob"
console.log(user._name); // undefined
```

2. 함수 팩토리

- 특정 인자를 고정한 함수를 생성할 수 있음

```js
function multiplier(factor) {
  return (number) => number * factor;
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

3. 이벤트 핸들러에서의 상태 유지

- addEventListener의 내부 함수가 클로저
  - attachClickHandler 함수 실행이 종료돼도 clickCount는 살아있음
  - clickCount가 클로저 객체로 힙 메모리에 저장됨 (DOM의 버튼이 이 클로저를 참조하고 있기 때문)
- attachClickHandler가 종료된 후에 버튼을 클릭하면, 새 실행 컨텍스트로 콜 스택에 push됨
  - 이때 clickCount는 복사본이 아니라 힙에 있는 원본을 그대로 수정 (상태 누적)

```js
function attachClickHandler(buttonId) {
  let clickCount = 0;

  document.getElementById(buttonId).addEventListener("click", () => {
    clickCount++;
    console.log(`클릭 횟수: ${clickCount}`);
  });
}

attachClickHandler("myButton");
```

<br/>

**레퍼런스**

[(JavaScript) 스코프(Scope)란?](https://medium.com/@su_bak/javascript-%EC%8A%A4%EC%BD%94%ED%94%84-scope-%EB%9E%80-bc761cba1023)
