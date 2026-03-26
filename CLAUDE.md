# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # 개발 서버 실행 (localhost:3000/TIL)
npm run build          # 프로덕션 빌드
npm run typecheck      # TypeScript 타입 검사

node scripts/generate-graph.js          # 지식 그래프 JSON 수동 재생성 (GEMINI_API_KEY 필요)
node scripts/generate-recommendations.js # TIL 추천 수동 생성 (GEMINI_API_KEY 필요)

cd mcp-server && npm run build  # MCP 서버 빌드
cd mcp-server && npm run dev    # MCP 서버 개발 모드 실행
```

환경 변수: `GEMINI_API_KEY`가 루트 `.env`에 필요 (그래프/추천 스크립트 실행 시)

## Architecture

이 프로젝트는 **Docusaurus 기반 TIL 사이트 + 자동화된 지식 관리 파이프라인**이다.

### 핵심 데이터 흐름

```
docs/**/*.md  →  GitHub Actions  →  Gemini AI 분석  →  static/data/knowledge-graph.json
                                                     →  meta/recommendations/YYYY-MM-DD.md + GitHub Issue
```

- `docs/**` 변경 push → `update-knowledge-graph.yml` 트리거 → 그래프 JSON 자동 갱신
- 매주 월요일 → `recommend-til.yml` 트리거 → 추천 문서 + GitHub Issue 자동 생성
- 자동 생성 커밋이 다시 CI를 트리거하지 않도록 경로 필터로 설계됨

### TIL 문서 규칙

- 경로: `docs/{카테고리}/{slug}.md`
- 현재 카테고리: `Algorithm`, `Data Structure`, `JavaScript`, `Network`, `Next`, `Node.js`, `Operating System`, `React`, `TypeScript`, `Web`
- frontmatter 필수 필드: `slug`, `title`
- 사이드바는 파일시스템 구조에서 자동 생성 (`sidebars.ts`)

### 주요 구성요소

- **`scripts/generate-graph.js`**: 모든 TIL을 읽어 Gemini AI로 관계 분석 후 `static/data/knowledge-graph.json` 생성
- **`scripts/generate-recommendations.js`**: 지식 그래프와 TIL 목록을 Gemini에 전달해 학습 추천 생성
- **`src/KnowledgeGraph.tsx`**: React Flow 기반 지식 그래프 시각화 (노드 = TIL, 엣지 = 개념 관계)
- **`mcp-server/`**: TIL 검색/조회용 MCP 서버. `TIL_PATH` 환경 변수로 저장소 경로 지정

### 배포

GitHub Pages (`baegyeong.github.io/TIL`)로 배포. `deploy.yml`이 `main` 브랜치 push 시 자동 실행.
