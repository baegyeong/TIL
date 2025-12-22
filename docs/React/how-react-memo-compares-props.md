---
slug: how-react-memo-compares-props
title: React.memo를 써도 객체/배열 props 때문에 리렌더링이 발생하는 이유
---

> React.memo는 얕은 비교를 사용하는데, 부모에서 객체/배열/함수는 새로 생성하면 참조가 달라져 매번 리렌더링이 발생한다.

**React.memo의 얕은 비교**

- props를 비교할 때 얕은 비교 사용
  - 원시타입은 값 비교, 객체/배열/함수는 참조 비교

**부모에서 객체나 배열을 새로 만들면**

```tsx
function Parent() {
  const options = { dark: true };

  return <Child options={options} />;
}

const Child = React.memo(({ options }) => {
  console.log("Child render");
  return <div />;
});
```

`{ dark: true } !== { dark: true }` 이기 때문에,
부모 컴포넌트가 렌더링될 때마다 새 객체가 메모리에 생성되고 참조주소가 매번 달라진다.

즉, Child가 다시 생성된다.

**해결방법**

1. useMemo로 참조 고정

   ```tsx
   function Parent() {
     const options = useMemo(() => ({ dark: true }), []);

     return <Child options={options} />;
   }
   ```

2. useCallback으로 함수 참조 고정

   ```tsx
   const onClick = useCallback(() => {
     console.log("click");
   }, []);
   ```
