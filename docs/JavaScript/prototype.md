---
slug: prototype
title: JavaScript 프로토타입
---

## 프로토타입이란?

객체가 다른 객체로부터 속성과 메서드를 물려받기 위해 참조하는 원본 객체

## `prototype` vs `__proto__`

| 구분        | 누가 가짐            | 역할                                             |
| ----------- | -------------------- | ------------------------------------------------ |
| `prototype` | **함수**만 가짐      | 생성자로 쓰일 때 인스턴스의 프로토타입이 될 객체 |
| `__proto__` | **모든 객체**가 가짐 | 자기 프로토타입으로의 링크                       |

```js
function Parent() {}
const child = new Parent();

child.__proto__ === Parent.prototype; // true

// 객체 리터럴은 prototype 속성이 없음
const obj = {};
obj.prototype; // undefined
```

## 객체 리터럴을 프로토타입으로 쓰려면?

`new`는 함수에만 쓸 수 있어서, 객체 리터럴이 프로토타입이 되려면 `Object.create`를 쓴다.

```js
const parent = {
  greet() {
    console.log("Hello");
  },
};

const child = Object.create(parent);
child.__proto__ === parent; // true
child.greet(); // "Hello" (프로토타입 체인 따라 찾음)
```

## `new` 키워드가 하는 일

`new Child("Alice")` 실행 시 내부적으로

1. 빈 객체를 새로 만든다
2. 그 객체의 `__proto__`를 `Child.prototype`으로 설정
3. `Child` 함수를 호출하되, `this`를 그 새 객체로 바인딩
4. 그 객체를 반환

그래서 생성자 함수 안의 `this`는 **새로 만들어진 인스턴스 객체**를 가리킨다.

## ES5 상속 패턴

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.greet = function () {
  console.log(`Hello, ${this.name}`);
};

function Child(name, age) {
  Parent.call(this, name); // ① 속성 상속
  this.age = age;
}
Child.prototype = Object.create(Parent.prototype); // ② 메서드 상속
Child.prototype.constructor = Child; // ③ constructor 복구
```

### ① `Parent.call(this, name)`

`Child`의 `this`(= 새로 만들어진 인스턴스)를 `Parent` 함수에 넘겨서, `Parent` 안의 `this.name = name`이 인스턴스에 직접 속성을 추가하게 한다.

### ② `Object.create(Parent.prototype)` 를 사용하는 이유

만약 `Child.prototype = Parent.prototype`으로 하면 **둘이 같은 객체를 참조**하게 되어, `Child.prototype`에 메서드를 추가하면 `Parent.prototype`도 오염된다.

`Object.create`는 `Parent.prototype`을 **프로토타입으로 갖는 새 객체**를 만들어준다. 참조는 분리되지만 체인으로 연결되어 상속은 유지된다.

```
Child.prototype (새 객체)
    └── __proto__ ──→ Parent.prototype
```

### ③ `constructor` 복구

`Object.create`로 만든 새 객체는 `constructor`가 `Parent`를 가리킨다(체인 따라 찾으니까). 관습적으로 `Child`로 복구해준다.

## ES6 `class`

위 패턴을 자동으로 해주는 문법적 설탕이다.

```js
class Child extends Parent {
  constructor(name, age) {
    super(name); // = Parent.call(this, name)
    this.age = age;
  }
}
```
