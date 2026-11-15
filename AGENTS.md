# Entour Korea (Exitour 인바운드) — 모든 AI 공동 작업 지침

이 저장소에는 Exitour의 **외국인 방한 투어 브랜드 "Entour Korea"** 사이트와 사업 기획 문서가 있다.
Claude(데스크톱 앱, Claude Code)와 넥서스 코딩 탭(Codex, Qwen, GLM, DeepSeek 등) 누구든 이어서 작업할 수 있게 관리한다.
`CLAUDE.md`, `GEMINI.md`, `QWEN.md`는 모두 이 파일을 가리킨다.

## 1. 먼저 읽기 (순서)

1. 이 파일
2. `CHANGELOG.md` 맨 위 3개 항목
3. `MAINTAINER.md`: 지금 누가 작업 중인지 표시하는 잠금판
4. `docs/10_narrow-launch.md`: **지금 상태**(2026-11-16 "좁혀서 열기": 드라이빙 가이드 두 상품만 연다), 사장님께 받을 것과 값 넣는 곳, 배포 순서
5. `docs/08_handoff.md`: PC 처음 준비, Vercel·사진·영상 절차, 함정(2026-10-28)
6. 작업과 관련된 `docs/` 문서 (목록은 `docs/README.md`)

## 2. 절대 규칙

| 규칙 | 이유 |
|---|---|
| 비밀번호, API 키, 토큰, 손님 개인정보(여권 번호 등)를 코드·문서·커밋에 쓰지 않는다. 비밀값은 커밋되지 않는 `.env`에만 둔다 | 저장소가 유출돼도 피해가 없게 |
| **파트너 원가와 마진은 이 비공개 저장소의 `docs/`에만** 둔다. 공개 저장소(`exitour-platform`)로 옮기지 않는다 | 원가가 공개되면 협상력이 사라진다 |
| 가격은 `src/content/pricing.ts` 한 곳에서만 바꾼다. **`status: "confirmed"`인 값만 숫자로 나간다.** `draft`·`on-request` 값은 화면에 "Written quote …"로만 보이고, 숫자는 화면·구조화 데이터·`llms.txt` 어디에도 나가지 않는다(2026-11-16부터). 사장님 확인 없이 `confirmed`로 바꾸지 않는다 | 틀린 가격이 AI 답변에 퍼지면 되돌리기 어렵다 |
| 값·포함 항목·취소 규정·회사 정보·기사 이름과 사진·후기를 **지어내지 않는다.** 모르는 값은 `null`로 두면 화면에서 빠지거나 "견적서에 적는다"로 나온다 | 사실과 다른 약속은 손님과의 분쟁이 된다 |
| 숨긴 쪽(`/guide-tour`, `/join-as-guide`, 값이 덜 찬 약관 3종)을 메뉴·바닥글·사이트맵·`llms.txt`에 걸지 않는다. 다시 여는 법은 `docs/10_narrow-launch.md` 9장 | 지금 파는 것은 두 상품뿐이다 |
| 법 관련 표현(렌터카 운전자 알선, 관광통역안내사 자격, 자가용 유상운송 금지)은 `docs/05_legal-notes.md`와 다르게 쓰지 않는다 | 사실과 다른 법률 문구는 신뢰와 책임 문제가 된다 |
| 자격 없는 기사가 관광지 안을 안내하는 것처럼 쓰지 않는다. "driver is not a guide" 원칙을 지킨다 | 관광진흥법 위반 소지 |
| 가짜 후기, 숨은 문구, AI에게만 보이는 텍스트를 만들지 않는다 | 검색과 AI 노출에서 퇴출된다 |
| 고객용 문구는 영어 원문으로 쓰고, 7개 언어(중·일·스페인·인니·태국·따갈로그·베트남) 사전을 같이 채운다. 화면 문장은 `t("…")`·`msg("…")`로 감싸고 값은 `{자리 표시}`로 넣는다(`docs/11_languages.md`). 문서와 커밋 메시지는 한국어로 쓴다 | 사이트는 외국인용, 운영은 한국어. 사전이 빠지면 그 문장만 영어로 나오고 시험이 실패한다 |

## 3. 작업 순서

1. 시작할 때 `git pull`, 이어서 `git status`로 남이 커밋하지 않은 변경이 있는지 본다. `MAINTAINER.md` "작업 중"에 이름, 시각, 할 일을 적는다.
2. 고친 뒤 아래 검사를 모두 통과시킨다. Windows에서는 `npm` 대신 `npm.cmd`를 쓴다.
   ```
   npm run lint
   npm run typecheck
   npm test
   npm run build
   npm run check:pages
   ```
   `check:pages`는 빌드 결과의 모든 쪽에서 제목·설명 겹침, noindex, JSON-LD, 확정되지 않은 값 누출을 확인한다(`scripts/check-structured-data.mjs`).
3. 커밋 메시지는 한국어로 "무엇을, 왜" 한두 줄과 검사 결과를 쓴다. 그다음 `git push`.
4. `CHANGELOG.md` 맨 위에 항목을 추가한다. `MAINTAINER.md` "작업 중"을 비우고 "마지막 작업"으로 옮긴다.

## 4. 코드 지도

