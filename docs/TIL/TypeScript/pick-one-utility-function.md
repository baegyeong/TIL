---
slug: pick-one-utility-function
title: PickOne 유틸리티 함수
---

> 우아한 타입스크립트 with 리액트 5장 내용 中

<br/>

서로 다른 2개 이상의 객체를 유니온 타입으로 받는 유틸리티 함수 구현해보자.

```ts
type Card = {
  card: string;
};

type Account = {
  account: string;
};

function withdraw(type: Card | Account) {
  // ...
}

withdraw({ card: "hyundai", account: "hana" });
```

위 상황과 같이 withdraw 함수의 매개변수로 Card 타입 혹은 Account를 받아야하는데, 둘 다 받아도 타입 에러가 발생하지 않는다.
유니온은 합집합이기 때문에 card, account 속성이 모두 포함되면 합집합의 범주에 들어간다.
따라서 식별할 수 있는 유니온 기법이 필요하다.

이전에 인턴할 때도 컴포넌트의 props으로 여러 prop 중 특정 prop만 받게 해야 하는 경우가 있었는데, 그땐 옵셔널 + undefined로 처리했었다.

```ts
{ account: string; card?: undefined } | { account?: undefined; card: string }
```

위와 같이 구현하면 속성이 추가될 때마다 옵셔널과 undefined를 계속 추가해줘야 한다.
이를 커스텀 유틸리티 타입으로 구현하여 편리하게 사용해보자!

## PickOne 커스텀 유틸리티 타입

```ts
type PickOne<T> = {
  [P in keyof T]: Record<P, T[P]> &
    Partial<Record<Exclude<keyof T, P>, undefined>>;
}[keyof T];
```

`PickOne<T>`를 `One<T>`, `ExcludeOne<T>`으로 나눠 뜯어보자.

### `One<T>`

```ts
type One<T> = { [P in keyof T]: Record<P, T[P]> }[keyof T];
```

1. [P in keyof T]는 T 객체 중 key값을 P로 뽑는다.
2. `Record<P, T[P]>`는 P를 키로 갖고, value는 P를 키로 둔 T 객체의 값의 레코드 타입이다.
3. 이 객체에서 다시 [keyof T]로 접근하므로 이는 원본객체 T와 동일하다.

### `ExcludeOne<T>`

```ts
type ExcludeOne<T> = {
  [P in keyof T]: Partial<Record<Exclude<keyof T, P>, undefined>>;
}[keyof T];
```

1. `Exclude<keyof T, P>`는 T 객체가 가진 키 값에서 P 타입과 일치하는 키 값을 제외한다. 이 타입을 A라 하자.
2. `Record<A, undefined>`는 키로 A 타입을, 값으로 undefined 타입을 갖는 레코드 타입이다. 이 타입을 B라 하자.
3. `Partial<B>`는 B 타입을 옵셔널로 만든다. `{ [key]?: undefined }` 형태가 된다.
4. 최종적으로 [keyof T]로 접근하기 때문에 3번의 타입이 반환된다.

<br/>

결국 `PickOne<T>` 타입은 다음과 같이 표현할 수 있다.

```ts
type PickOne<T> = One<T> & ExcludeOne<T>;
```

또한 이렇게 활용할 수 있다.

```ts
type Card = { card: string };
type Account = { account: string };

const pickOne1: PickOne<Card & Account> = { card: "hyundai" }; // O
const pickOne2: PickOne<Card & Account> = { account: "hana" }; // O
const pickOne3: PickOne<Card & Account> = { card: "hyundai", account: "hana" }; // X
```
