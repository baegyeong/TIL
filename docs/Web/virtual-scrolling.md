---
slug: virtual-scrolling
title: Virtual Scrolling
---

- 대량의 데이터를 효율적으로 렌더링하기 위한 기술
- 리스트를 표시할 때, 모든 항목을 한 번에 DOM에 렌더링하면 성능 문제가 발생
  - 따라서 실제로 화면에 보이는 항목들만 렌더링

## 작동원리

1. 현재 스크롤 위치 계산
2. 뷰포트에 표시될 항목들만 선택
3. 선택된 항목들만 DOM에 렌더링
4. 스크롤바가 정상적으로 작동하도록 전체 리스트 높이 유지

## 장점

- DOM 노드 수가 줄어들어 메모리 사용량이 감소
- 초기 로딩 속도 향상
- 렌더링 부담이 적어 부드러운 스크롤 (60fps) 구현 가능

## 라이브러리

npm trends에서 최근 1년간의 다운로드 수를 살펴봤을 때 `@tanstack/react-virtual`이 가장 높은 다운로드 수를 기록했다.
그 다음으로는 @tanstack/react-virtual > react-window > react-virtualized > react-infinite-scroll-component 순이었다.

- @tanstack/react-virtual
  - 대량의 요소 목록을 가상화하는 headless UI utility
  - headless UI이므로 스타일이나 마크업의 제어권은 사용자에게 있음

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function App() {
  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <div ref={parentRef} style={{ height: "400px", overflow: "auto" }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            Row {virtualItem.index}
          </div>
        ))}
      </div>
    </div>
  );
}
```