| 위치 | 내용 |
|---|---|
| `src/content/` | **사이트의 모든 데이터**: 회사 정보·메뉴·소유 확인 코드(`site.ts`), 서비스와 차량(`services.ts` — `listed: true`인 두 상품만 판다), **가격과 네 칸 표(`pricing.ts`)**, 10시간 하루 예시(`dayPlans.ts`), 기사 소개(`crew.ts`), 실제 사진 목록(`photos.ts` — 손님 사진은 확인 전까지 꺼 두고 `public/`에 넣지 않는다), 약관에 들어갈 값(`legal.ts`), 쪽별 제목·설명·공유 그림 문구(`pages.ts`), FAQ(`faqs.ts`), 안내 글(`articles.ts`), 숨긴 가이드 투어의 예시(`plans.ts`). 나중에 관리자 화면(CMS)이나 DB로 옮길 때 `types.ts`의 타입이 그대로 테이블이 된다 |
| `src/lib/` | 가격 계산과 표 문구(`pricing.ts`), 값 FAQ 만들기(`productFaqs.ts`), 구조화 데이터(`schema.ts`), 쪽별 메타데이터(`meta.ts`), AI 로봇 이름(`crawlers.ts`), 여행 요청 검증과 문구(`inquiry.ts`), 요청 알림(`notify.ts`), 공개·숨김 페이지 목록(`routes.ts`), `llms.txt` 생성(`llms.ts`) |
| `src/app/` | 페이지. **쪽 파일은 `src/app/[lang]/` 아래**에 있다(주소 첫 칸이 언어, 영어는 `src/proxy.ts`가 앞머리 없는 주소를 넘겨 준다). 새 공개 페이지를 만들면 `src/lib/routes.ts`와 `src/content/pages.ts`에도 넣는다(시험이 확인한다). `og/[file]/route.tsx`가 쪽별 공유 그림을 굽는다 |
| `src/i18n/` | 다국어: 언어 목록·주소 규칙(`config.ts`), 번역 함수(`translate.ts`, 서버 조각은 `server.ts`의 `getT()`), 7개 언어 사전(`messages/*.json`), 번역할 문장 목록(`source.json`, 자동 생성). `docs/11_languages.md` |
| `src/components/` | 공통 화면 조각. `ProductMatrix.tsx`가 네 칸 표, `ServicePage.tsx`가 서비스 페이지의 틀, `SiteChrome.tsx`·`MobileMenu.tsx`가 머리글·바닥글, `LegalPage.tsx`가 약관 3종의 틀이다 |
| `tests/` | Vitest 단위 시험 |
| `scripts/` | `check-structured-data.mjs`(빌드 결과 검사, `npm run check:pages`), `indexnow-submit.mjs`(배포 뒤 Bing 등에 알림), `capture-screens.mjs`(화면 캡처), `fetch-hero-assets.mjs`(메인 사진·영상 내려받기, 목록은 `hero-assets.json`) |
| `public/images`, `public/videos` | 사진·영상. `van/`(실제 차량), `places/`(실제 장소), `crew/`(기사님), 맨 위의 `hero-*.webp`(AI 풍경, 지금은 안 씀). `site.ts`의 `heroImage`·`heroVideo`와 `photos.ts`·`crew.ts`가 가리킨다(`tests/assets.test.ts`가 파일이 있는지 확인) |

## 5. 이 프로젝트의 Next.js는 16 버전

Next.js 16은 예전 버전과 다르다. `params`는 Promise이고, Turbopack이 기본이며, `middleware`는 `proxy`로 바뀌었다. 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 해당 문서를 읽는다.

## 6. Supabase (DB)

- 프로젝트: `exitour-inbound` (ref `imzbtkzmbkblvtdmkxnk`, 서울 리전, 무료). 기존 `exitour-platform` 프로젝트와 섞지 않는다
- 테이블 변경은 반드시 `supabase/migrations/`에 SQL 파일로 남기고 같은 내용을 적용한다. 대시보드에서 손으로만 바꾸지 않는다
- 요청이 저장되면 사장님께 알림을 보낸다(`src/lib/notify.ts`). 환경변수 `EXITOUR_TELEGRAM_*`·`EXITOUR_RESEND_API_KEY`+`EXITOUR_NOTIFY_EMAIL_TO`·`EXITOUR_NOTIFY_WEBHOOK_URL` 중 있는 것으로 보내고, 없으면 건너뛴다(`docs/10_narrow-launch.md` 7장)
- 앱은 **publishable 키만** 서버에서 쓴다(`EXITOUR_SUPABASE_URL`, `EXITOUR_SUPABASE_PUBLISHABLE_KEY`, `.env.local`). 이름에 `EXITOUR_`를 붙인 이유: 사장님 PC에 다른 프로젝트의 `SUPABASE_URL` 사용자 환경변수가 있고 Next.js는 그것을 `.env.local`보다 우선한다. service_role 키는 앱·저장소에 넣지 않는다
- 손님 정보가 있는 테이블은 RLS로 "넣기만" 허용한다. 공개 조회 정책을 만들지 않는다
- 여행 요청 확인: Supabase 대시보드 → Table Editor → `inquiries` (상태 칸 `status`: new → contacted → quoted → booked/closed)

## 7. 공개 전에 채울 값

전체 목록과 넣는 곳은 **`docs/10_narrow-launch.md` 3장**에 있다: 네 칸의 값과 포함 항목(`pricing.ts`), 취소 규정·결제·개인정보(`legal.ts`), 회사 정보·견적 답변 시간·소유 확인 코드(`site.ts`), 기사 소개와 자격 언어(`crew.ts`), 도메인(`NEXT_PUBLIC_SITE_URL`), 알림 환경변수. 비어 있는 값은 화면과 구조화 데이터에 나오지 않는다. 연락처(WhatsApp, LINE, 카카오 ID)는 2026-10-25에 채웠다.
