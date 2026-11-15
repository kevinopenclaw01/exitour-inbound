# 좁혀서 열기 (2026-11-16)

작성: Claude (Claude Code, 사장님 PC, Fable 5.2). 사장님 결정 "새 사이트를 만들지 않고 Entour Korea를 좁혀서 연다"를 실행한 기록이자, **배포 직전에 남은 일과 값 넣는 법**을 적은 문서다.
이 문서 하나로 「사장님 답을 받은 뒤 → 값을 넣고 → 배포」까지 갈 수 있게 썼다.

## 1. 무엇을 정했나 (사장님, 2026-11-15~16)

- 첫 상품은 **드라이빙 가이드 두 가지**: 차량+기사만(Driver only), 차량+자격 가이드 겸 기사(Driver-guide)
- **하루 10시간, 스타리아 한 대, 최대 7인 탑승, 팀당 값**
- **서울 시내와 경기권은 정해진 상품**, 그 밖의 지역은 상담
- 서울 상품은 **기름·통행료·주차 포함, 밤 종료 시간 제한 없음**
- 손님은 가족 단위 외국인, 영어권 동남아(특히 필리핀)를 먼저 본다
- 이 사이트가 앞으로 「외국인 한국여행 사이트」의 본체다. 다른 상품(프렌드십 투어 등)은 쪽을 더하는 방식으로 붙인다(주소를 옮기지 않는다)

## 2. 지금 사이트 모습

| 구분 | 경로 | 상태 |
|---|---|---|
| 메뉴(머리글·바닥글) | `/private-driver`, `/driver-guide`, `/prices`, `/plan`, `/faq`, `/about`, `/contact` | 공개 |
| 메뉴에 없지만 공개(본문 링크·사이트맵) | `/day-plans`(10시간 예시 4개, 새로 만듦), `/airport-transfer`, `/safety`, `/travel-guide`와 글 10편 | 공개 |
| 코드만 두고 숨김 | `/guide-tour`, `/join-as-guide` | noindex, 메뉴·사이트맵·`llms.txt`에 없음 |
| 틀만 있고 값 대기 | `/terms`, `/privacy`, `/cancellation-policy` | noindex, 메뉴·사이트맵에 없음. 주소를 치면 "Draft" 표시와 빈칸이 보인다 |
| 로봇용 | `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/og/<쪽>.png`(공유 그림 27장), `/icon.svg`, IndexNow 키 파일 | 자동 생성 |

**네 칸 표**(홈·`/prices`·두 상품 쪽이 같은 자료에서 그린다): 세로 Driver only / Driver-guide, 가로 Seoul / Gyeonggi. 칸마다 10시간·스타리아·최대 7인·값·포함 항목.
자료는 `src/content/pricing.ts`의 `dayRates` 한 곳이다.

## 3. 사장님께 받을 것 → 어디에 넣나

값을 받으면 아래 파일의 그 칸만 고치면 된다. 화면·`llms.txt`·구조화 데이터·FAQ가 같이 바뀐다.

