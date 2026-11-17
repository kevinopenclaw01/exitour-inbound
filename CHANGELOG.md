# 변경 기록

## 2026-11-17 밤 — Claude (Claude Code, 사장님 PC, Opus 5.5) — PG(페이팔) 심사 준비 (사장님 "entour는 페이팔만 신청할가?" → 손님별로 나눔: EXITour=KG이니시스, Entour=페이팔 → "고쳐줘")

- 사무실 유선번호 `site.officePhone` = +82 2-841-8422(EXITour와 같은 사무실). 바닥글 회사 정보 줄(「Office phone …」)과 약관 3종 운영자 정보(「Office phone」)에 나온다. 포트원 PG 심사는 바닥글에 유선번호가 있어야 한다(휴대폰 불가). 연락 번호(WhatsApp +82 10-9988-8846)는 그대로
- 개인정보처리방침 4. Who receives it: 「The payment provider …」 한 줄을 결제대행사 이름으로 바꿈 — `legal.privacy.paymentProviders`(PortOne(한국), PayPal). 추출기(`src/i18n/extract.ts`)에도 넣음
- 결제 방법 `legal.payment.methods`: 카드 또는 PayPal, PayPal 결제 링크, 가격은 원화로 안내하지만 **PayPal은 원화를 받지 않아 USD로 청구**되고 결제 전에 USD 금액이 보인다
- 새 문장 5개 × 8개 언어 사전
- 검사: lint·typecheck 통과, test 136 통과, build, check:pages 236쪽 문제 없음
- **남은 것**: 포트원 콘솔에서 페이팔 신청(사장님) → 신청 때 서비스 주소 entour.kr를 알릴 것(같은 사업자의 두 번째 사이트) → 채널 키를 받으면 `/book`에 결제창 연동. 이지페이(알리페이·동남아 결제 앱)를 하면 `paymentProviders`에 KICC 추가

## 2026-11-17 — Claude (Claude Code, 사장님 PC, Opus 5.5) — 약관 3종 값 채우기·공개, 9개 언어 번역 (사장님 "같은 기준으로 entour 미비된 거 보완해줘, entour는 단품 기준으로, 각 나라말로 번역 다 해주고")

- 회사 정보(`site.ts`): 대표 Kang Sangwook, 사업자등록번호 479-66-00070, 관광사업 등록 2018-000019(서초구청, 등록증 상호는 옛 이름 케빈투어), 통신판매업 2015-Seoul Seocho-1804, 주소 서초구 반포대로23길 13 5층, 메일 exitour0ffice@gmail.com(사장님 지정). 출처는 스마트스토어센터 판매자 정보와 관광사업등록증
- 취소·환불(`legal.ts`, 사장님 「단품 기준」 = 엑시투어 일반 단품과 같음): 이용일 7일 전 한국 시간 17시까지 전액, 3일 전 17시까지 70%(30% 공제), 2일 전 17시까지 50%, 그 뒤 환불 없음. 노쇼 환불 없음, 날짜 변경은 7일 전 17시까지 무료(그 뒤는 취소로 봄), 우리 쪽·천재지변은 다른 날짜 또는 전액 환불, 환불은 결제 수단으로 3영업일 안에 시작
- 결제: 결제 링크로 카드, 원화, 선금 없이 전액. 개인정보: 책임자 대표, 보관 12개월/5년/3년, 호스팅 Vercel(서울 리전), 여권 정보는 예약 뒤 받아 렌터카 회사에만 보내고 30일 안에 삭제, 카톡 알림·결제대행사 받는 곳 추가. 관할 서울중앙지방법원, 시행일 2026-11-17, 책임 문구(렌터카 보험, 법이 정한 책임)
- 약관 3종을 9개 언어로: `englishOnlyPages`에서 빼고 쪽 문장을 `t()`로, 새 문장 108개 × 8개 언어 사전. 번역판 맨 위에 「영어판과 다르면 영어판」 한 줄. 바닥글 링크도 그 언어 주소로. 따갈로그 쪽 제목이 영어와 같아 `Mga tuntunin ng serbisyo`·`Patakaran sa privacy`로
- 시험·검사 고침: 구조화 데이터 시험(회사 이메일·주소가 생김), routes 시험(약관이 번역판), `check:pages`의 숨긴 쪽 목록에서 약관 뺌
- 검사: lint·typecheck 통과, test 136 통과, build 288쪽, check:pages 236쪽 문제 없음
- **남은 것**: 변호사 검토(특히 책임 문구·여권 정보 30일 약속), 결제대행사가 정해지면 개인정보처리방침에 이름, 원어민 검수

