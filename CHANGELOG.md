# 변경 기록

## 2026-10-24 — Claude (Claude Code) — 저장소 시작: Entour Korea 사이트 v0 + 기획 문서 (사용자 "Exitour로 일단 만들어줘 / 렌트카+가이드 먼저 / 어디 저장할지 정해서 저장")

- **사이트 v0**: Next.js 16, React 19, Tailwind 4, TypeScript. 모든 페이지 정적 생성
  - 서비스 3종: `/private-driver`(차량+기사), `/driver-guide`(차량+자격 가이드), `/guide-tour`(가이드 투어와 일정 설계. 예시: 한강 저녁, 노을 갈매기)
  - `/prices`(그룹당 가격표), `/safety`(합법 구조), `/plan`(여행 요청 폼 → 메시지 생성), `/faq`, `/about`, `/join-as-guide`, `/travel-guide`(질문형 글 2편)
  - AI 노출 장치: 페이지마다 "Short answer" 상자, JSON-LD(TravelAgency, WebSite, Service, FAQPage, BreadcrumbList, Article), AI 크롤러를 허용하는 `robots.txt`, `sitemap.xml`, 콘텐츠 데이터에서 자동 생성하는 `/llms.txt`
  - 가격: 드라이빙 가이드 서울 ₩480,000, 경기 ₩540,000, 가이드만 종일 ₩230,000은 **draft**(파트너 원가 + 제안 마진). 나머지는 견적 문의. draft 가격은 구조화 데이터와 llms.txt에 나가지 않는다
- **문서** `docs/`: 결정 기록, 사업 기획, 로드맵, 사이트 기획, AI 검색 전략, 법규 메모, 파트너 상담 요약, 자격증 계획
- **공동 작업 장치**: `AGENTS.md`(모든 AI 공통 지침), `CLAUDE.md`·`GEMINI.md`·`QWEN.md`(AGENTS.md를 가리킴), `MAINTAINER.md`(작업 잠금), GitHub Actions(lint, typecheck, test, build)
- **검사**: lint 통과, typecheck 통과, test 23개 통과, build 통과(18개 경로 정적 생성), 데스크톱·휴대폰 화면 확인(가로 넘침과 콘솔 오류 없음)