| # | 받을 것 | 넣는 곳 | 넣기 전 화면 | 넣은 뒤 |
|---|---|---|---|---|
| 1 | 네 칸의 값(원) | `src/content/pricing.ts` `dayRates`의 `priceKrw` + `status: "confirmed"` | "Written quote for your date" | 값이 숫자로 나오고 `Offer`(구조화 데이터)·`llms.txt`에도 나간다 |
| 2 | 경기 상품의 기름·통행료·주차 포함 여부 | 같은 파일 `gyeonggiItems`의 `fuel`·`tolls`·`parking` (`true`/`false`) | "Stated in your written quote" | Included / Not included로 옮겨 간다 |
| 3 | 기사 식사, 입장료 포함 여부(서울·경기) | 같은 파일 `seoulItems`·`gyeonggiItems`의 `crew-meal`·`entrance-tickets` | 위와 같음 | 위와 같음 |
| 4 | 10시간을 넘길 때 시간당 값 | `dayRates`의 `extraHourKrw` | "Extra hours beyond 10"이 견적서 항목으로 | "Extra hours: ₩… per hour" |
| 5 | 경기 상품의 밤 종료 시간 제한 | `dayRates`의 `noLateFinishLimit` | 표시 없음 | `true`면 "No limit on how late the day can finish." |
| 6 | 견적 답변 약속 시간(예: 24시간) | `src/content/site.ts` `quoteReplyWithin` | "Written quote for your date" | "Written quote within 24 hours" |
| 7 | 취소 규정(시점별 환불, 노쇼, 날짜 변경, 우리 쪽 취소, 환불 방법) | `src/content/legal.ts` `cancellation` | `/cancellation-policy`가 Draft | 다 채우면 바닥글·사이트맵에 걸린다 |
| 8 | 결제 방법, 선금 | `src/content/legal.ts` `payment` | `/terms`가 Draft | 약관에 들어간다 |
| 9 | 회사 정보: 대표자, 사업자등록번호, 관광사업자 등록번호, 통신판매업 신고번호, 주소, 이메일 | `src/content/site.ts` `representative`·`businessNumber`·`operatorLicense.number`·`mailOrderNumber`·`address`·`email` | 바닥글·약관에 안 나옴 | 바닥글·약관·개인정보처리방침·구조화 데이터에 나온다 |
| 10 | 개인정보 보호책임자·연락처, 보관 기간, 여권 정보 처리 방식 | `src/content/legal.ts` `privacy` | `/privacy`가 Draft | 다 채우면 폼 아래 "Privacy policy" 링크가 생긴다 |
| 11 | 보험 보장 범위·책임 한도 문구, 관할 법원, 시행일 | `src/content/legal.ts` `liability`·`court`·`effectiveDate` | `/terms`가 Draft | 약관 공개 |
| 12 | 기사(가이드) 이름·얼굴 사진·자격·말할 수 있는 언어·소개 | `src/content/crew.ts` `crew` 배열 + 사진은 `public/images/crew/` | "Meet your driver-guide" 구역이 아예 없음 | 홈과 `/driver-guide`에 구역이 생긴다 |
| 13 | 자격증에 적힌 언어(영어인지), 따갈로그 문구를 켤지 | `src/content/crew.ts` `crewLanguageClaim.enabled` (+ `site.ts` `guideLanguages`) | 사이트 어디에도 따갈로그 없음 | 문구가 `/driver-guide`에 나온다 |
| 14 | 도메인 | Vercel 환경변수 `NEXT_PUBLIC_SITE_URL` | 주소가 localhost / Vercel 임시 주소 | canonical·사이트맵·공유 그림 주소가 도메인으로 |
| 15 | 검색엔진 소유 확인 코드(구글·Bing·네이버) | `src/content/site.ts` `verification` | `<head>`에 없음 | 확인용 `<meta>`가 들어간다 |
| 16 | 알림 받을 곳(텔레그램·이메일·웹훅 중) | 환경변수(7장) | 알림 없음 | 요청이 오면 바로 알림 |

### 값 확정하는 예 (1번)

```ts
// src/content/pricing.ts
{
  service: "driver-guide",
  region: "seoul",
  priceKrw: 000000,        // 사장님이 확정한 값
  status: "confirmed",     // 이 줄을 바꿔야 숫자가 나간다. 사장님 확인 없이 바꾸지 않는다
  ...
}
```

`status`가 `"draft"`나 `"on-request"`인 칸의 숫자는 화면·`llms.txt`·구조화 데이터 어디에도 나가지 않는다(`tests/pricing.test.ts`, `tests/schema.test.ts`, `scripts/check-structured-data.mjs`가 확인).
지금 `driver-guide`의 480,000·540,000은 2026-10-24 초안이고, 10시간·통행료·주차 포함 조건이 정해지기 전 값이라 다시 정해야 한다.

### 기사 소개 넣는 예 (12번)

`src/content/crew.ts` 맨 위 주석에 모양이 있다. 실제 이름·실제 사진(본인 동의)·자격증 사본으로 확인한 자격만 넣는다. 넣은 뒤 `tests/products.test.ts`의 "stays hidden until real crew details are added" 기대값을 인원 수에 맞게 고친다.

## 4. 이번에 채운 것 (`docs/09` 고칠 것 목록)

