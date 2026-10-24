# AI 검색 노출 전략

## 핵심

**AI 노출은 홈페이지 50%, 사이트 밖 50%.** 홈페이지는 "정답 원본"이 되고, AI가 즐겨 인용하는 곳(유튜브, 레딧, 트립어드바이저, OTA, 여행 블로그)이 그 원본을 반복해서 언급하게 만든다.

조사 결과 (마케팅 업체 자료라 방향 참고용):
- 구글 AI 모드 여행 질문 100개: 유튜브가 76개 답변, 레딧이 70개 답변에 인용됨. 인용의 56.8%가 개인 여행 블로그
- 퍼플렉시티는 구매형 질문에서 트립어드바이저 같은 후기 사이트를 많이 인용
- 2026년 3월 3천만 건 조사: 모든 AI를 통틀어 가장 많이 인용된 곳은 레딧

## AI가 추천하는 3단계

1. **찾기**: 각 AI의 검색 색인(OAI-SearchBot, Claude-SearchBot, PerplexityBot, 구글·Bing 색인) → 크롤러 허용, 서버 HTML
2. **읽기**: 질문에 바로 답하는 문단 → Short answer 상자, 숫자
3. **믿기**: 여러 출처의 같은 정보 → 사이트 밖 채널, 회사명·주소 통일, sameAs

## 질문 지도 (페이지 후보)

| 질문 | 페이지 | 상태 |
|---|---|---|
| How much is a private driver in Seoul / Korea? | `/prices`, `/travel-guide/private-driver-korea-cost` | v0 있음 |
| Is it legal to hire a driver in Korea? | `/safety`, `/travel-guide/is-hiring-a-driver-legal-in-korea` | v0 있음 |
| Driver vs driver-guide vs guide in Korea | 홈의 비교표 | v0 있음 |
| How to get to Nami Island from Seoul? | 안내 글 (셔틀·기차·프라이빗 공정 비교) | 할 일 |
| Korea tour with a Thai / Vietnamese / Indonesian / Chinese speaking guide | 언어별 가이드 페이지 | 할 일 |
| Seoul with elderly parents / toddlers / wheelchair | 가족 여행 페이지 | 할 일 |
| Halal food near Nami Island / Muslim-friendly Korea tour | 무슬림 친화 안내 | 할 일 |
| Where to see sunset and seagulls near Incheon Airport? | Sunset & Seagulls 글 | 할 일 |
| How to make Han River ramen? | Han River Evening 글 | 할 일 |
| Incheon layover tour | 환승 투어 | 할 일 |
| 5-day Korea itinerary in winter with snow | 일정 예시 | 할 일 |
| Everland tickets and queues with a private guide | 에버랜드 글 | 할 일 |

질문 지도 50개로 늘리는 것이 다음 콘텐츠 작업이다.

## 우리만 가진 데이터 (AI가 좋아하는 재료)

- 요일·시간대별 실제 이동 시간 기록 (예: 서울 → 남이섬 토요일 오전)
- 주차, 혼잡도, 벚꽃 실제 개화 관찰
- 해마다 "Korea Private Tour Price Index" 발행 → 기자·블로거 인용 → AI 인용

## 다국어

영어 질문은 경쟁이 많고, 태국어·인도네시아어·베트남어·번체 중국어 질문에는 답할 페이지가 거의 없다. AI는 질문한 언어의 페이지를 우선 인용한다. 번역은 AI로 초안을 만들고 **우리 가이드(원어민)가 검수**한다. 언어 추가 순서는 실제 문의 순서로 정한다.

## 사이트 밖 채널

| 채널 | 할 일 |
|---|---|
| 유튜브 | 서비스·코스마다 영상. 질문형 제목, 자막, 챕터. 홈페이지에 영상 넣기 |
| 레딧 | r/koreatravel, r/seoul에서 소속을 밝히고 도움 되는 답변. 광고 금지 |
| 트립어드바이저 | 업체 등록, 손님마다 후기 요청, 모든 후기에 답변, 포럼 답변 |
| 구글 비즈니스 프로필, Bing Places, Apple | 사진, 주간 게시물, 후기 |
| OTA | 상품 정보를 홈페이지와 똑같이 |
| 블로거·크리에이터 | 무료 투어 제공, 솔직한 후기(협찬 표시 필수) |
| 인스타·틱톡 | 발견용. 쇼츠 같이 올리기 |

## 주간 콘텐츠 엔진

촬영 1일 → 유튜브 롱폼 1, 쇼츠·릴스·틱톡 5, 홈페이지 질문 페이지 1(영상 포함, 번역·검수), 레딧·트립어드바이저 답변, 구글 비즈니스 게시물.
시즌: 눈·스키(11~2월), 벚꽃(검색 2~4월), 단풍(검색 8~10월), 춘절, 이드 연휴, 송끄란.

## 측정

1. **AI 질문 세트 50개**를 매달 ChatGPT, 퍼플렉시티, 제미나이, Claude, Copilot에 물어 언급·인용·인용 페이지·경쟁사 기록
2. chatgpt.com, perplexity.ai, gemini 등에서 들어온 방문을 따로 집계. 서버 기록에서 AI 크롤러 방문 확인
3. 예약 폼에 "어떻게 알게 되셨나요?" (선택지에 ChatGPT / AI)
4. 목표(가정): 3개월 뒤 50개 중 5개, 6개월 뒤 15개에서 언급

## 금지

가짜 후기, AI로 얇은 페이지 대량 생산, AI에게만 보이는 숨은 문구, 크롤러와 사람에게 다른 내용 보여 주기, 레딧 광고 도배.
