---
slug: how-this-works-in-javascript
title: JavaScript this는 호출방식으로 결정된다.
---

```js
const user = {
  name: "Claude",
  greet() {
    console.log(`Hi, ${this.name}`);
  },
};

const greet = user.greet;
greet();
```

이 코드에서 greet()는 "Hi, Claude"가 아닌 "Hi, "(non strict) 또는 TypeError(strict)가 나오게 된다.

### 핵심 원리

this는 함수가 정의된 위치가 아니라, 호출되는 방식으로 결정된다.
`const greet = user.greet`는 함수 참조만 복사할 뿐 user와의 연결은 따라오지 않는다.

```js
const user = {
  name: "Claude",
  greet() {
    console.log(this.name);
  },
};
const admin = { name: "Admin", greet: user.greet }; // 같은 함수 공유!

user.greet(); // "Claude"
admin.greet(); // "Admin"

const fn = user.greet;
fn(); // undefined 또는 TypeError
```

함수는 똑같은데 호출 시점의 점 앞이 다르면 결과가 달라진다.

### 화살표 함수로 감싼다면

```js
// ❌ this 깨짐 — 함수 자체를 넘김
button.addEventListener("click", user.greet);

// ✅ this 유지 — "user.greet()을 호출하라"는 명령을 넘김
button.addEventListener("click", () => user.greet());
```

()=>user.greet()라는 메서드 호출 형태가 그대로 유지된다.
클릭 시점에 점 앞에 user가 있으니 this = user가 된다ㅣ.
