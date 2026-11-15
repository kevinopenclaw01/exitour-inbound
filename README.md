# Entour Korea (by Exitour)

외국인 방한 프라이빗 투어 사이트. 2026-11-16부터 드라이빙 가이드 두 상품(차량 + 기사, 차량 + 자격 가이드 겸 기사 · 하루 10시간 · 스타리아 최대 7인 · 서울과 경기)을 중심으로 연다.
작업 지침은 `AGENTS.md`, 지금 상태와 남은 일은 `docs/10_narrow-launch.md`, 기획 문서는 `docs/`에 있다.

## 실행

```bash
npm install          # Windows: npm.cmd install
npm run dev          # http://localhost:3000
```

## 검사 (커밋 전 모두 통과)

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run check:pages   # 빌드 결과의 제목·설명·noindex·구조화 데이터 검사
```

## 환경변수

`.env.example`을 `.env.local`로 복사해 채운다. 비밀값은 커밋하지 않는다.
