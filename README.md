# Entour Korea (by Exitour)

외국인 방한 프라이빗 투어 사이트: 차량 + 기사, 차량 + 자격 가이드, 가이드 투어·일정 설계.
작업 지침은 `AGENTS.md`, 기획 문서는 `docs/`에 있다.

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
```

## 환경변수

`.env.example`을 `.env.local`로 복사해 채운다. 비밀값은 커밋하지 않는다.