## 2026-11-16 — Claude (Claude Code, 사장님 PC, Opus 5.5) — 공항 픽업 확정가, 기사·가이드 문구, 팁, 손님 사진(얼굴 가림), 기사 피켓 그림

- 공항 픽업·샌딩(편도, 차 한 대): 인천 ↔ 서울 ₩110,000, 김포 ↔ 서울 ₩90,000, 5인까지(7인이면 캐리어 자리가 없음). `pricing.ts`의 `airportRates`(confirmed) → `/airport-transfer` 값 칸·Offer·llms.txt. 손님 이름·호텔 피켓, 간단한 티켓·유심·환전 안내, 새벽·밤 비행기와 짐 보관 추가 요금 없음. 차 고르기 칸(스타리아 9·11·솔라티)은 「Your van」 한 줄로 바꿈
- 기사: 영어 가능, 따갈로그는 요청 시(사장님 확정). 「Driver only」 설명·FAQ·공항 쪽에 반영
- 기사 겸 가이드: 사장님 지시로 「가이드가 운전한다」는 표현을 빼고 「your language의 자격 가이드」로 씀(services·pricing 설명·홈·Hero·FAQ·llms 등)
- 팁: 기사 겸 가이드만 1인·하루 US$5 별도(`guideTipUsdPerPersonPerDay`). 기사만·공항 픽업은 팁 없음. 짐은 차에 두어도 추가 요금 없음
- 손님 사진: 얼굴 보이는 사진 6장을 얼굴(지나가는 사람 포함) 모자이크+흐림으로 가려 뒷모습 6장과 함께 홈 「Days out with our guests」에 켬. 후기 글은 지어내지 않음
- 공항 쪽 그림: 실제 기사님 사진을 바탕으로 Codex(GPT 이미지)가 그린 피켓 든 모습. 화면에 「Illustration」이라고 밝힘

## 2026-11-16 — Claude (Claude Code, 사장님 PC, Opus 5.5) — 판매가 확정, 구매 화면(/book) (사장님 "판매가는 넷가 +8만 원, 달러는 자동으로 맞춰서. 판매가와 구매하는 거 만들어 줘")

- 네 칸 판매가 확정(`src/content/pricing.ts`): 기사만 서울 ₩327,700·경기 ₩385,600, 기사 겸 가이드 서울 ₩430,000·경기 ₩480,000. 넷가·계산 근거는 저장소 밖 보고서에만 둔다
- 달러 참고값: `krwPerUsd = 1340`(한 숫자), 5달러 단위 반올림, 화면에 "≈ US$…". 결제는 원화
- 가격표 칸마다 「Book this day」 → `/book?product=…&region=…`
- `/book`: 상품·지역·날짜·일수(1~14)·인원(1~7)·호텔 → 합계가 바로 나오고 「Book now」. 서버(`/api/booking`)가 금액을 다시 계산해 `inquiries`에 `kind='booking'`·`region`·`price_krw`·`price_usd`로 저장(`supabase/migrations/20261116190000_bookings.sql`, 적용함). 카톡에는 「[Entour Korea 예약(구매)] … 금액 … 결제 링크 보내야 함」으로 간다
- 결제: 지금은 사장님이 기사·차를 확인한 뒤 결제 링크를 보내는 방식(화면 문구 그대로). PayPal·토스 중 정하면 링크를 붙인다
- `check:pages` 6번 규칙: 화면의 ₩ 숫자는 pricing.ts 확정값(또는 그 배수)만 허용으로 바꿈
- 검사: lint·typecheck·test 136·build·check:pages(212쪽) 통과. 로컬에서 예약 1건 보내 DB·카톡 문구(발송 없이) 확인 뒤 지움

## 2026-11-16 — Claude (Claude Code, 사장님 PC, Opus 5.5) — 연락 방법 고르기, 새 요청 카톡 알림 (사장님 "email, whatsapp, line, kakaotalk 중 고르게, 리퀘스트가 카톡으로 오게, 네이버·부럽·마리트와 같은 방으로")

