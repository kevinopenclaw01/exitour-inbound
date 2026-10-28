# 로컬 인수인계 (2026-10-28)

클라우드 세션(Claude Code on the web)에서 하던 작업을 **사장님 PC의 Claude Code·Claude 데스크톱 앱·넥서스 코딩 탭**에서 이어 가기 위한 문서다.
처음 이어받는 AI는 `AGENTS.md` → `CHANGELOG.md` 맨 위 → `MAINTAINER.md` → 이 문서 순서로 읽는다.

## 1. 지금 상태 (2026-10-28)

| 영역 | 상태 |
|---|---|
| 사이트 v0 | 완료. 서비스 3종, 가격, 합법·안전, 여행 요청 폼(영어 달력), FAQ, 연락처, 회사 소개, 가이드 모집, 질문형 글 2편, 홈 첫 화면(도로 안내표지 그림) |
| AI 노출 장치 | 완료. Short answer 상자, JSON-LD 자동 생성, AI 크롤러 허용 robots.txt, sitemap.xml, llms.txt 자동 생성 |
| 연락처 | 완료. WhatsApp·LINE `+82 10-9988-8846`, 카카오톡 ID `exitouroffice` |
| Supabase | 프로젝트 `exitour-inbound`(ref `imzbtkzmbkblvtdmkxnk`) + `inquiries` 테이블·RLS 적용. **2026-10-28 PC에서 실제 저장 확인 완료**(API·화면 두 경로, 시험 행은 spam 표시). 앱 변수 이름은 `EXITOUR_SUPABASE_*` |
| GitHub | 비공개 `kevinopenclaw01/exitour-inbound`, CI(lint·typecheck·test·build) 통과 |
| 메인 사진·영상 | 사진 3장 `public/images/`에 저장, 1번 단풍길을 `site.heroImage`로 연결(2026-10-28). 영상은 아직(크레딧 승인 대기) |
| 배포 | 아직. Vercel 연결 전 |
| 도메인 | 아직. 추천 `entourkorea.com` (구매 가능 여부 미확인) |

## 2. PC 처음 준비 (한 번만)

1. Node.js 22 LTS, Git 설치
2. 받기
   ```
   cd C:\AI
   git clone https://github.com/kevinopenclaw01/exitour-inbound
   cd exitour-inbound
   npm.cmd install
   ```