| `docs/09` 번호 | 내용 | 처리 |
|---|---|---|
| Q1 | 약관·개인정보·환불 쪽 없음 | 틀을 만들었다. 값이 채워지기 전에는 숨김 |
| Q2 | 바닥글 사업자 정보 | 칸을 만들었다(`site.ts`). 값이 들어오면 바닥글에 나온다 |
| Q3 | 공유 그림 없음 | 쪽마다 한 장(`/og/<쪽>.png`), 빌드 때 자동 생성. 흰 바탕에 글자만 |
| Q4 | 휴대폰 머리글 3줄 | 한 줄(브랜드 + Plan my trip + 접는 메뉴) |
| Q5 | 요청 알림 없음 | `src/lib/notify.ts`. 환경변수만 넣으면 켜진다(7장) |
| Q7 | 아이콘 없음 | `src/app/icon.svg` |
| Q8 | 설명이 긴 쪽 | 쪽마다 160자 이하의 설명을 따로 둠(`src/content/pages.ts`) |
| Q9 | 없는 주소의 제목 | "Page not found", noindex |
| Q6 | 방문 측정 | **안 함.** Vercel 계정이 생긴 뒤 Vercel Web Analytics를 켜는 것이 가장 간단하다(쿠키 없음). 켜면 `/privacy` 6번 항목을 고친다 |
| Q10 | 스팸 방지 | **안 함.** 공개 뒤 상황을 보고 Cloudflare Turnstile |

## 5. 검색·AI 노출 (EXITour 한국어 사이트와 같은 수준)

- `robots.txt`: AI 로봇 21개 이름을 공식 문서 기준으로(`src/lib/crawlers.ts`), `/api/`만 막음. 숨긴 쪽은 막지 않는다(막으면 noindex를 못 읽는다)
- 쪽마다 다른 제목·설명·canonical·공유 그림: `src/content/pages.ts` + `src/lib/meta.ts`
- 사이트맵 수정일: 본문이 실제로 바뀐 날(`site.contentUpdated`, 서비스·글의 `updated`)
- 구조화 데이터: TravelAgency·WebSite·Service·FAQPage·BreadcrumbList·Article·ItemList. **값이 확정되지 않은 칸에는 `Offer`가 없다**
- 검사: `npm.cmd run build` 다음 `npm.cmd run check:pages` — 빌드된 모든 쪽의 제목·설명 겹침, noindex, JSON-LD 필수 칸, 초안 값 누출을 확인한다(CI에도 넣었다)
- 검색엔진 소유 확인 코드 자리: `site.ts` `verification`
- IndexNow: 키 파일 `public/d86cd2d173b8ff0af48d36281f63a254.txt`(비밀 아님, 지우면 제출이 멈춘다) + `scripts/indexnow-submit.mjs`
- 온라인 검증기(구글 리치 결과 테스트, validator.schema.org)는 공개 주소가 필요해서 **배포 뒤에** 돌린다

## 6. 배포 순서 (사장님 승인 뒤)

1. 3장의 값을 넣고 검사 통과 → `git push`
2. Vercel: `docs/08_handoff.md` B(프로젝트 Import, 환경변수 `EXITOUR_SUPABASE_URL`·`EXITOUR_SUPABASE_PUBLISHABLE_KEY` + 7장의 알림 변수)
3. 도메인 구매·연결 → Vercel 환경변수 `NEXT_PUBLIC_SITE_URL=https://도메인` → 다시 배포
4. `/plan`에서 TEST 요청 1건 → Supabase `inquiries`에 행, 알림 도착 확인 → 시험 행은 `status=spam`
5. 구글 서치 콘솔·Bing 웹마스터(·네이버 서치어드바이저) 등록 → 확인 코드를 `site.ts` `verification`에 넣고 배포 → 사이트맵 제출
6. `node scripts/indexnow-submit.mjs https://도메인` (운영 배포 뒤마다 한 번)
7. 구글 리치 결과 테스트로 홈·상품 쪽 확인

## 7. 문의 알림 켜는 법

`.env.local`(PC)과 Vercel 환경변수에 같은 이름으로 넣는다. 셋 중 하나만 있어도 켜지고, 여러 개면 모두 보낸다. 아무것도 없으면 조용히 건너뛴다.

