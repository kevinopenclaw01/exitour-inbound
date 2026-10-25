# Entour Korea (Exitour 인바운드) — 모든 AI 공동 작업 지침

이 저장소에는 Exitour의 **외국인 방한 투어 브랜드 "Entour Korea"** 사이트와 사업 기획 문서가 있다.
Claude(데스크톱 앱, Claude Code)와 넥서스 코딩 탭(Codex, Qwen, GLM, DeepSeek 등) 누구든 이어서 작업할 수 있게 관리한다.
`CLAUDE.md`, `GEMINI.md`, `QWEN.md`는 모두 이 파일을 가리킨다.

## 1. 먼저 읽기 (순서)

1. 이 파일
2. `CHANGELOG.md` 맨 위 3개 항목
3. `MAINTAINER.md`: 지금 누가 작업 중인지 표시하는 잠금판
4. 작업과 관련된 `docs/` 문서 (목록은 `docs/README.md`)

## 2. 절대 규칙

| 규칙 | 이유 |
|---|---|
| 비밀번호, API 키, 토큰, 손님 개인정보(여권 번호 등)를 코드·문서·커밋에 쓰지 않는다. 비밀값은 커밋되지 않는 `.env`에만 둔다 | 저장소가 유출돼도 피해가 없게 |
| **파트너 원가와 마진은 이 비공개 저장소의 `docs/`에만** 둔다. 공개 저장소(`exitour-platform`)로 옮기지 않는다 | 원가가 공개되면 협상력이 사라진다 |
| 가격은 `src/content/pricing.ts` 한 곳에서만 바꾼다. `status: "draft"` 값은 화면에 "draft rate"로만 보이고, 구조화 데이터와 `llms.txt`에는 나가지 않는다. 사장님 확인 없이 `confirmed`로 바꾸지 않는다 | 틀린 가격이 AI 답변에 퍼지면 되돌리기 어렵다 |
| 법 관련 표현(렌터카 운전자 알선, 관광통역안내사 자격, 자가용 유상운송 금지)은 `docs/05_legal-notes.md`와 다르게 쓰지 않는다 | 사실과 다른 법률 문구는 신뢰와 책임 문제가 된다 |
| 자격 없는 기사가 관광지 안을 안내하는 것처럼 쓰지 않는다. "driver is not a guide" 원칙을 지킨다 | 관광진흥법 위반 소지 |
| 가짜 후기, 숨은 문구, AI에게만 보이는 텍스트를 만들지 않는다 | 검색과 AI 노출에서 퇴출된다 |
| 고객용 문구는 영어로 쓴다(다른 언어는 나중에 추가). 문서와 커밋 메시지는 한국어로 쓴다 | 사이트는 외국인용, 운영은 한국어 |

## 3. 작업 순서

1. 시작할 때 `git pull`, 이어서 `git status`로 남이 커밋하지 않은 변경이 있는지 본다. `MAINTAINER.md` "작업 중"에 이름, 시각, 할 일을 적는다.
2. 고친 뒤 아래 검사를 모두 통과시킨다. Windows에서는 `npm` 대신 `npm.cmd`를 쓴다.
   ```
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```
3. 커밋 메시지는 한국어로 "무엇을, 왜" 한두 줄과 검사 결과를 쓴다. 그다음 `git push`.
4. `CHANGELOG.md` 맨 위에 항목을 추가한다. `MAINTAINER.md` "작업 중"을 비우고 "마지막 작업"으로 옮긴다.

## 4. 코드 지도

| 위치 | 내용 |
|---|---|
| `src/content/` | **사이트의 모든 데이터**: 회사 정보(`site.ts`), 서비스 3종과 차량(`services.ts`), 가격(`pricing.ts`), 일정 예시(`plans.ts`), FAQ(`faqs.ts`), 안내 글(`articles.ts`). 나중에 관리자 화면(CMS)이나 DB로 옮길 때 `types.ts`의 타입이 그대로 테이블이 된다 |
| `src/lib/` | 가격 계산(`pricing.ts`), 구조화 데이터(`schema.ts`), 여행 요청 검증과 문구(`inquiry.ts`), 공개 페이지 목록(`routes.ts`), `llms.txt` 생성(`llms.ts`) |
| `src/app/` | 페이지. 새 공개 페이지를 만들면 `src/lib/routes.ts`에도 넣는다(시험이 확인한다) |
| `src/components/` | 공통 화면 조각. `ServicePage.tsx`가 서비스 3종 페이지의 틀이다 |
| `tests/` | Vitest 단위 시험 |

## 5. 이 프로젝트의 Next.js는 16 버전

Next.js 16은 예전 버전과 다르다. `params`는 Promise이고, Turbopack이 기본이며, `middleware`는 `proxy`로 바뀌었다. 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 해당 문서를 읽는다.

## 6. Supabase (DB)

- 프로젝트: `exitour-inbound` (ref `imzbtkzmbkblvtdmkxnk`, 서울 리전, 무료). 기존 `exitour-platform` 프로젝트와 섞지 않는다
- 테이블 변경은 반드시 `supabase/migrations/`에 SQL 파일로 남기고 같은 내용을 적용한다. 대시보드에서 손으로만 바꾸지 않는다
- 앱은 **publishable 키만** 서버에서 쓴다(`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `.env.local`). service_role 키는 앱·저장소에 넣지 않는다
- 손님 정보가 있는 테이블은 RLS로 "넣기만" 허용한다. 공개 조회 정책을 만들지 않는다
- 여행 요청 확인: Supabase 대시보드 → Table Editor → `inquiries` (상태 칸 `status`: new → contacted → quoted → booked/closed)

## 7. 공개 전에 채울 값

`src/content/site.ts`의 null 칸: 관광사업자 등록번호, 주소, 이메일, 소셜 주소(sameAs). 그리고 환경변수 `NEXT_PUBLIC_SITE_URL`(도메인). 비어 있는 값은 화면과 구조화 데이터에 나오지 않는다. 연락처(WhatsApp, LINE, 카카오 ID)는 2026-10-25에 채웠다.
