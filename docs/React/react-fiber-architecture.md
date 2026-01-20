---
slug: react-fiber-architecture
title: React Fiber Architecture
---

## Fiber

- React의 재조정(reconciliation) 엔진을 재작성한 것
- 작업을 작은 단위로 쪼개서 우선순위를 정하고 중단/재개할 수 있게 해줌

## Fiber의 자료구조

각 Fiber 노드는 컴포넌트의 인스턴스를 나타냄

- `type`: 컴포넌트 타입 (함수, 클래스, DOM 태그)
- `key`: 리스트 렌더링 시 식별자
- `child`: 첫 번째 자식 Fiber
- `sibling`: 다음 형제 Fiber
- `return`: 부모 Fiber (반환할 위치)
- `alternate`: 현재/작업중 트리의 대응 노드
- `effectTag`: 어떤 작업이 필요한지 (Placement, Update, Deletion)
- `memoizedState`: Hook 상태 저장소

## 작업 단위 처리

Fiber는 `performUnitOfWork` 함수를 통해 각 노드를 순회

1. beginWork: 컴포넌트 렌더링, 자식 Fiber 생성
2. completeWork: DOM 노드 생성, effect 수집
3. 브라우저가 제어권을 필요로 하면 작업 중단 가능 (`requestIdleCallback`)

```javascript
// Fiber의 작업 우선순위
// 1. Immediate (동기)
// 2. UserBlocking (클릭, 입력)
// 3. Normal (네트워크 응답)
// 4. Low (분석)
// 5. Idle (백그라운드)
```

**이중 버퍼링 (Double Buffering)**

- current tree: 현재 화면에 렌더링된 트리
- workInProgress tree: 작업 중인 트리
- 각 Fiber는 `alternate` 포인터로 상대 트리의 노드를 참조
- 작업 완료 후 포인터만 교체 (commit phase)
- 이를 통해 렌더링 중간에 화면이 깨지는 것을 방지

**Render Phase vs Commit Phase**

- Render Phase: 비동기, 중단 가능, 사이드 이펙트 없음
  - Fiber 트리 순회하며 변경사항 계산
  - 우선순위에 따라 작업 스케줄링
- Commit Phase: 동기, 중단 불가, DOM 업데이트
  - 실제 DOM 변경 적용
  - useEffect, useLayoutEffect 실행