- `/plan` 폼: 「How should we contact you?」에서 WhatsApp·Email·LINE·KakaoTalk 중 하나를 고르면 그 방법의 칸(번호·주소·ID)이 열린다. 방법별 검사(이메일 모양, WhatsApp 숫자 7개 이상, ID 2자 이상). DB `contact_method` 칸, 요청 메시지 `Reply by: LINE …`. 새 문장 11개 × 8개 언어 번역
- 카톡 알림: 사장님 PC의 `semi ochestra\자동화\entour\Relay-EntourInquiries.mjs`가 2분마다(작업 스케줄러 「Entour Korea Inquiry Kakao」, 창 없음) 아직 안 알린 요청을 가져와 예약 알림과 같은 방(업무방·저장소, `자동화\reservation\pipeline.json` rooms)에 보낸다. 23~7시는 쉬고 아침에 보낸다. DB 함수 `inquiry_relay_pending`·`inquiry_relay_mark`는 PC 열쇠(`C:\AI\entour-relay\relay.env`)의 해시가 맞을 때만 동작(`supabase/migrations/20261116150000_…`). 2분마다 DB를 읽어 무료 Supabase가 7일 무접속으로 멈추는 것도 막는다

## 2026-11-16 — Claude (Claude Code, 사장님 PC, Opus 5.5) — entour.kr 운영 배포 (사장님 "entour.kr 샀어, 실제 도메인 주소로 배포하자")

- Vercel 프로젝트 `entour-korea` 만들고 운영 배포, 도메인 `entour.kr`·`www.entour.kr` 연결(가비아 DNS A 2개·CNAME 1개). `www`는 `entour.kr`로 308 이동(`next.config.ts`)
- `vercel.json`: 함수 지역 `icn1`(Supabase 서울과 가깝게). `.vercelignore`: `.env*`·`.claude` 등 올리지 않음
- Supabase `exitour-inbound`가 멈춰 있어 다시 켬. 운영 주소에서 시험 요청 저장 확인 후 삭제
- 확인: 9개 언어 첫 화면·`/prices`·`/plan`·사이트맵·robots·`llms.txt`·공유 그림 200, canonical·hreflang·사이트맵이 `https://entour.kr`, `/ko` noindex, `/zh/terms` 404

## 2026-11-16 — Claude (Claude Code, 사장님 PC, Opus 5.5) — 한국어 검토판 추가, 다국어 마무리 검사 (사장님 "한국어 버전도 만들어줘, 내가 체크하기 위해 필요해")

- `/ko/…` 한국어판(882문장, 영어 뜻 그대로 옮김). 사장님 검토용이라 noindex, hreflang·사이트맵·`llms.txt`·바닥글 언어 목록에서 뺐고 머리글 언어 단추에만 「한국어 (검토용)」으로 있다. 화면 맨 위에 검토용 띠. 손님용으로 열려면 `src/i18n/config.ts`의 `reviewLangs`에서 뺀다
- 휴대폰에서 머리글 「Plan my trip」 버튼을 숨김: 스페인어·따갈로그·인니어·베트남어에서 머리글이 375px을 넘쳐 화면이 옆으로 밀렸다. 같은 링크가 접는 메뉴와 첫 화면에 있다
- 검사: lint·typecheck 통과, test 125개 통과, 운영 빌드 통과, `check:pages` 203쪽 문제 없음(9개 언어 `<html lang>`·hreflang·제목/설명 중복·160자). 375px에서 9개 언어 가로 넘침 없음

## 2026-11-16 — Claude (Claude Code, 사장님 PC, Opus 5.5) — 7개 언어판 추가 (사장님 "중국어, 일본어, 스페인어, 인도네시아어, 태국어, 필리핀 따갈로그, 베트남어 추가해서 만들어줘")

