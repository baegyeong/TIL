---
slug: caching-strategy
title: 캐싱 전략
---

# 1. 브라우저 캐싱

브라우저는 응답 헤더를 보고 리소스를 얼마나, 어떻게 저장할지 결정

### Cache-Control 헤더

가장 핵심적인 헤더이며 여러 디렉티브를 조합해서 사용

```
Cache-Control: max-age=31536000, immutable       // JS/CSS 정적 자산
Cache-Control: no-cache                          // 항상 서버에 재검증 요청
Cache-Control: no-store                          // 아예 캐싱 금지
Cache-Control: public, max-age=3600             // CDN 포함 모든 곳에서 캐싱
Cache-Control: private, max-age=600             // 브라우저만 캐싱 (개인 데이터)
```

- `max-age`: 캐시 유효 기간(초). 이 시간 안에는 서버 요청 자체를 안 보냄
- `no-cache`: 캐시는 하되, 사용 전 서버에 아직 유효한 지 확인 후 씀
- `no-store`: 민감 정보(결제 페이지 등)에 사용. 디스크/메모리 어디에도 저장 안 함
- `immutable`: 유효 기간 내엔 재검증 요청조차 안 보냄. 해시 붙은 정적 자산에 최적

### ETag & Last-Modified (조건부 요청)

max-age가 만료된 후, 브라우저는 곧바로 새 파일을 받는 게 아니라 서버에 변경됐는지 물음

```
// 최초 응답
ETag: "abc123"
Last-Modified: Tue, 01 Jan 2025 00:00:00 GMT

// 재검증 요청 (브라우저 → 서버)
If-None-Match: "abc123"
If-Modified-Since: Tue, 01 Jan 2025 00:00:00 GMT

// 변경 없으면 서버는 304 Not Modified 반환 (body 없음, 빠름)
```

- 파일이 안 바뀌었으면 304로 응답해 body 전송을 생략 → 대역폭 절약

### 캐시 버스팅 (Cache Busting)

max-age가 길면 변경사항이 반영이 안됨 -> 해결법은 파일명에 해시를 넣는 것

```
// Vite, webpack이 빌드 시 자동으로 생성
main.a3f9b2c1.js
styles.7e4d1a0f.css
```

- 파일 내용이 바뀌면 해시가 바뀌고 → URL이 달라지므로 → 브라우저는 새 파일로 인식
- index.html은 해시 없이 no-cache로 관리하면 항상 최신 JS/CSS URL을 가리킬 수 있음

# 2. CDN 캐싱

- 전 세계 엣지 서버에 콘텐츠를 복제해 지리적 레이턴시를 줄임
- 브라우저 캐시와 원본 서버 사이에 위치
- [cdn TIL 문서](/docs/Network/cdn.md)

### 기본 흐름

```
사용자 → CDN 엣지 (HIT이면 여기서 응답) → Origin 서버 (MISS일 때만)
```

- Cache HIT: CDN이 이미 갖고 있음 → 원본 서버 요청 없이 즉시 응답
- Cache MISS: CDN에 없음 → 원본 요청 후 결과를 저장하고 응답

### s-maxage

public과 함께 쓰면 CDN 전용 TTL을 따로 설정할 수 있음

```
Cache-Control: public, max-age=60, s-maxage=86400
```

- 브라우저는 60초 캐싱, CDN은 하루 동안 캐싱

### CDN 퍼지 (Purge)

- 콘텐츠가 바뀌었을 때 CDN에 저장된 캐시를 강제로 지우는 작업
- 배포 파이프라인에 포함시키는 게 일반적

```bash
# Cloudflare 예시
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  -d '{"purge_everything": true}'
```

- 정적 자산(해시 파일)은 퍼지가 불필요하며 HTML, API 응답처럼 가변적인 리소스에 필요

### Vary 헤더

같은 URL이라도 요청 조건이 다르면 다른 캐시를 저장하도록 지시

```
Vary: Accept-Encoding     // gzip/br 별로 다른 캐시
Vary: Accept-Language     // 언어별 다른 캐시
```

- `Vary: *`는 캐싱을 사실상 비활성화하므로 피해야함

# 3. API 캐싱

데이터 요청에는 브라우저 HTTP 캐시 외에도 여러 레이어가 존재

### HTTP 캐시 활용

GET 요청에 Cache-Control을 적용하면 브라우저와 CDN 모두 API 응답을 캐싱 할 수 있음

```
# 공개 데이터 (뉴스, 상품 목록 등)
Cache-Control: public, max-age=60, stale-while-revalidate=300

# 사용자별 데이터
Cache-Control: private, max-age=30
```

### stale-while-revalidate

캐시가 만료됐어도 일단 오래된 응답을 즉시 반환하고, 백그라운드에서 조용히 새 데이터를 받아옴

```
Cache-Control: max-age=60, stale-while-revalidate=300
```

- 60초 안에는 캐시 사용, 60~360초 사이엔 오래된 캐시를 먼저 보여주고 동시에 재검증
- UX 관점에서 로딩 없이 빠르게 보여주면서 데이터도 최신으로 유지할 수 있음

### 클라이언트 캐싱 라이브러리

React Query, SWR 같은 라이브러리가 이 패턴을 자동화해줌

### 낙관적 업데이트

서버 응답을 기다리지 않고 UI를 먼저 바꾼 뒤, 실패 시 롤백

- 캐싱 전략의 일종이면서 UX 향상 기법
