---
slug: conditional-types
title: 타입스크립트의 조건부 타입
---

- 조건부 타입은 타입 수준에서 조건문을 작성할 수 있게 해줌
- 삼항 연산자와 유사한 문법을 사용하여 입력된 타입에 따라 다른 타입 반환

```typescript
T extends U ? X : Y
```

- T가 U에 할당 가능하면 X 타입을, 그렇지 않으면 Y 타입 반환

**[예시]**

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

## 타입 추론 (infer)

조건부 타입 내에서 `infer` 키워드를 사용하여 타입을 추출할 수 있음

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type E = ReturnType<() => string>; // string
type F = ReturnType<(x: number) => boolean>; // boolean
```

- `infer R`은 함수의 반환 타입을 R이라는 타입 변수로 추론

## 분산 조건부 타입 (Distributive Conditional Types)

유니온 타입에 조건부 타입을 적용하면 각 타입에 대해 분산되어 적용

```typescript
type ToArray<T> = T extends any ? T[] : never;

type G = ToArray<string | number>; // string[] | number[]
```

### 분산 방지

분산을 방지하려면 대괄호로 감싸기

```typescript
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type H = ToArrayNonDist<string | number>; // (string | number)[]
```

## 유틸리티 타입에서의 활용

TypeScript의 내장 유틸리티 타입들은 조건부 타입을 기반으로 구현되어 있음

```typescript
// Exclude: T에서 U에 할당 가능한 타입 제거
type Exclude<T, U> = T extends U ? never : T;

// Extract: T에서 U에 할당 가능한 타입만 추출
type Extract<T, U> = T extends U ? T : never;

// Parameters: 함수의 매개변수 타입을 튜플로 추출
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

## 중첩 조건부 타입

여러 조건을 중첩하여 복잡한 타입 로직을 구현할 수 있음

```typescript
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : "object";

type I = TypeName<string>; // "string"
type J = TypeName<true>; // "boolean"
```
