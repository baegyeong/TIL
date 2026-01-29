---
slug: lower-bound-upper-bound
title: lower bound와 upper bound
---

- 정렬된 자료구조에서 특정 값의 위치를 찾는 이진 탐색 알고리즘
- 시간복잡도는 O(logN)

## Lower Bound

- 찾고자 하는 값의 시작 위치를 찾는 알고리즘
- 배열에서 target 값보다 크거나 같은 첫 번째 원소의 위치를 반환

![](/img/lower-bound.png)

**[예시] target=2를 찾는 경우**

```
초기 상태:
left = 0, right = 7
배열: [1, 2, 2, 2, 3, 4, 5]
인덱스: 0  1  2  3  4  5  6

1단계:
mid = (0 + 7) / 2 = 3
arr[3] = 2 >= 2 (target) → right = mid = 3

2단계:
mid = (0 + 3) / 2 = 1
arr[1] = 2 >= 2 (target) → right = mid = 1

3단계:
mid = (0 + 1) / 2 = 0
arr[0] = 1 < 2 (target) → left = mid + 1 = 1

종료: left = 1, right = 1
결과: 인덱스 1 반환
```

**[로직]**

```javascript
function lowerBound(arr, target) {
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] < target) {
      left = mid + 1; // target보다 작으면 오른쪽 탐색
    } else {
      right = mid; // target 이상이면 왼쪽 탐색
    }
  }

  return left;
}
```

## Upper Bound

- 찾고자 하는 값보다 처음으로 큰 값의 위치를 찾는 알고리즘
- 배열에서 target 값보다 큰 첫 번째 원소의 위치를 반환

![](/img/upper-bound.png)

**[예시] target=2를 찾는 경우**

```
초기 상태:
left = 0, right = 7
배열: [1, 2, 2, 2, 3, 4, 5]
인덱스: 0  1  2  3  4  5  6

1단계:
mid = (0 + 7) / 2 = 3
arr[3] = 2 <= 2 (target) → left = mid + 1 = 4

2단계:
mid = (4 + 7) / 2 = 5
arr[5] = 4 > 2 (target) → right = mid = 5

3단계:
mid = (4 + 5) / 2 = 4
arr[4] = 3 > 2 (target) → right = mid = 4

종료: left = 4, right = 4
결과: 인덱스 4 반환
```

**[로직]**

```javascript
function upperBound(arr, target) {
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] <= target) {
      left = mid + 1; // target 이하면 오른쪽 탐색
    } else {
      right = mid; // target 초과면 왼쪽 탐색
    }
  }

  return left;
}
```

<br/>

**레퍼런스**

[Lower bound & Upper bound 개념 및 구현](https://yoongrammer.tistory.com/105)
