# 사이트 기획

## 목표

AI 검색(ChatGPT, 퍼플렉시티, 구글 AI 모드, 제미나이, Claude, Copilot)이 "한국 프라이빗 기사·가이드"를 물을 때 **인용하고 추천하는 정답 원본**이 되는 것. 전략 전체는 `04_ai-search-strategy.md`에 있다.

## 지금 있는 것 (v0, 2026-10-24)

| 경로 | 역할 |
|---|---|
| `/` | 서비스 3종, 기사와 가이드의 차이 표, 예약 절차 4단계, 감성 일정 예시, 합법·안전, FAQ |
| `/private-driver` | 차량 + 기사 |
| `/driver-guide` | 차량 + 자격 가이드 |
| `/guide-tour` | 가이드 투어 + 일정 설계 (예시: Han River Evening, Sunset & Seagulls) |
| `/airport-transfer` | 공항 픽업·샌딩(인천 T1·T2, 김포). 견적 문의, 확정가 전까지 Offer 없음 (2026-10-28 추가) |
| `/prices` | 그룹당 가격 전체 표 |
| `/safety` | 합법 구조(여행업 등록, 렌터카 알선, 자격 가이드, 쇼핑 강요 없음) |
| `/plan` | 여행 요청 폼. v0는 저장하지 않고 메시지를 만들어 손님이 복사하거나 WhatsApp으로 보낸다 |
| `/faq`, `/about`, `/join-as-guide` | FAQ, 회사 소개(Entour 이름의 뜻), 가이드 모집 |
| `/travel-guide/...` | 질문형 안내 글 10편: 비용, 합법성 (2026-10-24) + 남이섬 가는 법, 인천공항→서울, 내 언어 가이드, 부모님 모시고 서울, 무슬림 친화, 인천공항 근처 노을, 한강 라면, 인천 환승 투어 (2026-10-28) |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | AI·검색 크롤러용. `llms.txt`는 콘텐츠 데이터에서 자동 생성 |

## 모든 페이지의 틀

1. 맨 위 **"Short answer" 상자**: 질문에 대한 결론을 숫자와 조건으로 먼저 쓴다
2. 비교표, 포함·불포함
3. 최종 수정일
4. FAQ (구조화 데이터 FAQPage로 자동 생성)
5. 관련 서비스·글 링크, 여행 요청 버튼

## 구조화 데이터 (자동 생성, `src/lib/schema.ts`)

TravelAgency(운영사 Exitour를 parentOrganization으로), WebSite, Service(확정가만 Offer로), FAQPage, BreadcrumbList, Article.
회사 정보 중 비어 있는 값은 넣지 않는다. 계정을 만들면 `site.sameAs`에 유튜브, 인스타, 틱톡, 트립어드바이저, 구글 비즈니스, OTA 상품 페이지 주소를 넣는다.

## 데이터 구조

`src/content/types.ts`가 기준이다. MVP에서 DB로 옮길 때 이 타입이 테이블이 된다.

| 지금 (파일) | MVP (DB 테이블) |
|---|---|
| `services.ts` Service, Vehicle, Region | `services`, `service_translations`, `vehicles`, `regions` |
| `pricing.ts` PriceRule (서비스 × 지역 × 차량 × 단위, status) | `price_rules` (+ 원가 칸, 승인 기록) |
| `plans.ts` PlanIdea | `plan_ideas` → 나중에 `experience_blocks`, `pois`(명소 정보) |
| `articles.ts` Article | `articles`, `article_translations` |
| `faqs.ts` | `faqs` |
| 없음 | `guides`(언어, 자격증 번호와 확인 여부, 지역, 일당, 일정), `suppliers`(렌터카 업체, 번호판, 보험), `inquiries`, `bookings`, `customers`(여권 정보는 암호화, 별도 보관), `reviews` |

## 기술

- 지금: Next.js 16 + React 19 + Tailwind 4 + TypeScript(엄격 모드), 모든 페이지 정적 생성, Vitest 단위 시험, GitHub Actions(lint, typecheck, test, build), 보안 헤더
- MVP에서 추가: Supabase(Postgres, Storage, 접근 권한 규칙), 관리자 화면, 예약 요청 저장, 스팸 방지(Turnstile), 오류 알림
- 관리자 화면은 **Payload CMS**(Next.js 안에서 같이 돌아감, 언어별 입력칸, 임시저장, 사진 업로드 기본 제공)를 1순위로 검토한다. Exitour 기존 사이트처럼 Supabase에 직접 관리자 페이지를 만드는 방법이 2순위
- 호스팅: Vercel 또는 Cloudflare

## 제작 단계

| 버전 | 시기 | 범위 |
|---|---|---|
| v0 | 2026-10-24 완료 | 위 표 |
| MVP | 2026년 12월 | 관리자 화면, 예약 요청 저장과 알림, 확정가 반영, 연락 채널 연결, 구글 서치콘솔·Bing 웹마스터, 질문형 글 10편 |
| v1 | 2027년 3월 | 견적 계산기, 해외카드 결제, 다국어(문의 많은 순), 언어별 가이드 페이지, 후기 |
| v2 | 2027년 7월 이후 | 개별 투어 상품, 가이드 배정 화면(일정 달력), 명소 데이터 기반 AI 일정 도우미, 해외 여행사용 B2B 요금 |

## 공개 전 채울 값

- `src/content/site.ts`: 관광사업자 등록번호, 주소, 이메일, WhatsApp, 카카오 채널, LINE, sameAs
- `NEXT_PUBLIC_SITE_URL`: 도메인
- `src/content/pricing.ts`: 파트너 원가를 받은 뒤 확정가(`confirmed`)
- 사진: 지금은 사진 없이 글과 표로만 구성. 실제 투어 사진·영상을 받으면 추가 (남의 사진·생성 이미지를 실제 투어처럼 쓰지 않는다)
