---
slug: component-return-type
title: 함수 컴포넌트의 반환 타입
---

ReactElement, JSX.Element, ReactNode의 차이점을 살펴보자.

## ReactElement

- JSX의 createElement 메서드 호출로 생성된 리액트 엘리먼트를 나타내는 타입
- 가상DOM 엘리먼트는 ReactElement 형태로 저장됨

```ts
interface ReactElement<
  P = any,
  T extends string | JSXElementConstructor<any> =
    | string
    | JSXElementConstructor<any>
> {
  type: T;
  props: P;
  key: Key | null;
}
```

## JSX.Element

- ReactElement의 제네릭으로 props와 타입 필드에 대해 any 타입을 가지도록 확장
- 글로벌 네임스페이스에 정의됨 -> 외부 라이브러리에서 컴포넌트 타입 재정의 가능

```ts
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}
```

## ReactNode

- 리액트의 render 함수가 반환할 수 있는 모든 형태를 담고 있음
- ReactElement보다 넓은 범위 포함

````ts
type ReactText = string | number;
type ReactChild = ReactElement | ReactText; // ReactElement보다 넓은 범위

type ReactFragment = {} | Iterable<ReactNode>; // ReactNode의 배열 형태
type ReactNode =
	| ReactChild
	| ReactFragment
	| ReactPortal
	| boolean
	| null
	| undefined;
    ```
````

## 포함관계

> ReactNode > ReactElement > JSX.Element

- ReactNode는 ReactElement보다 넓은 범위를 포함하고, JSX.Element는 ReactElement에서 특정 타입을 갖는 형태

## 각 타입의 사용 목적

### ReactElement

- 제네릭에 직접 해당 컴포넌트의 props 타입 명시 가능
- 하나의 노드 타입을 표현하며, 컴포넌트가 1개의 JSX 요소만 리턴하도록 강제하고 싶을 때 사용

```tsx
interface IconProps {
  size: number;
}

interface Props {
  // ReactElement의 props 타입으로 IconProps 타입 지정
  icon: React.ReactElement<IconProps>;
}

const Item = ({ icon }: Props) => {
  // icon prop으로 받은 컴포넌트의 props에 접근하면, props의 목록이 추론된다
  const iconSize = icon.props.size;

  return <li>{icon}</li>;
};
```

### JSX.Element

- tsx에서 jsx를 컴파일할 때 기본 반환 타입
- 리액트 엘리먼트를 prop으로 받아 render props 패턴으로 컴포넌트를 구현할 때 유용

```tsx
interface Props {
  icon: JSX.Element;
}

const Item = ({ icon }: Props) => {
  // prop으로 받은 컴포넌트의 props에 접근할 수 있다
  const iconSize = icon.props.size;

  return <li>{icon}</li>;
};

// icon prop에는 JSX.Element 타입을 가진 요소만 할당할 수 있다
const App = () => {
  return <Item icon={<Icon size={14} />} />;
};
```

### ReactNode

- 리액트 컴포넌트가 가질 수 있는 모든 타입이므로 children 타입으로 설정할 때 적합

```ts
interface MyComponentProps {
  children?: React.ReactNode;
  // ...
}
```

- `PropsWithChildren<T>`에서는 T 타입에 자동으로 `children?: ReactNode`를 추가한다.

<br/>

**레퍼런스**

우아한 타입스크립트 with 리액트 8장
