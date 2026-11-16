-- 2026-11-16 사장님 「판매가와 구매하는 거 만들어 줘」: 구매 화면(/book)의 예약도 inquiries에 저장한다.
-- kind: 'request'(여행 요청, /plan) 또는 'booking'(구매, /book). 예약은 지역과 금액(서버가 pricing.ts로 계산)을 함께 남긴다.
-- 카톡 중계(inquiry_relay_pending)는 테이블 전체 행을 돌려주므로 함수는 바꾸지 않는다.
-- Supabase 프로젝트 exitour-inbound(imzbtkzmbkblvtdmkxnk)에 2026-11-16 적용함.

alter table public.inquiries
  add column kind text not null default 'request' check (kind in ('request', 'booking')),
  add column region text not null default '' check (region in ('', 'seoul', 'gyeonggi')),
  add column price_krw integer check (price_krw is null or price_krw between 1 and 100000000),
  add column price_usd integer check (price_usd is null or price_usd between 1 and 100000);

-- 예약이면 상품·지역·금액이 다 있어야 한다.
alter table public.inquiries add constraint inquiries_booking_complete check (
  kind = 'request'
  or (service in ('private-driver', 'driver-guide') and region <> '' and price_krw is not null and price_usd is not null)
);