| 통로 | 환경변수 | 준비 |
|---|---|---|
| 텔레그램 | `EXITOUR_TELEGRAM_BOT_TOKEN`, `EXITOUR_TELEGRAM_CHAT_ID` | 텔레그램에서 @BotFather로 봇을 만들어 토큰을 받고, 그 봇에게 아무 말이나 보낸 뒤 chat id를 확인 |
| 이메일(Resend) | `EXITOUR_RESEND_API_KEY`, `EXITOUR_NOTIFY_EMAIL_TO` (+ `EXITOUR_NOTIFY_EMAIL_FROM`) | resend.com 가입 → API 키. 도메인 인증 전에는 가입한 본인 주소로만 보낼 수 있다(알림용으로는 충분) |
| 웹훅 | `EXITOUR_NOTIFY_WEBHOOK_URL` | Slack·Discord·n8n·Make 등의 수신 주소 |

- 알림에는 손님 이름·연락처가 들어간다. 사장님만 보는 곳으로 보낸다
- 저장(Supabase)에 실패했을 때도 알림은 간다("저장 실패, 이 알림이 유일한 기록")
- 토큰·키는 `.env.local`과 Vercel에만 둔다. 저장소에 쓰지 않는다
- **`.env.example`에는 이 이름들을 적지 못했다**(이 PC의 Claude 권한 설정이 `.env*` 파일 읽기·쓰기를 막아 둠). 필요하면 사람이 위 표의 이름을 `.env.example`에 덧붙인다

## 8. 검사와 화면 캡처

```
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run check:pages
```

화면 캡처(설치된 Edge를 창 없이 띄워 찍는다):

```
npm.cmd run start -- -p 3210
node scripts/capture-screens.mjs http://localhost:3210 "C:\저장할\폴더"
```

홈·두 상품·Prices·Plan을 1440px과 390px으로 찍는다. 뒤에 쪽 이름을 적으면 그 쪽만 찍는다(`home prices day-plans`).

## 9. 숨긴 쪽을 다시 여는 법

`/guide-tour`: `src/content/services.ts`에서 `listed: true` → `src/content/pages.ts`에서 `index: false` 지움 → `src/content/site.ts` `nav`에 추가 → `src/lib/inquiry.ts` `serviceOptions`에 한 줄 → `tests/routes.test.ts`·`tests/products.test.ts`의 기대값 수정.
`/join-as-guide`: `pages.ts`의 `index: false` 지움 → `src/lib/routes.ts`의 `publicRoutes`에 추가, `hiddenRoutes`에서 뺌.

## 10. 손대지 않았거나 사장님이 봐야 하는 것

- **공항 픽업 쪽(`/airport-transfer`)과 안내 글 10편은 그대로 두었다.** 여기에는 "스타리아 9·11인승, 솔라티 미니버스"가 적혀 있다(일반 시장 안내와 공항 상품 설명). 스타리아 한 대만 운영한다면 공항 쪽 차량 문구를 고칠지 정해야 한다
- **`/safety`와 FAQ에 "가이드 자격증 사본을 보관한다"고 적혀 있다.** 공개 전에 실제로 사본을 받아 둔다(13번과 같이)
- **남이섬**: 선착장은 경기 가평, 섬은 강원 춘천이다. 예시(`/day-plans`)에는 경기 일정으로 넣었다. 경기 상품 값에 남이섬이 들어가는지 확인 필요
- 예약 절차 문구에서 "선금을 내면 확정" 문장을 뺐다(선금·결제 방법이 아직 정해지지 않아서). 8번을 받으면 약관에 들어간다
- 홈 사진(`public/images/hero-road.webp`)은 AI로 만든 풍경이다. 오른쪽 멀리 차가 한 대 있어서 홈에서는 왼쪽(호수·나무)만 보이게 잘라 쓰고, 설명글에서 지명("가평")을 뺐다. 실제 차량·기사 사진이 생기면 바꾼다
- Next.js를 16.2.4 → **16.4.6**으로 올렸다(`npm audit` 치명 1·높음 2건, 그중 하나가 이번에 쓰기 시작한 공유 그림 생성 기능의 취약점). 올린 뒤 `npm audit --omit=dev` 0건. 개발용 `sharp` 0.34.5(사진 내려받기 스크립트에서만 씀)는 그대로
- 방문 측정(Q6), 스팸 방지(Q10), 결제, 상표(KIPRIS) 확인은 하지 않았다