3. `.env.local` 만들기(커밋되지 않는 파일). 키는 Supabase 대시보드 → exitour-inbound → Project Settings → API Keys의 **publishable 키**(`sb_publishable_...`)를 복사한다. service_role 키는 쓰지 않는다.
   ```
   EXITOUR_SUPABASE_URL=https://imzbtkzmbkblvtdmkxnk.supabase.co
   EXITOUR_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
4. `npm.cmd run dev` → **그 PC의 브라우저에서** http://localhost:3000

넥서스 코딩 탭은 작업 폴더를 `C:\AI\exitour-inbound`로 고른다(넥서스 허브 폴더 `C:\AI\llm-hub`와 섞지 않는다).

## 3. 남은 일 (순서대로)

### A. Supabase 실제 저장 확인 — **완료 2026-10-28 (PC Claude)**
1. `npm.cmd run dev` 후 http://localhost:3000/plan 에서 시험 요청 1건(이름에 `TEST` 표시)
2. 화면에 "We received your request (요청번호)"가 나오면 성공
3. Supabase 대시보드 → Table Editor → `inquiries`에 행이 있는지 확인 → 시험 행은 지우거나 `status`를 `spam`으로
4. 실패하면 브라우저 화면의 오류와 `npm.cmd run dev` 창의 로그를 확인. 흔한 원인: `.env.local` 키 오타, 서버 재시작 안 함(환경변수는 재시작해야 반영)

### B. Vercel 배포
1. https://vercel.com → Continue with GitHub(kevinopenclaw01) → Add New → Project → `exitour-inbound` Import
2. Environment Variables: `EXITOUR_SUPABASE_URL`, `EXITOUR_SUPABASE_PUBLISHABLE_KEY` (도메인 연결 전에는 `NEXT_PUBLIC_SITE_URL`을 넣지 않는다 — 비워 두면 Vercel 운영 주소를 자동으로 쓴다)
3. Deploy → 나온 주소에서 A의 저장 시험을 한 번 더
4. 이후 `main`에 push하면 자동 배포된다

### C. 메인 사진·영상 — 사진 완료 2026-10-28, 영상은 승인 대기
**사진** (힉스필드 2026-10-27 생성, 목록과 원본 주소는 `scripts/hero-assets.json`)
```
node scripts/fetch-hero-assets.mjs hero-road
```
→ `public/images/hero-road.webp`(가로 2400px)가 생긴다. 사장님이 사진을 보고 **현대 로고·글자·왜곡이 없는지** 확인한 뒤 `src/content/site.ts`:
```ts
heroImage: { src: "/images/hero-road.webp", alt: "Autumn ginkgo and maple road in Gapyeong, Korea" } as ...,
```
2번(한강 `hero-han-river`), 3번(경복궁 `hero-palace`)은 서비스 페이지 상단 사진 후보.

**영상** (아직 만들지 않음. 사장님 승인 후 생성)
- 힉스필드 모델 `kling3_0`, mode `pro`, 16:9, 8초, sound `off`, 예상 12 크레딧
- 시작 화면·끝 화면 모두 1번 사진(job `488a6185-fa02-4b1d-a3a6-a72e9920f070`) → 끊김 없이 반복
- 프롬프트: `Slow, steady cinematic dolly forward along the autumn country road lined with golden ginkgo and red maple trees, the dark van drives slowly away into the distance, leaves gently falling, soft late afternoon light, calm and smooth camera, no text, no logos`
- 힉스필드가 "IN THE DARK" 프리셋을 추천하면 거절하고 그대로 생성(`declined_preset_id`)
- 완성되면 `scripts/hero-assets.json`에 `{"name": "hero-road-video", "type": "video", "url": "..."}` 추가 → `node scripts/fetch-hero-assets.mjs hero-road-video`
- 4MB가 넘으면 압축(ffmpeg):
  ```
  ffmpeg -i public\videos\hero-road-video.mp4 -vf scale=1920:-2 -c:v libx264 -crf 26 -preset slow -an -movflags +faststart public\videos\hero.mp4
  ```
- `site.ts`에 `heroVideo: "/videos/hero.mp4"` (heroImage도 같이 — 영상이 뜨기 전·움직임 줄이기 설정용 정지 화면)
- `tests/assets.test.ts`가 파일이 실제로 있는지 확인한다

원칙(`docs/decisions.md` 2026-10-25 5번): AI 이미지는 풍경·분위기만. 우리 차량·가이드·손님처럼 보이게 쓰지 않는다. Qwen Image 2.1은 비상업 라이선스라 이 사이트에 쓰지 않는다.

### D. 도메인
1. `entourkorea.com` 구매(Cloudflare Registrar 또는 국내 업체). 없으면 `entour-korea.com`, `entourkorea.co`
2. Vercel → Project → Settings → Domains에 연결
3. Vercel 환경변수 `NEXT_PUBLIC_SITE_URL=https://entourkorea.com` 추가 → 다시 배포
4. 이메일 주소를 만들면 `site.ts`의 `email`에 넣는다

### E. 검색엔진·AI 등록 (도메인 연결 후)
- Google Search Console: 도메인 소유 확인 → `https://도메인/sitemap.xml` 제출
- Bing Webmaster Tools: 같은 방식(ChatGPT·Copilot 검색이 Bing 색인을 쓴다)
- 다음 개발 거리: IndexNow(새 페이지를 Bing 등에 바로 알림)

### F. 확정 가격 (사장님 확인 필수)
- 파트너 질문지(`docs/06_partner-call-2026-10-24.md` 끝)로 원가를 받은 뒤 `src/content/pricing.ts`의 값을 고치고, **사장님이 승인한 것만** `status: "confirmed"`로 바꾼다
- confirmed가 되면 구조화 데이터·llms.txt에 가격이 자동으로 나간다

