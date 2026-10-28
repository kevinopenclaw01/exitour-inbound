# 변경 기록

## 2026-10-28 — Claude (Claude Code, 클라우드) — 소개서 `docs/00_introduction.md` (사용자 "기획 배경과 만든 취지, 주요 상품을 다른 세션에 소개할 소개서 만들어줘")

- 배경(회사·시장·파트너 상담), 사업·사이트 취지(AI 검색 노출, 합법·신뢰), 브랜드, 주요 상품(서비스 3종 + 공항 픽업·샌딩 + 설계 예시), 운영 원칙, 사이트 현황, 미결정 사항(첫 상품: 넥서스 회의의 서울 도보 4시간과의 차이 포함), 이어 작업하는 법, 문서 지도
- 파트너 원가 숫자는 넣지 않음(다른 곳에 공유될 수 있어서). 코드 변경 없음

## 2026-10-28 — Claude (Claude Code, 사장님 PC, Opus 5.5) — 품질 점검·지난 결정 대조·결제·도메인 조사 (사용자 "사이트 품질 체크하고 기존 대화에 입각해서 추가할 게 있는지, 결제, 도메인")

- `docs/09_quality-payment-domain.md` 새 문서. 코드 변경 없음
- 품질: 23개 페이지 200·깨진 링크 0·JSON-LD 정상·휴대폰 홈 278KB·CLS 0. 고칠 것 10개(약관·개인정보·환불 페이지 없음, 사업자 정보 없음, og:image 없음, 휴대폰 머리글 3줄, 요청 알림·측정 없음 등)
- 대조: 10-24 회의 첫 상품(서울 도보 4시간·팀 정액·견적 전 가격 비공개)이 사이트에 없고 draft 가격이 화면에 보임. 001 문서의 네이버지도 병기·확인서 PDF·메신저 선택 미반영
- 결제: Stripe 한국 불가 확인, 1단계 PayPal 인보이스 → 2단계 국내 PG 해외카드(토스 4.5%·나이스 3.8% 비교) + OTA 병행 추천
- 도메인: entourkorea.com·entour.kr 미등록 확인(RDAP), entour.com은 등록됨. entourkorea.com 추천, KIPRIS 상표 확인은 남음

## 2026-10-28 — Claude (Claude Code, 사장님 PC) — 인수인계 G: 공항 픽업·샌딩 페이지와 안내 글 8편 (사용자 "이후 진행해줘")

- **`/airport-transfer`** 새 페이지(`src/content/airportTransfer.ts` + `src/app/airport-transfer/page.tsx`): 짧은 답, 4단계, Best for·포함·불포함, 인천 T1/T2·김포 표, 가격 요인(견적 문의), 차량, FAQ 8개. JSON-LD Service(Airport ICN·GMP areaServed, 확정가 없어 Offer 없음)·FAQPage·Breadcrumb. 메뉴·바닥글·`llms.txt`·사이트맵·Private Driver 페이지 안내 띠에 연결
- **안내 글 8편** (`src/content/articles.ts`, `docs/04` 질문 지도): 남이섬 가는 법, 인천공항→서울 교통 비교, 내 언어 가이드(12개 자격 언어), 부모님 모시고 서울, 무슬림 친화(할랄 4분류·기도실), 인천공항 근처 노을·갈매기, 한강 라면, 인천 환승 투어. 모두 "driver is not a guide"·자격 가이드 원칙 유지, 요금·시간표는 범위로 표기
- `tests/articles.test.ts` 추가: slug 중복·관련 서비스 id·짧은 답 길이·표 열 수·공항 페이지 데이터
- 문서: `docs/03` 경로 표, `docs/04` 질문 지도 상태, `docs/08` A·C·G 상태 갱신
- 검사: lint·typecheck 통과, test 38개 통과, build 통과(29개 경로). `/airport-transfer`·안내 글·`llms.txt` 화면 확인, 콘솔 오류 없음

## 2026-10-28 — Claude (Claude Code, 사장님 PC) — 인수인계 A·C 진행: Supabase 실제 저장 확인, 메인 사진 연결 (사용자 "이후 진행해줘")

