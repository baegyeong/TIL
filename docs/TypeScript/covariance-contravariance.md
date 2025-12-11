---
slug: covariance-contravariance
title: 타입스크립트의 공변성과 반공변성
tags: [covariance, contravariance]
---

타입스크립트에서의 타입들은 기본적으로 공변성 규칙을 따르지만, 유일하게 **함수의 매개변수**는 반공변성을 갖고 있음

## 공변성

타입 A가 타입 B의 서브타입일 때, `T<A>`가 `T<B>`의 서브타입이다.

아래의 예시 코드에서,
Member는 User의 서브타입이고, `Array<Member>`는 `Array<User>`의 서브타입이다.

따라서 `Array<Member>`는 `Array<User>`로 취급될 수 있으며, `users = members` 가능하다.

```ts
// 모든 유저(회원, 비회원)은 id를 갖고 있음
interface User {
  id: string;
}

interface Member extends User {
  nickName: string;
}

let users: Array<User> = [];
let members: Array<Member> = [];

users = members; // OK
members = users; // Error
```

함수의 반환 타입은 공변이다.

## 반공변성

타입 A가 타입 B의 서브타입이면, `T<B>`는 `T<A>`의 서브타입이다.

아래의 예시 코드에서,
Member는 User의 서브타입이고 `PrintUserInfo<User>`는 `PrintUserInfo<Member>`의 서브타입이다.

```ts
type PrintUserInfo<U extends User> = (user: U) => void;

let printUser: PrintUserInfo<User> = (user) => console.log(user.id);

let printMember: PrintUserInfo<Member> = (user) => {
  console.log(user.id, user.nickName);
};

printMember = printUser; // OK.
printUser = printMember; // Error - Property 'nickName' is missing in type 'User' but required in type 'Member'.
```

반공변성은 타입스크립트의 매개변수 타입에서 적용되며, 더 넓은 매개변수 타입을 넣을 수 있다.

```ts
// 타입선언
type User = {
  name: string;
};

type Admin = User & {
  permissions: string[];
};

// 타입에 맞는 변수 준비
const user: User = {
  name: "user",
};

const admin: Admin = {
  name: "admin",
  permissions: [],
};

// 타입 에러. 타입의 인자는 User이지만, 실제로는 Admin이 필요
const fn1: (arg: User) => void = (arg: Admin) =>
  console.log(arg.name, arg.permissions.length);

fn1(user); // arg.permissions가 존재하지 않기 때문에 런타임 에러

// Admin을 전달받아도 User의 부분만 사용하므로 할당 가능
const fn2: (arg: Admin) => void = (arg: User) => console.log(arg.name);
```

**레퍼런스**

우아한 타입스크립트 with 리액트 8장

[타입스크립트 변성 5분 만에 이해하기(공변성, 반변성, 양변성)](https://mycodings.fly.dev/blog/2024-02-20-understanding-typescript-covariant-and-contravariant/)
