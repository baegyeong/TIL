---
slug: tls-handshake
title: TLS 핸드셰이크
---

## TLS란?

- 안전한 인터넷 통신을 위한 암호화 및 인증 프로토콜
- 클라이언트와 서버 간의 통신을 암호화하여 제3자가 데이터를 도청하거나 변조할 수 없도록 보호

## TLS 핸드셰이크의 목적

- 안전한 통신을 시작하기 전에 클라이언트와 서버가 수행하는 협상 과정
  - 서로의 신원 확인
  - 사용할 암호화 알고리즘 협상
  - 세션 키(대칭키) 생성 및 안전한 교환
  - 통신 무결성 보장

## TLS 1.2 핸드셰이크 과정

- 전체 핸드셰이크는 2-RTT(Round Trip Time)가 소요

**1단계: Client Hello (클라이언트 → 서버)**

- 클라이언트가 서버에 연결을 시작하며 다음 정보 전송
  - TLS 버전: 클라이언트가 지원하는 TLS 버전 목록
  - Cipher Suites: 클라이언트가 지원하는 암호화 알고리즘 목록 (예: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256)
  - Random 값: 클라이언트가 생성한 랜덤 데이터 (나중에 세션 키 생성에 사용)
  - Session ID: 이전 세션을 재사용하려는 경우 해당 ID
  - 확장(Extensions): SNI(Server Name Indication), ALPN 등의 추가 기능

**2단계: Server Hello (서버 → 클라이언트)**

- 서버가 클라이언트의 제안을 받아들이고 응답
  - 선택된 TLS 버전: 사용할 TLS 버전
  - 선택된 Cipher Suite: 서버가 선택한 암호화 알고리즘
  - Random 값: 서버가 생성한 랜덤 데이터
  - Session ID: 세션 재사용을 위한 ID

**3단계: Certificate (서버 → 클라이언트)**

- 서버가 자신의 디지털 인증서를 전송
- 인증서 내용
  - 서버의 공개키
  - 도메인 정보
  - 인증 기관(CA)의 서명
  - 유효 기간
- 클라이언트는 이 인증서를 검증하여 서버가 신뢰할 수 있는지 확인

**4단계: Server Key Exchange (서버 → 클라이언트)**
키 교환 알고리즘에 따라 필요한 추가 정보를 전송

**5단계: Server Hello Done (서버 → 클라이언트)**

- 서버가 자신의 핸드셰이크 메시지 전송을 완료했음을 알림

**6단계: Client Key Exchange (클라이언트 → 서버)**

- 클라이언트가 키 교환에 필요한 정보를 전송
  - ECDHE 방식: 클라이언트의 임시 공개키를 전송
  - RSA 방식: Pre-Master Secret을 서버 공개키로 암호화하여 전송

이 시점에서 클라이언트와 서버는 각각 동일한 Pre-Master Secret을 계산 가능

**7단계: Master Secret 생성**

```
Master Secret = PRF(Pre-Master Secret, "master secret", ClientRandom + ServerRandom)
```

- 양측이 독립적으로 계산
- 이 Master Secret으로부터 실제 암호화에 사용할 세션 키들을 파생
  - 클라이언트 암호화 키
  - 서버 암호화 키
  - 클라이언트 MAC 키
  - 서버 MAC 키

**8단계: Change Cipher Spec (클라이언트 → 서버)**
클라이언트가 이제부터 협상된 암호화를 사용하겠다고 알림

**9단계: Finished (클라이언트 → 서버)**

- 클라이언트가 지금까지의 모든 핸드셰이크 메시지에 대한 해시값을 암호화하여 전송
- 이를 통해 핸드셰이크가 변조되지 않았음을 증명

**10단계: Change Cipher Spec & Finished (서버 → 클라이언트)**
서버도 같은 방식으로 암호화를 활성화하고 Finished 메시지를 전송

**11단계: 암호화된 데이터 통신 시작**
핸드셰이크가 완료되면 양측은 협상된 대칭키로 데이터를 암호화하여 통신
