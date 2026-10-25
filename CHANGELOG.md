# 변경 기록

## 2026-10-25 — Claude (Claude Code) — Vercel 배포 준비: 사이트 주소 자동 설정

- `NEXT_PUBLIC_SITE_URL`이 없으면 Vercel 운영 주소(`VERCEL_PROJECT_PRODUCTION_URL`)를 쓰도록 함. 도메인 연결 전에도 사이트맵·canonical·구조화 데이터가 localhost를 가리키지 않게

## 2026-10-25 — Claude (Claude Code) — GitHub 저장소 연결, 타입 검사 수정

- 비공개 저장소 `kevinopenclaw01/exitour-inbound`에 첫 업로드
- `npm run typecheck`가 빌드 전(깨끗한 체크아웃, CI)에는 `PageProps` 타입이 없어 실패하던 것을 `next typegen && tsc --noEmit`으로 고침. `.next`를 지운 상태에서 재현 → 수정 후 통과 확인

## 2026-10-25 — Claude (Claude Code) — 연락처 반영, Supabase 여행 요청 저장 연결 (사용자 "supabase 연동시키고 / WhatsApp·LINE·카카오 / 09~18시")

- **연락처**: WhatsApp +82 10-9988-8846, LINE(같은 번호), 카카오톡 ID exitouroffice, 응대 시간 "09:00–18:00 KST, 그 밖에도 자주 답함". 하단·`/contact`(새 페이지)·여행 요청 결과·가이드 모집 페이지·`llms.txt`·구조화 데이터(telephone, ContactPoint)에 반영
- **Supabase**: 새 프로젝트 `exitour-inbound`(서울, 무료) 생성, `inquiries` 테이블 + RLS(손님은 넣기만, 조회 불가, 상태 조작 불가) 적용. 마이그레이션 `supabase/migrations/20261025083000_create_inquiries.sql`. 보안 점검(advisors) 경고 0개. anon 역할로 넣기 성공·조회 거부·status 조작 거부를 SQL로 확인
- **여행 요청 폼**: `/api/inquiry`(서버)로 저장 → 요청 번호 표시. 저장 실패 시 WhatsApp으로 보내기·복사 안내. "How did you find us?"(ChatGPT/AI 등) 칸, 스팸 봇용 숨은 칸 추가
- **검사**: lint·typecheck 통과, test 27개 통과, build 통과(20개 경로). API 검증 오류(422)·스팸 칸 처리 확인. **실제 Supabase 저장은 이 작업 환경의 네트워크가 supabase.co를 막아 확인하지 못함**(PC나 배포 환경에서 확인 필요)

## 2026-10-24 — Claude (Claude Code) — 저장소 시작: Entour Korea 사이트 v0 + 기획 문서 (사용자 "Exitour로 일단 만들어줘 / 렌트카+가이드 먼저 / 어디 저장할지 정해서 저장")

- **사이트 v0**: Next.js 16, React 19, Tailwind 4, TypeScript. 모든 페이지 정적 생성
  - 서비스 3종: `/private-driver`(차량+기사), `/driver-guide`(차량+자격 가이드), `/guide-tour`(가이드 투어와 일정 설계. 예시: 한강 저녁, 노을 갈매기)
  - `/prices`(그룹당 가격표), `/safety`(합법 구조), `/plan`(여행 요청 폼 → 메시지 생성), `/faq`, `/about`, `/join-as-guide`, `/travel-guide`(질문형 글 2편)
  - AI 노출 장치: 페이지마다 "Short answer" 상자, JSON-LD(TravelAgency, WebSite, Service, FAQPage, BreadcrumbList, Article), AI 크롤러를 허용하는 `robots.txt`, `sitemap.xml`, 콘텐츠 데이터에서 자동 생성하는 `/llms.txt`
  - 가격: 드라이빙 가이드 서울 ₩480,000, 경기 ₩540,000, 가이드만 종일 ₩230,000은 **draft**(파트너 원가 + 제안 마진). 나머지는 견적 문의. draft 가격은 구조화 데이터와 llms.txt에 나가지 않는다
- **문서** `docs/`: 결정 기록, 사업 기획, 로드맵, 사이트 기획, AI 검색 전략, 법규 메모, 파트너 상담 요약, 자격증 계획
- **공동 작업 장치**: `AGENTS.md`(모든 AI 공통 지침), `CLAUDE.md`·`GEMINI.md`·`QWEN.md`(AGENTS.md를 가리킴), `MAINTAINER.md`(작업 잠금), GitHub Actions(lint, typecheck, test, build)
- **검사**: lint 통과, typecheck 통과, test 23개 통과, build 통과(18개 경로 정적 생성), 데스크톱·휴대폰 화면 확인(가로 넘침과 콘솔 오류 없음)
