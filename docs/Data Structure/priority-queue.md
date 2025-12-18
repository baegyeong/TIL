---
slug: priority-queue
title: 우선순위 큐
---

- 우선순위에 따라서 데이터를 추출하는 자료구조
- 각 요소가 우선순위를 가지고 있고 우선순위가 가장 높은 요소가 먼저 나감
- 힙을 사용하여 삽입과 삭제 연산을 O(logN)으로 구현 가능

## 힙

- 힙은 완전 이진 트리 자료구조를 따름
  - 이진 트리: 최대 2개까지의 자식을 가짐
  - 완전 이진 트리: 모든 노드가 왼쪽 자식부터 차근차근 채워진 트리
  - 포화 이진 트리: 리프 노드를 제외한 모든 노드가 두 자식을 가지고 있는 트리
  - 높이 균형 트리: 왼쪽 자식 트리와 오른쪽 자식 트리의 높이가 1 이상 차이가 나지 않는 트리
- 최대 힙: 값이 큰 원소부터 추출
- 최소 힙: 값이 작은 원소부터 추출

## 우선순위 큐 구현

### 생성자

```js
class PriorityQueue {
  constructor() {
    this.heap = [];
  }
}
```

### size, isEmpty 메서드

```js
  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }
```

### enqueue 메서드

- heap의 가장 끝에 값을 추가하고 heapifyUp을 진행한다.
- heapifyUp: 부모로 거슬러 올라가며 부모보다 자신이 더 작은 경우 위치를 교체

```js
  enqueue(value) {
    this.heap.push(value);
    this.heapifyUp();
  }

  heapifyUp() {
    let i = this.size() - 1;
    const lastNode = this.heap[i];

    while (i > 0) {
      const parentIndex = Math.floor((i - 1) / 2);
      if (lastNode < this.heap[parentIndex]) {
        this.heap[i] = this.heap[parentIndex];
        i = parentIndex;
      } else {
        break;
      }
    }

    this.heap[i] = lastNode;
  }
```

### dequeue 메서드

- 가장 마지막 노드가 루트 노드 위치에 오고, 루트 노드에서부터 하향식으로 heapifyDown을 진행한다.

```js
 dequeue() {
    if (this.isEmpty()) return null;
    if (this.size() === 1) return this.heap.pop();

    const rootNode = this.heap[0];
    this.heap[0] = this.heap.pop();

    this.heapifyDown();
    return rootNode;
  }

  heapifyDown() {
    let i = 0;
    const heapSize = this.size();

    while (true) {
      let swapIndex = i;
      const leftChildIndex = i * 2 + 1;
      const rightChildIndex = i * 2 + 2;

      if (leftChildIndex < heapSize) {
        if (this.heap[i] > this.heap[leftChildIndex]) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < heapSize) {
        if (this.heap[swapIndex] > this.heap[rightChildIndex]) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === i) break;
      [this.heap[i], this.heap[swapIndex]] = [
        this.heap[swapIndex],
        this.heap[i],
      ];

      i = swapIndex;
    }
  }
```

## 전체 코드

```js
class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  enqueue(value) {
    this.heap.push(value);
    this.heapifyUp();
  }

  heapifyUp() {
    let i = this.size() - 1;
    const lastNode = this.heap[i];

    while (i > 0) {
      const parentIndex = Math.floor((i - 1) / 2);
      if (lastNode < this.heap[parentIndex]) {
        this.heap[i] = this.heap[parentIndex];
        i = parentIndex;
      } else {
        break;
      }
    }

    this.heap[i] = lastNode;
  }

  dequeue() {
    if (this.isEmpty()) return null;
    if (this.size() === 1) return this.heap.pop();

    const rootNode = this.heap[0];
    this.heap[0] = this.heap.pop();

    this.heapifyDown();
    return rootNode;
  }

  heapifyDown() {
    let i = 0;
    const heapSize = this.size();

    while (true) {
      let swapIndex = i;
      const leftChildIndex = i * 2 + 1;
      const rightChildIndex = i * 2 + 2;

      if (leftChildIndex < heapSize) {
        if (this.heap[i] > this.heap[leftChildIndex]) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < heapSize) {
        if (this.heap[swapIndex] > this.heap[rightChildIndex]) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === i) break;
      [this.heap[i], this.heap[swapIndex]] = [
        this.heap[swapIndex],
        this.heap[i],
      ];

      i = swapIndex;
    }
  }
}
```

<br/>

**레퍼런스**

[[자료구조] 자바스크립트로 우선순위 큐(Priority Queue) 구현하기](https://dr-dev.tistory.com/26)