- 주소: 영어는 그대로(`/prices`), 다른 언어는 `/zh/prices`처럼 앞머리. 쪽 파일을 `src/app/[lang]/`로 옮기고 `src/proxy.ts`가 영어 주소를 넘긴다. `/en/…`은 308 이동
- 번역: `src/i18n/`(번역 함수·서버 `getT()`·폼 문장 목록·자동 추출), 사전 `messages/*.json` 7개 × 882문장(AI 초안, 원어민 검수 필요). 가격 문장·값 FAQ·날짜 고르기·여행 요청 폼도 그 언어로. 저장 값과 사장님 알림은 영어
- 머리글 언어 단추, 바닥글 언어 링크, 쪽마다 hreflang 8개+x-default, 사이트맵 176개 주소(언어별 묶음), JSON-LD inLanguage, `llms.txt` 끝에 언어판 목록
- 영어판만: 약관·개인정보·환불(초안)과 숨긴 쪽. 다른 언어 주소는 404. 공유 그림은 영어판 공용
- 시험: `tests/i18n.test.ts`(목록 최신·빠진 번역·자리 표시), 검사 스크립트에 `<html lang>`·hreflang 확인 추가
- 번역 중 발견한 영어 원문 문제(고치지 않음, 보고만): 노인 부모 글의 "in your language", 따갈로그 문구 두 개가 서로 다름, 안내 글의 "Rates marked as draft", 공항 쪽의 9·11인승·솔라티 표기가 두 상품(스타리아 7인)과 다름
- 검사: lint·typecheck 통과, test 122개 통과. 번역 넣기 전 운영 빌드 통과(181쪽). **번역을 넣은 뒤의 빌드·`check:pages`·휴대폰 화면 확인은 아직**

## 2026-11-16 — Claude (Claude Code, 사장님 PC, Fable 5.2) — 사장님이 주신 실제 사진 반영 (다른 세션이 편집해 넘긴 사진: 차량·장소·기사님·손님 뒷모습)

- **실제 차량 사진 4장**(`public/images/van/`): 두 상품 쪽 "Your van"에 앞 옆모습·좌석·앞좌석·운전석. "번호판은 가렸다"고 밝힘
- **실제 장소 사진 4장**(`public/images/places/`): 경회루·남산타워·두물머리·남이섬. 홈 "What fits in 10 hours" 위 사진 줄과 `/day-plans`의 해당 일정에 붙임
- **홈 첫 화면 사진을 AI 풍경 → 실제 사진(경복궁 경회루)** 으로. 화면에서 비교해 실제 사진 쪽으로 정함(출처 표시 "AI-generated scenery" 대신 장소 이름)
- **기사님 사진**(`public/images/crew/driver-on-boat-square.webp`)을 소개 자리에 연결. 사장님이 얼굴 사용을 허락함. 이름·자격·소개가 없어 **구역은 그대로 꺼져 있음**(`crew.ts`의 `crewEntries`, `show: false`)
- **손님 뒷모습 6장은 자리만**(`photos.ts`의 `guestPhotos`, `GuestMoments`): 꺼 둠. 손님 확인 전이라 파일도 `public/`에 넣지 않음(시험이 확인)
- 경기 예시 하나를 "남이섬 + 아침고요수목원" → **"남이섬 + 두물머리"**(실제 사진이 있는 곳, 구간 합 600분 유지)
- 쓰지 않은 사진: 별마당 도서관(지점 미확인), 소나무 정원(이름 미확인), 차량 정면(겹침), 세로 사진들
- 받을 것에 추가: 손님 뒷모습 사진 사용 확인, 기사님 사진 세 장 본인 확인, 장소 이름 두 곳(`docs/10` 3장 12-1·17·18)
- 검사: lint·typecheck 통과, test 94개 통과, build 통과(61개 경로), `check:pages` 27쪽 문제 없음. 홈·두 상품·Prices·Plan·Day plans를 1440px·390px으로 다시 확인

## 2026-11-16 — Claude (Claude Code, 사장님 PC, Fable 5.2) — 좁혀서 열기: 드라이빙 가이드 두 상품 중심으로, 배포 직전까지 (사장님 "새로 만들지 않고 이 사이트를 좁혀서 연다 — 그렇게 해 줘")

