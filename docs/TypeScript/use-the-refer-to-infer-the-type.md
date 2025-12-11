---
slug: use-the-refer-to-infer-the-type
title: infer를 활용해서 타입 추론하기
tags: [infer]
---

> 우아한 타입스크립트 with 리액트 5장 내용 中

<br/>
타입스크립트에서는 infer 키워드를 사용하여 조건부 타입 내에서 추론이 가능하다.

```ts
// 제네릭으로 T를 받아서 T가 Promise로 래핑된 경우라면 K를 반환하고, 그렇지 않은 경우에는 any를 반환한다.
type UnpackPromise<T> = T extends Promise<infer K>[] ? K : any;

// 예시
const promises = [Promise.resolve("Mark"), Promise.resolve(38)];
type Expected = UnpackPromise<typeof promises>; // string | number
```

<br/>

책의 예시인 라이더 어드민 서비스로 infer를 이해해보자.

[코드1]

```ts
interface RouteBase {
  name: string;
  patch: string;
  component: ComponentType;
}

export interface RouteItem {
  name: string;
  path: string;
  component?: ComponentType;
  pages?: RouteBase[];
}

export const routes: RouteItem[] = [
  {
    name: "기기 내역 관리",
    path: "/device-history",
    component: DeviceHistoryPage,
  },
  {
    name: "헬멧 인증 관리",
    path: "/helmet-certification",
    component: HelmentCertificationPage,
  },
  // ...
];
```

- 라이더 어드민에서 라우팅을 위해 사용하는 타입
  - 사용자가 URL로 접근했을 때 실제로 보여줄 페이지를 정의
  - 권한 API로 반환된 사용자 권한과 name을 비교하여 **인가되지 않은 사용자 접근 방지**

[코드2]

```ts
export interface SubMenu {
  name: string;
  path: string;
}

export interface MainMenu {
  name: string;
  path?: string;
  subMenus?: SubMenu[];
}
export type MenuItem = MainMenu | SubMenu;
export const menuList: MenuItem[] = [
  {
    name: "계정 관리",
    subMenus: [
      {
        name: "기기 내역 관리",
        path: "/device-history",
      },
      {
        name: "헬멧 인증 관리",
        path: "/helmet-certification",
      },
    ],
  },
  {
    name: "운행 관리",
    path: "/operation",
  },
  // ...
];
```

- MainMenu와 SubMenu는 메뉴 리스트에서 사용하는 타입
- 권한 API를 통해 반환된 사용자 권한과 name을 비교하여 **사용자가 접근할 수 있는 메뉴만 렌더링**

<br/>
코드1은 실제 페이지를 렌더링하는 목적(인증인가로 인한 보호)으로, 코드2는 UI에 메뉴를 표시하기 위한 목적으로 사용된다.
menuList에서 subMenus가 없는 MainMenu의 name과 subMenus에서 쓰이는 name, route name에 동일한 문자열만 입력해야한다.

<br/>
이 동일한 name 문자열을 아래와 같이 infer로 추출할 수 있다.

```ts
type UnpackMenuNames<T extends ReadonlyArray<MenuItem>> =
  // T는 MenuItem 배열 타입을 받음 (menuList의 타입)

  T extends ReadonlyArray<infer U>
    ? // T가 배열이면 배열의 각 요소 타입을 U로 추론
      // infer U: 배열 요소의 타입을 U 변수에 담음

      U extends MainMenu
      ? // U가 MainMenu 타입인지 확인 (subMenus 속성이 있는지)

        U["subMenus"] extends infer V
        ? // MainMenu의 SubMenus 속성 타입을 V로 추론
          // U["subMenus"]는 SubMenu[] | undefined 타입

          V extends ReadonlyArray<SubMenu>
          ? // V가 SubMenu 배열인지 확인 (undefined가 아닌지)

            UnpackMenuNames<V>
          : // SubMenu 배열이면 재귀 호출: 서브메뉴들의 name을 추출
            // 예: [{ name: "기기 내역 관리" }, { name: "헬멧 인증 관리" }]
            // -> "기기 내역 관리" | "헬멧 인증 관리"

            U["name"]
        : // V가 배열이 아니면 (subNames가 없으면) MainMenu의 name 반환
          // 예: { name: "운행 관리", path: "/operation" } -> "운행 관리"

          never
      : // 이론상 도달 불가능한 경우

      U extends SubMenu
      ? // U가 SubMenu 타입인지 확인 (재귀 호출에서 발생)

        U["name"]
      : // SubMenu면 그 name을 반환
        // 예: { name: "기기 내역 관리", path: "/device-history" }
        // -> "기기 내역 관리"

        never
    : // MainMenu도 SubMenu도 아니면 never

      never;
// T가 배열이 아니면 never
```

주석을 넣어서 좀 길어졌는데.. 차근차근 읽어보면 결국 접근 가능한 메뉴의 name을 재귀적으로 추출하는 유틸리티 타입이다.

```ts
// menuList에서 권한으로 유효한 값만 추출하여 배열로 반환하는 타입
export type PermissionNames = UnpackMenuNames<typeof menuList>; // [기기 내역 관리, 헬멧 인증 관리, 운행 관리]

export interface MainMenu {
  // ...
  subMenus?: ReadonlyArray<SubMenu>;
}

export const menuList = [
  // ...
] as const;

interface RouteBase {
  name: PermissionNames;
  path: string;
  component: ComponentType;
}

export type RouteItem =
  | {
      name: string;
      path: string;
      component?: ComponentType;
      pages: RouteBase[];
    }
  | {
      name: PermissionNames;
      path: string;
      component?: ComponentType;
    };
```

infer를 사용한 유틸리티 타입으로 PermissionNames를 추출 후 RouteItem의 name에 할당하여 사용할 수 있다.
