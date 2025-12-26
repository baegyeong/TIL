---
slug: this-binding
title: this 바인딩
---

자바스크립트의 this는 함수가 호출되는 방식에 따라 동적으로 결정된다.

## 1. 기본 바인딩

독립적인 함수 호출 시 적용된다.

```js
function showThis() {
  console.log(this);
}

showThis(); // 브라우저: window, strict mode: undefined
```

## 2. 암시적 바인딩

객체의 메서드로 호출될 때는 해당 객체를 참조한다.

```js
const user = {
  name: "Alice",
  greet: function () {
    console.log(`Hello, ${this.name}`);
  },
};

user.greet(); // "Hello, Alice"
```

## 3. 명시적 바인딩

`call()`, `apply()`, `bind()`를 사용한다.

### call()

인자를 개별적으로 전달한다.

```js
function introduce(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person = { name: "Bob" };
introduce.call(person, "Hi", "!"); // "Hi, I'm Bob!"
```

### apply()

인자를 배열로 전달한다.

```js
introduce.apply(person, ["Hello", "."]); // "Hello, I'm Bob."
```

### bind()

새로운 함수를 반환하며, 나중에 호출이 가능하다.

```js
const boundIntroduce = introduce.bind(person);
boundIntroduce("Hey", "~"); // "Hey, I'm Bob~"
```

## 4. new 바인딩

생성자 함수를 new 키워드로 호출하면, 새로운 객체가 생성되고 this는 그 객체를 참조한다.

```js
function User(name) {
  this.name = name;
  this.sayHi = function () {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const user1 = new User("Charlie");
user1.sayHi(); // "Hi, I'm Charlie"
```

### new 바인딩 동작 과정

1. 새로운 빈 객체 생성
   ```js
   const newObject = {};
   ```
2. 프로토타입 체인 연결
   - 새 객체의 내부 `[[Prototype]]` 속성이 생성자 함수의 `prototype` 객체를 가리킴
   - 새 객체는 생성자 함수의 프로토타입에 정의된 메서드를 사용할 수 있게 됨
   ```js
   // 내부적으로 이렇게 동작
   Object.setPrototypeOf(newObject, User.prototype);
   // 또는: newObject.__proto__ = User.prototype;
   ```
3. 생성자 함수 실행(this 바인딩)

   ```js
   // this가 새 객체를 참조한 상태로 함수 실행
   User.call(newObject, "Charlie");
   // 결과: newObject.name = 'Charlie'
   ```

4. 명시적으로 다른 객체를 반환하지 않으면 새 객체가 반환됨

   ```js
   // 케이스 1: 명시적 반환 없음 (일반적인 경우)
   function User1(name) {
     this.name = name;
     // return 없음
   }
   const user1 = new User1("Alice");
   console.log(user1.name); // "Alice" ✓

   // 케이스 2: 명시적으로 다른 객체 반환
   function User2(name) {
     this.name = name;
     return { name: "Overridden" };
   }
   const user2 = new User2("Bob");
   console.log(user2.name); // "Overridden" - 반환된 객체 사용

   // 케이스 3: 원시값 반환 (무시됨)
   function User3(name) {
     this.name = name;
     return "ignored";
   }
   const user3 = new User3("Charlie");
   console.log(user3.name); // "Charlie" - 원시값은 무시되고 새 객체 반환
   ```
