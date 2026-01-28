---
slug: yarn-pnpm
title: yarn과 pnpm
---

## Yarn

- facebook에서 2016년에 만든 JavaScript 패키지 매니저
- npm의 속도, 보안, 일관성 문제를 해결

- yarn classic(v1)의 주요 특징
  - yarn.lock 파일로 의존성 버전을 정확히 고정해서 어디서나 동일한 패키지 설치 보장
  - 병렬 설치로 npm보다 빠른 설치 속도
  - 오프라인 캐시 기능으로 이미 설치한 패키지는 인터넷 없이도 재설치 가능
  - node_modules 폴더에 flat한 구조로 패키지 저장

## Yarn berry

- yarn v2 이상을 지칭하는 이름으로 2020년에 출시

- Plug'n'Play (PnP)
  - 기존의 node_modules 방식을 버리고 .pnp.cjs 파일로 의존성 관리
  - .pnp.cjs 파일에 모든 패키지의 위치정보가 맵으로 작성됨
  - 따라서 디스크 I/O가 대폭 줄어들어 설치 속도가 빠르고, 프로젝트 용량이 크게 감소
  - 유령 의존성 문제 해결

- Zero-Installs
  - .yarn/cache 폴더를 git에 커밋해서 의존성을 저장소에 포함시킬 수 있음
  - CI/CD에서 yarn install 없이 바로 실행 가능

- workspace 개선
  - workspace 간 의존성 관리가 명확해짐

## pnpm

- 2017년에 등장한 빠르고 디스크 효율적인 JavaScript 패키지 매니저

- 콘텐츠 주소 기반 저장소
  - 모든 패키지를 홈 디렉토리의 글로벌 저장소(~/.pnpm-store)에 한번만 저장 (프로젝트에서는 하드링크로 연결)
  - 같은 패키지의 같은 버전은 디스크에 딱 한 번만 저장됨
  - 프로젝트의 node_modules는 심볼릭 링크 구조로 구성
  - 여러 프로젝트에서 같은 패키지를 쓰더라도 디스크 공간은 하나만큼만 차지

- 엄격한 node_modules 구조
  - node_modules에 flat하게 모든 패키지를 설치하지 않고 중첩된 구조를 유지
  - package.json에 명시된 의존성만 직접 접근 가능
  - 유령의존성 차단
  - 의존성 그래프가 명확해짐

- 빠른 설치 속도
  - 콜드 캐시: 하드링크 생성만 하면 되어서 빠름
  - 핫 캐시: 글로벌 저장소에서 링크만 걸면 되어서 빠름

- workspace 기능