- **A. Supabase 저장 확인 완료**: PC에서 API(curl)와 `/plan` 화면 두 경로로 TEST 요청을 보내 `inquiries`에 행이 생기는 것 확인(요청번호 946A3681·85C35C77). 시험 행 2개는 `status=spam`·`admin_note`로 표시해 둠
- **환경변수 이름 변경** `SUPABASE_URL`·`SUPABASE_PUBLISHABLE_KEY` → `EXITOUR_SUPABASE_URL`·`EXITOUR_SUPABASE_PUBLISHABLE_KEY`(`src/lib/supabase.ts`, AGENTS.md, handoff). 이유: 사장님 PC 사용자 환경변수에 오픈클로용 `SUPABASE_URL`(옛 프로젝트 `afwauzrvawoctomkotye`)이 남아 있고 Next.js는 PC 환경변수를 `.env.local`보다 우선해서, 첫 시험이 그 주소로 가 `ENOTFOUND`로 실패했음. PC 환경변수는 다른 프로그램이 쓸 수 있어 건드리지 않음. **Vercel에도 새 이름으로 넣어야 한다**
- **C. 사진**: `scripts/fetch-hero-assets.mjs`를 PC에서 처음 실행, 3장 모두 내려받아 `public/images/hero-road.webp`(0.56MB)·`hero-han-river.webp`·`hero-palace.webp` 저장(가로 2400px). 세 장 육안 확인: 로고·글자·왜곡 없음. 1번 단풍길을 `site.heroImage`로 연결, 출처 표시 "AI-generated scenery". 2·3번은 서비스 페이지 사진 후보로 보관
- 영상(C 후반)은 크레딧 사용이라 사장님 승인 대기. B(Vercel)·D(도메인)는 사장님 계정 로그인·구매가 필요해 대기
- 검사: lint·typecheck 통과, test 33개 통과, build 통과(20개 경로). 홈 1024px·390px 화면 확인

## 2026-10-28 — Claude (Claude Code, 클라우드) — PC에서 이어 가기 위한 인수인계 + 메인 영상 자리 (사용자 "이후 작업 로컬에서 이어갈 수 있게 진행해줘")

- **`docs/08_handoff.md`**: 지금 상태, PC 처음 준비, 남은 일 A~I(Supabase 저장 확인 → Vercel → 메인 사진·영상 → 도메인 → 검색엔진 등록 → 확정 가격 → 콘텐츠 → 회사 정보 → MVP), 함정, 연결된 자원, PC Claude Code에 붙여 넣을 첫 말
- **메인 영상 자리**: `site.heroVideo`(mp4)를 넣으면 소리 없이 반복 재생, `heroImage`는 정지 화면(움직임 줄이기 설정이면 영상 대신 사진). 임시 파일로 켜서 `<video>`가 그려지는 것 확인 후 되돌림
- **`scripts/fetch-hero-assets.mjs` + `hero-assets.json`**: 힉스필드로 만든 사진 3장(job ID·원본 주소)을 내려받아 가로 2400px WebP로 저장. 영상은 mp4 그대로, 4MB 넘으면 경고. `sharp`를 개발 의존성으로 명시
- **`tests/assets.test.ts`**: site.ts가 가리키는 사진·영상 파일이 public/에 실제로 있는지 확인
- 검사: lint·typecheck 통과, test 33개 통과, build 통과. 클라우드에서는 힉스필드 파일 서버 접속이 막혀 실제 내려받기는 시험하지 못함(PC에서 실행)

## 2026-10-25 — Claude (Claude Code) — 홈 메인 화면(히어로) 새로 만들기 (사용자 "홈페이지인데 인트로 메인 화면은 하나 만들어야 하는 거 아냐?" → "진행해줘")

- 별도 인트로 페이지 대신 홈 첫 화면을 크게 바꿈(클릭이 늘지 않고, AI·검색엔진이 첫 페이지 글을 그대로 읽게)
- `src/components/Hero.tsx`: 진한 녹색 배경, 제목, 서비스 3종 바로가기, Plan my trip·See prices 버튼, 신뢰 띠(등록 여행사·자격 가이드·렌터카 등록 차량·쇼핑 강요 없음·WhatsApp 응답)
- 사진이 없는 지금은 **한국 고속도로 안내표지 모양 그림**(서울 중심, 남이섬·인천공항·수원 방향, 갈색 관광지 표지에 경복궁·북촌·한강). 한글은 크게, 영어는 작게(실제 표지 방식)
- **사진 자리**: `src/content/site.ts`의 `heroImage`에 사진을 넣으면 그림 대신 배경 사진이 된다(직접 찍은 사진이나 사용 조건을 확인한 사진만)
- 검사: lint·typecheck 통과, test 31개 통과, build 통과. 1440px·390px 화면 확인(가로 넘침·콘솔 오류 없음)

## 2026-10-25 — Claude (Claude Code) — 여행 요청 날짜 선택기를 영어로 고정 (사용자 "날짜 나오는 거 한글로 나와, 수정해줘")

- 브라우저 기본 날짜 입력은 손님 컴퓨터 언어(한국어 등)로 보여서, 영어 달력(`src/components/DatePicker.tsx`)을 직접 만듦. 오늘(한국 시간) 이전 날짜는 고를 수 없고, 선택한 날짜는 "Saturday, 5 December 2026"처럼 표시
- 날짜 계산을 `src/lib/dates.ts`로 모아 폼과 `/api/inquiry`가 같은 "오늘" 기준을 씀
- 검사: lint·typecheck 통과, test 31개 통과(날짜 4개 추가), build 통과. 한국어 브라우저에서 데스크톱·휴대폰 폭으로 달력 표시·날짜 선택 확인

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
