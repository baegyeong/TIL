---
slug: ssh
title: ssh(Secure Shell)
---

## SSH란?

네트워크 상의 다른 컴퓨터에 로그인하거나 원격 시스템에서 명령을 실행하고 다른 시스템으로 파일을 복사할 수 있도록 해 주는 응용 프로그램 또는 그 프로토콜을 가리킴

## 주요 특징

- 공개키 암호화 방식을 사용하여 클라이언트와 서버 간의 통신을 암호화
- 기본적으로 22번 포트 사용
- 사용자 인증과 데이터 암호화를 통해 안전한 원격 접속을 가능하게 함
  - 기존에도 이러한 프로그램(rsh, rlogin, telnet 등)이 있었으나, 통신 과정에서 암호화가 되어 있지 않아 스니핑 공격에 늘 노출되어 있었음

## SSH 통신 과정

1. Session Authentication

> 클라이언트와 서버가 서로가 올바른 노드인지 인증하는 절차

- 공개키와 개인키로 이루어지는 비대칭키 암호화 방식 이용
- SSH Client가 최초에 요청한 SSH Connection Request를 공격자가 가로채어 SSH Server인 척 하지 못하게 하기 위해 세션이 맺어지기 전부터 인증 과정을 거침

![](/static/img/session-authentication.png)

2. User Authentication

- SSH Client와 SSH Server 간에 Connection 연결 후, 접속을 시도하는 User가 접속 권한이 있는 사람인지 확인하는 절차 필요

- Password 인증

  - 사용자가 입력한 비밀번호를 Session Authentication 과정에서 생성한 Session Key로 암호화하여 SSH Server에게 보내고, SSH Server가 검증하면 끝나는 방식
  - 보안상 권장하지 않음

- Key-Pair 인증
  - SSH Client에서 Public Key, Private Key를 생성하고, 이를 SSH Server에 접속할 때 Public Key를 제출하여 인증되는 방식
  - 인증 과정
    - 클라이언트가 서버에 연결 요청
    - 서버가 랜덤 챌린지 생성 후 클라이언트의 공개키로 암호화
    - 클라이언트가 개인키로 챌린지를 복호화하여 응답
    - 서버가 응답을 검증하여 인증 완료

![](/static/img/key-pair-ssh.png)

<br/>

**레퍼런스**

[SSH의 개념, 통신 과정](https://co-no.tistory.com/entry/%ED%86%B5%EC%8B%A0-SSH%EC%9D%98-%EA%B0%9C%EB%85%90-%ED%86%B5%EC%8B%A0-%EA%B3%BC%EC%A0%95feat-OpenSSH)
