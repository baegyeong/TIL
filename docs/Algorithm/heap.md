---
slug: heap
title: Heap(힙)
---

## 개요

- Heap은 완전 이진 트리(Complete Binary Tree) 기반의 자료구조
- 최솟값 또는 최댓값을 O(1)에 조회

- 최소 힙(Min Heap): 부모 노드 ≤ 자식 노드 → 루트가 항상 최솟값
- 최대 힙(Max Heap): 부모 노드 ≥ 자식 노드 → 루트가 항상 최댓값

## 핵심 연산과 시간복잡도

| 연산      | 설명               | 시간복잡도 |
| --------- | ------------------ | ---------- |
| `peek`    | 최솟값/최댓값 조회 | O(1)       |
| `push`    | 원소 삽입          | O(log N)   |
| `pop`     | 루트 원소 제거     | O(log N)   |
| `heapify` | 배열 → 힙 변환     | O(N)       |

## 동작 원리

### 삽입 (Push)

1. 트리의 맨 끝에 원소를 추가
2. 부모와 비교하며 조건을 만족할 때까지 위로 올림 (Sift Up)

### 삭제 (Pop)

1. 루트를 제거하고, 맨 끝 원소를 루트 자리로 옮김
2. 자식과 비교하며 조건을 만족할 때까지 아래로 내림 (Sift Down).

## JavaScript 예제

```js
class MinHeap {
  constructor() {
    this.heap = [];
  }

  peek() {
    return this.heap[0];
  }

  push(val) {
    this.heap.push(val);
    this._siftUp(this.heap.length - 1);
  }

  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  _siftUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent] <= this.heap[i]) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  _siftDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.heap[left] < this.heap[smallest]) smallest = left;
      if (right < n && this.heap[right] < this.heap[smallest]) smallest = right;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

// 사용 예시
const heap = new MinHeap();
heap.push(3);
heap.push(1);
heap.push(5);

console.log(heap.peek()); // 1
console.log(heap.pop()); // 1
console.log(heap.peek()); // 3
```

## 배열로 표현

- 힙은 배열로 간결하게 표현 가능

- 인덱스 i의 노드 기준
  - 부모: (i - 1) // 2
  - 왼쪽 자식: 2 \* i + 1
  - 오른쪽 자식: 2 \* i + 2

## 활용 사례

- 우선순위 큐 (Priority Queue) 구현
- 다익스트라(Dijkstra) 최단경로 알고리즘
- 힙 정렬 (Heap Sort) — O(N log N)
- Top K 문제 — K번째로 크거나 작은 원소 탐색
