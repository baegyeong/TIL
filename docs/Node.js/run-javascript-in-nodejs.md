---
slug: run-javascript-in-nodejs
title: Node.js의 자바스크립트 실행 방법
---

## Node.js의 구성요소

![Node.js의 구성요소](/assets/components-of-nodejs.png)

- 각 계층이 각 하단에 있는 API를 사용

  - 사용자 코드는 Node.js의 API 사용
  - Node.js API는 C++에 바인딩 되어 있는 소스이거나 직접 만든 C++애드온 호출
  - C++에서는 V8을 사용해 JS 해석 및 최적화, C/C++ 종속성이 있는 코드 실행
  - libuv의 API를 사용해 해당 운영체제에 알맞는 API 사용

- V8: 자바스크립트 코드를 실행하도록 해줌
- libuv: 이벤트 루프 및 운영체제 계층 기능을 사용하도록 API 제공

## V8 엔진: 자바스크립트 실행

![V8 엔진의 JS 코드 컴파일 단계](/assets/v8-compile.png)

- 파서, 컴파일러, 인터프리터, 가비지 컬렉터, 콜 스택, 힙으로 구성

- JS 코드가 파서에 전달되어 `AST`로 만들어짐
- 이그니션 인터프리터에 전달되면 이그니션은 AST를 `바이트코드`로 만듦
- 최적화가 필요하다면 터보팬으로 넘김
- 터보팬에서 컴파일 과정을 거쳐서 `바이너리 코드`가 됨
- 최적화가 잘 안 된 경우는 다시 최적화를 해제하고 이그니션의 인터프리터 기능 사용

## libuv: 이벤트 루프와 운영체제 단 비동기 API 및 스레드 풀 지원

![libuv 아키텍처](/assets/libuv-architecture.png)

- JS로 C++ 코드를 감싸서 사용 (C++ 바인딩)
- 다양한 플랫폼에서 사용할 수 있는 이벤트 루프 제공
- 네트워크, 파일 IO, DNS, 스레드 풀 기능 제공

## Node.js 아키텍처로 코드가 어떻게 실행되는지 확인하기

![nodejs 아키텍처](/assets/nodejs-architecture.png)

1. 애플리케이션에서 요청 발생
   - V8 엔진은 JS 코드로 된 요청을 바이트 코드나 기계어로 변경
