---
slug: fouc
title: FOUC(Flash of Unstyled Content)
tags: [fouc]
---

## FOUC란?

> Flash of Unstyled Content의 약자로, 외부의 CSS가 불러오기 전에 잠시 스타일이 적용되지 않은 웹 페이지가 나타나는 현상

## 원인

1. HTML 파싱과 CSS 로딩의 시간차

- 브라우저가 HTML을 먼저 파싱하고 렌더링하는데, CSS 파일 다운로드가 늦어지면 스타일 없는 콘텐츠가 먼저 표시됨

2. JavaScript로 스타일 조작

- 페이지 로드 후 JavaScript가 DOM을 조작하거나 클래스를 추가할 때 발생
- 실제로 프로젝트 도중 React에서 useEffect 내부에 테마 변경 코드를 넣었다가 FOUC가 발생했었다.
  - useEffect는 React DOM 업데이트 후 실행되므로 잠깐 지연이 발생하기 때문
  - 관련 트러블 슈팅: [다크모드에서 새로고침 시 라이트모드가 잠깐 보이는 문제(FOUC)](<https://github.com/boostcampwm-2024/web17-juchumjuchum/wiki/%F0%9F%8C%9A-%EB%8B%A4%ED%81%AC%EB%AA%A8%EB%93%9C%EC%97%90%EC%84%9C-%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8-%EC%8B%9C-%EB%9D%BC%EC%9D%B4%ED%8A%B8%EB%AA%A8%EB%93%9C%EA%B0%80-%EC%9E%A0%EA%B9%90-%EB%B3%B4%EC%9D%B4%EB%8A%94-%EB%AC%B8%EC%A0%9C(FOUC)>)

3. 외부 폰트 로딩: 웹폰트가 로딩되기 전에 기본 폰트로 텍스트가 먼저 렌더링되는 경우

## 해결 방법

1. CSS를 `<head>` 태그에 배치하여 HTML보다 먼저 로드되게 하기
2. 인라인 CSS를 사용하여 페이지와 함께 로드하기 (필수적인 정보만 쓸 것)
3. `<link>` 태그의 preload 속성 등을 사용하여 웹 폰트 로드 최적화
4. JavaScript 호출을 `<body>` 태그의 끝 부분에 배치하거나 async 또는 defer 속성 사용
5. 서버에서 HTML을 렌더링하는 SSR 사용
