---
slug: linked-list
title: 연결리스트
---

- 각 노드가 한 줄로 연결되어 있는 자료구조
- (데이터, 포인터) 형태이며 포인터는 다음 노드의 메모리 주소를 가리키는 목적

## 노듸 정의

```js
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
```

## 연결 리스트 클래스

```js
class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
}
```

## append(value): 뒤에 추가

```js
  append(value) {
    const newNode = new Node(value);

    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }
```

## prepend(value): 앞에 추가

```js
  prepend(value) {
    const newNode = new Node(value);

    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }

    this.length++;
  }
```

## insert(index, value): 중간 삽입

```js
  insert(index, value) {
    if (index < 0 || index > this.length) return;

    if (index === 0) return this.prepend(value);
    if (index === this.length) return this.append(value);

    const newNode = new Node(value);
    let current = this.head;

    for (let i = 0; i < index - 1; i++) {
      current = current.next;
    }

    newNode.next = current.next;
    current.next = newNode;
    this.length++;
  }
```

## remove(index): 삭제

```js
  remove(index) {
    if (index < 0 || index >= this.length) return;

    // 하나만 있을 때
    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    }
    // 첫 노드 삭제
    else if (index === 0) {
      this.head = this.head.next;
    }
    // 마지막 노드 삭제
    else if (index === this.length - 1) {
      let current = this.head;
      while (current.next !== this.tail) {
        current = current.next;
      }
      current.next = null;
      this.tail = current;
    }
    // 중간 삭제
    else {
      let current = this.head;
      for (let i = 0; i < index - 1; i++) {
        current = current.next;
      }
      current.next = current.next.next;
    }

    this.length--;
  }
```

## isEmpty()

```js
  isEmpty() {
    return this.length === 0;
  }
```

## print()

```js
  print() {
    let current = this.head;
    const result = [];

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    console.log(result.join(" -> "));
  }
```

## 전체 코드

```js
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // O(1)
  append(value) {
    const newNode = new Node(value);

    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  // O(1)
  prepend(value) {
    const newNode = new Node(value);

    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }

    this.length++;
  }

  // O(n)
  insert(index, value) {
    if (index < 0 || index > this.length) return false;

    if (index === 0) {
      this.prepend(value);
      return true;
    }

    if (index === this.length) {
      this.append(value);
      return true;
    }

    const newNode = new Node(value);
    let current = this.head;

    for (let i = 0; i < index - 1; i++) {
      current = current.next;
    }

    newNode.next = current.next;
    current.next = newNode;
    this.length++;
    return true;
  }

  // O(n)
  remove(index) {
    if (index < 0 || index >= this.length) return null;

    let removedNode;

    // 노드가 1개일 때
    if (this.length === 1) {
      removedNode = this.head;
      this.head = null;
      this.tail = null;
    }
    // 첫 노드 삭제
    else if (index === 0) {
      removedNode = this.head;
      this.head = this.head.next;
    }
    // 마지막 노드 삭제
    else if (index === this.length - 1) {
      let current = this.head;
      while (current.next !== this.tail) {
        current = current.next;
      }
      removedNode = this.tail;
      current.next = null;
      this.tail = current;
    }
    // 중간 삭제
    else {
      let current = this.head;
      for (let i = 0; i < index - 1; i++) {
        current = current.next;
      }
      removedNode = current.next;
      current.next = current.next.next;
    }

    this.length--;
    return removedNode.value;
  }

  // O(1)
  isEmpty() {
    return this.length === 0;
  }

  // O(n)
  indexOf(value) {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.value === value) return index;
      current = current.next;
      index++;
    }

    return -1;
  }

  // O(n)
  print() {
    let current = this.head;
    const result = [];

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    console.log(result.join(" -> "));
  }
}
```
