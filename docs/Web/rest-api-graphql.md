---
slug: rest-api-graphql
title: REST API vs GraphQL
---

## REST API

클라이언트 애플리케이션이 HTTP 동사를 사용하여 서버와 데이터를 교환

## GraphQL

클라이언트 애플리케이션이 원격 서버로부터 데이터를 요청하는 방법에 대한 사양을 정의하는 API 쿼리 언어

## 데이터 요청 방식

- REST API: 여러 엔드포인트를 통해 고정된 데이터 구조 반환
- GraphQL: 단일 엔드포인트에서 쿼리를 통해 필요한 데이터만 정확히 요청

```graphql
query {
  user(id: 123) {
    name
    posts {
      title
    }
  }
}
```

## 유연성과 효율성

- REST는 버전 관리를 통해 API를 발전
- GraphQL은 스키마에 필드를 추가하는 방식으로 하위 호환성 유지하며 확장 가능

## 캐싱과 성능

- REST는 HTTP 캐싱을 활용하여 CDN이나 브라우저 캐시 적용 가능
- GraphQL은 POST 요청을 사용하므로 캐싱이 복잡하지만, Apollo Client 같은 라이브러리가 정교한 클라이언트 사이드 캐싱 제공

## 실시간 데이터

- GraphQL는 Subscription을 통해 실시간 데이터 업데이트를 표준으로 지원
- REST는 웹소켓이나 SSE를 별도로 구현