### G. 콘텐츠 — **완료 2026-10-28 (PC Claude)**
- 공항 픽업·샌딩 전용 페이지(`/airport-transfer`) 추가: 내용은 `src/content/airportTransfer.ts`. 요금은 파트너 원가(질문지 5번)가 오면 `pricing.ts`에 넣고 페이지 "Price" 절을 표로 바꾼다
- 질문형 안내 글 8편 추가(`src/content/articles.ts`, 2026-10-28 표시). 남은 후보: 5일 겨울 일정, 에버랜드, 언어별 개별 페이지(`docs/04` 질문 지도)
- 글의 사실(시간표·요금·기도실·시설)은 2026-10 기준 일반 정보이며, 변하는 값은 "about", "check the current"로 써 두었다. 공개 전 사장님·가이드가 한 번 읽고 틀린 곳을 고친다
- 새 공개 페이지는 `src/lib/routes.ts`에도 추가(시험이 확인)

### H. 회사 정보 (사장님 정보 필요)
`src/content/site.ts`: 관광사업자 등록번호, 주소, 이메일, LINE ID(지금은 전화번호로 표시), 소셜 주소(`sameAs` — 유튜브·인스타·틱톡·트립어드바이저·구글 비즈니스 프로필)

### I. MVP (2026년 12월 목표, `docs/02_roadmap.md`)
관리자 화면(상품·가격·글 입력), 새 여행 요청 알림(이메일·메신저), 견적 계산기, 결제

## 4. 함정

| 함정 | 대처 |
|---|---|
| `tsc`만 돌리면 깨끗한 체크아웃에서 `PageProps` 오류 | `npm run typecheck`(= `next typegen && tsc --noEmit`)를 쓴다 |
| Next.js 16은 예전과 다름 | `node_modules/next/dist/docs/` 확인. `params`는 Promise |
| Windows에서 `npm` 대신 | `npm.cmd` |
| 환경변수 바꾼 뒤 반영 안 됨 | `npm.cmd run dev` 재시작, Vercel은 재배포 |
| 저장이 엉뚱한 Supabase 프로젝트(`afwauzrvawoctomkotye`)로 가서 `ENOTFOUND` | 사장님 PC 사용자 환경변수에 오픈클로용 `SUPABASE_URL`·`SUPABASE_SERVICE_ROLE_KEY`가 남아 있고 Next.js는 PC 환경변수를 `.env.local`보다 우선한다. 그래서 이 앱은 `EXITOUR_SUPABASE_*` 이름을 쓴다(2026-10-28). PC 환경변수는 주식 프로그램 등이 쓸 수 있으니 지우지 않는다 |
| `localhost` 링크가 안 열림 | 그 PC에서 `npm.cmd run dev`를 켜야 열린다. 휴대폰에서는 안 열린다 |
| draft 가격 | 화면에만 "draft rate". 구조화 데이터·llms.txt에는 안 나간다. 마음대로 confirmed로 바꾸지 않는다 |
| 원가·마진 | 이 비공개 저장소 `docs/`에만. 공개 저장소 `exitour-platform`에 옮기지 않는다 |
| 힉스필드 크레딧 | 생성 전 `get_cost`로 비용 확인, 사장님 승인 후 생성 |
| 넥서스 | 이 사이트를 `C:\AI\llm-hub`(넥서스) 저장소에 넣지 않는다 |

## 5. 연결된 자원

| 자원 | 위치 |
|---|---|
| 코드 | https://github.com/kevinopenclaw01/exitour-inbound (비공개) |
| DB | Supabase 조직 "openclaw desktop" → 프로젝트 `exitour-inbound` (ref `imzbtkzmbkblvtdmkxnk`, 서울, 무료. 무료 요금제 활성 프로젝트 2자리 모두 사용 중) |
| 로드맵(공유용 페이지) | https://claude.ai/artifact/DvzJABtpJvmsVqBhc2VWwC |
| 힉스필드 생성물 | 사진 job ID는 `scripts/hero-assets.json` |
| 기존 한국인 해외여행 사이트 | `kevinopenclaw01/exitour-platform` (공개 저장소, 별도 Supabase 프로젝트) |

## 6. PC의 Claude Code에 처음 붙여 넣을 말

```
C:\AI\exitour-inbound 저장소를 이어서 작업해.
AGENTS.md → CHANGELOG.md 맨 위 → MAINTAINER.md → docs/08_handoff.md 순서로 읽고,
handoff의 "3. 남은 일"을 A부터 순서대로 진행해. 각 단계에서 내 확인이 필요한 것(가격 확정, 크레딧 사용, 도메인 구매)은 먼저 물어봐.
```