- **문을 좁힘**: 메뉴·바닥글에 Private Driver·Driver-Guide·Prices·Plan·FAQ·About·Contact만. `/guide-tour`·`/join-as-guide`는 코드만 두고 noindex, 사이트맵·`llms.txt`·메뉴에서 뺌. 안내 글·`/airport-transfer`·`/safety`는 그대로(한강 글의 숨긴 상품 문단만 정리)
- **네 칸 표**(`ProductMatrix.tsx`, 자료는 `pricing.ts`의 `dayRates`): Driver only / Driver-guide × Seoul / Gyeonggi. 칸마다 10시간·스타리아·최대 7인·값·포함 항목. 홈·`/prices`·두 상품 쪽이 같은 자료에서 그림. **`confirmed`인 칸만 숫자가 나가고**, 나머지는 "Written quote for your date". 예전 초안 숫자(48만·54만·23만)는 화면·`llms.txt`·구조화 데이터 어디에도 안 나감("draft rate" 표시도 없앰)
- 포함 항목은 사장님이 말씀하신 것만: 서울 상품 기름·통행료·주차 포함, 밤 종료 시간 제한 없음. 나머지(경기의 기름·통행료·주차, 기사 식사, 입장료, 초과 시간)는 "Stated in your written quote"
- 두 상품 문구를 10시간·스타리아 한 대·최대 7인·영어 기준으로 다시 씀. 솔라티·9/11인승·"당신의 언어로" 같은 문구를 상품 쪽·FAQ·회사 설명에서 뺌. "선금을 내면 확정" 문장도 뺌(선금 미정)
- **기사 소개 자리**(`crew.ts`, `CrewSection.tsx`): 자료가 없으면 구역이 안 나옴. "영어와 따갈로그" 문구는 초안으로만 두고 꺼 둠
- **10시간 하루 예시 4개**(`dayPlans.ts`, 새 쪽 `/day-plans`): 서울 2(궁·북촌·남산 / 아이 동반 잠실·한강 밤), 경기 2(남이섬·아침고요수목원 / 수원화성·민속촌). 구간 시간 합이 600분인지 시험이 확인. 입장료·운영 시간은 적지 않음
- **`docs/09` 고칠 것**: 약관·개인정보·환불 틀(`/terms`·`/privacy`·`/cancellation-policy`, 값이 찰 때까지 noindex·메뉴 밖), 쪽별 공유 그림 27장(`/og/<쪽>.png`, 빌드 때 생성), 문의 알림(`notify.ts` — 텔레그램·이메일·웹훅, 환경변수만 넣으면 켜짐), 휴대폰 머리글 한 줄(접는 메뉴), 아이콘, 404 제목, 쪽별 160자 이하 설명
- **검색·AI 노출**: robots의 AI 로봇 21개(공식 문서 철자), `/api/` 차단, 쪽마다 다른 제목·설명·canonical(`pages.ts`+`meta.ts`), 사이트맵 수정일, 소유 확인 코드 자리(`site.verification`), IndexNow 키 파일과 `scripts/indexnow-submit.mjs`, 빌드 결과 검사 `npm run check:pages`(CI에도 추가). 확정값이 없어 `Offer`는 0개
- 디자인: 틀은 그대로, 첫 화면과 요청 띠의 큰 녹색 면을 흰 바탕으로. 홈 사진은 차가 보이지 않게 왼쪽만 잘라 쓰고 설명글에서 지명을 뺌
- **Next.js 16.2.4 → 16.4.6**(`npm audit --omit=dev` 치명 1·높음 2 → 0. 공유 그림 생성 기능의 취약점 포함)
- 도메인 RDAP 조회(2026-11-16): `entourkorea.com`·`entour-korea.com`·`entourkorea.net`·`entour.kr`·`entourkorea.kr`·`entourkorea.co.kr` 미등록, `entour.com` 등록됨. 사지 않음
- 문서: `docs/10_narrow-launch.md`(지금 상태·받을 것과 넣는 곳·알림·배포 순서) 새로 씀. `AGENTS.md` 규칙·코드 지도, `decisions.md`, `08`·`09`·`03`, `README` 갱신
- **하지 않은 것**: Vercel 프로젝트·배포, 도메인 구매, 계정 만들기, 방문 측정, 스팸 방지, 결제. `.env.example`은 이 PC의 권한 설정이 막아 고치지 못함(알림 변수 이름은 `docs/10` 7장)
- 검사: lint·typecheck 통과, test 87개 통과, build 통과(61개 경로), `check:pages` 27쪽 문제 없음. 운영 빌드를 로컬에서 켜 홈·두 상품·Prices·Plan·Day plans를 1440px과 390px으로 확인(가로 넘침·콘솔 오류 없음, 휴대폰 메뉴 열림 확인). 요청 API는 검증 오류·스팸 칸만 시험(실제 저장·알림 전송은 하지 않음)

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
