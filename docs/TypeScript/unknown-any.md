---
slug: unknown-any
title: unknown과 any의 차이
---

## any 타입

- 타입 검사 포기
- 어떤 연산도 허용됨
- 런타임 에러 발생 가능성 높음

```ts
let value: any = 10;

value.toUpperCase(); // 컴파일 에러 없음
value.foo.bar(); // 컴파일 에러 없음
```

## unknown 타입

- 값을 받을 수 있지만, 사용하려면 타입 체크 필요
- 모든 타입 할당 가능
- 사용 시 타입 검증 필요
- 런타임 에러 예방

```ts
let value: unknown = 10;

value.toUpperCase(); // ❌ 컴파일 에러
```

- 사용하려면 타입 가드

```ts
if (typeof value === "string") {
  value.toUpperCase(); // ✅
}
```

## unknown이 더 안전한 이유

- 신뢰할 수 없는 데이터의 시작점에 적합

```ts
function parseInput(input: unknown) {
  if (typeof input === "number") {
    return input * 2;
  }
  return 0;
}
```

## 언제 써야할까?

- unknown
  - API 응답
  - 사용자 입력
  - JSON.parse 결과
- any
  - 점진적 마이그레이션
  - 정말 타입을 알 수 없는 레거시 코드
