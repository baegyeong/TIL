# TIL

꾸준히 작성한 TIL을 기반으로 지식 간의 관계를 자동으로 분석하고,
다음에 학습하면 좋은 주제를 추천하는 **자동화된 학습 파이프라인**

## ✨ Core Features

### 1️⃣ Consistent TIL Writing

- `docs/` 디렉토리에 프론트엔드 중심의 TIL을 지속적으로 기록
- React, Network, Operating System, Data Structure 등 핵심 영역 중심

### 2️⃣ Automated Knowledge Graph Generation

TIL 간의 관계를 **지식 그래프 형태로 자동 생성**

- **Gemini AI API**를 활용해 TIL 간 관계 분석
- 노드: TIL 문서
- 엣지: 개념적 연관성, 선행 지식, 확장 관계
- **React Flow** 기반 시각화

#### 자동화 파이프라인

1. TIL 문서 추가/수정
2. GitHub Action 트리거
3. 지식 그래프 JSON 자동 재생성
4. 웹에 즉시 반영

### 3️⃣ Full-Text Search with Algolia (진행중)

- `@docusaurus/theme-search-algolia` 사용
- **문서 본문 전체 검색 가능**
- 공식 문서 검색(cmd+k)과 유사한 UX 제공

### 4️⃣ Weekly TIL Topic Recommendations (AI-driven)

현재까지의 학습 내용을 기반으로
**다음에 작성하면 좋은 TIL 주제를 자동 추천**

- Gemini AI API 기반 분석
- 입력:

  - 기존 TIL
  - 지식 그래프 구조

- 출력:

  - 우선 학습 주제
  - 상대적으로 약한 영역
  - 기존 TIL을 연결/확장할 수 있는 주제

#### 자동화 결과물

- 날짜별 추천 문서 생성 (`meta/recommendations/YYYY-MM-DD.md`)
- GitHub Issue 자동 생성
- 주 1회 실행 (GitHub Action)

## 🏗 Architecture Overview

```text
docs/til/**                 # 실제 TIL 문서
        ↓
GitHub Actions
        ↓
Gemini AI 분석
        ↓
Knowledge Graph JSON 생성
        ↓
React Flow 시각화
        ↓
Weekly Topic Recommendation
        ↓
Markdown Commit + GitHub Issue
```

- **문서(Source)** 와 **메타 산출물(Result)** 분리
- 자동 생성 파일이 CI를 재귀적으로 트리거하지 않도록 설계

## 📌 Tech Stack

- **Frontend**: React, React Flow, Docusaurus
- **Search**: Algolia
- **AI**: Gemini API
- **Automation**: GitHub Actions
- **Visualization**: Knowledge Graph (Node-Link Model)
